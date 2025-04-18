import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { 
  getAuth, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  where,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
  limit,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSe2c9-8xqShoHEW-D7BXXAyD5N9uXWEs",
  authDomain: "ang-silakbo.firebaseapp.com",
  projectId: "ang-silakbo",
  storageBucket: "ang-silakbo.appspot.com",
  messagingSenderId: "1006400633782",
  appId: "1:1006400633782:web:ef4a93c1d445cb825b9f17",
  measurementId: "G-TSDTG2YJ94"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Admin users mapping
const adminUsers = {
  "angsilakbo1@uclm.com": "Miss Queen",
  "angsilakbo2@uclm.com": "Miss June",
  "angsilakbo3@uclm.com": "Miss Diana"
};

// Check if a user is an admin
function isAdmin(email) {
  return Object.keys(adminUsers).includes(email);
}

// Get admin display name
function getAdminDisplayName(email) {
  return adminUsers[email] || email;
}

// DOM Elements
const logoutBtn = document.getElementById('logout-btn');
const mobileLogoutBtn = document.getElementById('mobile-logout');
const postForm = document.getElementById('post-form');
const postContent = document.getElementById('post-content');
const submitPostBtn = document.getElementById('submit-post');
const postsSection = document.getElementById('posts');
const greetingText = document.getElementById('greeting-text');
const userName = document.getElementById('user-name');
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const searchToggle = document.getElementById('search-toggle');
const searchContainer = document.querySelector('.search-container');
const editPopup = document.getElementById('edit-popup');
const editTitle = document.getElementById('edit-title');
const editContent = document.getElementById('edit-content');
const saveEditBtn = document.getElementById('save-edit');
const cancelEditBtn = document.getElementById('cancel-edit');
const overlay = document.getElementById('overlay');
const categorySelect = document.getElementById('category-select');
const postTags = document.getElementById('post-tags');
const profileSection = document.getElementById('profile-section');
const profilePicture = document.getElementById('profile-picture');
const uploadPicture = document.getElementById('upload-picture');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const homeLink = document.getElementById('home-link');
const profileLink = document.getElementById('profile-link');
const notificationsLink = document.getElementById('notifications-link');
const notificationsPanel = document.getElementById('notifications-panel');
const closeNotificationsBtn = document.getElementById('close-notifications');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const mobileHome = document.getElementById('mobile-home');
const mobileProfile = document.getElementById('mobile-profile');
const mobileNotifications = document.getElementById('mobile-notifications');
const addPostFab = document.getElementById('add-post-fab');
const mobilePostForm = document.getElementById('mobile-post-form');
const closeMobileForm = document.getElementById('close-mobile-form');
const mobileCategorySelect = document.getElementById('mobile-category-select');
const mobilePostTitle = document.getElementById('mobile-post-title');
const mobilePostContent = document.getElementById('mobile-post-content');
const mobilePostTags = document.getElementById('mobile-post-tags');
const mobileSubmitPost = document.getElementById('mobile-submit-post');
const userStats = document.getElementById('user-stats');
const postsCount = document.getElementById('posts-count');
const commentsCount = document.getElementById('comments-count');
const likesCount = document.getElementById('likes-count');
const receivedLikesCount = document.getElementById('received-likes-count');
const trendingTopicsList = document.getElementById('trending-topics-list');
const categoryFilterBtns = document.querySelectorAll('.category-btn');
const postFormAvatar = document.getElementById('post-form-avatar');
const profileBtn = document.getElementById('profile-btn');
const notificationsBtn = document.getElementById('notifications-btn');
const categoryLinks = document.querySelectorAll('.category-link');
const profilePosts = document.getElementById('profile-posts');
const profileComments = document.getElementById('profile-comments');
const profileLikes = document.getElementById('profile-likes');
const topContributorsList = document.getElementById('top-contributors-list');
const totalPosts = document.getElementById('total-posts');
const totalUsers = document.getElementById('total-users');
const totalComments = document.getElementById('total-comments');
const totalLikes = document.getElementById('total-likes');
const onlineCount = document.getElementById('online-count');

// Helper Functions
function generateAvatarUrl(seed) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
}

function showToast(message) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// Get time of day for greeting
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Event Listeners
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('Are you sure you want to log out?')) {
    signOut(auth)
      .then(() => {
        window.location.href = 'Silakbo Freedom Wall.html';
      })
      .catch((error) => showToast(error.message));
  }
});

mobileLogoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('Are you sure you want to log out?')) {
    signOut(auth)
      .then(() => {
        window.location.href = 'Silakbo Freedom Wall.html';
      })
      .catch((error) => showToast(error.message));
  }
});

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('show');
});

searchToggle?.addEventListener('click', () => {
  searchContainer.classList.toggle('show');
  if (searchContainer.classList.contains('show')) {
    searchBar.focus();
  }
});

// Mobile Post Form
addPostFab.addEventListener('click', () => {
  mobilePostForm.classList.add('show');
});

closeMobileForm.addEventListener('click', () => {
  mobilePostForm.classList.remove('show');
});

// Auth State Change
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Update greeting with user's name
    const timeGreeting = getTimeBasedGreeting();
    let displayName = user.displayName || user.email.split('@')[0];
    
    // Check if user is an admin and update display name
    if (isAdmin(user.email)) {
      displayName = getAdminDisplayName(user.email);
    }
    
    userName.textContent = displayName;
    greetingText.innerHTML = `${timeGreeting}, <span id="user-name">${displayName}</span>!`;
    
    postFormAvatar.src = user.photoURL || generateAvatarUrl(user.uid);
    loadPosts();
    listenForNotifications(user.uid);
    updateProfileInfo(user);
    loadTrendingTopics();
    loadUserStats(user.uid);
    loadTopContributors();
    loadCommunityStats();
    
    // Show post form on desktop
    if (window.innerWidth > 992) {
      postForm.style.display = 'block';
    }
  } else {
    window.location.href = 'Silakbo Freedom Wall.html';
  }
});

// Post Submission
submitPostBtn.addEventListener('click', () => {
  submitPost(
    categorySelect.value,
    document.getElementById('post-title').value.trim(),
    postContent.value.trim(),
    postTags.value
  );
});

mobileSubmitPost.addEventListener('click', () => {
  submitPost(
    mobileCategorySelect.value,
    mobilePostTitle.value.trim(),
    mobilePostContent.value.trim(),
    mobilePostTags.value
  );
});

