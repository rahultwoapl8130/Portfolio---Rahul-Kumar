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
    'project': 'I have built several projects, including Shooper Spectrum (AI E-Commerce Analytics), SmartCart (Customer Segmentation), and an Adventure Works Power BI Dashboard.',
    'contact': 'You can reach me at rahultwoapl8130@gmail.com, or connect with me on LinkedIn!',
    'education': 'I am pursuing an MBA in Business Analytics at Uttaranchal University (2023-2025) and hold a B.Sc. in Agriculture.',
    'experience': 'I am an Aspiring Data Scientist & ML Engineer focusing on predictive modeling, business analytics, and AI-driven solutions.',
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
      } else if (lowerText.includes('education') || lowerText.includes('degree') || lowerText.includes('university') || lowerText.includes('college') || lowerText.includes('mba')) {
        response = knowledgeBase['education'];
      } else if (lowerText.includes('experience') || lowerText.includes('job')) {
        response = knowledgeBase['experience'];
      } else if (lowerText.includes('resume') || lowerText.includes('cv')) {
        response = knowledgeBase['resume'];
      } else if (lowerText === 'hi' || lowerText === 'hello' || lowerText === 'hey') {
        response = knowledgeBase['hello'];
      } else if (lowerText.includes('linkedin')) {
        response = 'Opening Rahul\\'s LinkedIn profile...';
        setTimeout(() => {
          window.open('https://www.linkedin.com/in/rahul-kumar-54258a344/', '_blank');
        }, 1000);
      } else if (lowerText.includes('github')) {
        response = 'Opening Rahul\\'s GitHub profile...';
        setTimeout(() => {
          window.open('https://github.com/rahultwoapl8130', '_blank');
        }, 1000);
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
