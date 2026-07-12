/* ===================================================================
   AI CHATBOT WIDGET JS
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const chatWindow = document.getElementById('chatbot-window');
  const chatMessages = document.getElementById('chatbot-messages');
  const chatForm = document.getElementById('chatbot-form');
  const chatInput = document.getElementById('chatbot-input');
  const chatChips = document.getElementById('chatbot-chips');

  // Simple knowledge base
  const knowledgeBase = {
    'skills': 'My top skills include Python, Machine Learning, Data Science, SQL, Power BI, Scikit-learn, TensorFlow, and AWS.',
    'project': 'My best project is the "End-to-End Sales Prediction API" which uses a Random Forest model deployed with Flask and Docker on AWS.',
    'contact': 'You can reach me at rahultwoapl8130@gmail.com, or connect with me on LinkedIn!',
    'education': 'I have a Bachelor of Technology in Computer Science with a specialization in AI and Data Science.',
    'experience': 'I have worked on several freelance and academic projects focusing on predictive modeling, NLP, and data visualization.',
    'resume': 'You can download my resume using the "Resume" button in the hero section or the navigation menu.',
    'hello': 'Hi there! I am Rahul\\'s AI assistant. Ask me about his skills, projects, or how to contact him.',
    'hi': 'Hello! How can I help you learn more about Rahul today?',
    'default': 'That\\'s an interesting question! I am a simple AI assistant right now. Please reach out to Rahul directly for more detailed discussions via LinkedIn or email.'
  };

  // State
  let isFirstOpen = true;

  // Toggle chat
  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.add('active');
    toggleBtn.style.transform = 'scale(0)';
    if (isFirstOpen) {
      setTimeout(() => {
        addBotMessage("Hi! I'm Rahul's AI assistant. 👋 What would you like to know about him?");
      }, 500);
      isFirstOpen = false;
    }
    chatInput.focus();
  });

  // Close chat
  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('active');
    toggleBtn.style.transform = 'scale(1)';
  });

  // Handle chips
  chatChips.addEventListener('click', (e) => {
    if (e.target.classList.contains('chat-chip')) {
      const text = e.target.textContent;
      handleUserInput(text);
    }
  });

  // Handle form submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (text) {
      handleUserInput(text);
      chatInput.value = '';
    }
  });

  function handleUserInput(text) {
    // Add user message
    addUserMessage(text);
    
    // Show typing indicator
    const typingId = showTypingIndicator();
    
    // Scroll to bottom
    scrollToBottom();

    // Determine response
    setTimeout(() => {
      removeTypingIndicator(typingId);
      
      const lowerText = text.toLowerCase();
      let response = knowledgeBase['default'];
      
      if (lowerText.includes('skill') || lowerText.includes('tech') || lowerText.includes('stack')) {
        response = knowledgeBase['skills'];
      } else if (lowerText.includes('project') || lowerText.includes('portfolio') || lowerText.includes('work')) {
        response = knowledgeBase['project'];
      } else if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('hire') || lowerText.includes('reach')) {
        response = knowledgeBase['contact'];
      } else if (lowerText.includes('education') || lowerText.includes('degree') || lowerText.includes('university') || lowerText.includes('college')) {
        response = knowledgeBase['education'];
      } else if (lowerText.includes('experience') || lowerText.includes('job') || lowerText.includes('work')) {
        response = knowledgeBase['experience'];
      } else if (lowerText.includes('resume') || lowerText.includes('cv')) {
        response = knowledgeBase['resume'];
      } else if (lowerText === 'hi' || lowerText === 'hello' || lowerText === 'hey') {
        response = knowledgeBase['hello'];
      }

      addBotMessage(response);
    }, 1200 + Math.random() * 800); // Simulate network delay (1.2s - 2s)
  }

  function addUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg user';
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
  }

  function addBotMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg bot';
    msgDiv.innerHTML = text; // Allow basic HTML if needed in future
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = id;
    typingDiv.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
    return id;
  }

  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) {
      el.remove();
    }
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