function submitPost(category, title, content, tags) {
  const tagsList = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
  
  if (title && content && category) {
    submitPostBtn.disabled = true;
    mobileSubmitPost.disabled = true;
    
    addDoc(collection(db, 'posts'), {
      title: title,
      content: content,
      category: category,
      tags: tagsList,
      timestamp: new Date(),
      userId: auth.currentUser.uid,
      userName: isAdmin(auth.currentUser.email) ? 
                getAdminDisplayName(auth.currentUser.email) : 
                (auth.currentUser.displayName || auth.currentUser.email),
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: []
    })
    .then(() => {
      // Clear form fields
      document.getElementById('post-title').value = '';
      postContent.value = '';
      categorySelect.value = '';
      postTags.value = '';
      
      // Clear mobile form fields
      mobilePostTitle.value = '';
      mobilePostContent.value = '';
      mobileCategorySelect.value = '';
      mobilePostTags.value = '';
      
      // Hide mobile form
      mobilePostForm.classList.remove('show');
      
      showToast('Post created successfully!');
      submitPostBtn.disabled = false;
      mobileSubmitPost.disabled = false;
      
      // Update trending topics
      loadTrendingTopics();
      loadCommunityStats();
      loadTopContributors();
    })
    .catch((error) => {
      showToast(error.message);
      submitPostBtn.disabled = false;
      mobileSubmitPost.disabled = false;
    });
  } else {
    showToast('Please fill in all required fields');
  }
}

// Load Posts
let unsubscribePosts = null;
let currentQuery = null;
let currentCategory = 'all';

function loadPosts(userId = null, category = currentCategory) {
  // Unsubscribe from previous listener if exists
  if (unsubscribePosts) {
    unsubscribePosts();
    unsubscribePosts = null;
  }

  // If the query is the same as the current one, don't reload
  const queryString = userId ? `user-${userId}-${category}` : `all-${category}`;
  if (queryString === currentQuery) {
    return;
  }
  currentQuery = queryString;
  currentCategory = category;
  
  let q;
  if (userId) {
    if (category !== 'all') {
      q = query(
        collection(db, 'posts'), 
        where('userId', '==', userId),
        where('category', '==', category),
        orderBy('timestamp', 'desc')
      );
    } else {
      q = query(
        collection(db, 'posts'), 
        where('userId', '==', userId), 
        orderBy('timestamp', 'desc')
      );
    }
  } else {
    if (category !== 'all') {
      q = query(
        collection(db, 'posts'),
        where('category', '==', category),
        orderBy('timestamp', 'desc')
      );
    } else {
      q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    }
  }
  
  unsubscribePosts = onSnapshot(q, (querySnapshot) => {
    postsSection.innerHTML = ''; // Clear posts section before rendering
    
    if (querySnapshot.empty) {
      postsSection.innerHTML = '<div class="post"><p>No posts found.</p></div>';
      return;
    }
    
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const postElement = document.createElement('div');
      postElement.className = 'post';
      
      // Check if current user is admin or post owner
      const isCurrentUserAdmin = isAdmin(auth.currentUser.email);
      const isPostOwner = post.userId === auth.currentUser.uid;
      
      // Determine if delete button should be shown
      const showDeleteButton = isCurrentUserAdmin || isPostOwner;
      
      // Create post menu buttons based on permissions
      let postActions = '';
      if (isPostOwner) {
        postActions = `
          <div class="post-menu">
            <button class="post-menu-btn edit-post-btn" title="Edit Post"><i class="fas fa-edit"></i></button>
            <button class="post-menu-btn delete-post-btn" title="Delete Post"><i class="fas fa-trash"></i></button>
          </div>`;
      } else if (isCurrentUserAdmin) {
        postActions = `
          <div class="post-menu">
            <button class="post-menu-btn delete-post-btn" title="Delete Post"><i class="fas fa-trash"></i></button>
          </div>`;
      }
      
      const tagsHtml = post.tags && post.tags.length > 0 ? 
        post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
      
      // Check if user is admin to add badge
      const isUserAdmin = Object.keys(adminUsers).some(adminEmail => {
        // Check if this post's user is an admin by comparing with known admin usernames
        return adminUsers[adminEmail] === post.userName;
      });
      
      const adminBadgeHtml = isUserAdmin ? 
        `<span class="admin-badge">Admin</span>` : '';
      
      postElement.innerHTML = `
        <div class="post-header">
          <div class="post-header-left">
            <img src="${generateAvatarUrl(post.userId)}" alt="Profile Picture" class="post-avatar" />
            <div class="post-user">
              <h3 class="user-name" data-user-id="${post.userId}">${post.userName}</h3>
              <p>${new Date(post.timestamp?.toDate()).toLocaleString()}</p>
              ${adminBadgeHtml}
            </div>
          </div>
          ${postActions}
        </div>
        <h2 class="post-title">${post.title}</h2>
        <p class="post-content">${post.content}</p>
        <div class="post-meta">
          <p class="post-category">Category: ${post.category}</p>
          <div class="post-tags">
            ${tagsHtml}
          </div>
        </div>
        <div class="post-actions">
          <button class="post-action-btn like-btn ${post.likedBy?.includes(auth.currentUser.uid) ? 'active' : ''}" data-post-id="${doc.id}">
            <i class="fas fa-thumbs-up"></i> <span class="like-count">${post.likes || 0}</span>
          </button>
          <button class="post-action-btn dislike-btn ${post.dislikedBy?.includes(auth.currentUser.uid) ? 'active' : ''}" data-post-id="${doc.id}">
            <i class="fas fa-thumbs-down"></i> <span class="dislike-count">${post.dislikes || 0}</span>
          </button>
          <button class="post-action-btn comment-btn">
            <i class="fas fa-comment"></i> Comments
          </button>
        </div>
        <div class="comments-section">
          <div class="comments-container"></div>
          <form class="comment-form">
            <input type="text" class="comment-input" placeholder="Write a comment..." />
            <button type="submit" class="comment-submit">Send</button>
          </form>
        </div>
      `;
      
      postsSection.appendChild(postElement);

      // Event Listeners for Post Elements
      const userNameElement = postElement.querySelector('.user-name');
      userNameElement.addEventListener('click', (e) => {
        e.preventDefault();
        profileSection.style.display = 'block';
        userStats.style.display = 'block';
        postForm.style.display = 'none';
        loadPosts(e.target.dataset.userId);
        loadUserStats(e.target.dataset.userId);
        
        // Update active states
        document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
        document.querySelectorAll('.mobile-nav-link').forEach(link => link.classList.remove('active'));
        profileLink.classList.add('active');
        mobileProfile.classList.add('active');
      });

      const commentsSection = postElement.querySelector('.comments-section');
      const commentBtn = postElement.querySelector('.comment-btn');
      commentBtn.addEventListener('click', (e) => {
        e.preventDefault();
        commentsSection.classList.toggle('show');
        if (commentsSection.classList.contains('show')) {
          loadComments(doc.id, commentsSection);
        }
      });

      const commentForm = postElement.querySelector('.comment-form');
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const commentInput = commentForm.querySelector('.comment-input');
        const commentContent = commentInput.value.trim();
        if (commentContent) {
          addComment(doc.id, commentContent);
          commentInput.value = '';
        } else {
          showToast('Comment cannot be empty');
        }
      });

      const deleteBtn = postElement.querySelector('.delete-post-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          if (confirm('Are you sure you want to delete this post?')) {
            deletePost(doc.id);
          }
        });
      }

      const editBtn = postElement.querySelector('.edit-post-btn');
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          showEditPopup(doc.id, post.title, post.content);
        });
      }

      const likeBtn = postElement.querySelector('.like-btn');
      const dislikeBtn = postElement.querySelector('.dislike-btn');
      
      likeBtn.addEventListener('click', async () => {
        if (likeBtn.disabled) return;
        likeBtn.disabled = true;
        dislikeBtn.disabled = true;
        
        try {
          await handleLike(doc.id);
        } catch (error) {
          console.error('Error updating like:', error);
          showToast('Failed to update like. Please try again.');
        } finally {
          likeBtn.disabled = false;
          dislikeBtn.disabled = false;
        }
      });

      dislikeBtn.addEventListener('click', async () => {
        if (dislikeBtn.disabled) return;
        dislikeBtn.disabled = true;
        likeBtn.disabled = true;
        
        try {
          await handleDislike(doc.id);
        } catch (error) {
          console.error('Error updating dislike:', error);
          showToast('Failed to update dislike. Please try again.');
        } finally {
          dislikeBtn.disabled = false;
          likeBtn.disabled = false;
        }
      });
    });
  });
}

