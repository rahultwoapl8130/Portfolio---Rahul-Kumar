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

  // Comprehensive Knowledge Base based on the entire portfolio
  const knowledgeBase = {
    'profile': 'Rahul Kumar is an Aspiring Data Scientist & ML Engineer pursuing an MBA in Business Analytics at Uttaranchal University. He is passionate about predictive modeling, AI-driven solutions, and crafting beautiful digital experiences.',
    'skills': 'Rahul\\'s top skills include: <br>• <strong>Programming:</strong> Python, SQL, JavaScript, C++<br>• <strong>ML & AI:</strong> Scikit-learn, TensorFlow, PyTorch, Pandas, NumPy<br>• <strong>Data Visualization:</strong> Power BI, Matplotlib, Seaborn, Excel<br>• <strong>Cloud:</strong> GCP, Vertex AI, BigQuery, Snowflake, Databricks<br>• <strong>Tools:</strong> Git, Docker, HTML/CSS.',
    'project': 'Rahul has built several amazing projects:<br>1) <strong>Shooper Spectrum:</strong> AI E-Commerce Analytics<br>2) <strong>SmartCart:</strong> Customer Segmentation via K-Means & PCA<br>3) <strong>Loan Predictor:</strong> Random Forest with 92% accuracy<br>4) <strong>Customer Churn:</strong> XGBoost predictive ML<br>5) <strong>Finance Dashboard:</strong> Power BI & DAX.',
    'shooper': '<strong>Shooper Spectrum</strong> is an AI-Powered E-Commerce Analytics Platform with customer segmentation and recommendation intelligence.',
    'smartcart': '<strong>SmartCart</strong> is an unsupervised machine learning engine using K-Means and PCA to group users into high-intent segments.',
    'experience': 'Rahul\\'s experience includes:<br>• <strong>Data Science & ML Projects (2024-2026):</strong> Independent work on Customer Segmentation, BI, and Predictive Modeling.<br>• <strong>Data Analytics Intern (2023):</strong> Built automated reports reducing manual time by 30% and engineered SQL queries.',
    'education': 'Rahul is pursuing an <strong>MBA in Business Analytics</strong> at Uttaranchal University (2023-2025) and holds a <strong>B.Sc. in Agriculture</strong> (2019-2022).',
    'certifications': 'Rahul holds multiple certifications, including:<br>• Microsoft Certified: Generative AI<br>• Power BI Data Analyst Associate<br>• Machine Learning Specialization (Stanford)<br>• Google Cloud Digital Leader<br>• Snowflake SnowPro Core<br>• Python for Data Science (IBM)',
    'achievements': 'Rahul\\'s key achievements:<br>• 5+ End-to-End ML Projects<br>• Multiple Cloud Certifications<br>• Full-Stack AI Applications<br>• Open Source Contributor on GitHub.',
    'contact': 'You can reach Rahul at <strong>rahultwoapl8130@gmail.com</strong>, or connect with him on LinkedIn!',
    'resume': 'You can download his resume using the "Resume" button in the hero section or the navigation menu.',
    'github': 'Rahul has 10+ public repos, 200+ contributions, and 5+ stars on GitHub. I can open his GitHub profile if you\\'d like!',
    'hello': 'Hi there! I am Rahul\\'s AI assistant. You can ask me about his <strong>skills, projects, experience, education, certifications, or how to contact him</strong>.',
    'hi': 'Hello! How can I help you learn more about Rahul today? Try asking about his <strong>certifications</strong> or <strong>projects</strong>!',
    'default': 'That\\'s an interesting question! I am a simple AI assistant right now. Try asking me about Rahul\\'s <strong>skills, projects, certifications, or education</strong>. You can also reach out to him directly via LinkedIn or email.'
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
      
      // Comprehensive keyword matching
      if (lowerText.includes('skill') || lowerText.includes('tech') || lowerText.includes('stack') || lowerText.includes('tool') || lowerText.includes('language')) {
        response = knowledgeBase['skills'];
      } else if (lowerText.includes('shooper')) {
        response = knowledgeBase['shooper'];
      } else if (lowerText.includes('smartcart') || lowerText.includes('segmentation')) {
        response = knowledgeBase['smartcart'];
      } else if (lowerText.includes('project') || lowerText.includes('portfolio') || lowerText.includes('work') || lowerText.includes('build')) {
        response = knowledgeBase['project'];
      } else if (lowerText.includes('profile') || lowerText.includes('about') || lowerText.includes('who is') || lowerText.includes('overview')) {
        response = knowledgeBase['profile'];
      } else if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('hire') || lowerText.includes('reach') || lowerText.includes('message')) {
        response = knowledgeBase['contact'];
      } else if (lowerText.includes('education') || lowerText.includes('degree') || lowerText.includes('university') || lowerText.includes('college') || lowerText.includes('mba') || lowerText.includes('bsc')) {
        response = knowledgeBase['education'];
      } else if (lowerText.includes('experience') || lowerText.includes('job') || lowerText.includes('intern') || lowerText.includes('work')) {
        response = knowledgeBase['experience'];
      } else if (lowerText.includes('certificat') || lowerText.includes('credential') || lowerText.includes('course')) {
        response = knowledgeBase['certifications'];
      } else if (lowerText.includes('achieve') || lowerText.includes('award') || lowerText.includes('milestone')) {
        response = knowledgeBase['achievements'];
      } else if (lowerText.includes('resume') || lowerText.includes('cv')) {
        response = knowledgeBase['resume'];
      } else if (lowerText === 'hi' || lowerText === 'hello' || lowerText === 'hey' || lowerText === 'greetings') {
        response = knowledgeBase['hello'];
      } else if (lowerText.includes('linkedin')) {
        response = 'Opening Rahul\\'s LinkedIn profile...';
        setTimeout(() => {
          window.open('https://www.linkedin.com/in/rahul-kumar-54258a344/', '_blank');
        }, 1000);
      } else if (lowerText.includes('github') || lowerText.includes('git')) {
        if (lowerText.includes('open') || lowerText.includes('go to')) {
          response = 'Opening Rahul\\'s GitHub profile...';
          setTimeout(() => {
            window.open('https://github.com/rahultwoapl8130', '_blank');
          }, 1000);
        } else {
          response = knowledgeBase['github'];
        }
      }

      addBotMessage(response);
    }, 1000 + Math.random() * 600); // Simulate network delay
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

  // Update time in chatbot header
  function updateTime() {
    const timeElement = document.getElementById('chatbot-time');
    if (timeElement) {
      const now = new Date();
      timeElement.textContent = 'Local Time: ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
  }
  
  updateTime();
  setInterval(updateTime, 60000);
});
