// Cargo.toml dependencies
// [dependencies]
// actix-web = "4.5.1"
// actix-identity = "0.6.0"
// actix-session = "0.8.0"
// diesel = { version = "2.1.0", features = ["postgres", "chrono", "uuid"] }
// dotenvy = "0.15"
// serde = { version = "1.0", features = ["derive"] }
// serde_json = "1.0"
// chrono = { version = "0.4", features = ["serde"] }
// uuid = { version = "1.3", features = ["v4", "serde"] }
// argon2 = "0.5"
// jsonwebtoken = "9.2"
// validator = "0.16"
// log = "0.4"
// env_logger = "0.10"
// rand = "0.8"
// lettre = "0.11"

use actix_web::{
    web, App, HttpResponse, HttpServer, Responder, 
    middleware::{Logger, NormalizePath},
    http::{header, StatusCode}
};
use actix_identity::{Identity, IdentityMiddleware};
use actix_session::{SessionMiddleware, storage::CookieSessionStore};
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{NaiveDateTime, Utc};
use validator::Validate;
use log::{info, error};
use argon2::{self, Config};
use jsonwebtoken::{encode, EncodingKey, Header};

// Enhanced database connection type
type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;

// Expanded Article Types
#[derive(Debug, Serialize, Deserialize, diesel::AsChangeset, diesel::Queryable, diesel::Insertable)]
#[diesel(table_name = articles)]
enum ArticleType {
    Silaksalitaan,
    Photostory,
    Feature,
    Editorial,
    Interview,
    Commentary,
}

// Enhanced User Roles
#[derive(Debug, Serialize, Deserialize)]
enum UserRole {
    Reader,
    Contributor,
    Editor,
    Admin,
}

// User Model
#[derive(Debug, Serialize, Deserialize, diesel::Queryable, diesel::Insertable)]
#[diesel(table_name = users)]
struct User {
    id: Uuid,
    username: String,
    email: String,
    password_hash: String,
    role: UserRole,
    profile_picture: Option<String>,
    bio: Option<String>,
    created_at: NaiveDateTime,
    last_login: Option<NaiveDateTime>,
}

// Enhanced Article Model
#[derive(Debug, Serialize, Deserialize, diesel::Queryable, diesel::Insertable)]
#[diesel(table_name = articles)]
struct Article {
    id: Uuid,
    title: String,
    subtitle: Option<String>,
    content: String,
    author_id: Uuid,
    article_type: ArticleType,
    tags: Vec<String>,
    cover_image: Option<String>,
    featured: bool,
    published_at: Option<NaiveDateTime>,
    created_at: NaiveDateTime,
    updated_at: NaiveDateTime,
    status: ArticleStatus,
}

// Article Status
#[derive(Debug, Serialize, Deserialize)]
enum ArticleStatus {
    Draft,
    Pending,
    Published,
    Archived,
}

// Comment Model
#[derive(Debug, Serialize, Deserialize, diesel::Queryable, diesel::Insertable)]
#[diesel(table_name = comments)]
struct Comment {
    id: Uuid,
    article_id: Uuid,
    user_id: Uuid,
    content: String,
    created_at: NaiveDateTime,
    parent_comment_id: Option<Uuid>,
}

// Validation DTOs with Validation
#[derive(Debug, Deserialize, Validate)]
struct RegisterUserRequest {
    #[validate(length(min = 3, max = 50, message = "Username must be 3-50 characters"))]
    username: String,
    #[validate(email(message = "Invalid email format"))]
    email: String,
    #[validate(length(min = 8, message = "Password must be at least 8 characters"))]
    password: String,
}

#[derive(Debug, Deserialize, Validate)]
struct CreateArticleRequest {
    #[validate(length(min = 5, max = 200, message = "Title must be 5-200 characters"))]
    title: String,
    subtitle: Option<String>,
    #[validate(length(min = 10, message = "Content must be at least 10 characters"))]
    content: String,
    article_type: ArticleType,
    tags: Vec<String>,
    cover_image: Option<String>,
    featured: Option<bool>,
}