// Handle Likes and Dislikes
async function handleLike(postId) {
  const postRef = doc(db, 'posts', postId);
  const postDoc = await getDoc(postRef);
  const post = postDoc.data();
  const userId = auth.currentUser.uid;
  const batch = writeBatch(db);

  if (post.likedBy.includes(userId)) {
    // User has already liked, remove the like
    batch.update(postRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId)
    });
  } else {
    // User hasn't liked, add the like
    batch.update(postRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId)
    });

    // If the user had previously disliked, remove the dislike
    if (post.dislikedBy.includes(userId)) {
      batch.update(postRef, {
        dislikes: increment(-1),
        dislikedBy: arrayRemove(userId)
      });
    }
    
    // Add notification for the post owner if it's not the current user
    if (post.userId !== userId) {
      addNotification(post.userId, `${auth.currentUser.displayName || auth.currentUser.email} liked your post.`);
    }
  }

  await batch.commit();
  
  // Update user stats
  loadUserStats(auth.currentUser.uid);
  loadCommunityStats();
}

async function handleDislike(postId) {
  const postRef = doc(db, 'posts', postId);
  const postDoc = await getDoc(postRef);
  const post = postDoc.data();
  const userId = auth.currentUser.uid;
  const batch = writeBatch(db);

  if (post.dislikedBy.includes(userId)) {
    // User has already disliked, remove the dislike
    batch.update(postRef, {
      dislikes: increment(-1),
      dislikedBy: arrayRemove(userId)
    });
  } else {
    // User hasn't disliked, add the dislike
    batch.update(postRef, {
      dislikes: increment(1),
      dislikedBy: arrayUnion(userId)
    });

    // If the user had previously liked, remove the like
    if (post.likedBy.includes(userId)) {
      batch.update(postRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId)
      });
    }
  }

  await batch.commit();
}

// Edit Post Popup
function showEditPopup(postId, title, content) {
  editTitle.value = title;
  editContent.value = content;
  editPopup.classList.add('show');
  overlay.style.display = 'block';

  saveEditBtn.onclick = () => {
    updatePost(postId, editTitle.value, editContent.value);
    closeEditPopup();
  };
}

function closeEditPopup() {
  editPopup.classList.remove('show');
  overlay.style.display = 'none';
}

// Post CRUD Operations
async function deletePost(postId) {
  try {
    await deleteDoc(doc(db, 'posts', postId));
    showToast('Post deleted successfully');
    loadTrendingTopics();
    loadUserStats(auth.currentUser.uid);
    loadCommunityStats();
    loadTopContributors();
  } catch (error) {
    console.error('Error deleting post:', error);
    showToast('Failed to delete post. Please try again.');
  }
}

async function updatePost(postId, newTitle, newContent) {
  try {
    await updateDoc(doc(db, 'posts', postId), {
      title: newTitle,
      content: newContent
    });
    showToast('Post updated successfully');
  } catch (error) {
    console.error('Error updating post:', error);
    showToast('Failed to update post. Please try again.');
  }
}

// Comments
async function addComment(postId, content) {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnapshot = await getDoc(postRef);

    if (!postSnapshot.exists()) {
      throw new Error('Post does not exist!');
    }

    const postData = postSnapshot.data();

    // Use admin display name if user is admin
    const commentUserName = isAdmin(auth.currentUser.email) ? 
                           getAdminDisplayName(auth.currentUser.email) : 
                           (auth.currentUser.displayName || auth.currentUser.email);

    await addDoc(collection(db, 'posts', postId, 'comments'), {
      content: content,
      timestamp: new Date(),
      userId: auth.currentUser.uid,
      userName: commentUserName
    });

    // Add notification for the post owner
    if (postData.userId !== auth.currentUser.uid) {
      addNotification(postData.userId, `${commentUserName} commented on your post.`);
    }
    
    showToast('Comment added successfully');
    loadUserStats(auth.currentUser.uid);
    loadCommunityStats();
  } catch (error) {
    showToast(error.message);
  }
}

const unsubscribeMap = new Map();

