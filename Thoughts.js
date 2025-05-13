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
      Timestamp,
      setDoc
    } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
    import { 
      getStorage, 
      ref, 
      uploadBytes, 
      getDownloadURL,
      deleteObject
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

    // Cloudinary configuration
    const cloudName = "dz3sdis2x";
    const uploadPreset = "Ang Silakbo 1";

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
    const tweetsContainer = document.getElementById('tweets-container');
    const tweetContent = document.getElementById('tweet-content');
    const tweetTitle = document.getElementById('tweet-title');
    const tweetTags = document.getElementById('tweet-tags');
    const categorySelect = document.getElementById('category-select');
    const tweetSubmit = document.getElementById('tweet-submit');
    const composeBtn = document.getElementById('compose-btn');
    const floatTweetBtn = document.getElementById('float-tweet-btn');
    const searchInput = document.getElementById('search-input');
    const trendingTopicsList = document.getElementById('trending-topics-list');
    const topContributorsList = document.getElementById('top-contributors-list');
    const userProfileBtn = document.getElementById('user-profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    const dropdownProfile = document.getElementById('dropdown-profile');
    const dropdownLogout = document.getElementById('dropdown-logout');
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    const sidebarName = document.getElementById('sidebar-name');
    const sidebarHandle = document.getElementById('sidebar-handle');
    const composeAvatar = document.getElementById('compose-avatar');
    const homeLink = document.getElementById('home-link');
    const exploreLink = document.getElementById('explore-link');
    const notificationsLink = document.getElementById('notifications-link');
    const profileLink = document.getElementById('profile-link');
    const settingsLink = document.getElementById('settings-link');
    const mobileHome = document.getElementById('mobile-home');
    const mobileExplore = document.getElementById('mobile-explore');
    const mobileNotifications = document.getElementById('mobile-notifications');
    const mobileProfile = document.getElementById('mobile-profile');
    const pageTitle = document.getElementById('page-title');
    
    // Image Upload Elements
    const imageUploadContainer = document.getElementById('image-upload-container');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const imageRemoveBtn = document.getElementById('image-remove-btn');
    const uploadImageBtn = document.getElementById('upload-image-btn');
    
    // Edit Image Upload Elements
    const editImageUploadContainer = document.getElementById('edit-image-upload-container');
    const editImagePreviewContainer = document.getElementById('edit-image-preview-container');
    const editImagePreview = document.getElementById('edit-image-preview');
    const editImageRemoveBtn = document.getElementById('edit-image-remove-btn');
    
    // Profile Image Upload
    const profileImageUpload = document.getElementById('profile-image-upload');
    
    // Lightbox Elements
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    
    // Pages
    const homePage = document.getElementById('home-page');
    const notificationsPage = document.getElementById('notifications-page');
    const profilePage = document.getElementById('profile-page');
    const explorePage = document.getElementById('explore-page');
    const settingsPage = document.getElementById('settings-page');
    
    // Modals
    const editModal = document.getElementById('edit-modal');
    const editModalOverlay = document.getElementById('edit-modal-overlay');
    const editModalClose = document.getElementById('edit-modal-close');
    const editTitle = document.getElementById('edit-title');
    const editContent = document.getElementById('edit-content');
    const editSave = document.getElementById('edit-save');
    const editCancel = document.getElementById('edit-cancel');
    
    const reportModal = document.getElementById('report-modal');
    const reportModalOverlay = document.getElementById('report-modal-overlay');
    const reportModalClose = document.getElementById('report-modal-close');
    const reportSubmit = document.getElementById('report-submit');
    const reportCancel = document.getElementById('report-cancel');
    const reportOptions = document.querySelectorAll('.report-option');
    const reportDetails = document.getElementById('report-details');
    
    const followersModal = document.getElementById('followers-modal');
    const followersModalOverlay = document.getElementById('followers-modal-overlay');
    const followersModalClose = document.getElementById('followers-modal-close');
    const followersList = document.getElementById('followers-list');
    
    const followingModal = document.getElementById('following-modal');
    const followingModalOverlay = document.getElementById('following-modal-overlay');
    const followingModalClose = document.getElementById('following-modal-close');
    const followingList = document.getElementById('following-list');
    
    // Profile Elements
    const profileAvatar = document.getElementById('profile-avatar');
    const profileName = document.getElementById('profile-name');
    const profileHandle = document.getElementById('profile-handle');
    const profileBio = document.getElementById('profile-bio');
    const profilePostsCount = document.getElementById('profile-posts').querySelector('.profile-stat-value');
    const profileFollowersCount = document.getElementById('profile-followers').querySelector('.profile-stat-value');
    const profileFollowingCount = document.getElementById('profile-following').querySelector('.profile-stat-value');
    const profileActions = document.getElementById('profile-actions');
    const followBtn = document.getElementById('follow-btn');
    const reportUserBtn = document.getElementById('report-user-btn');
    const profileTabs = document.querySelectorAll('.profile-tab');
    const profileTweetsContainer = document.getElementById('profile-tweets-container');
    
    // Explore Elements
    const exploreTabs = document.querySelectorAll('.explore-tab');
    const exploreTweetsContainer = document.getElementById('explore-tweets-container');
    
    // Settings Elements
    const settingsUsername = document.getElementById('settings-username');
    const settingsBio = document.getElementById('settings-bio');
    const emailNotifications = document.getElementById('email-notifications');
    const pushNotifications = document.getElementById('push-notifications');
    const privateAccount = document.getElementById('private-account');
    const activityStatus = document.getElementById('activity-status');
    const saveSettings = document.getElementById('save-settings');

    // Variables for image upload
    let currentUploadedImageUrl = null;
    let editImageUrl = null;
    let profileImageUrl = null;

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

    // Cloudinary Upload Widget
    function initCloudinaryUploadWidget(callback) {
      const options = {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        maxFileSize: 10000000, // 10MB
        resourceType: 'image',
        cropping: false,
        styles: {
          palette: {
            window: "#FFFFFF",
            sourceBg: "#F7F9FA",
            windowBorder: "#E1E8ED",
            tabIcon: "#E65100",
            inactiveTabIcon: "#657786",
            menuIcons: "#E65100",
            link: "#E65100",
            action: "#E65100",
            inProgress: "#E65100",
            complete: "#4E9F3D",
            error: "#E0245E",
            textDark: "#14171A",
            textLight: "#FFFFFF"
          }
        }
      };
      
      return cloudinary.createUploadWidget(options, (error, result) => {
        if (!error && result && result.event === "success") {
          const imageUrl = result.info.secure_url;
          callback(imageUrl);
        }
        
        if (error) {
          console.error('Cloudinary upload error:', error);
          showToast('Error uploading image. Please try again.');
        }
      });
    }

    // Initialize Cloudinary Upload Widgets
    const uploadWidget = initCloudinaryUploadWidget((imageUrl) => {
      currentUploadedImageUrl = imageUrl;
      imagePreview.src = imageUrl;
      imagePreviewContainer.style.display = 'block';
      imageUploadContainer.style.display = 'none';
      showToast('Image uploaded successfully!');
    });
    
    const editUploadWidget = initCloudinaryUploadWidget((imageUrl) => {
      editImageUrl = imageUrl;
      editImagePreview.src = imageUrl;
      editImagePreviewContainer.style.display = 'block';
      editImageUploadContainer.style.display = 'none';
      showToast('Image uploaded successfully!');
    });
    
    const profileUploadWidget = initCloudinaryUploadWidget((imageUrl) => {
      profileImageUrl = imageUrl;
      
      // Update user's profile picture in Firebase
      updateDoc(doc(db, 'users', auth.currentUser.uid), {
        photoURL: imageUrl
      }).then(() => {
        // Update UI
        sidebarAvatar.src = imageUrl;
        composeAvatar.src = imageUrl;
        profileAvatar.src = imageUrl;
        showToast('Profile picture updated successfully!');
      }).catch((error) => {
        console.error('Error updating profile picture:', error);
        showToast('Error updating profile picture. Please try again.');
      });
    });

    // Image Upload Event Listeners
    imageUploadContainer.addEventListener('click', () => {
      uploadWidget.open();
    });
    
    uploadImageBtn.addEventListener('click', () => {
      uploadWidget.open();
    });
    
    imageRemoveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentUploadedImageUrl = null;
      imagePreview.src = '';
      imagePreviewContainer.style.display = 'none';
      imageUploadContainer.style.display = 'block';
    });
    
    editImageUploadContainer.addEventListener('click', () => {
      editUploadWidget.open();
    });
    
    editImageRemoveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      editImageUrl = null;
      editImagePreview.src = '';
      editImagePreviewContainer.style.display = 'none';
      editImageUploadContainer.style.display = 'block';
    });
    
    profileImageUpload.addEventListener('click', () => {
      profileUploadWidget.open();
    });
    
    // Lightbox Event Listeners
    lightboxClose.addEventListener('click', () => {
      lightboxOverlay.style.display = 'none';
    });
    
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) {
        lightboxOverlay.style.display = 'none';
      }
    });

    // Toggle Profile Dropdown
    userProfileBtn.addEventListener('click', () => {
      profileDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!userProfileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('show');
      }
    });

    // Dropdown Actions
    dropdownProfile.addEventListener('click', (e) => {
      e.preventDefault();
      profileDropdown.classList.remove('show');
      setActiveNavItem('profile');
      loadUserProfile(auth.currentUser.uid);
    });

    dropdownLogout.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to log out?')) {
        signOut(auth)
          .then(() => {
            window.location.href = 'Silakbo Freedom Wall.html';
          })
          .catch((error) => showToast(error.message));
      }
    });

    // Auth State Change
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Update user info in sidebar
        let displayName = user.displayName || user.email.split('@')[0];
        let userHandle = '@' + (user.displayName || user.email.split('@')[0]).toLowerCase().replace(/\s+/g, '');
        
        // Check if user is an admin and update display name
        if (isAdmin(user.email)) {
          displayName = getAdminDisplayName(user.email);
          userHandle = '@admin_' + displayName.toLowerCase().replace(/\s+/g, '');
        }
        
        sidebarName.textContent = displayName;
        sidebarHandle.textContent = userHandle;
        sidebarAvatar.src = user.photoURL || generateAvatarUrl(user.uid);
        composeAvatar.src = user.photoURL || generateAvatarUrl(user.uid);
        
        // Initialize user data if it doesn't exist
        initializeUserData(user);
        
        loadPosts();
        loadTrendingTopics();
        loadTopContributors();
        loadNotifications();
      } else {
        window.location.href = 'Silakbo Freedom Wall.html';
      }
    });

    // Initialize user data
    async function initializeUserData(user) {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        await setDoc(userRef, {
          displayName: isAdmin(user.email) ? getAdminDisplayName(user.email) : (user.displayName || user.email.split('@')[0]),
          email: user.email,
          photoURL: user.photoURL || generateAvatarUrl(user.uid),
          bio: '',
          followers: [],
          following: [],
          createdAt: new Date(),
          isAdmin: isAdmin(user.email),
          settings: {
            emailNotifications: false,
            pushNotifications: true,
            privateAccount: false,
            activityStatus: true
          }
        });
      }
    }

    // Tweet Submission
    tweetSubmit.addEventListener('click', submitTweet);
    
    function submitTweet() {
      const title = tweetTitle.value.trim();
      const content = tweetContent.value.trim();
      const category = categorySelect.value;
      const tagsList = tweetTags.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      if (title && content && category) {
        tweetSubmit.disabled = true;
        
        const postData = {
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
        };
        
        // Add image URL if uploaded
        if (currentUploadedImageUrl) {
          postData.imageUrl = currentUploadedImageUrl;
        }
        
        addDoc(collection(db, 'posts'), postData)
        .then(() => {
          // Clear form fields
          tweetTitle.value = '';
          tweetContent.value = '';
          categorySelect.value = '';
          tweetTags.value = '';
          currentUploadedImageUrl = null;
          imagePreview.src = '';
          imagePreviewContainer.style.display = 'none';
          imageUploadContainer.style.display = 'block';
          
          showToast('Scrib posted successfully!');
          tweetSubmit.disabled = false;
          
          // Update trending topics
          loadTrendingTopics();
          loadTopContributors();
        })
        .catch((error) => {
          showToast(error.message);
          tweetSubmit.disabled = false;
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
      
      const container = userId ? profileTweetsContainer : tweetsContainer;
      container.innerHTML = '<div style="text-align: center; padding: 2rem;">Loading posts...</div>';
      
      unsubscribePosts = onSnapshot(q, (querySnapshot) => {
        container.innerHTML = ''; // Clear container before rendering
        
        if (querySnapshot.empty) {
          container.innerHTML = '<div class="tweet"><p style="text-align: center; padding: 2rem;">No scribs found.</p></div>';
          return;
        }
        
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          const tweetElement = document.createElement('div');
          tweetElement.className = 'tweet';
          tweetElement.dataset.postId = doc.id;
          
          // Check if current user is admin or post owner
          const isCurrentUserAdmin = isAdmin(auth.currentUser.email);
          const isPostOwner = post.userId === auth.currentUser.uid;
          
          // Determine if delete/edit buttons should be shown
          const showDeleteButton = isCurrentUserAdmin || isPostOwner;
          const showEditButton = isPostOwner;
          
          // Format date
          const postDate = post.timestamp?.toDate();
          const formattedDate = postDate ? formatDate(postDate) : '';
          
          // Check if user is admin to add badge
          const isUserAdmin = Object.keys(adminUsers).some(adminEmail => {
            return adminUsers[adminEmail] === post.userName;
          });
          
          const adminBadgeHtml = isUserAdmin ? 
            `<span style="background-color: var(--primary-color); color: white; font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: var(--radius-full); margin-left: 0.3rem;">Admin</span>` : '';
          
          // Create tags HTML
          const tagsHtml = post.tags && post.tags.length > 0 ? 
            post.tags.map(tag => `<span class="tweet-tag">${tag}</span>`).join('') : '';
          
          // Create image HTML if post has an image
          const imageHtml = post.imageUrl ? 
            `<img src="${post.imageUrl}" alt="Post image" class="tweet-image" data-full-image="${post.imageUrl}">` : '';
          
          tweetElement.innerHTML = `
            <div class="tweet-header">
              <img src="${generateAvatarUrl(post.userId)}" alt="Profile Picture" class="tweet-avatar" data-user-id="${post.userId}">
              <div class="tweet-user-info">
                <div>
                  <p class="tweet-user-name" data-user-id="${post.userId}">${post.userName}</p>
                  ${adminBadgeHtml}
                  <span class="tweet-user-handle">@${post.userName.toLowerCase().replace(/\s+/g, '')}</span>
                </div>
                <p class="tweet-time">${formattedDate}</p>
              </div>
              ${showDeleteButton || showEditButton ? `
                <div class="tweet-more-container" style="position: relative;">
                  <button class="tweet-more">
                    <i class="fas fa-ellipsis-h"></i>
                  </button>
                  <div class="tweet-dropdown" style="position: absolute; right: 0; top: 30px; background: white; border-radius: var(--radius-md); box-shadow: var(--shadow-md); width: 150px; z-index: 10; display: none;">
                    ${showEditButton ? `
                      <div class="dropdown-item edit-tweet-btn" style="padding: 0.8rem 1rem; display: flex; align-items: center; cursor: pointer;">
                        <i class="fas fa-edit" style="margin-right: 0.8rem;"></i> Edit
                      </div>
                    ` : ''}
                    ${showDeleteButton ? `
                      <div class="dropdown-item delete-tweet-btn" style="padding: 0.8rem 1rem; display: flex; align-items: center; cursor: pointer; color: var(--error-color);">
                        <i class="fas fa-trash" style="margin-right: 0.8rem;"></i> Delete
                      </div>
                    ` : ''}
                    <div class="dropdown-item report-tweet-btn" style="padding: 0.8rem 1rem; display: flex; align-items: center; cursor: pointer;">
                      <i class="fas fa-flag" style="margin-right: 0.8rem;"></i> Report
                    </div>
                  </div>
                </div>
              ` : `
                <div class="tweet-more-container" style="position: relative;">
                  <button class="tweet-more">
                    <i class="fas fa-ellipsis-h"></i>
                  </button>
                  <div class="tweet-dropdown" style="position: absolute; right: 0; top: 30px; background: white; border-radius: var(--radius-md); box-shadow: var(--shadow-md); width: 150px; z-index: 10; display: none;">
                    <div class="dropdown-item report-tweet-btn" style="padding: 0.8rem 1rem; display: flex; align-items: center; cursor: pointer;">
                      <i class="fas fa-flag" style="margin-right: 0.8rem;"></i> Report
                    </div>
                  </div>
                </div>
              `}
            </div>
            <div class="tweet-content">
              <h3 class="tweet-title">${post.title}</h3>
              <p class="tweet-text">${post.content}</p>
              ${imageHtml}
              <div style="margin-top: 0.8rem;">
                <span class="tweet-category">${post.category}</span>
                ${tagsHtml}
              </div>
            </div>
            <div class="tweet-actions">
              <button class="tweet-action comment-btn">
                <i class="far fa-comment"></i>
                <span class="comment-count">0</span>
              </button>
              <button class="tweet-action like-btn ${post.likedBy?.includes(auth.currentUser.uid) ? 'liked' : ''}">
                <i class="far fa-heart"></i>
                <span class="like-count">${post.likes || 0}</span>
              </button>
              <button class="tweet-action dislike-btn ${post.dislikedBy?.includes(auth.currentUser.uid) ? 'disliked' : ''}">
                <i class="far fa-thumbs-down"></i>
                <span class="dislike-count">${post.dislikes || 0}</span>
              </button>
              <button class="tweet-action share-btn">
                <i class="far fa-share-square"></i>
              </button>
            </div>
            <div class="comments-section">
              <div class="comments-container"></div>
              <form class="comment-form">
                <input type="text" class="comment-input" placeholder="Scrib your reply">
                <button type="submit" class="comment-submit">
                  <i class="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          `;
          
          container.appendChild(tweetElement);

          // Get comments count
          getCommentsCount(doc.id).then(count => {
            const commentCount = tweetElement.querySelector('.comment-count');
            if (commentCount) {
              commentCount.textContent = count;
            }
          });

          // Event Listeners for Tweet Elements
          const tweetAvatar = tweetElement.querySelector('.tweet-avatar');
          const tweetUserName = tweetElement.querySelector('.tweet-user-name');
          
          tweetAvatar.addEventListener('click', () => {
            loadUserProfile(tweetAvatar.dataset.userId);
          });
          
          tweetUserName.addEventListener('click', () => {
            loadUserProfile(tweetUserName.dataset.userId);
          });

          // Image click event for lightbox
          const tweetImage = tweetElement.querySelector('.tweet-image');
          if (tweetImage) {
            tweetImage.addEventListener('click', () => {
              lightboxImage.src = tweetImage.dataset.fullImage;
              lightboxOverlay.style.display = 'flex';
            });
          }

          const commentsSection = tweetElement.querySelector('.comments-section');
          const commentBtn = tweetElement.querySelector('.comment-btn');
          commentBtn.addEventListener('click', () => {
            commentsSection.classList.toggle('show');
            if (commentsSection.classList.contains('show')) {
              loadComments(doc.id, commentsSection);
            }
          });

          const commentForm = tweetElement.querySelector('.comment-form');
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

          const tweetMore = tweetElement.querySelector('.tweet-more');
          const tweetDropdown = tweetElement.querySelector('.tweet-dropdown');
          
          if (tweetMore && tweetDropdown) {
            tweetMore.addEventListener('click', (e) => {
              e.stopPropagation();
              tweetDropdown.style.display = tweetDropdown.style.display === 'block' ? 'none' : 'block';
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
              if (tweetDropdown) {
                tweetDropdown.style.display = 'none';
              }
            });
            
            const deleteBtn = tweetElement.querySelector('.delete-tweet-btn');
            if (deleteBtn) {
              deleteBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this scrib?')) {
                  deletePost(doc.id, post.imageUrl);
                }
              });
            }

            const editBtn = tweetElement.querySelector('.edit-tweet-btn');
            if (editBtn) {
              editBtn.addEventListener('click', () => {
                showEditModal(doc.id, post.title, post.content, post.imageUrl);
              });
            }
            
            const reportBtn = tweetElement.querySelector('.report-tweet-btn');
            if (reportBtn) {
              reportBtn.addEventListener('click', () => {
                showReportModal('post', doc.id);
              });
            }
          }

          const likeBtn = tweetElement.querySelector('.like-btn');
          const dislikeBtn = tweetElement.querySelector('.dislike-btn');
          
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

          const shareBtn = tweetElement.querySelector('.share-btn');
          shareBtn.addEventListener('click', () => {
            // Simple share functionality - copy URL to clipboard
            const url = window.location.href.split('?')[0] + '?post=' + doc.id;
            navigator.clipboard.writeText(url).then(() => {
              showToast('Link copied to clipboard!');
            });
          });
        });
      });
    }

    // Format date for tweets
    function formatDate(date) {
      const now = new Date();
      const diff = Math.floor((now - date) / 1000); // seconds
      
      if (diff < 60) {
        return `${diff}s`;
      } else if (diff < 3600) {
        return `${Math.floor(diff / 60)}m`;
      } else if (diff < 86400) {
        return `${Math.floor(diff / 3600)}h`;
      } else if (diff < 604800) {
        return `${Math.floor(diff / 86400)}d`;
      } else {
        return date.toLocaleDateString();
      }
    }

    // Get comments count
    async function getCommentsCount(postId) {
      try {
        const commentsQuery = query(collection(db, 'posts', postId, 'comments'));
        const commentsSnapshot = await getDocs(commentsQuery);
        return commentsSnapshot.size;
      } catch (error) {
        console.error('Error getting comments count:', error);
        return 0;
      }
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
          addNotification(post.userId, `${auth.currentUser.displayName || auth.currentUser.email} liked your scrib.`, 'like', postId);
        }
      }

      await batch.commit();
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

    // Edit Modal
    function showEditModal(postId, title, content, imageUrl = null) {
      editTitle.value = title;
      editContent.value = content;
      
      // Reset image preview
      editImageUrl = null;
      editImagePreview.src = '';
      editImagePreviewContainer.style.display = 'none';
      editImageUploadContainer.style.display = 'block';
      
      // If post has an image, show it in the preview
      if (imageUrl) {
        editImageUrl = imageUrl;
        editImagePreview.src = imageUrl;
        editImagePreviewContainer.style.display = 'block';
        editImageUploadContainer.style.display = 'none';
      }
      
      editModal.style.display = 'block';
      editModalOverlay.style.display = 'block';

      editSave.onclick = () => {
        updatePost(postId, editTitle.value, editContent.value, editImageUrl);
        closeEditModal();
      };
    }

    function closeEditModal() {
      editModal.style.display = 'none';
      editModalOverlay.style.display = 'none';
    }

    editModalClose.addEventListener('click', closeEditModal);
    editCancel.addEventListener('click', closeEditModal);
    editModalOverlay.addEventListener('click', closeEditModal);
    
    // Report Modal
    let reportType = '';
    let reportItemId = '';
    
    function showReportModal(type, itemId) {
      reportType = type;
      reportItemId = itemId;
      
      // Reset form
      document.querySelectorAll('input[name="report-reason"]').forEach(radio => {
        radio.checked = false;
      });
      reportDetails.value = '';
      reportOptions.forEach(option => {
        option.classList.remove('selected');
      });
      
      reportModal.style.display = 'block';
      reportModalOverlay.style.display = 'block';
    }
    
    function closeReportModal() {
      reportModal.style.display = 'none';
      reportModalOverlay.style.display = 'none';
    }
    
    reportModalClose.addEventListener('click', closeReportModal);
    reportCancel.addEventListener('click', closeReportModal);
    reportModalOverlay.addEventListener('click', closeReportModal);
    
    // Handle report option selection
    reportOptions.forEach(option => {
      option.addEventListener('click', () => {
        const radio = option.querySelector('input[type="radio"]');
        radio.checked = true;
        
        reportOptions.forEach(opt => {
          opt.classList.remove('selected');
        });
        option.classList.add('selected');
      });
    });
    
    // Submit report
    reportSubmit.addEventListener('click', () => {
      const selectedReason = document.querySelector('input[name="report-reason"]:checked');
      
      if (!selectedReason) {
        showToast('Please select a reason for reporting');
        return;
      }
      
      const reason = selectedReason.value;
      const details = reportDetails.value.trim();
      
      submitReport(reportType, reportItemId, reason, details);
      closeReportModal();
    });
    
    async function submitReport(type, itemId, reason, details) {
      try {
        await addDoc(collection(db, 'reports'), {
          type: type,
          itemId: itemId,
          reason: reason,
          details: details,
          reportedBy: auth.currentUser.uid,
          reportedAt: new Date(),
          status: 'pending'
        });
        
        showToast('Report submitted successfully');
        
        // Save report to Feedback.html
        saveReportToFeedback(type, itemId, reason, details);
      } catch (error) {
        console.error('Error submitting report:', error);
        showToast('Failed to submit report. Please try again.');
      }
    }
    
    // Save report to Feedback.html
    function saveReportToFeedback(type, itemId, reason, details) {
      // Create a form to submit the report data
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'Feedback.html';
      form.style.display = 'none';
      
      // Add form fields
      const typeField = document.createElement('input');
      typeField.name = 'type';
      typeField.value = type;
      form.appendChild(typeField);
      
      const itemIdField = document.createElement('input');
      itemIdField.name = 'itemId';
      itemIdField.value = itemId;
      form.appendChild(itemIdField);
      
      const reasonField = document.createElement('input');
      reasonField.name = 'reason';
      reasonField.value = reason;
      form.appendChild(reasonField);
      
      const detailsField = document.createElement('input');
      detailsField.name = 'details';
      detailsField.value = details;
      form.appendChild(detailsField);
      
      const userIdField = document.createElement('input');
      userIdField.name = 'userId';
      userIdField.value = auth.currentUser.uid;
      form.appendChild(userIdField);
      
      const userNameField = document.createElement('input');
      userNameField.name = 'userName';
      userNameField.value = auth.currentUser.displayName || auth.currentUser.email;
      form.appendChild(userNameField);
      
      const dateField = document.createElement('input');
      dateField.name = 'date';
      dateField.value = new Date().toISOString();
      form.appendChild(dateField);
      
      // Submit the form
      document.body.appendChild(form);
      
      // Instead of submitting the form, we'll save the data to localStorage
      // This is a workaround since we can't actually submit to a different HTML file in this context
      const reportData = {
        type: type,
        itemId: itemId,
        reason: reason,
        details: details,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || auth.currentUser.email,
        date: new Date().toISOString()
      };
      
      // Get existing reports or initialize empty array
      const existingReports = JSON.parse(localStorage.getItem('silakboReports') || '[]');
      existingReports.push(reportData);
      localStorage.setItem('silakboReports', JSON.stringify(existingReports));
      
      // Remove the form
      document.body.removeChild(form);
    }

    // Post CRUD Operations
    async function deletePost(postId, imageUrl = null) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        
        // If post has an image, delete it from Cloudinary
        // Note: Cloudinary doesn't provide a direct way to delete images via client-side JavaScript
        // You would typically need a server-side function to handle this securely
        // For now, we'll just show a success message
        
        showToast('Scrib deleted successfully');
        loadTrendingTopics();
        loadTopContributors();
      } catch (error) {
        console.error('Error deleting post:', error);
        showToast('Failed to delete scrib. Please try again.');
      }
    }

    async function updatePost(postId, newTitle, newContent, newImageUrl = null) {
      try {
        const postRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postRef);
        
        if (!postDoc.exists()) {
          throw new Error('Post does not exist!');
        }
        
        const postData = postDoc.data();
        const updateData = {
          title: newTitle,
          content: newContent
        };
        
        // Handle image update
        if (newImageUrl !== postData.imageUrl) {
          // If there's a new image URL, update it
          if (newImageUrl) {
            updateData.imageUrl = newImageUrl;
          } else {
            // If the image was removed, remove the imageUrl field
            // Note: In Firestore, you can't directly set a field to undefined to remove it
            // We'll use a server-side function or update the entire document without the field
            const { imageUrl, ...restData } = postData;
            await setDoc(postRef, { ...restData, title: newTitle, content: newContent });
            showToast('Scrib updated successfully');
            return;
          }
        }
        
        await updateDoc(postRef, updateData);
        showToast('Scrib updated successfully');
      } catch (error) {
        console.error('Error updating post:', error);
        showToast('Failed to update scrib. Please try again.');
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
          addNotification(postData.userId, `${commentUserName} commented on your scrib.`, 'comment', postId);
        }
        
        showToast('Reply sent successfully');
        
        // Update comment count
        const tweetElement = document.querySelector(`[data-post-id="${postId}"]`);
        if (tweetElement) {
          const commentCount = tweetElement.querySelector('.comment-count');
          if (commentCount) {
            commentCount.textContent = parseInt(commentCount.textContent) + 1;
          }
        }
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
          commentsContainer.innerHTML = '<p style="padding: 1rem 0; color: var(--text-secondary);">No replies yet. Be the first to reply!</p>';
          return;
        }
        
        querySnapshot.forEach((doc) => {
          const comment = doc.data();
          const commentElement = document.createElement('div');
          commentElement.className = 'comment';
          
          // Check if current user is admin or comment owner
          const isCurrentUserAdmin = isAdmin(auth.currentUser.email);
          const isCommentOwner = comment.userId === auth.currentUser.uid;
          
          // Check if comment user is admin to add badge
          const isUserAdmin = Object.keys(adminUsers).some(adminEmail => {
            return adminUsers[adminEmail] === comment.userName;
          });
          
          const adminBadgeHtml = isUserAdmin ? 
            `<span style="background-color: var(--primary-color); color: white; font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: var(--radius-full); margin-left: 0.3rem;">Admin</span>` : '';
          
          commentElement.innerHTML = `
            <img src="${generateAvatarUrl(comment.userId)}" alt="Profile Picture" class="comment-avatar" data-user-id="${comment.userId}">
            <div class="comment-content">
              <div>
                <span class="comment-user-name" data-user-id="${comment.userId}">${comment.userName}</span>
                ${adminBadgeHtml}
                <span style="font-size: 0.8rem; color: var(--text-secondary); margin-left: 0.3rem;">${formatDate(comment.timestamp.toDate())}</span>
              </div>
              <p class="comment-text">${comment.content}</p>
              <div class="comment-actions">
                <button class="comment-action reply-btn">
                  <i class="far fa-comment"></i> Reply
                </button>
                ${isCommentOwner || isCurrentUserAdmin ? `
                  <button class="comment-action delete-comment-btn">
                    <i class="far fa-trash-alt"></i> Delete
                  </button>
                ` : ''}
                ${isCommentOwner ? `
                  <button class="comment-action edit-comment-btn">
                    <i class="far fa-edit"></i> Edit
                  </button>
                ` : ''}
                <button class="comment-action report-comment-btn">
                  <i class="far fa-flag"></i> Report
                </button>
              </div>
            </div>
          `;
          
          commentsContainer.appendChild(commentElement);

          // Event listeners for comment elements
          const commentAvatar = commentElement.querySelector('.comment-avatar');
          const commentUserName = commentElement.querySelector('.comment-user-name');
          
          commentAvatar.addEventListener('click', () => {
            loadUserProfile(commentAvatar.dataset.userId);
          });
          
          commentUserName.addEventListener('click', () => {
            loadUserProfile(commentUserName.dataset.userId);
          });

          const deleteCommentBtn = commentElement.querySelector('.delete-comment-btn');
          if (deleteCommentBtn) {
            deleteCommentBtn.addEventListener('click', () => {
              if (confirm('Are you sure you want to delete this reply?')) {
                deleteComment(postId, doc.id);
              }
            });
          }

          const editCommentBtn = commentElement.querySelector('.edit-comment-btn');
          if (editCommentBtn) {
            editCommentBtn.addEventListener('click', () => {
              const commentText = commentElement.querySelector('.comment-text');
              const currentContent = commentText.textContent;
              
              // Inline edit
              commentText.innerHTML = `
                <input type="text" value="${currentContent}" style="width: 100%; padding: 0.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 0.5rem;">
                <div style="display: flex; gap: 0.5rem;">
                  <button class="save-edit-btn" style="background-color: var(--primary-color); color: white; border: none; border-radius: var(--radius-full); padding: 0.3rem 0.8rem; cursor: pointer;">Save</button>
                  <button class="cancel-edit-btn" style="background-color: transparent; border: 1px solid var(--border-color); border-radius: var(--radius-full); padding: 0.3rem 0.8rem; cursor: pointer;">Cancel</button>
                </div>
              `;
              
              const saveEditBtn = commentText.querySelector('.save-edit-btn');
              const cancelEditBtn = commentText.querySelector('.cancel-edit-btn');
              const editInput = commentText.querySelector('input');
              
              saveEditBtn.addEventListener('click', () => {
                updateComment(postId, doc.id, editInput.value);
                commentText.textContent = editInput.value;
              });
              
              cancelEditBtn.addEventListener('click', () => {
                commentText.textContent = currentContent;
              });
            });
          }
          
          const reportCommentBtn = commentElement.querySelector('.report-comment-btn');
          if (reportCommentBtn) {
            reportCommentBtn.addEventListener('click', () => {
              showReportModal('comment', doc.id);
                          });
          }
        });
      });
      
      unsubscribeMap.set(postId, unsubscribe);
    }

    // Comment CRUD Operations
    async function deleteComment(postId, commentId) {
      try {
        await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
        showToast('Reply deleted successfully');
        
        // Update comment count
        const tweetElement = document.querySelector(`[data-post-id="${postId}"]`);
        if (tweetElement) {
          const commentCount = tweetElement.querySelector('.comment-count');
          if (commentCount) {
            const currentCount = parseInt(commentCount.textContent);
            if (currentCount > 0) {
              commentCount.textContent = currentCount - 1;
            }
          }
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        showToast('Failed to delete reply. Please try again.');
      }
    }

    async function updateComment(postId, commentId, newContent) {
      try {
        await updateDoc(doc(db, 'posts', postId, 'comments', commentId), {
          content: newContent
        });
        showToast('Reply updated successfully');
      } catch (error) {
        console.error('Error updating comment:', error);
        showToast('Failed to update reply. Please try again.');
      }
    }

    // Notifications
    function addNotification(userId, message, type, referenceId) {
      addDoc(collection(db, 'notifications'), {
        userId: userId,
        message: message,
        type: type,
        referenceId: referenceId,
        timestamp: new Date(),
        read: false
      }).then(() => {
        console.log('Notification added successfully');
      }).catch((error) => {
        console.error('Error adding notification:', error);
      });
    }
    
    // Load Notifications
    let unsubscribeNotifications = null;
    
    function loadNotifications() {
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
      }
      
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      
      unsubscribeNotifications = onSnapshot(q, (querySnapshot) => {
        notificationsPage.innerHTML = '';
        
        if (querySnapshot.empty) {
          notificationsPage.innerHTML = '<div style="text-align: center; padding: 2rem;">No notifications yet.</div>';
          return;
        }
        
        querySnapshot.forEach((doc) => {
          const notification = doc.data();
          const notificationElement = document.createElement('div');
          notificationElement.className = `notification-item ${notification.read ? '' : 'unread'}`;
          
          // Determine icon based on notification type
          let iconClass = 'fas fa-bell';
          if (notification.type === 'like') {
            iconClass = 'fas fa-heart';
          } else if (notification.type === 'comment') {
            iconClass = 'fas fa-comment';
          } else if (notification.type === 'follow') {
            iconClass = 'fas fa-user-plus';
          }
          
          notificationElement.innerHTML = `
            <div class="notification-icon">
              <i class="${iconClass}"></i>
            </div>
            <div class="notification-content">
              <p class="notification-text">${notification.message}</p>
              <p class="notification-time">${formatDate(notification.timestamp.toDate())}</p>
              <div class="notification-actions">
                <button class="notification-action view-btn">View</button>
                <button class="notification-action mark-read-btn">${notification.read ? 'Mark as unread' : 'Mark as read'}</button>
              </div>
            </div>
          `;
          
          notificationsPage.appendChild(notificationElement);
          
          // Event listeners for notification actions
          const viewBtn = notificationElement.querySelector('.view-btn');
          viewBtn.addEventListener('click', () => {
            // Mark as read
            updateDoc(doc(db, 'notifications', doc.id), {
              read: true
            });
            
            // Navigate to the referenced content
            if (notification.type === 'like' || notification.type === 'comment') {
              // Navigate to the post
              setActiveNavItem('home');
              showPage('home-page');
              
              // Find and highlight the post
              setTimeout(() => {
                const postElement = document.querySelector(`[data-post-id="${notification.referenceId}"]`);
                if (postElement) {
                  postElement.scrollIntoView({ behavior: 'smooth' });
                  postElement.style.backgroundColor = 'rgba(230, 81, 0, 0.05)';
                  setTimeout(() => {
                    postElement.style.backgroundColor = '';
                  }, 2000);
                  
                  // If it's a comment notification, open the comments section
                  if (notification.type === 'comment') {
                    const commentBtn = postElement.querySelector('.comment-btn');
                    if (commentBtn) {
                      commentBtn.click();
                    }
                  }
                } else {
                  // Post not found in current view, load it directly
                  loadSinglePost(notification.referenceId);
                }
              }, 300);
            } else if (notification.type === 'follow') {
              // Navigate to the user's profile
              loadUserProfile(notification.referenceId);
            }
          });
          
          const markReadBtn = notificationElement.querySelector('.mark-read-btn');
          markReadBtn.addEventListener('click', () => {
            updateDoc(doc(db, 'notifications', doc.id), {
              read: !notification.read
            });
          });
        });
        
        // Update notification badge
        updateNotificationBadge(querySnapshot.docs.filter(doc => !doc.data().read).length);
      });
    }
    
    // Update notification badge
    function updateNotificationBadge(count) {
      const notificationBadge = document.createElement('span');
      notificationBadge.className = 'notification-badge';
      notificationBadge.style.cssText = `
        position: absolute;
        top: 0;
        right: 0;
        background-color: var(--error-color);
        color: white;
        font-size: 0.7rem;
        font-weight: 600;
        padding: 0.1rem 0.4rem;
        border-radius: var(--radius-full);
        transform: translate(50%, -50%);
      `;
      
      // Remove existing badges
      const existingBadges = document.querySelectorAll('.notification-badge');
      existingBadges.forEach(badge => badge.remove());
      
      if (count > 0) {
        // Add badge to notification links
        const notificationLinks = [notificationsLink, mobileNotifications];
        notificationLinks.forEach(link => {
          const iconContainer = link.querySelector('i').parentElement;
          iconContainer.style.position = 'relative';
          
          const badge = notificationBadge.cloneNode(true);
          badge.textContent = count > 9 ? '9+' : count;
          iconContainer.appendChild(badge);
        });
      }
    }
    
    // Load single post
    async function loadSinglePost(postId) {
      try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        
        if (!postDoc.exists()) {
          showToast('Post not found');
          return;
        }
        
        setActiveNavItem('home');
        showPage('home-page');
        
        tweetsContainer.innerHTML = '';
        
        const post = postDoc.data();
        const tweetElement = document.createElement('div');
        tweetElement.className = 'tweet';
        tweetElement.dataset.postId = postDoc.id;
        
        // Check if current user is admin or post owner
        const isCurrentUserAdmin = isAdmin(auth.currentUser.email);
        const isPostOwner = post.userId === auth.currentUser.uid;
        
        // Determine if delete/edit buttons should be shown
        const showDeleteButton = isCurrentUserAdmin || isPostOwner;
        const showEditButton = isPostOwner;
        
        // Format date
        const postDate = post.timestamp?.toDate();
        const formattedDate = postDate ? formatDate(postDate) : '';
        
        // Check if user is admin to add badge
        const isUserAdmin = Object.keys(adminUsers).some(adminEmail => {
          return adminUsers[adminEmail] === post.userName;
        });
        
        const adminBadgeHtml = isUserAdmin ? 
          `<span style="background-color: var(--primary-color); color: white; font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: var(--radius-full); margin-left: 0.3rem;">Admin</span>` : '';
        
        // Create tags HTML
        const tagsHtml = post.tags && post.tags.length > 0 ? 
          post.tags.map(tag => `<span class="tweet-tag">${tag}</span>`).join('') : '';
        
        // Create image HTML if post has an image
        const imageHtml = post.imageUrl ? 
          `<img src="${post.imageUrl}" alt="Post image" class="tweet-image" data-full-image="${post.imageUrl}">` : '';
        
        tweetElement.innerHTML = `
          <div class="tweet-header">
            <img src="${generateAvatarUrl(post.userId)}" alt="Profile Picture" class="tweet-avatar" data-user-id="${post.userId}">
            <div class="tweet-user-info">
              <div>
                <p class="tweet-user-name" data-user-id="${post.userId}">${post.userName}</p>
                ${adminBadgeHtml}
                <span class="tweet-user-handle">@${post.userName.toLowerCase().replace(/\s+/g, '')}</span>
              </div>
              <p class="tweet-time">${formattedDate}</p>
            </div>
            ${showDeleteButton || showEditButton ? `
              <div class="tweet-more-container" style="position: relative;">
                <button class="tweet-more">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
                <div class="tweet-dropdown" style="position: absolute; right: 0; top: 30px; background: white; border-radius: var(--radius-md); box-shadow: var(--shadow-md); width: 150px; z-index: 10; display: none;">
                  ${showEditButton ? `
                    <div class="dropdown-item edit-tweet-btn" style="padding: 0.8rem 1rem; display: flex; align-items: center; cursor: pointer;">
                      <i class="fas fa-edit" style="margin-right: 0.8rem;"></i> Edit
                    </div>
                  ` : ''}
                  ${showDeleteButton ? `
                    <div class="dropdown-item delete-tweet-btn" style="padding: 0.8rem 1rem; display: flex; align-items: center; cursor: pointer; color: var(--error-color);">
                      <i class="fas fa-trash" style="margin-right: 0.8rem;"></i> Delete
                    </div>
                  ` : ''}
                  <div class="dropdown-item report-tweet-btn" style="padding: 0.8rem 1rem; display: flex; align-items: center; cursor: pointer;">
                    <i class="fas fa-flag" style="margin-right: 0.8rem;"></i> Report
                  </div>
                </div>
              </div>
            ` : `
              <div class="tweet-more-container" style="position: relative;">
                <button class="tweet-more">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
                <div class="tweet-dropdown" style="position: absolute; right: 0; top: 30px; background: white; border-radius: var(--radius-md); box-shadow: var(--shadow-md); width: 150px; z-index: 10; display: none;">
                  <div class="dropdown-item report-tweet-btn" style="padding: 0.8rem 1rem; display: flex; align-items: center; cursor: pointer;">
                    <i class="fas fa-flag" style="margin-right: 0.8rem;"></i> Report
                  </div>
                </div>
              </div>
            `}
          </div>
          <div class="tweet-content">
            <h3 class="tweet-title">${post.title}</h3>
            <p class="tweet-text">${post.content}</p>
            ${imageHtml}
            <div style="margin-top: 0.8rem;">
              <span class="tweet-category">${post.category}</span>
              ${tagsHtml}
            </div>
          </div>
          <div class="tweet-actions">
            <button class="tweet-action comment-btn">
              <i class="far fa-comment"></i>
              <span class="comment-count">0</span>
            </button>
            <button class="tweet-action like-btn ${post.likedBy?.includes(auth.currentUser.uid) ? 'liked' : ''}">
              <i class="far fa-heart"></i>
              <span class="like-count">${post.likes || 0}</span>
            </button>
            <button class="tweet-action dislike-btn ${post.dislikedBy?.includes(auth.currentUser.uid) ? 'disliked' : ''}">
              <i class="far fa-thumbs-down"></i>
              <span class="dislike-count">${post.dislikes || 0}</span>
            </button>
            <button class="tweet-action share-btn">
              <i class="far fa-share-square"></i>
            </button>
          </div>
          <div class="comments-section">
            <div class="comments-container"></div>
            <form class="comment-form">
              <input type="text" class="comment-input" placeholder="Scrib your reply">
              <button type="submit" class="comment-submit">
                <i class="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        `;
        
        tweetsContainer.appendChild(tweetElement);
        
        // Get comments count
        getCommentsCount(postDoc.id).then(count => {
          const commentCount = tweetElement.querySelector('.comment-count');
          if (commentCount) {
            commentCount.textContent = count;
          }
        });
        
        // Add event listeners
        const tweetAvatar = tweetElement.querySelector('.tweet-avatar');
        const tweetUserName = tweetElement.querySelector('.tweet-user-name');
        
        tweetAvatar.addEventListener('click', () => {
          loadUserProfile(tweetAvatar.dataset.userId);
        });
        
        tweetUserName.addEventListener('click', () => {
          loadUserProfile(tweetUserName.dataset.userId);
        });
        
        // Image click event for lightbox
        const tweetImage = tweetElement.querySelector('.tweet-image');
        if (tweetImage) {
          tweetImage.addEventListener('click', () => {
            lightboxImage.src = tweetImage.dataset.fullImage;
            lightboxOverlay.style.display = 'flex';
          });
        }
        
        const commentsSection = tweetElement.querySelector('.comments-section');
        const commentBtn = tweetElement.querySelector('.comment-btn');
        commentBtn.addEventListener('click', () => {
          commentsSection.classList.toggle('show');
          if (commentsSection.classList.contains('show')) {
            loadComments(postDoc.id, commentsSection);
          }
        });
        
        const commentForm = tweetElement.querySelector('.comment-form');
        commentForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const commentInput = commentForm.querySelector('.comment-input');
          const commentContent = commentInput.value.trim();
          if (commentContent) {
            addComment(postDoc.id, commentContent);
            commentInput.value = '';
          } else {
            showToast('Comment cannot be empty');
          }
        });
        
        const tweetMore = tweetElement.querySelector('.tweet-more');
        const tweetDropdown = tweetElement.querySelector('.tweet-dropdown');
        
        if (tweetMore && tweetDropdown) {
          tweetMore.addEventListener('click', (e) => {
            e.stopPropagation();
            tweetDropdown.style.display = tweetDropdown.style.display === 'block' ? 'none' : 'block';
          });
          
          // Close dropdown when clicking outside
          document.addEventListener('click', () => {
            if (tweetDropdown) {
              tweetDropdown.style.display = 'none';
            }
          });
          
          const deleteBtn = tweetElement.querySelector('.delete-tweet-btn');
          if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
              if (confirm('Are you sure you want to delete this scrib?')) {
                deletePost(postDoc.id, post.imageUrl);
              }
            });
          }
          
          const editBtn = tweetElement.querySelector('.edit-tweet-btn');
          if (editBtn) {
            editBtn.addEventListener('click', () => {
              showEditModal(postDoc.id, post.title, post.content, post.imageUrl);
            });
          }
          
          const reportBtn = tweetElement.querySelector('.report-tweet-btn');
          if (reportBtn) {
            reportBtn.addEventListener('click', () => {
              showReportModal('post', postDoc.id);
            });
          }
        }
        
        const likeBtn = tweetElement.querySelector('.like-btn');
        const dislikeBtn = tweetElement.querySelector('.dislike-btn');
        
        likeBtn.addEventListener('click', async () => {
          if (likeBtn.disabled) return;
          likeBtn.disabled = true;
          dislikeBtn.disabled = true;
          
          try {
            await handleLike(postDoc.id);
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
            await handleDislike(postDoc.id);
          } catch (error) {
            console.error('Error updating dislike:', error);
            showToast('Failed to update dislike. Please try again.');
          } finally {
            dislikeBtn.disabled = false;
            likeBtn.disabled = false;
          }
        });
        
        const shareBtn = tweetElement.querySelector('.share-btn');
        shareBtn.addEventListener('click', () => {
          // Simple share functionality - copy URL to clipboard
          const url = window.location.href.split('?')[0] + '?post=' + postDoc.id;
          navigator.clipboard.writeText(url).then(() => {
            showToast('Link copied to clipboard!');
          });
        });
        
        // Highlight the post
        tweetElement.style.backgroundColor = 'rgba(230, 81, 0, 0.05)';
        setTimeout(() => {
          tweetElement.style.backgroundColor = '';
        }, 2000);
        
      } catch (error) {
        console.error('Error loading post:', error);
        showToast('Error loading post');
      }
    }

    // Search Functionality
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });

    function performSearch() {
      const searchTerm = searchInput.value.trim().toLowerCase();
      if (searchTerm) {
        Promise.resolve().then(async () => {
          try {
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

            const [postsTitleSnapshot, postsContentSnapshot, postsTagsSnapshot] = await Promise.all([
              getDocs(postsTitleQuery),
              getDocs(postsContentQuery),
              getDocs(postsTagsQuery)
            ]);

            // Combine post results and remove duplicates
            const postResults = new Map();
            
            function addPostToResults(doc) {
              if (!postResults.has(doc.id)) {
                postResults.set(doc.id, { id: doc.id, ...doc.data() });
              }
            }
            
            postsTitleSnapshot.forEach(addPostToResults);
            postsContentSnapshot.forEach(addPostToResults);
            postsTagsSnapshot.forEach(addPostToResults);

            // Display results
            tweetsContainer.innerHTML = '';
            
            pageTitle.textContent = `Search: ${searchTerm}`;
            
            if (postResults.size === 0) {
              tweetsContainer.innerHTML = '<div class="tweet"><p style="text-align: center; padding: 2rem;">No results found. Try a different search term.</p></div>';
              return;
            }
            
            // Convert Map to Array and sort by timestamp
            const sortedResults = Array.from(postResults.values())
              .sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
            
            sortedResults.forEach(post => {
              const tweetElement = document.createElement('div');
              tweetElement.className = 'tweet';
              tweetElement.dataset.postId = post.id;
              
              // Format date
              const postDate = post.timestamp?.toDate();
              const formattedDate = postDate ? formatDate(postDate) : '';
              
              // Check if user is admin to add badge
              const isUserAdmin = Object.keys(adminUsers).some(adminEmail => {
                return adminUsers[adminEmail] === post.userName;
              });
              
              const adminBadgeHtml = isUserAdmin ? 
                `<span style="background-color: var(--primary-color); color: white; font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: var(--radius-full); margin-left: 0.3rem;">Admin</span>` : '';
              
              // Create tags HTML
              const tagsHtml = post.tags && post.tags.length > 0 ? 
                post.tags.map(tag => `<span class="tweet-tag">${tag}</span>`).join('') : '';
              
              // Create image HTML if post has an image
              const imageHtml = post.imageUrl ? 
                `<img src="${post.imageUrl}" alt="Post image" class="tweet-image" data-full-image="${post.imageUrl}">` : '';
              
              tweetElement.innerHTML = `
                <div class="tweet-header">
                  <img src="${generateAvatarUrl(post.userId)}" alt="Profile Picture" class="tweet-avatar" data-user-id="${post.userId}">
                  <div class="tweet-user-info">
                    <div>
                      <p class="tweet-user-name" data-user-id="${post.userId}">${post.userName}</p>
                      ${adminBadgeHtml}
                      <span class="tweet-user-handle">@${post.userName.toLowerCase().replace(/\s+/g, '')}</span>
                    </div>
                    <p class="tweet-time">${formattedDate}</p>
                  </div>
                </div>
                <div class="tweet-content">
                  <h3 class="tweet-title">${post.title}</h3>
                  <p class="tweet-text">${post.content}</p>
                  ${imageHtml}
                  <div style="margin-top: 0.8rem;">
                    <span class="tweet-category">${post.category}</span>
                    ${tagsHtml}
                  </div>
                </div>
                <div class="tweet-actions">
                  <button class="tweet-action comment-btn">
                    <i class="far fa-comment"></i>
                    <span class="comment-count">0</span>
                  </button>
                  <button class="tweet-action like-btn ${post.likedBy?.includes(auth.currentUser.uid) ? 'liked' : ''}">
                    <i class="far fa-heart"></i>
                    <span class="like-count">${post.likes || 0}</span>
                  </button>
                  <button class="tweet-action dislike-btn ${post.dislikedBy?.includes(auth.currentUser.uid) ? 'disliked' : ''}">
                    <i class="far fa-thumbs-down"></i>
                    <span class="dislike-count">${post.dislikes || 0}</span>
                  </button>
                  <button class="tweet-action share-btn">
                    <i class="far fa-share-square"></i>
                  </button>
                </div>
              `;
              
              tweetsContainer.appendChild(tweetElement);
              
              // Add event listeners
              const tweetAvatar = tweetElement.querySelector('.tweet-avatar');
              const tweetUserName = tweetElement.querySelector('.tweet-user-name');
              
              tweetAvatar.addEventListener('click', () => {
                loadUserProfile(tweetAvatar.dataset.userId);
              });
              
              tweetUserName.addEventListener('click', () => {
                loadUserProfile(tweetUserName.dataset.userId);
              });
              
              // Image click event for lightbox
              const tweetImage = tweetElement.querySelector('.tweet-image');
              if (tweetImage) {
                tweetImage.addEventListener('click', () => {
                  lightboxImage.src = tweetImage.dataset.fullImage;
                  lightboxOverlay.style.display = 'flex';
                });
              }
              
              // Get comments count
              getCommentsCount(post.id).then(count => {
                const commentCount = tweetElement.querySelector('.comment-count');
                if (commentCount) {
                  commentCount.textContent = count;
                }
              });
            });
            
          } catch (error) {
            console.error('Search error:', error);
            showToast('Search error: ' + error.message);
          }
        });
      } else {
        showToast('Please enter a search term');
      }
    }

    // Load User Profile
    async function loadUserProfile(userId) {
      try {
        // Update UI to show profile view
        pageTitle.textContent = 'Profile';
        setActiveNavItem('profile');
        showPage('profile-page');
        
        // Get user data
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (!userDoc.exists()) {
          showToast('User not found');
          return;
        }
        
        const userData = userDoc.data();
        
        // Update profile UI
        profileAvatar.src = userData.photoURL || generateAvatarUrl(userId);
        profileName.textContent = userData.displayName;
        profileHandle.textContent = `@${userData.displayName.toLowerCase().replace(/\s+/g, '')}`;
        profileBio.textContent = userData.bio || 'No bio yet.';
        
        // Get post count
        const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
        const postsSnapshot = await getDocs(postsQuery);
        profilePostsCount.textContent = postsSnapshot.size;
        
        // Get followers and following counts
        profileFollowersCount.textContent = userData.followers?.length || 0;
        profileFollowingCount.textContent = userData.following?.length || 0;
        
        // Update profile actions
        if (userId === auth.currentUser.uid) {
          // Own profile
          profileActions.innerHTML = `
            <button class="profile-action-btn profile-action-primary" id="edit-profile-btn">Edit Profile</button>
          `;
          
          const editProfileBtn = document.getElementById('edit-profile-btn');
          editProfileBtn.addEventListener('click', () => {
            // Navigate to settings
            setActiveNavItem('settings');
            showPage('settings-page');
            
            // Load current settings
            loadUserSettings();
          });
        } else {
          // Other user's profile
          const isFollowing = userData.followers?.includes(auth.currentUser.uid) || false;
          
          profileActions.innerHTML = `
            <button class="profile-action-btn profile-action-primary" id="follow-btn">${isFollowing ? 'Following' : 'Follow'}</button>
            <button class="profile-action-btn profile-action-secondary" id="report-user-btn">
              <i class="fas fa-flag"></i> Report
            </button>
          `;
          
          const followBtn = document.getElementById('follow-btn');
          followBtn.addEventListener('click', () => {
            toggleFollow(userId, isFollowing);
          });
          
          const reportUserBtn = document.getElementById('report-user-btn');
          reportUserBtn.addEventListener('click', () => {
            showReportModal('user', userId);
          });
        }
        
        // Set up profile tabs
        profileTabs.forEach(tab => {
          tab.addEventListener('click', () => {
            profileTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabName = tab.dataset.tab;
            
            if (tabName === 'posts') {
              // Load user's posts
              loadPosts(userId);
            } else if (tabName === 'likes') {
              // Load user's liked posts
              loadLikedPosts(userId);
            } else if (tabName === 'media') {
              // Load user's media posts (posts with images)
              loadMediaPosts(userId);
            }
          });
        });
        
        // Set up followers/following click events
        const followersStats = document.querySelector('.followers-stat');
        followersStats.addEventListener('click', () => {
          showFollowersModal(userId);
        });
        
        const followingStats = document.querySelector('.following-stat');
        followingStats.addEventListener('click', () => {
          showFollowingModal(userId);
        });
        
        // Load user's posts by default
        loadPosts(userId);
        
      } catch (error) {
        console.error('Error loading user profile:', error);
        showToast('Error loading user profile');
      }
    }
    
    // Toggle Follow
    async function toggleFollow(userId, isCurrentlyFollowing) {
      try {
        const currentUserId = auth.currentUser.uid;
        const batch = writeBatch(db);
        
        // Update target user's followers
        const targetUserRef = doc(db, 'users', userId);
        
        // Update current user's following
        const currentUserRef = doc(db, 'users', currentUserId);
        
        if (isCurrentlyFollowing) {
          // Unfollow
          batch.update(targetUserRef, {
            followers: arrayRemove(currentUserId)
          });
          
          batch.update(currentUserRef, {
            following: arrayRemove(userId)
          });
          
          await batch.commit();
          
          // Update UI
          const followBtn = document.getElementById('follow-btn');
          followBtn.textContent = 'Follow';
          
          // Update follower count
          const currentCount = parseInt(profileFollowersCount.textContent);
          profileFollowersCount.textContent = currentCount - 1;
          
          showToast('Unfollowed successfully');
        } else {
          // Follow
          batch.update(targetUserRef, {
            followers: arrayUnion(currentUserId)
          });
          
          batch.update(currentUserRef, {
            following: arrayUnion(userId)
          });
          
          await batch.commit();
          
          // Add notification
          addNotification(userId, `${auth.currentUser.displayName || auth.currentUser.email} started following you.`, 'follow', currentUserId);
          
          // Update UI
          const followBtn = document.getElementById('follow-btn');
          followBtn.textContent = 'Following';
          
          // Update follower count
          const currentCount = parseInt(profileFollowersCount.textContent);
          profileFollowersCount.textContent = currentCount + 1;
          
          showToast('Following successfully');
        }
      } catch (error) {
        console.error('Error toggling follow:', error);
        showToast('Error updating follow status');
      }
    }
    
    // Load Liked Posts
    async function loadLikedPosts(userId) {
      try {
        profileTweetsContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">Loading liked posts...</div>';
        
        // Get all posts
        const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const postsSnapshot = await getDocs(postsQuery);
        
        // Filter posts liked by the user
        const likedPosts = postsSnapshot.docs.filter(doc => {
          const post = doc.data();
          return post.likedBy && post.likedBy.includes(userId);
        });
        
        if (likedPosts.length === 0) {
          profileTweetsContainer.innerHTML = '<div class="tweet"><p style="text-align: center; padding: 2rem;">No liked posts found.</p></div>';
          return;
        }
        
        profileTweetsContainer.innerHTML = '';
        
        // Render liked posts
        likedPosts.forEach(doc => {
          const post = doc.data();
          const tweetElement = document.createElement('div');
          tweetElement.className = 'tweet';
          tweetElement.dataset.postId = doc.id;
          
          // Format date
          const postDate = post.timestamp?.toDate();
          const formattedDate = postDate ? formatDate(postDate) : '';
          
          // Check if user is admin to add badge
          const isUserAdmin = Object.keys(adminUsers).some(adminEmail => {
            return adminUsers[adminEmail] === post.userName;
          });
          
          const adminBadgeHtml = isUserAdmin ? 
            `<span style="background-color: var(--primary-color); color: white; font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: var(--radius-full); margin-left: 0.3rem;">Admin</span>` : '';
          
          // Create tags HTML
          const tagsHtml = post.tags && post.tags.length > 0 ? 
            post.tags.map(tag => `<span class="tweet-tag">${tag}</span>`).join('') : '';
          
          // Create image HTML if post has an image
          const imageHtml = post.imageUrl ? 
            `<img src="${post.imageUrl}" alt="Post image" class="tweet-image" data-full-image="${post.imageUrl}">` : '';
          
          tweetElement.innerHTML = `
            <div class="tweet-header">
              <img src="${generateAvatarUrl(post.userId)}" alt="Profile Picture" class="tweet-avatar" data-user-id="${post.userId}">
              <div class="tweet-user-info">
                <div>
                  <p class="tweet-user-name" data-user-id="${post.userId}">${post.userName}</p>
                  ${adminBadgeHtml}
                  <span class="tweet-user-handle">@${post.userName.toLowerCase().replace(/\s+/g, '')}</span>
                </div>
                <p class="tweet-time">${formattedDate}</p>
              </div>
            </div>
            <div class="tweet-content">
              <h3 class="tweet-title">${post.title}</h3>
              <p class="tweet-text">${post.content}</p>
              ${imageHtml}
              <div style="margin-top: 0.8rem;">
                <span class="tweet-category">${post.category}</span>
                ${tagsHtml}
              </div>
            </div>
            <div class="tweet-actions">
              <button class="tweet-action comment-btn">
                <i class="far fa-comment"></i>
                <span class="comment-count">0</span>
              </button>
              <button class="tweet-action like-btn liked">
                <i class="far fa-heart"></i>
                <span class="like-count">${post.likes || 0}</span>
              </button>
              <button class="tweet-action dislike-btn">
                <i class="far fa-thumbs-down"></i>
                <span class="dislike-count">${post.dislikes || 0}</span>
              </button>
              <button class="tweet-action share-btn">
                <i class="far fa-share-square"></i>
              </button>
            </div>
          `;
          
          profileTweetsContainer.appendChild(tweetElement);
          
          // Add event listeners
          const tweetAvatar = tweetElement.querySelector('.tweet-avatar');
          const tweetUserName = tweetElement.querySelector('.tweet-user-name');
          
          tweetAvatar.addEventListener('click', () => {
            loadUserProfile(tweetAvatar.dataset.userId);
          });
          
          tweetUserName.addEventListener('click', () => {
            loadUserProfile(tweetUserName.dataset.userId);
          });
          
          // Image click event for lightbox
          const tweetImage = tweetElement.querySelector('.tweet-image');
          if (tweetImage) {
            tweetImage.addEventListener('click', () => {
              lightboxImage.src = tweetImage.dataset.fullImage;
              lightboxOverlay.style.display = 'flex';
            });
          }
          
          // Get comments count
          getCommentsCount(doc.id).then(count => {
            const commentCount = tweetElement.querySelector('.comment-count');
            if (commentCount) {
              commentCount.textContent = count;
            }
          });
        });
        
      } catch (error) {
        console.error('Error loading liked posts:', error);
        profileTweetsContainer.innerHTML = '<div class="tweet"><p style="text-align: center; padding: 2rem;">Error loading liked posts.</p></div>';
      }
    }
    
    // Load Media Posts
    async function loadMediaPosts(userId) {
      try {
        profileTweetsContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">Loading media posts...</div>';
        
        // Get user's posts
        const postsQuery = query(
          collection(db, 'posts'),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc')
        );
        
        const postsSnapshot = await getDocs(postsQuery);
        
        // Filter posts with images
        const mediaPosts = postsSnapshot.docs.filter(doc => {
          const post = doc.data();
          return post.imageUrl;
        });
        
        if (mediaPosts.length === 0) {
          profileTweetsContainer.innerHTML = '<div class="tweet"><p style="text-align: center; padding: 2rem;">No media posts found.</p></div>';
          return;
        }
        
        profileTweetsContainer.innerHTML = '';
        
        // Render media posts
        mediaPosts.forEach(doc => {
          const post = doc.data();
          const tweetElement = document.createElement('div');
          tweetElement.className = 'tweet';
          tweetElement.dataset.postId = doc.id;
          
          // Format date
          const postDate = post.timestamp?.toDate();
          const formattedDate = postDate ? formatDate(postDate) : '';
          
          // Check if user is admin to add badge
          const isUserAdmin = Object.keys(adminUsers).some(adminEmail => {
            return adminUsers[adminEmail] === post.userName;
          });
          
          const adminBadgeHtml = isUserAdmin ? 
            `<span style="background-color: var(--primary-color); color: white; font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: var(--radius-full); margin-left: 0.3rem;">Admin</span>` : '';
          
          // Create tags HTML
          const tagsHtml = post.tags && post.tags.length > 0 ? 
            post.tags.map(tag => `<span class="tweet-tag">${tag}</span>`).join('') : '';
          
          tweetElement.innerHTML = `
            <div class="tweet-header">
              <img src="${generateAvatarUrl(post.userId)}" alt="Profile Picture" class="tweet-avatar" data-user-id="${post.userId}">
              <div class="tweet-user-info">
                <div>
                  <p class="tweet-user-name" data-user-id="${post.userId}">${post.userName}</p>
                  ${adminBadgeHtml}
                  <span class="tweet-user-handle">@${post.userName.toLowerCase().replace(/\s+/g, '')}</span>
                </div>
                <p class="tweet-time">${formattedDate}</p>
              </div>
            </div>
            <div class="tweet-content">
              <h3 class="tweet-title">${post.title}</h3>
              <p class="tweet-text">${post.content}</p>
              <img src="${post.imageUrl}" alt="Post image" class="tweet-image" data-full-image="${post.imageUrl}">
              <div style="margin-top: 0.8rem;">
                <span class="tweet-category">${post.category}</span>
                ${tagsHtml}
              </div>
            </div>
            <div class="tweet-actions">
              <button class="tweet-action comment-btn">
                <i class="far fa-comment"></i>
                <span class="comment-count">0</span>
              </button>
              <button class="tweet-action like-btn ${post.likedBy?.includes(auth.currentUser.uid) ? 'liked' : ''}">
                <i class="far fa-heart"></i>
                <span class="like-count">${post.likes || 0}</span>
              </button>
              <button class="tweet-action dislike-btn ${post.dislikedBy?.includes(auth.currentUser.uid) ? 'disliked' : ''}">
                <i class="far fa-thumbs-down"></i>
                <span class="dislike-count">${post.dislikes || 0}</span>
              </button>
              <button class="tweet-action share-btn">
                <i class="far fa-share-square"></i>
              </button>
            </div>
          `;
          
          profileTweetsContainer.appendChild(tweetElement);
          
          // Add event listeners
          const tweetAvatar = tweetElement.querySelector('.tweet-avatar');
          const tweetUserName = tweetElement.querySelector('.tweet-user-name');
          
          tweetAvatar.addEventListener('click', () => {
            loadUserProfile(tweetAvatar.dataset.userId);
          });
          
          tweetUserName.addEventListener('click', () => {
            loadUserProfile(tweetUserName.dataset.userId);
          });
          
          // Image click event for lightbox
          const tweetImage = tweetElement.querySelector('.tweet-image');
          if (tweetImage) {
            tweetImage.addEventListener('click', () => {
              lightboxImage.src = tweetImage.dataset.fullImage;
              lightboxOverlay.style.display = 'flex';
            });
          }
          
          // Get comments count
          getCommentsCount(doc.id).then(count => {
            const commentCount = tweetElement.querySelector('.comment-count');
            if (commentCount) {
              commentCount.textContent = count;
            }
          });
        });
        
      } catch (error) {
        console.error('Error loading media posts:', error);
        profileTweetsContainer.innerHTML = '<div class="tweet"><p style="text-align: center; padding: 2rem;">Error loading media posts.</p></div>';
      }
    }
    
    // Show Followers Modal
    async function showFollowersModal(userId) {
      try {
        // Get user data
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (!userDoc.exists()) {
          showToast('User not found');
          return;
        }
        
        const userData = userDoc.data();
        const followers = userData.followers || [];
        
        followersList.innerHTML = '';
        
        if (followers.length === 0) {
          followersList.innerHTML = '<div style="text-align: center; padding: 2rem;">No followers yet.</div>';
        } else {
          // Get follower user data
          for (const followerId of followers) {
            const followerDoc = await getDoc(doc(db, 'users', followerId));
            
            if (followerDoc.exists()) {
              const followerData = followerDoc.data();
              
              const followerElement = document.createElement('div');
              followerElement.className = 'user-list-item';
              
              // Check if current user is following this follower
              const isFollowing = followerData.followers?.includes(auth.currentUser.uid) || false;
              
              followerElement.innerHTML = `
                <img src="${followerData.photoURL || generateAvatarUrl(followerId)}" alt="Profile Picture" class="user-list-avatar" data-user-id="${followerId}">
                <div class="user-list-info">
                  <div class="user-list-name">${followerData.displayName}</div>
                  <div class="user-list-handle">@${followerData.displayName.toLowerCase().replace(/\s+/g, '')}</div>
                </div>
                ${followerId !== auth.currentUser.uid ? `
                  <button class="follow-btn follower-follow-btn" data-user-id="${followerId}" data-following="${isFollowing}">
                    ${isFollowing ? 'Following' : 'Follow'}
                  </button>
                ` : ''}
              `;
              
              followersList.appendChild(followerElement);
              
              // Add event listeners
              const followerAvatar = followerElement.querySelector('.user-list-avatar');
              followerAvatar.addEventListener('click', () => {
                loadUserProfile(followerId);
                closeFollowersModal();
              });
              
              const followerFollowBtn = followerElement.querySelector('.follower-follow-btn');
              if (followerFollowBtn) {
                followerFollowBtn.addEventListener('click', () => {
                  const isCurrentlyFollowing = followerFollowBtn.dataset.following === 'true';
                  toggleFollow(followerId, isCurrentlyFollowing);
                  
                  // Update button
                  followerFollowBtn.textContent = isCurrentlyFollowing ? 'Follow' : 'Following';
                  followerFollowBtn.dataset.following = isCurrentlyFollowing ? 'false' : 'true';
                });
              }
            }
          }
        }
        
        // Show modal
        followersModal.style.display = 'block';
        followersModalOverlay.style.display = 'block';
        
      } catch (error) {
        console.error('Error showing followers:', error);
        showToast('Error loading followers');
      }
    }
    
    function closeFollowersModal() {
      followersModal.style.display = 'none';
      followersModalOverlay.style.display = 'none';
    }
    
    followersModalClose.addEventListener('click', closeFollowersModal);
    followersModalOverlay.addEventListener('click', closeFollowersModal);
    
    // Show Following Modal
    async function showFollowingModal(userId) {
      try {
        // Get user data
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (!userDoc.exists()) {
          showToast('User not found');
          return;
        }
        
        const userData = userDoc.data();
        const following = userData.following || [];
        
        followingList.innerHTML = '';
        
        if (following.length === 0) {
          followingList.innerHTML = '<div style="text-align: center; padding: 2rem;">Not following anyone yet.</div>';
        } else {
          // Get following user data
          for (const followingId of following) {
            const followingDoc = await getDoc(doc(db, 'users', followingId));
            
            if (followingDoc.exists()) {
              const followingData = followingDoc.data();
              
              const followingElement = document.createElement('div');
              followingElement.className = 'user-list-item';
              
              // Current user is already following this user
              const isFollowing = true;
              
              followingElement.innerHTML = `
                <img src="${followingData.photoURL || generateAvatarUrl(followingId)}" alt="Profile Picture" class="user-list-avatar" data-user-id="${followingId}">
                <div class="user-list-info">
                  <div class="user-list-name">${followingData.displayName}</div>
                  <div class="user-list-handle">@${followingData.displayName.toLowerCase().replace(/\s+/g, '')}</div>
                </div>
                ${userId === auth.currentUser.uid ? `
                  <button class="follow-btn following-follow-btn" data-user-id="${followingId}" data-following="${isFollowing}">
                    ${isFollowing ? 'Following' : 'Follow'}
                  </button>
                ` : ''}
              `;
              
              followingList.appendChild(followingElement);
              
              // Add event listeners
              const followingAvatar = followingElement.querySelector('.user-list-avatar');
              followingAvatar.addEventListener('click', () => {
                loadUserProfile(followingId);
                closeFollowingModal();
              });
              
              const followingFollowBtn = followingElement.querySelector('.following-follow-btn');
              if (followingFollowBtn) {
                followingFollowBtn.addEventListener('click', () => {
                  const isCurrentlyFollowing = followingFollowBtn.dataset.following === 'true';
                  toggleFollow(followingId, isCurrentlyFollowing);
                  
                  // Update button
                  followingFollowBtn.textContent = isCurrentlyFollowing ? 'Follow' : 'Following';
                  followingFollowBtn.dataset.following = isCurrentlyFollowing ? 'false' : 'true';
                  
                  // Remove from list if unfollowed
                  if (isCurrentlyFollowing) {
                    followingElement.remove();
                    
                    // Check if list is empty
                    if (followingList.children.length === 0) {
                      followingList.innerHTML = '<div style="text-align: center; padding: 2rem;">Not following anyone yet.</div>';
                    }
                  }
                });
              }
            }
          }
        }
        
        // Show modal
        followingModal.style.display = 'block';
        followingModalOverlay.style.display = 'block';
        
      } catch (error) {
        console.error('Error showing following:', error);
        showToast('Error loading following');
      }
    }
    
    function closeFollowingModal() {
      followingModal.style.display = 'none';
      followingModalOverlay.style.display = 'none';
    }
    
    followingModalClose.addEventListener('click', closeFollowingModal);
    followingModalOverlay.addEventListener('click', closeFollowingModal);
    
    // Load User Settings
    async function loadUserSettings() {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        
        if (!userDoc.exists()) {
          return;
        }
        
        const userData = userDoc.data();
        
        // Update settings form
        settingsUsername.value = userData.displayName || '';
        settingsBio.value = userData.bio || '';
        
        // Update settings toggles
        const settings = userData.settings || {};
        emailNotifications.checked = settings.emailNotifications || false;
        pushNotifications.checked = settings.pushNotifications || true;
        privateAccount.checked = settings.privateAccount || false;
        activityStatus.checked = settings.activityStatus || true;
        
      } catch (error) {
        console.error('Error loading user settings:', error);
        showToast('Error loading settings');
      }
    }
    
    // Save User Settings
    saveSettings.addEventListener('click', async () => {
      try {
        const username = settingsUsername.value.trim();
        const bio = settingsBio.value.trim();
        
        if (!username) {
          showToast('Username cannot be empty');
          return;
        }
        
        // Update user document
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          displayName: username,
          bio: bio,
          settings: {
            emailNotifications: emailNotifications.checked,
            pushNotifications: pushNotifications.checked,
            privateAccount: privateAccount.checked,
            activityStatus: activityStatus.checked
          }
        });
        
        // Update sidebar user info
        sidebarName.textContent = username;
        sidebarHandle.textContent = '@' + username.toLowerCase().replace(/\s+/g, '');
        
        showToast('Settings saved successfully');
        
      } catch (error) {
        console.error('Error saving settings:', error);
        showToast('Error saving settings');
      }
    });

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
          trendingTopicsList.innerHTML = '<div style="padding: 1rem; text-align: center;">No trending topics yet.</div>';
          return;
        }
        
        sortedTopics.forEach((topic, index) => {
          const topicElement = document.createElement('div');
          topicElement.className = 'trending-item';
          topicElement.innerHTML = `
            <div class="trending-category">${topic.category}</div>
            <div class="trending-title">${topic.title}</div>
            <div class="trending-stats">${index + 1} · Trending</div>
          `;
          
          topicElement.addEventListener('click', () => {
            // Load the post
            loadSinglePost(topic.postId);
          });
          
          trendingTopicsList.appendChild(topicElement);
        });
        
      } catch (error) {
        console.error('Error loading trending topics:', error);
        trendingTopicsList.innerHTML = '<div style="padding: 1rem; text-align: center;">Error loading trending topics.</div>';
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
          .slice(0, 3);
        
        // Update UI
        topContributorsList.innerHTML = '';
        
        if (sortedContributors.length === 0) {
          topContributorsList.innerHTML = '<div style="padding: 1rem; text-align: center;">No contributors yet.</div>';
          return;
        }
        
        sortedContributors.forEach((contributor) => {
          const contributorElement = document.createElement('div');
          contributorElement.className = 'who-to-follow-item';
          
          // Check if contributor is admin
          const isContributorAdmin = Object.values(adminUsers).includes(contributor.userName);
          
          // Check if current user is following this contributor
          const isFollowing = false; // This will be updated when we implement following
          
          contributorElement.innerHTML = `
            <img src="${generateAvatarUrl(contributor.userId)}" alt="Profile Picture" class="who-to-follow-avatar">
            <div class="who-to-follow-info">
              <div class="who-to-follow-name">
                ${contributor.userName}
                ${isContributorAdmin ? `<span style="background-color: var(--primary-color); color: white; font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: var(--radius-full); margin-left: 0.3rem;">Admin</span>` : ''}
              </div>
              <div class="who-to-follow-handle">@${contributor.userName.toLowerCase().replace(/\s+/g, '')}</div>
            </div>
            ${contributor.userId !== auth.currentUser.uid ? `
              <button class="follow-btn contributor-follow-btn" data-user-id="${contributor.userId}" data-following="${isFollowing}">
                ${isFollowing ? 'Following' : 'Follow'}
              </button>
            ` : ''}
          `;
          
          contributorElement.addEventListener('click', (e) => {
            if (!e.target.classList.contains('follow-btn')) {
              loadUserProfile(contributor.userId);
            }
          });
          
          const followBtn = contributorElement.querySelector('.contributor-follow-btn');
          if (followBtn) {
            followBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const isCurrentlyFollowing = followBtn.dataset.following === 'true';
              toggleFollow(contributor.userId, isCurrentlyFollowing);
              
              // Update button
              followBtn.textContent = isCurrentlyFollowing ? 'Follow' : 'Following';
              followBtn.dataset.following = isCurrentlyFollowing ? 'false' : 'true';
            });
          }
          
          topContributorsList.appendChild(contributorElement);
        });
        
      } catch (error) {
        console.error('Error loading top contributors:', error);
        topContributorsList.innerHTML = '<div style="padding: 1rem; text-align: center;">Error loading top contributors.</div>';
      }
    }
    
    // Explore Page
    exploreTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        exploreTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const category = tab.dataset.category;
        loadExplorePosts(category);
      });
    });
    
    function loadExplorePosts(category) {
      // Use the existing loadPosts function with the category filter
      loadPosts(null, category);
    }

    // Navigation
    function setActiveNavItem(item) {
      // Desktop navigation
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      document.querySelectorAll('.mobile-nav-link').forEach(link => link.classList.remove('active'));
      
      switch (item) {
        case 'home':
          homeLink.classList.add('active');
          mobileHome.classList.add('active');
          break;
        case 'explore':
          exploreLink.classList.add('active');
          mobileExplore.classList.add('active');
          break;
        case 'notifications':
          notificationsLink.classList.add('active');
          mobileNotifications.classList.add('active');
          break;
        case 'profile':
          profileLink.classList.add('active');
          mobileProfile.classList.add('active');
          break;
        case 'settings':
          settingsLink.classList.add('active');
          break;
      }
    }
    
    function showPage(pageId) {
      // Hide all pages
      homePage.style.display = 'none';
      notificationsPage.style.display = 'none';
      profilePage.style.display = 'none';
      explorePage.style.display = 'none';
      settingsPage.style.display = 'none';
      
      // Show selected page
      document.getElementById(pageId).style.display = 'block';
    }

    homeLink.addEventListener('click', (e) => {
      e.preventDefault();
      pageTitle.textContent = 'Home';
      setActiveNavItem('home');
      showPage('home-page');
      loadPosts();
    });

    exploreLink.addEventListener('click', (e) => {
      e.preventDefault();
      pageTitle.textContent = 'Explore';
      setActiveNavItem('explore');
      showPage('explore-page');
      loadExplorePosts('all');
    });

    notificationsLink.addEventListener('click', (e) => {
      e.preventDefault();
      pageTitle.textContent = 'Notifications';
      setActiveNavItem('notifications');
      showPage('notifications-page');
      loadNotifications();
    });

    profileLink.addEventListener('click', (e) => {
      e.preventDefault();
      loadUserProfile(auth.currentUser.uid);
    });
    
    settingsLink.addEventListener('click', (e) => {
      e.preventDefault();
      pageTitle.textContent = 'Settings';
      setActiveNavItem('settings');
      showPage('settings-page');
      loadUserSettings();
    });

    // Mobile Navigation
    mobileHome.addEventListener('click', (e) => {
      e.preventDefault();
      pageTitle.textContent = 'Home';
      setActiveNavItem('home');
      showPage('home-page');
      loadPosts();
    });

    mobileExplore.addEventListener('click', (e) => {
      e.preventDefault();
      pageTitle.textContent = 'Explore';
      setActiveNavItem('explore');
      showPage('explore-page');
      loadExplorePosts('all');
    });

    mobileNotifications.addEventListener('click', (e) => {
      e.preventDefault();
      pageTitle.textContent = 'Notifications';
      setActiveNavItem('notifications');
      showPage('notifications-page');
      loadNotifications();
    });

    mobileProfile.addEventListener('click', (e) => {
      e.preventDefault();
      loadUserProfile(auth.currentUser.uid);
    });

    // Compose Tweet Button
    composeBtn.addEventListener('click', () => {
      // Scroll to compose area
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Focus on title input
      setTimeout(() => {
        tweetTitle.focus();
      }, 500);
    });

    floatTweetBtn.addEventListener('click', () => {
      // Scroll to compose area
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Focus on title input
      setTimeout(() => {
        tweetTitle.focus();
      }, 500);
    });
    
    // Initialize the app
    setActiveNavItem('home');
    showPage('home-page');