// JWT Claims for Authentication
#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,  // user ID
    exp: usize,   // expiration time
    role: UserRole,
}

// Error Handling Struct
#[derive(Debug, Serialize)]
struct ApiError {
    error: String,
    details: Option<Vec<String>>,
}

// Authentication Service
struct AuthService;

impl AuthService {
    fn hash_password(password: &str) -> String {
        let salt = b"randomsalt";
        let config = Config::default();
        argon2::hash_encoded(password.as_bytes(), salt, &config)
            .expect("Failed to hash password")
    }

    fn verify_password(password: &str, hash: &str) -> bool {
        argon2::verify_encoded(hash, password.as_bytes())
            .unwrap_or(false)
    }

    fn generate_jwt(user_id: &str, role: &UserRole) -> Result<String, jsonwebtoken::errors::Error> {
        let expiration = Utc::now()
            .checked_add_signed(chrono::Duration::hours(24))
            .expect("valid timestamp")
            .timestamp();

        let claims = Claims {
            sub: user_id.to_string(),
            exp: expiration as usize,
            role: role.clone(),
        };

        encode(
            &Header::default(), 
            &claims, 
            &EncodingKey::from_secret(b"your_secret_key")
        )
    }
}

// Advanced Repository Traits
trait UserRepository {
    fn create_user(&self, user: RegisterUserRequest) -> QueryResult<User>;
    fn find_user_by_email(&self, email: &str) -> QueryResult<User>;
    fn update_user_profile(&self, user_id: Uuid, updates: UserProfileUpdate) -> QueryResult<User>;
}

trait ArticleRepository {
    fn create_article(&self, article: CreateArticleRequest, author_id: Uuid) -> QueryResult<Article>;
    fn get_article_by_id(&self, article_id: Uuid) -> QueryResult<Article>;
    fn list_articles(&self, filters: ArticleFilter) -> QueryResult<Vec<Article>>;
    fn search_articles(&self, query: &str, filters: Option<ArticleFilter>) -> QueryResult<Vec<Article>>;
    fn update_article_status(&self, article_id: Uuid, status: ArticleStatus) -> QueryResult<Article>;
}

trait CommentRepository {
    fn add_comment(&self, article_id: Uuid, user_id: Uuid, content: String, parent_id: Option<Uuid>) -> QueryResult<Comment>;
    fn get_article_comments(&self, article_id: Uuid) -> QueryResult<Vec<Comment>>;
}

// Filter and Update Structs
#[derive(Debug, Deserialize)]
struct ArticleFilter {
    article_type: Option<ArticleType>,
    tags: Option<Vec<String>>,
    featured: Option<bool>,
    status: Option<ArticleStatus>,
    page: Option<i64>,
    per_page: Option<i64>,
}

#[derive(Debug, Deserialize)]
struct UserProfileUpdate {
    profile_picture: Option<String>,
    bio: Option<String>,
}

// Mock Implementations (would be replaced with actual database interactions)
struct UserRepositoryImpl;
struct ArticleRepositoryImpl;
struct CommentRepositoryImpl;

// Comprehensive Web Handlers
mod handlers {
    use super::*;

    // User Registration Handler
    pub async fn register_user(
        pool: web::Data<DbPool>,
        user_data: web::Json<RegisterUserRequest>
    ) -> impl Responder {
        let repository = UserRepositoryImpl {};
        
        // Validate input
        match user_data.validate() {
            Ok(_) => {},
            Err(validation_errors) => {
                let error_details: Vec<String> = validation_errors
                    .field_errors()
                    .iter()
                    .map(|(field, errors)| {
                        errors.iter()
                            .map(|error| format!("{}: {}", field, error))
                            .collect::<Vec<String>>()
                    })
                    .flatten()
                    .collect();
                
                return HttpResponse::BadRequest().json(ApiError {
                    error: "Validation Failed".to_string(),
                    details: Some(error_details),
                });
            }
        }

        // Additional complex logic for user registration would go here
        match repository.create_user(user_data.into_inner()) {
            Ok(user) => HttpResponse::Created().json(user),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        }
    }