function loadComments(postId, commentsSection) {
  // Unsubscribe from previous listener for this postId if exists
  if (unsubscribeMap.has(postId)) {
    unsubscribeMap.get(postId)();
  }

  const commentsContainer = commentsSection.querySelector('.comments-container');
  const q = query(collection(db, 'posts', postId, 'comments'), orderBy('timestamp', 'asc'));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    commentsContainer.innerHTML = '';
    
    if (querySnapshot.empty) {
      commentsContainer.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
      return;
    }
    
    querySnapshot.forEach((doc) => {
      const comment = doc.data();
      const commentElement = document.createElement('div');
      commentElement.className = 'comment';
      
      // Check if current user is admin or comment owner
      const isCurrentUserAdmin = isAdmin(auth.currentUser.email);
      const isCommentOwner = comment.userId === auth.currentUser.uid;
      
      // Determine if delete/edit buttons should be shown
      let editDeleteButtons = '';
      if (isCommentOwner) {
        editDeleteButtons = `
          <button class="comment-action-btn edit-comment-btn"><i class="fas fa-edit"></i></button>
          <button class="comment-action-btn delete-comment-btn"><i class="fas fa-trash"></i></button>`;
      } else if (isCurrentUserAdmin) {
        editDeleteButtons = `
          <button class="comment-action-btn delete-comment-btn"><i class="fas fa-trash"></i></button>`;
      }
      
      // Check if comment user is admin to add badge
      const isUserAdmin = Object.keys(adminUsers).some(adminEmail => {
        return adminUsers[adminEmail] === comment.userName;
      });
      
      const adminBadgeHtml = isUserAdmin ? 
        `<span class="admin-badge">Admin</span>` : '';
      
      commentElement.innerHTML = `
        <div class="comment-header">
          <img src="${generateAvatarUrl(comment.userId)}" alt="Profile Picture" class="comment-avatar" />
          <div class="comment-user">
            <h3>${comment.userName} ${adminBadgeHtml}</h3>
            <p>${new Date(comment.timestamp?.toDate()).toLocaleString()}</p>
          </div>
        </div>
        <p class="comment-content">${comment.content}</p>
        <div class="comment-actions">
          <button class="comment-action-btn reply-btn"><i class="fas fa-reply"></i> Reply</button>
          ${editDeleteButtons}
        </div>
        <div class="replies"></div>
        <form class="reply-form" style="display: none;">
          <input type="text" class="reply-input" placeholder="Write a reply..." />
          <button type="submit" class="reply-submit">Send</button>
        </form>
      `;
      
      commentsContainer.appendChild(commentElement);

      const replyBtn = commentElement.querySelector('.reply-btn');
      const replyForm = commentElement.querySelector('.reply-form');
      
      replyBtn.addEventListener('click', () => {
        replyForm.style.display = replyForm.style.display === 'none' ? 'flex' : 'none';
      });

      replyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const replyInput = replyForm.querySelector('.reply-input');
        const replyContent = replyInput.value.trim();
        if (replyContent) {
          addReply(postId, doc.id, replyContent);
          replyInput.value = '';
          replyForm.style.display = 'none';
        } else {
          showToast('Reply cannot be empty');
        }
      });

      const deleteCommentBtn = commentElement.querySelector('.delete-comment-btn');
      if (deleteCommentBtn) {
        deleteCommentBtn.addEventListener('click', () => {
          if (confirm('Are you sure you want to delete this comment?')) {
            deleteComment(postId, doc.id);
          }
        });
      }

      const editCommentBtn = commentElement.querySelector('.edit-comment-btn');
      if (editCommentBtn) {
        editCommentBtn.addEventListener('click', () => {
          const commentContent = commentElement.querySelector('.comment-content');
          const currentContent = commentContent.textContent;
          showEditPopup(doc.id, '', currentContent);
          saveEditBtn.onclick = () => {
            updateComment(postId, doc.id, editContent.value);
            closeEditPopup();
          };
        });
      }

      loadReplies(postId, doc.id, commentElement.querySelector('.replies'));
    });
  });
  
  unsubscribeMap.set(postId, unsubscribe);
}

// Replies
async function addReply(postId, commentId, content) {
  try {
    const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    const commentSnapshot = await getDoc(commentRef);

    if (!commentSnapshot.exists()) {
      throw new Error('Comment does not exist!');
    }

    const commentData = commentSnapshot.data();

    // Use admin display name if user is admin
    const replyUserName = isAdmin(auth.currentUser.email) ? 
                         getAdminDisplayName(auth.currentUser.email) : 
                         (auth.currentUser.displayName || auth.currentUser.email);

    await addDoc(collection(db, 'posts', postId, 'comments', commentId, 'replies'), {
      content: content,
      timestamp: new Date(),
      userId: auth.currentUser.uid,
      userName: replyUserName
    });

    // Add notification for the comment owner
    if (commentData.userId !== auth.currentUser.uid) {
      addNotification(commentData.userId, `${replyUserName} replied to your comment.`);
    }
    
    showToast('Reply added successfully');
    loadCommunityStats();
  } catch (error) {
    showToast(error.message);
  }
}

function loadReplies(postId, commentId, repliesSection) {
  const q = query(collection(db, 'posts', postId, 'comments', commentId, 'replies'), orderBy('timestamp', 'asc'));
  
  onSnapshot(q, (querySnapshot) => {
    repliesSection.innerHTML = '';
    
    querySnapshot.forEach((doc) => {
      const reply = doc.data();
      const replyElement = document.createElement('div');
      replyElement.className = 'reply';
      
      // Check if current user is admin or reply owner
      const isCurrentUserAdmin = isAdmin(auth.currentUser.email);
      const isReplyOwner = reply.userId === auth.currentUser.uid;
      
      // Determine if delete/edit buttons should be shown
      let editDeleteButtons = '';
      if (isReplyOwner) {
        editDeleteButtons = `
          <button class="comment-action-btn edit-reply-btn"><i class="fas fa-edit"></i></button>
          <button class="comment-action-btn delete-reply-btn"><i class="fas fa-trash"></i></button>`;
      } else if (isCurrentUserAdmin) {
        editDeleteButtons = `
          <button class="comment-action-btn delete-reply-btn"><i class="fas fa-trash"></i></button>`;
      }
      
      // Check if reply user is admin to add badge
      const isUserAdmin = Object.keys(adminUsers).some(adminEmail => {
        return adminUsers[adminEmail] === reply.userName;
      });
      
      const adminBadgeHtml = isUserAdmin ? 
        `<span class="admin-badge">Admin</span>` : '';
      
      replyElement.innerHTML = `
        <div class="comment-header">
          <img src="${generateAvatarUrl(reply.userId)}" alt="Profile Picture" class="comment-avatar">
          <div class="comment-user">
            <h3>${reply.userName} ${adminBadgeHtml}</h3>
            <p>${new Date(reply.timestamp?.toDate()).toLocaleString()}</p>
          </div>
        </div>
        <p class="comment-content">${reply.content}</p>
        <div class="comment-actions">
          ${editDeleteButtons}
        </div>
      `;
      
      repliesSection.appendChild(replyElement);

      const deleteReplyBtn = replyElement.querySelector('.delete-reply-btn');
      if (deleteReplyBtn) {
        deleteReplyBtn.addEventListener('click', () => {
          if (confirm('Are you sure you want to delete this reply?')) {
            deleteReply(postId, commentId, doc.id);
          }
        });
      }

      const editReplyBtn = replyElement.querySelector('.edit-reply-btn');
      if (editReplyBtn) {
        editReplyBtn.addEventListener('click', () => {
          const replyContent = replyElement.querySelector('.comment-content');
          const currentContent = replyContent.textContent;
          showEditPopup(doc.id, '', currentContent);
          saveEditBtn.onclick = () => {
            updateReply(postId, commentId, doc.id, editContent.value);
            closeEditPopup();
          };
        });
      }
    });
  });
}

