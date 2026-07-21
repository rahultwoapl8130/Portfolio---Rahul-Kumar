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
    'profile': 'I am an AI assistant here to help you learn about Rahul Kumar! Rahul is an aspiring Data Scientist and Machine Learning Engineer. He is pursuing an MBA in Business Analytics and has a strong foundation in predictive modeling, AI solutions, and full-stack analytics. He loves turning complex data into actionable business strategies.',
    'skills': 'Rahul\\'s technical stack is quite impressive! <br><br>• <strong>Languages:</strong> Python, SQL, JavaScript, C++<br>• <strong>Machine Learning:</strong> Scikit-learn, TensorFlow, PyTorch, Pandas, NumPy<br>• <strong>Data Viz:</strong> Power BI, Matplotlib, Seaborn, Tableau<br>• <strong>Cloud & DB:</strong> GCP, Snowflake, BigQuery, Databricks<br><br>Is there a specific skill you are looking for?',
    'project': 'Rahul has built several end-to-end projects. Here are his top ones:<br><br>1) <strong>Shooper Spectrum:</strong> AI E-Commerce Analytics<br>2) <strong>SmartCart:</strong> Customer Segmentation via K-Means & PCA<br>3) <strong>Loan Predictor:</strong> Random Forest model with 92% accuracy<br>4) <strong>Customer Churn:</strong> XGBoost predictive ML<br>5) <strong>Finance Dashboard:</strong> Automated Power BI dashboards.<br><br>Which project would you like to know more about?',
    'shooper': '<strong>Shooper Spectrum</strong> is an AI-Powered E-Commerce Analytics Platform. It uses machine learning for customer segmentation and intelligent product recommendations, built with Python and modern ML libraries.',
    'smartcart': '<strong>SmartCart</strong> is an unsupervised machine learning engine. Rahul used K-Means and PCA to group users into high-intent behavioral segments, aiming for a 15% improvement in targeting ROI.',
    'finance': 'The <strong>Finance Dashboard (Adventure Works BI)</strong> is a project where Rahul designed an automated Power BI Executive Dashboard. It connects directly to SQL databases and reduced manual reporting time by 15 hours per week!',
    'loan': 'The <strong>Loan Approval Predictor</strong> is an ML project where Rahul deployed a Random Forest classifier to predict loan default risks, achieving an impressive 92% accuracy and an F1-score of 0.89.',
    'churn': 'The <strong>Customer Churn Prediction</strong> project uses XGBoost to analyze historical user data and identify at-risk customers, allowing businesses to improve retention strategies proactively.',
    'experience': 'Rahul\\'s professional experience includes:<br>• <strong>Data Science & ML Projects (2024-2026):</strong> Independent work building complex ML pipelines and BI dashboards.<br>• <strong>Data Analytics Intern (2023):</strong> Built automated reports and engineered SQL queries, reducing manual reporting time by 30%.',
    'education': 'Rahul has a very strong academic background. He is currently pursuing an <strong>MBA in Business Analytics</strong> at Uttaranchal University (2023-2025). Prior to that, he completed his <strong>B.Sc. in Agriculture</strong> (2019-2022).',
    'certifications': 'Rahul is highly certified! He holds:<br>• Microsoft Certified: Generative AI<br>• Power BI Data Analyst Associate<br>• Machine Learning Specialization (Stanford / Coursera)<br>• Google Cloud Digital Leader<br>• Snowflake SnowPro Core<br>• Python for Data Science (IBM)',
    'achievements': 'Some of Rahul\\'s key milestones include building 5+ End-to-End ML Projects, earning multiple prestigious Cloud Certifications, and being an active open-source contributor on GitHub.',
    'contact': 'You can reach Rahul directly via:<br>📧 <strong>Email:</strong> rahultwoapl8130@gmail.com<br>📱 <strong>Phone / WhatsApp:</strong> +91 9876543210 <i>(Replace with actual number)</i><br>💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/rahul-kumar-54258a344/" target="_blank" style="color:var(--accent-primary)">Rahul Kumar</a><br><br>He is actively looking for full-time Data Scientist/ML Engineer roles!',
    'resume': 'You can easily download Rahul\\'s resume by clicking the <strong>"Download Resume"</strong> button in the Overview section, or from the top navigation bar.',
    'github': 'Rahul is very active on GitHub! He has over 10 public repositories and 200+ contributions. I can open his GitHub profile for you if you type "open github".',
    'hello': 'Hello! I am Rahul\\'s AI assistant. How can I help you today? I can answer questions about his <strong>projects, skills, education, or provide his contact and WhatsApp details</strong>.',
    'hi': 'Hi there! I am an AI trained to answer any questions about Rahul Kumar. You can ask me about his <strong>experience, certifications, or specific projects like SmartCart or Shooper</strong>!',
    'default': 'That\\'s a great question, but I might need a bit more context! I am an AI assistant specifically trained on Rahul\\'s portfolio. Try asking me about his <strong>skills, specific projects, contact number, WhatsApp, or resume</strong>. You can also reach out to him directly via email (rahultwoapl8130@gmail.com)!'
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
      } else if (lowerText.includes('finance') || lowerText.includes('dashboard') || lowerText.includes('power bi')) {
        response = knowledgeBase['finance'];
      } else if (lowerText.includes('loan') || lowerText.includes('random forest')) {
        response = knowledgeBase['loan'];
      } else if (lowerText.includes('churn') || lowerText.includes('xgboost')) {
        response = knowledgeBase['churn'];
      } else if (lowerText.includes('project') || lowerText.includes('portfolio') || lowerText.includes('work') || lowerText.includes('build')) {
        response = knowledgeBase['project'];
      } else if (lowerText.includes('profile') || lowerText.includes('about') || lowerText.includes('who is') || lowerText.includes('overview') || lowerText.includes('journey')) {
        response = knowledgeBase['profile'];
      } else if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('hire') || lowerText.includes('reach') || lowerText.includes('message') || lowerText.includes('number') || lowerText.includes('phone') || lowerText.includes('whatsapp') || lowerText.includes('call')) {
        response = knowledgeBase['contact'];
      } else if (lowerText.includes('education') || lowerText.includes('degree') || lowerText.includes('university') || lowerText.includes('college') || lowerText.includes('mba') || lowerText.includes('bsc') || lowerText.includes('graduate')) {
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