    // Login Handler
    pub async fn login(
        pool: web::Data<DbPool>,
        credentials: web::Json<LoginRequest>
    ) -> impl Responder {
        let repository = UserRepositoryImpl {};
        
        // Authenticate user
        match repository.find_user_by_email(&credentials.email) {
            Ok(user) if AuthService::verify_password(&credentials.password, &user.password_hash) => {
                // Generate JWT
                match AuthService::generate_jwt(&user.id.to_string(), &user.role) {
                    Ok(token) => HttpResponse::Ok()
                        .append_header((header::AUTHORIZATION, format!("Bearer {}", token)))
                        .json(LoginResponse { token }),
                    Err(_) => HttpResponse::InternalServerError().finish(),
                }
            },
            _ => HttpResponse::Unauthorized().json(ApiError {
                error: "Invalid credentials".to_string(),
                details: None,
            }),
        }
    }

    // Article Creation Handler
    pub async fn create_article(
        pool: web::Data<DbPool>,
        identity: Identity,
        article_data: web::Json<CreateArticleRequest>
    ) -> impl Responder {
        // Authorization and article creation logic
        // Detailed implementation would check user roles, validate input, etc.
        HttpResponse::Created()
    }

    // More handlers for comments, article updates, etc.
}

// Additional Data Transfer Objects
#[derive(Deserialize)]
struct LoginRequest {
    email: String,
    password: String,
}

#[derive(Serialize)]
struct LoginResponse {
    token: String,
}

// Main Server Configuration with Enhanced Setup
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Logging setup
    env_logger::init();

    // Database and connection pool setup
    dotenvy::dotenv().ok();
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create database pool.");

    // Server configuration
    HttpServer::new(move || {
        App::new()
            // Middleware
            .wrap(Logger::default())
            .wrap(NormalizePath::trim())
            .wrap(IdentityMiddleware::default())
            .wrap(
                SessionMiddleware::new(
                    CookieSessionStore::default(),
                    // Replace with a proper secret key in production
                    actix_web::cookie::Key::generate()
                )
            )
            // Application data
            .app_data(web::Data::new(pool.clone()))
            // Authentication Routes
            .service(
                web::scope("/auth")
                    .route("/register", web::post().to(handlers::register_user))
                    .route("/login", web::post().to(handlers::login))
            )
            // Article Routes
            .service(
                web::scope("/articles")
                    .route("", web::post().to(handlers::create_article))
                    // More article-related routes
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}

// Optional: Database Migrations and Schema Definitions
// Would typically be in a separate migrations or schema file
diesel::table! {
    users (id) {
        id -> Uuid,
        username -> Varchar,
        email -> Varchar,
        password_hash -> Varchar,
        role -> Varchar,
        profile_picture -> Nullable<Varchar>,
        bio -> Nullable<Varchar>,
        created_at -> Timestamp,
        last_login -> Nullable<Timestamp>,
    }
}

diesel::table! {
    articles (id) {
        id -> Uuid,
        title -> Varchar,
        subtitle -> Nullable<Varchar>,
        content -> Text,
        author_id -> Uuid,
        article_type -> Varchar,
        tags -> Array<Text>,
        cover_image -> Nullable<Varchar>,
        featured -> Bool,
        published_at -> Nullable<Timestamp>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        status -> Varchar,
    }
}

diesel::table! {
    comments (id) {
        id -> Uuid,
        article_id -> Uuid,
        user_id -> Uuid,
        content -> Text,
        created_at -> Timestamp,
        parent_comment_id -> Nullable<Uuid>,
    }
}