// Comment CRUD Operations
async function deleteComment(postId, commentId) {
  try {
    await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
    showToast('Comment deleted successfully');
    loadUserStats(auth.currentUser.uid);
    loadCommunityStats();
  } catch (error) {
    console.error('Error deleting comment:', error);
    showToast('Failed to delete comment. Please try again.');
  }
}

async function updateComment(postId, commentId, newContent) {
  try {
    await updateDoc(doc(db, 'posts', postId, 'comments', commentId), {
      content: newContent
    });
    showToast('Comment updated successfully');
  } catch (error) {
    console.error('Error updating comment:', error);
    showToast('Failed to update comment. Please try again.');
  }
}

async function deleteReply(postId, commentId, replyId) {
  try {
    await deleteDoc(doc(db, 'posts', postId, 'comments', commentId, 'replies', replyId));
    showToast('Reply deleted successfully');
  } catch (error) {
    console.error('Error deleting reply:', error);
    showToast('Failed to delete reply. Please try again.');
  }
}

async function updateReply(postId, commentId, replyId, newContent) {
  try {
    await updateDoc(doc(db, 'posts', postId, 'comments', commentId, 'replies', replyId), {
      content: newContent
    });
    showToast('Reply updated successfully');
  } catch (error) {
    console.error('Error updating reply:', error);
    showToast('Failed to update reply. Please try again.');
  }
}

// Notifications
function addNotification(userId, message) {
  addDoc(collection(db, 'notifications'), {
    userId: userId,
    message: message,
    timestamp: new Date(),
    read: false
  }).then(() => {
    console.log('Notification added successfully');
  }).catch((error) => {
    console.error('Error adding notification:', error);
  });
}

function getNotificationIcon(message) {
  if (message.includes('commented')) {
    return 'fa-comment';
  } else if (message.includes('replied')) {
    return 'fa-reply';
  } else if (message.includes('liked')) {
    return 'fa-thumbs-up';
  } else {
    return 'fa-bell';
  }
}

function listenForNotifications(userId) {
  const q = query(collection(db, 'notifications'), where('userId', '==', userId), orderBy('timestamp', 'desc'));
  onSnapshot(q, (querySnapshot) => {
    const notificationsList = document.getElementById('notifications-list');
    notificationsList.innerHTML = '';
    
    if (querySnapshot.empty) {
      notificationsList.innerHTML = '<div class="notification-item">No notifications yet.</div>';
      return;
    }
    
    querySnapshot.forEach((doc) => {
      const notification = doc.data();
      const notificationElement = document.createElement('div');
      notificationElement.className = 'notification-item';
      
      const iconClass = getNotificationIcon(notification.message);
      
      notificationElement.innerHTML = `
        <div class="notification-icon">
          <i class="fas ${iconClass}"></i>
        </div>
        <div class="notification-content">
          <p>${notification.message}</p>
          <p class="notification-time">${new Date(notification.timestamp.toDate()).toLocaleString()}</p>
        </div>
      `;
      
      notificationsList.appendChild(notificationElement);
    });
  });
}

// Search Functionality
searchBtn.addEventListener('click', function() {
  performSearch();
});

searchBar.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    performSearch();
  }
});

