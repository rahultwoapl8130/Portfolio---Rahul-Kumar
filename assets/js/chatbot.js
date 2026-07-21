/**
 * Chatbot Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const chatbotWindow = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const messagesContainer = document.getElementById('chatbot-messages');
  const timeDisplay = document.getElementById('chatbot-time');

  // Set initial time
  if (timeDisplay) {
    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Pre-defined answers matching keywords
  const qaDatabase = [
    {
      keywords: ['hi', 'hello', 'hey', 'start'],
      response: "Hi there! I'm Rahul's AI assistant. You can ask me about his skills, experience, projects, or how to contact him!"
    },
    {
      keywords: ['skill', 'tech', 'stack', 'tool', 'language'],
      response: "Rahul specializes in Machine Learning and Data Science. His core stack includes Python, Scikit-Learn, TensorFlow, Power BI, SQL, and web technologies like HTML/CSS/JS."
    },
    {
      keywords: ['experience', 'work', 'job', 'role'],
      response: "Rahul has hands-on experience building end-to-end ML solutions and predictive models, focusing on customer segmentation, NLP, and data analysis. Check the 'Experience' section for details!"
    },
    {
      keywords: ['project', 'portfolio', 'work'],
      response: "He has built several projects including Shopper Spectrum (Customer Segmentation), SmartCart AI, and advanced Sentiment Analysis models. You can view live demos in the 'Projects' section."
    },
    {
      keywords: ['contact', 'email', 'hire', 'talk', 'freelance'],
      response: "You can reach Rahul directly via email at rahultwoapl8130@gmail.com, or use the Contact Form at the bottom of the page. He is open to full-time roles and freelance projects!"
    },
    {
      keywords: ['education', 'degree', 'study', 'college'],
      response: "Rahul holds a degree in Computer Science and Engineering from Guru Gobind Singh Indraprastha University (2020-2024)."
    },
    {
      keywords: ['resume', 'cv', 'download'],
      response: "You can download Rahul's resume by clicking the 'Download Resume' button at the top of the page in the Hero section."
    }
  ];

  // Function to add a message to the chat
  function addMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.style.marginBottom = '12px';
    msgDiv.style.display = 'flex';
    msgDiv.style.flexDirection = 'column';
    msgDiv.style.alignItems = isUser ? 'flex-end' : 'flex-start';

    const bubble = document.createElement('div');
    bubble.style.padding = '10px 14px';
    bubble.style.borderRadius = '14px';
    bubble.style.maxWidth = '85%';
    bubble.style.fontSize = '0.9rem';
    bubble.style.lineHeight = '1.4';
    bubble.style.animation = 'fadeInChar 0.3s ease-out forwards';
    
    if (isUser) {
      bubble.style.background = 'linear-gradient(90deg, #9f36f3, #6c5ce7)';
      bubble.style.color = 'white';
      bubble.style.borderBottomRightRadius = '4px';
    } else {
      bubble.style.background = 'var(--bg-glass)';
      bubble.style.color = 'var(--text-primary)';
      bubble.style.borderBottomLeftRadius = '4px';
      bubble.style.border = 'var(--border-glass)';
    }

    bubble.textContent = text;
    msgDiv.appendChild(bubble);
    messagesContainer.appendChild(msgDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function getBotResponse(userText) {
    const lowerText = userText.toLowerCase();
    
    // Search for matching keyword
    for (let qa of qaDatabase) {
      for (let keyword of qa.keywords) {
        if (lowerText.includes(keyword)) {
          return qa.response;
        }
      }
    }
    
    // Default response
    return "I'm still learning! You can ask me about Rahul's skills, experience, projects, or how to contact him.";
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Add user message
    addMessage(text, true);
    chatInput.value = '';

    // 2. Simulate typing delay then add bot response
    setTimeout(() => {
      const response = getBotResponse(text);
      addMessage(response, false);
    }, 600);
  }

  // Event Listeners
  if (sendBtn) {
    sendBtn.addEventListener('click', handleSend);
  }
  
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    });
  }

  // Close functionality is handled in HTML button's onclick or here
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatbotWindow.classList.remove('active');
    });
  }

  // Initial greeting if chat is empty
  setTimeout(() => {
    if (messagesContainer && messagesContainer.children.length === 0) {
      addMessage("Hi! I'm Rahul's virtual assistant. Ask me anything about his profile!", false);
    }
  }, 1000);
});
