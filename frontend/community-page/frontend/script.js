
// DOM Elements
const postsContainer = document.getElementById('posts-container');
const submitPostButton = document.getElementById('submit-post');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const fileInput = document.getElementById('file-upload');
const chatInput = document.getElementById('chat-input');
const sendMessageButton = document.getElementById('send-message');
const messagesContainer = document.getElementById('messages-container');

// Array to store posts
let posts = [];

// Array to store chat messages
let messages = [];

// Function: Add Post
function addPost(title, content, fileUrl) {
    const post = {
        id: posts.length + 1,
        title: title,
        content: content,
        fileUrl: fileUrl,
        createdAt: new Date().toLocaleString(),
    };
    posts.push(post);
    displayPosts();
}

// Function: Display Posts
function displayPosts() {
    postsContainer.innerHTML = ''; // Clear existing posts
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            ${post.fileUrl ? `<img src="${post.fileUrl}" alt="Uploaded Image" class="uploaded-image">` : ''}
            <small>Posted on: ${post.createdAt}</small>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Function: Handle File Upload
function uploadFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject('File upload failed.');
        reader.readAsDataURL(file);
    });
}

// Event Listener: Add Post Button
submitPostButton.addEventListener('click', async () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const file = fileInput.files[0];

    if (!title || !content) {
        alert('Please fill in both the title and content fields.');
        return;
    }

    let fileUrl = '';
    if (file) {
        try {
            fileUrl = await uploadFile(file);
        } catch (error) {
            alert(error);
            return;
        }
    }

    addPost(title, content, fileUrl);

    // Clear inputs
    titleInput.value = '';
    contentInput.value = '';
    fileInput.value = '';
});

// Function: Add Chat Message
function addMessage(message) {
    messages.push({ text: message, createdAt: new Date().toLocaleTimeString() });
    displayMessages();
}

// Function: Display Chat Messages
function displayMessages() {
    messagesContainer.innerHTML = ''; // Clear existing messages
    messages.forEach(msg => {
        const messageElement = document.createElement('p');
        messageElement.textContent = `${msg.createdAt}: ${msg.text}`;
        messagesContainer.appendChild(messageElement);
    });
}

// Event Listener: Send Message Button
sendMessageButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (!message) {
        alert('Please type a message before sending.');
        return;
    }
    addMessage(message);
    chatInput.value = ''; // Clear input
});