function performSearch() {
  const searchTerm = searchBar.value.trim().toLowerCase();
  if (searchTerm) {
    Promise.resolve().then(async () => {
      try {
        // Search in users
        const usersQuery = query(
          collection(db, 'users'),
          where('userName', '>=', searchTerm),
          where('userName', '<=', searchTerm + '\uf8ff')
        );
        
        
        // Search in posts (title)
        const postsTitleQuery = query(
          collection(db, 'posts'),
          orderBy('title'),
          where('title', '>=', searchTerm),
          where('title', '<=', searchTerm + '\uf8ff')
        );
        
        // Search in posts (content)
        const postsContentQuery = query(
          collection(db, 'posts'),
          orderBy('content'),
          where('content', '>=', searchTerm),
          where('content', '<=', searchTerm + '\uf8ff')
        );
        
        // Search in posts (tags)
        const postsTagsQuery = query(
          collection(db, 'posts'),
          where('tags', 'array-contains', searchTerm)
        );

        const [usersSnapshot, postsTitleSnapshot, postsContentSnapshot, postsTagsSnapshot] = await Promise.all([
          getDocs(usersQuery),
          getDocs(postsTitleQuery),
          getDocs(postsContentQuery),
          getDocs(postsTagsQuery)
        ]);

        // Combine post results and remove duplicates
        const postResults = new Map();
        
        function addPostToResults(doc) {
          if (!postResults.has(doc.id)) {
            postResults.set(doc.id, doc.data());
          }
        }
        
        postsTitleSnapshot.forEach(addPostToResults);
        postsContentSnapshot.forEach(addPostToResults);
        postsTagsSnapshot.forEach(addPostToResults);

        // Display results
        postsSection.innerHTML = '';
        
        const resultsHeader = document.createElement('div');
        resultsHeader.className = 'post';
        resultsHeader.innerHTML = `<h3>Search Results for "${searchTerm}"</h3>`;
        postsSection.appendChild(resultsHeader);
        
        // Display user results
        if (!usersSnapshot.empty) {
          const usersResultsSection = document.createElement('div');
          usersResultsSection.className = 'post';
          usersResultsSection.innerHTML = '<h4>Users:</h4>';
          
          usersSnapshot.forEach((userDoc) => {
            const user = userDoc.data();
            const userItem = document.createElement('div');
            userItem.className = 'post-header-left';
            userItem.style.margin = '10px 0';
            userItem.style.cursor = 'pointer';
            
            // Check if user is admin
            let displayName = user.userName || 'Anonymous';
            const isUserAdmin = Object.keys(adminUsers).some(adminEmail => {
              if (user.email === adminEmail) {
                displayName = adminUsers[adminEmail];
                return true;
              }
              return false;
            });
            
            const adminBadgeHtml = isUserAdmin ? 
              `<span class="admin-badge">Admin</span>` : '';
            
            userItem.innerHTML = `
              <img src="${generateAvatarUrl(userDoc.id)}" alt="Profile Picture" class="post-avatar" />
              <div class="post-user">
                <h3 class="user-name" data-user-id="${userDoc.id}">${displayName}</h3>
                ${adminBadgeHtml}
              </div>
            `;
            
            userItem.addEventListener('click', () => {
              profileSection.style.display = 'block';
              userStats.style.display = 'block';
              postForm.style.display = 'none';
              loadPosts(userDoc.id);
              loadUserStats(userDoc.id);
              
              // Update active states
              document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
              document.querySelectorAll('.mobile-nav-link').forEach(link => link.classList.remove('active'));
              profileLink.classList.add('active');
              mobileProfile.classList.add('active');
            });
            
            usersResultsSection.appendChild(userItem);
          });
          
          postsSection.appendChild(usersResultsSection);
        }
        
        // Display post results
        if (postResults.size > 0) {
          const postsResultsSection = document.createElement('div');
          postsResultsSection.className = 'post';
          postsResultsSection.innerHTML = '<h4>Posts:</h4>';
          
          postResults.forEach((post, postId) => {
            const postItem = document.createElement('div');
            postItem.className = 'post-item';
            postItem.style.margin = '10px 0';
            postItem.style.padding = '10px';
            postItem.style.borderRadius = '8px';
            postItem.style.backgroundColor = 'var(--background-color)';
            postItem.style.cursor = 'pointer';
            postItem.style.transition = 'var(--transition)';
            
            // Check if post author is admin
            const isUserAdmin = Object.keys(adminUsers).some(adminEmail => {
              return adminUsers[adminEmail] === post.userName;
            });
            
            const adminBadgeHtml = isUserAdmin ? 
              `<span class="admin-badge">Admin</span>` : '';
            
            postItem.innerHTML = `
              <div class="post-header-left">
                <img src="${generateAvatarUrl(post.userId)}" alt="Profile Picture" class="post-avatar" style="width: 32px; height: 32px;" />
                <div class="post-user">
                  <h3>${post.userName} ${adminBadgeHtml}</h3>
                </div>
              </div>
              <h4 style="margin-top: 8px;">${post.title}</h4>
              <p style="margin-top: 4px; font-size: 0.9rem;">${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
            `;
            
            postItem.addEventListener('click', () => {
              // Close search results and show the actual post
              loadPosts();
              
              // Scroll to the post after a short delay to allow posts to load
              setTimeout(() => {
                const postElement = document.querySelector(`[data-post-id="${postId}"]`)?.closest('.post');
                if (postElement) {
                  postElement.scrollIntoView({ behavior: 'smooth' });
                  postElement.style.animation = 'highlight 2s';
                }
              }, 500);
            });
            
            postItem.addEventListener('mouseenter', () => {
              postItem.style.backgroundColor = 'rgba(230, 81, 0, 0.05)';
              postItem.style.transform = 'translateY(-2px)';
            });
            
            postItem.addEventListener('mouseleave', () => {
              postItem.style.backgroundColor = 'var(--background-color)';
              postItem.style.transform = 'translateY(0)';
            });
            
            postsResultsSection.appendChild(postItem);
          });
          
          postsSection.appendChild(postsResultsSection);
        }
        
        // No results message
        if (usersSnapshot.empty && postResults.size === 0) {
          const noResultsMessage = document.createElement('div');
          noResultsMessage.className = 'post';
          noResultsMessage.innerHTML = '<p>No results found. Try a different search term.</p>';
          postsSection.appendChild(noResultsMessage);
        }
        
        // Hide search container on mobile after search
        if (window.innerWidth <= 576) {
          searchContainer.classList.remove('show');
        }
        
      } catch (error) {
        console.error('Search error:', error);
        showToast('Search error: ' + error.message);
      }
    });
  } else {
    showToast('Please enter a search term');
  }
}

// Profile Management
function updateProfileInfo(user) {
  // Check if user is admin and update display name
  let displayName = user.displayName || 'Anonymous';
  if (isAdmin(user.email)) {
    displayName = getAdminDisplayName(user.email);
  }
  
  profileName.textContent = displayName;
  profileEmail.textContent = user.email;
  profilePicture.src = user.photoURL || generateAvatarUrl(user.uid);

  const q = query(collection(db, 'posts'), where('userId', '==', user.uid));
  getDocs(q).then((querySnapshot) => {
    profilePosts.textContent = querySnapshot.size;
  });
  
  // Get comments count
  let commentsCount = 0;
  getDocs(q).then(async (postsSnapshot) => {
    for (const postDoc of postsSnapshot.docs) {
      const commentsQuery = query(collection(db, 'posts', postDoc.id, 'comments'), where('userId', '==', user.uid));
      const commentsSnapshot = await getDocs(commentsQuery);
      commentsCount += commentsSnapshot.size;
    }
    profileComments.textContent = commentsCount;
  });
  
  // Get likes count
  const likedPostsQuery = query(collection(db, 'posts'), where('likedBy', 'array-contains', user.uid));
  getDocs(likedPostsQuery).then((likedPostsSnapshot) => {
    profileLikes.textContent = likedPostsSnapshot.size;
  });
}

uploadPicture.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const storageRef = ref(storage, 'profile_pictures/' + auth.currentUser.uid);
    
    // Show loading state
    profilePicture.style.opacity = '0.5';
    
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        auth.currentUser.updateProfile({
          photoURL: downloadURL
        }).then(() => {
          profilePicture.src = downloadURL;
          postFormAvatar.src = downloadURL;
          profilePicture.style.opacity = '1';
          showToast('Profile picture updated successfully');
        });
      });
    }).catch(error => {
      profilePicture.style.opacity = '1';
      showToast('Error uploading image: ' + error.message);
    });
  }
});

// User Stats
async function loadUserStats(userId) {
  try {
    // Count posts
    const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
    const postsSnapshot = await getDocs(postsQuery);
    const postsCount = postsSnapshot.size;
    
    // Initialize counters
    let commentsTotal = 0;
    let likesGiven = 0;
    let likesReceived = 0;
    
    // Count comments
    const commentPromises = postsSnapshot.docs.map(async (postDoc) => {
      const commentsQuery = query(collection(db, 'posts', postDoc.id, 'comments'), where('userId', '==', userId));
      const commentsSnapshot = await getDocs(commentsQuery);
      return commentsSnapshot.size;
    });
    
    const commentCounts = await Promise.all(commentPromises);
    commentsTotal = commentCounts.reduce((total, count) => total + count, 0);
    
    // Count likes given
    const likedPostsQuery = query(collection(db, 'posts'), where('likedBy', 'array-contains', userId));
    const likedPostsSnapshot = await getDocs(likedPostsQuery);
    likesGiven = likedPostsSnapshot.size;
    
    // Count likes received
    postsSnapshot.forEach(doc => {
      const post = doc.data();
      likesReceived += post.likes || 0;
    });
    
    // Update UI
    document.getElementById('posts-count').textContent = postsCount;
    document.getElementById('comments-count').textContent = commentsTotal;
    document.getElementById('likes-count').textContent = likesGiven;
    document.getElementById('received-likes-count').textContent = likesReceived;
    
  } catch (error) {
    console.error('Error loading user stats:', error);
  }
}

// Top Contributors
async function loadTopContributors() {
  try {
    // Get all posts
    const postsQuery = query(collection(db, 'posts'));
    const postsSnapshot = await getDocs(postsQuery);
    
    // Count posts by user
    const userPostCounts = {};
    
    postsSnapshot.forEach(doc => {
      const post = doc.data();
      const userId = post.userId;
      const userName = post.userName;
      
      if (!userPostCounts[userId]) {
        userPostCounts[userId] = {
          userId,
          userName,
          posts: 0,
          likes: 0
        };
      }
      
      userPostCounts[userId].posts += 1;
      userPostCounts[userId].likes += post.likes || 0;
    });
    
    // Convert to array and sort by post count
    const sortedContributors = Object.values(userPostCounts)
      .sort((a, b) => b.posts - a.posts || b.likes - a.likes)
      .slice(0, 5);
    
    // Update UI
    topContributorsList.innerHTML = '';
    
    if (sortedContributors.length === 0) {
      topContributorsList.innerHTML = '<p>No contributors yet.</p>';
      return;
    }
    
    sortedContributors.forEach((contributor, index) => {
      const contributorElement = document.createElement('div');
      contributorElement.className = 'top-contributor';
      
      // Randomly determine if user is online (for demo purposes)
      const isOnline = Math.random() > 0.5;
      
      // Check if contributor is admin
      const isContributorAdmin = Object.values(adminUsers).includes(contributor.userName);
      const adminBadgeHtml = isContributorAdmin ? 
        `<span class="admin-badge">Admin</span>` : '';
      
      contributorElement.innerHTML = `
        <div class="contributor-rank">${index + 1}</div>
        <img src="${generateAvatarUrl(contributor.userId)}" alt="Profile Picture" class="contributor-avatar" />
        <div class="contributor-info">
          <h4 class="contributor-name">${contributor.userName}</h4>
          <p class="contributor-stats">${contributor.posts} posts, ${contributor.likes} likes</p>
          ${adminBadgeHtml}
        </div>
        ${isOnline ? '<div class="online-indicator"></div>' : ''}
      `;
      
      contributorElement.addEventListener('click', () => {
        profileSection.style.display = 'block';
        userStats.style.display = 'block';
        postForm.style.display = 'none';
        loadPosts(contributor.userId);
        loadUserStats(contributor.userId);
        
        // Update active states
        document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
        document.querySelectorAll('.mobile-nav-link').forEach(link => link.classList.remove('active'));
        profileLink.classList.add('active');
        mobileProfile.classList.add('active');
      });
      
      topContributorsList.appendChild(contributorElement);
    });
    
    // Set online users count (random for demo)
    onlineCount.textContent = Math.floor(Math.random() * 10) + sortedContributors.length;
    
  } catch (error) {
    console.error('Error loading top contributors:', error);
    topContributorsList.innerHTML = '<p>Error loading top contributors.</p>';
  }
}

// Community Stats
async function loadCommunityStats() {
  try {
    // Count total posts
    const postsQuery = query(collection(db, 'posts'));
    const postsSnapshot = await getDocs(postsQuery);
    const postsCount = postsSnapshot.size;
    
    // Count unique users
    const uniqueUsers = new Set();
    postsSnapshot.forEach(doc => {
      const post = doc.data();
      uniqueUsers.add(post.userId);
    });
    
    // Count total comments
    let commentsTotal = 0;
    for (const postDoc of postsSnapshot.docs) {
      const commentsQuery = query(collection(db, 'posts', postDoc.id, 'comments'));
      const commentsSnapshot = await getDocs(commentsQuery);
      commentsTotal += commentsSnapshot.size;
    }
    
    // Count total likes
    let likesTotal = 0;
    postsSnapshot.forEach(doc => {
      const post = doc.data();
      likesTotal += post.likes || 0;
    });
    
    // Update UI
    totalPosts.textContent = postsCount;
    totalUsers.textContent = uniqueUsers.size;
    totalComments.textContent = commentsTotal;
    totalLikes.textContent = likesTotal;
    
  } catch (error) {
    console.error('Error loading community stats:', error);
  }
}

// Trending Topics
async function loadTrendingTopics() {
  try {
    // Get posts from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const postsQuery = query(
      collection(db, 'posts'),
      where('timestamp', '>=', oneWeekAgo),
      orderBy('timestamp', 'desc')
    );
    
    const postsSnapshot = await getDocs(postsQuery);
    
    // Calculate trending score based on likes, comments, and recency
    const topics = new Map();
    
    for (const postDoc of postsSnapshot.docs) {
      const post = postDoc.data();
      
      // Get comment count
      const commentsQuery = query(collection(db, 'posts', postDoc.id, 'comments'));
      const commentsSnapshot = await getDocs(commentsQuery);
      const commentCount = commentsSnapshot.size;
      
      // Calculate recency score (newer posts get higher score)
      const postDate = post.timestamp.toDate();
      const now = new Date();
      const ageInHours = (now - postDate) / (1000 * 60 * 60);
      const recencyScore = Math.max(0, 1 - (ageInHours / (7 * 24))); // 0-1 score, 1 being newest
      
      // Calculate trending score
      const trendingScore = (post.likes || 0) * 2 + commentCount * 3 + recencyScore * 10;
      
      // Add to topics map
      if (!topics.has(post.title)) {
        topics.set(post.title, {
          title: post.title,
          category: post.category,
          score: trendingScore,
          postId: postDoc.id
        });
      } else {
        // If topic already exists, update score if this post has higher score
        const existingTopic = topics.get(post.title);
        if (trendingScore > existingTopic.score) {
          existingTopic.score = trendingScore;
          existingTopic.postId = postDoc.id;
        }
      }
    }
    
    // Sort topics by score and take top 5
    const sortedTopics = Array.from(topics.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    // Update UI
    trendingTopicsList.innerHTML = '';
    
    if (sortedTopics.length === 0) {
      trendingTopicsList.innerHTML = '<p>No trending topics yet.</p>';
      return;
    }
    
    sortedTopics.forEach((topic, index) => {
      const topicElement = document.createElement('div');
      topicElement.className = 'trending-topic';
      topicElement.innerHTML = `
        <div class="trending-topic-number">${index + 1}</div>
        <div class="trending-topic-content">
          <h4>${topic.title}</h4>
          <p>Category: ${topic.category}</p>
        </div>
      `;
      
      topicElement.addEventListener('click', () => {
        // Load the post
        loadPosts();
        
        // Scroll to the post after a short delay
        setTimeout(() => {
          const postElement = document.querySelector(`[data-post-id="${topic.postId}"]`)?.closest('.post');
          if (postElement) {
            postElement.scrollIntoView({ behavior: 'smooth' });
            postElement.style.animation = 'highlight 2s';
          }
        }, 500);
      });
      
      trendingTopicsList.appendChild(topicElement);
    });
    
  } catch (error) {
    console.error('Error loading trending topics:', error);
    trendingTopicsList.innerHTML = '<p>Error loading trending topics.</p>';
  }
}

// Category Filter
categoryFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    
    // Update active state
    categoryFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Load posts with selected category
    loadPosts(null, category);
  });
});

// Category links in sidebar
categoryLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const category = link.dataset.category;
    
    // Update active state in category filter
    categoryFilterBtns.forEach(btn => {
      if (btn.dataset.category === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Load posts with selected category
    loadPosts(null, category);
    
    // Close sidebar on mobile
    if (window.innerWidth <= 992) {
      sidebar.classList.remove('show');
    }
  });
});

// Navigation
function setActiveNavItem(id) {
  // Desktop navigation
  document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  
  // Mobile navigation
  document.querySelectorAll('.mobile-nav-link').forEach(link => link.classList.remove('active'));
  document.getElementById('mobile-' + id.replace('-link', '')).classList.add('active');
  
  // Close sidebar on mobile
  if (window.innerWidth <= 992) {
    sidebar.classList.remove('show');
  }
}

homeLink.addEventListener('click', (e) => {
  e.preventDefault();
  profileSection.style.display = 'none';
  userStats.style.display = 'none';
  postForm.style.display = window.innerWidth > 992 ? 'block' : 'none';
  postsSection.style.display = 'block';
  loadPosts();
  setActiveNavItem('home-link');
});

profileLink.addEventListener('click', (e) => {
  e.preventDefault();
  profileSection.style.display = 'block';
  userStats.style.display = 'block';
  postForm.style.display = 'none';
  postsSection.style.display = 'block';
  loadPosts(auth.currentUser.uid);
  loadUserStats(auth.currentUser.uid);
  setActiveNavItem('profile-link');
});

profileBtn.addEventListener('click', (e) => {
  profileSection.style.display = 'block';
  userStats.style.display = 'block';
  postForm.style.display = 'none';
  postsSection.style.display = 'block';
  loadPosts(auth.currentUser.uid);
  loadUserStats(auth.currentUser.uid);
  setActiveNavItem('profile-link');
});

notificationsLink.addEventListener('click', (e) => {
  e.preventDefault();
  notificationsPanel.classList.add('show');
  setActiveNavItem('notifications-link');
});

notificationsBtn.addEventListener('click', (e) => {
  notificationsPanel.classList.add('show');
  setActiveNavItem('notifications-link');
});

closeNotificationsBtn.addEventListener('click', () => {
  notificationsPanel.classList.remove('show');
});

// Mobile Navigation
mobileHome.addEventListener('click', (e) => {
  e.preventDefault();
  profileSection.style.display = 'none';
  userStats.style.display = 'none';
  postForm.style.display = 'none'; // Hide on mobile
  postsSection.style.display = 'block';
  loadPosts();
  setActiveNavItem('home-link');
});

mobileProfile.addEventListener('click', (e) => {
  e.preventDefault();
  profileSection.style.display = 'block';
  userStats.style.display = 'block';
  postForm.style.display = 'none';
  postsSection.style.display = 'block';
  loadPosts(auth.currentUser.uid);
  loadUserStats(auth.currentUser.uid);
  setActiveNavItem('profile-link');
});

mobileNotifications.addEventListener('click', (e) => {
  e.preventDefault();
  notificationsPanel.classList.add('show');
  setActiveNavItem('notifications-link');
});

// Edit Popup
cancelEditBtn.addEventListener('click', closeEditPopup);
overlay.addEventListener('click', closeEditPopup);

// Close notifications panel when clicking outside
document.addEventListener('click', (e) => {
  if (notificationsPanel.classList.contains('show') && 
      !notificationsPanel.contains(e.target) && 
      !notificationsLink.contains(e.target) &&
      !notificationsBtn.contains(e.target) &&
      !mobileNotifications.contains(e.target)) {
    notificationsPanel.classList.remove('show');
  }
});

// Window resize handler
window.addEventListener('resize', () => {
  if (window.innerWidth > 992) {
    if (homeLink.classList.contains('active')) {
      postForm.style.display = 'block';
    }
  } else {
    postForm.style.display = 'none';
  }
});

// Initialize UI based on screen size
if (window.innerWidth <= 992) {
  postForm.style.display = 'none';
}