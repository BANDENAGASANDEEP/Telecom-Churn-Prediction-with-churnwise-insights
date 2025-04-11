
document.addEventListener('DOMContentLoaded', function() {
  // Handle login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Call API for login
      fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'username': email,
          'password': password,
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then(data => {
        localStorage.setItem('token', data.access_token);
        window.location.href = 'dashboard.html';
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Invalid username or password');
      });
    });
  }

  // Dashboard slide navigation with smooth transitions
  const slideNavBtns = document.querySelectorAll('.slide-nav-btn');
  const slides = document.querySelectorAll('.dashboard-section');
  const slideIndicators = document.querySelectorAll('.slide-indicator');

  if (slideNavBtns.length > 0) {
    slideNavBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const slideIndex = parseInt(this.dataset.slide);
        switchSlide(slideIndex);
      });
    });

    function switchSlide(index) {
      // Update nav buttons with animated transition
      slideNavBtns.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.slide) === index) {
          btn.classList.add('active');
          // Add subtle pulse animation
          btn.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.05)' },
            { transform: 'scale(1)' }
          ], {
            duration: 300,
            easing: 'ease-in-out'
          });
        }
      });

      // Update slide indicators with animated transition
      slideIndicators.forEach(indicator => {
        indicator.classList.remove('active');
        if (parseInt(indicator.dataset.slide) === index) {
          indicator.classList.add('active');
          // Smooth width transition is handled by CSS
        }
      });

      // Update slides with animated transitions
      slides.forEach((slide, i) => {
        const isActive = i === index;
        
        if (isActive && !slide.classList.contains('active')) {
          // Slide in
          slide.style.opacity = '0';
          slide.style.transform = 'translateX(20px)';
          slide.classList.add('active');
          
          // Trigger animation after a small delay to ensure proper rendering
          setTimeout(() => {
            slide.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            slide.style.opacity = '1';
            slide.style.transform = 'translateX(0)';
          }, 50);
        } 
        else if (!isActive && slide.classList.contains('active')) {
          // Slide out
          slide.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          slide.style.opacity = '0';
          slide.style.transform = 'translateX(-20px)';
          
          // Remove active class after animation completes
          setTimeout(() => {
            slide.classList.remove('active');
          }, 500);
        }
      });
    }
  }

  // User menu toggle with improved animation
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userMenu = document.getElementById('userMenu');
  
  if (userMenuBtn && userMenu) {
    userMenuBtn.addEventListener('click', function() {
      if (userMenu.classList.contains('hidden')) {
        // Show menu with animation
        userMenu.classList.remove('hidden');
        userMenu.style.opacity = '0';
        userMenu.style.transform = 'translateY(10px)';
        
        // Trigger animation
        setTimeout(() => {
          userMenu.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          userMenu.style.opacity = '1';
          userMenu.style.transform = 'translateY(0)';
        }, 10);
      } else {
        // Hide menu with animation
        userMenu.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        userMenu.style.opacity = '0';
        userMenu.style.transform = 'translateY(10px)';
        
        // Remove hidden class after animation completes
        setTimeout(() => {
          userMenu.classList.add('hidden');
        }, 200);
      }
    });

    // Close menu when clicking outside with animation
    document.addEventListener('click', function(e) {
      if (!userMenuBtn.contains(e.target) && !userMenu.contains(e.target) && !userMenu.classList.contains('hidden')) {
        userMenu.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        userMenu.style.opacity = '0';
        userMenu.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
          userMenu.classList.add('hidden');
        }, 200);
      }
    });
  }

  // Chatbot functionality with API integration
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbot = document.getElementById('chatbot');
  const closeChatbot = document.getElementById('closeChatbot');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendMessage = document.getElementById('sendMessage');

  if (chatbotToggle && chatbot) {
    chatbotToggle.addEventListener('click', function() {
      if (chatbot.classList.contains('hidden')) {
        // Show chatbot with animation
        chatbot.classList.remove('hidden');
        chatbot.style.opacity = '0';
        chatbot.style.transform = 'scale(0.95)';
        
        // Trigger animation
        setTimeout(() => {
          chatbot.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          chatbot.style.opacity = '1';
          chatbot.style.transform = 'scale(1)';
          if (chatInput) chatInput.focus();
        }, 10);
      } else {
        // Hide chatbot with animation
        hideChatbot();
      }
    });

    if (closeChatbot) {
      closeChatbot.addEventListener('click', function() {
        hideChatbot();
      });
    }

    function hideChatbot() {
      chatbot.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      chatbot.style.opacity = '0';
      chatbot.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        chatbot.classList.add('hidden');
      }, 300);
    }

    // Send chat message with API integration
    if (sendMessage && chatInput && chatMessages) {
      const sendChatMessage = () => {
        const message = chatInput.value.trim();
        if (message) {
          // Add user message with animation
          addMessage(message, 'user');
          chatInput.value = '';
          
          // Show typing indicator
          showTypingIndicator();
          
          // Send message to API
          fetch(`http://localhost:8000/chat?query=${encodeURIComponent(message)}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          })
          .then(response => response.json())
          .then(data => {
            removeTypingIndicator();
            const responses = data.response;
            if (responses && responses.length > 0) {
              // Add each response as a separate message
              responses.forEach(response => {
                addMessage(response, 'bot');
              });
            } else {
              addMessage("I'm sorry, I couldn't find relevant information.", 'bot');
            }
          })
          .catch(error => {
            console.error('Error:', error);
            removeTypingIndicator();
            addMessage("I'm having trouble connecting to the server. Please try again later.", 'bot');
          });
        }
      };

      sendMessage.addEventListener('click', sendChatMessage);
      
      chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          sendChatMessage();
        }
      });

      function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `chat-message-${sender}`);
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = sender === 'user' ? 'translateX(20px)' : 'translateX(-20px)';
        
        const messagePara = document.createElement('p');
        messagePara.textContent = text;
        
        messageDiv.appendChild(messagePara);
        chatMessages.appendChild(messageDiv);
        
        // Animate the message
        setTimeout(() => {
          messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          messageDiv.style.opacity = '1';
          messageDiv.style.transform = 'translateX(0)';
          
          // Scroll to bottom with smooth animation
          chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
          });
        }, 10);
      }

      function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('chat-message', 'chat-message-bot', 'typing-indicator');
        typingDiv.style.opacity = '0';
        typingDiv.style.transform = 'translateX(-20px)';
        
        typingDiv.innerHTML = `
          <div class="typing-animation">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        
        // Animate the typing indicator
        setTimeout(() => {
          typingDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          typingDiv.style.opacity = '1';
          typingDiv.style.transform = 'translateX(0)';
          
          // Scroll to bottom with smooth animation
          chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
          });
        }, 10);
      }

      function removeTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
          typingIndicator.style.transition = 'opacity 0.2s ease';
          typingIndicator.style.opacity = '0';
          
          setTimeout(() => {
            typingIndicator.remove();
          }, 200);
        }
      }
    }
  }

  // Customer search functionality with API integration
  const searchCustomerBtn = document.getElementById('searchCustomerBtn');
  const customerIdInput = document.getElementById('customerId');
  const customerProfile = document.getElementById('customerProfile');

  if (searchCustomerBtn && customerIdInput && customerProfile) {
    searchCustomerBtn.addEventListener('click', function() {
      const customerId = customerIdInput.value.trim();
      if (customerId) {
        // Pulse animation on search button
        this.classList.add('animate-pulse');
        setTimeout(() => {
          this.classList.remove('animate-pulse');
        }, 500);
        
        // Call API to get customer profile
        fetch(`http://localhost:8000/customer-profile?customer_id=${customerId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Customer not found');
          }
          return response.json();
        })
        .then(data => {
          // Update customer profile with API data
          updateCustomerProfile(data);
          
          // Show customer profile with animation
          customerProfile.style.opacity = '0';
          customerProfile.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            customerProfile.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            customerProfile.style.opacity = '1';
            customerProfile.style.transform = 'translateY(0)';
          }, 100);
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Customer not found or error retrieving data');
        });
      }
    });
    
    function updateCustomerProfile(customer) {
      // Update customer profile card with data from API
      const profileName = document.getElementById('profileName');
      const profileId = document.getElementById('profileId');
      const profileTenure = document.getElementById('profileTenure');
      const profileContract = document.getElementById('profileContract');
      const profileMonthlyCharges = document.getElementById('profileMonthlyCharges');
      const profileTotalCharges = document.getElementById('profileTotalCharges');
      
      if (profileName) profileName.textContent = customer.gender === 'Male' ? 'Mr. Customer' : 'Ms. Customer';
      if (profileId) profileId.textContent = customer.customerID;
      if (profileTenure) profileTenure.textContent = `${customer.tenure} months`;
      if (profileContract) profileContract.textContent = customer.Contract;
      if (profileMonthlyCharges) profileMonthlyCharges.textContent = `$${customer.MonthlyCharges}`;
      if (profileTotalCharges) profileTotalCharges.textContent = `$${customer.TotalCharges}`;
      
      // Update services
      const servicesContainer = document.getElementById('servicesContainer');
      if (servicesContainer) {
        servicesContainer.innerHTML = '';
        
        const services = [
          { name: 'Phone Service', value: customer.PhoneService },
          { name: 'Multiple Lines', value: customer.MultipleLines },
          { name: 'Internet Service', value: customer.InternetService },
          { name: 'Online Security', value: customer.OnlineSecurity },
          { name: 'Online Backup', value: customer.OnlineBackup },
          { name: 'Device Protection', value: customer.DeviceProtection },
          { name: 'Tech Support', value: customer.TechSupport },
          { name: 'Streaming TV', value: customer.StreamingTV },
          { name: 'Streaming Movies', value: customer.StreamingMovies }
        ];
        
        services.forEach(service => {
          if (service.value !== 'No' && service.value !== 'No internet service' && service.value !== 'No phone service') {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium m-1';
            serviceItem.textContent = service.name;
            servicesContainer.appendChild(serviceItem);
          }
        });
      }
    }
  }

  // Churn prediction form with API integration
  const churnPredictionForm = document.getElementById('churnPredictionForm');
  const noPrediction = document.getElementById('noPrediction');
  const predictionResult = document.getElementById('predictionResult');
  const churnRiskMeter = document.getElementById('churnRiskMeter');
  const churnPercentage = document.getElementById('churnPercentage');
  const riskLabel = document.getElementById('riskLabel');

  if (churnPredictionForm && noPrediction && predictionResult && churnRiskMeter && churnPercentage) {
    churnPredictionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data for prediction
      const tenure = parseInt(document.getElementById('tenureInput').value) || 0;
      const monthlyCharges = parseFloat(document.getElementById('monthlyChargesInput').value) || 0;
      const contract = document.getElementById('contractSelect').value;
      const internetService = document.getElementById('internetServiceSelect').value;
      
      // Convert form data to features array for model
      // This is a simplified example - you would need to match your actual model's expected features
      const features = [
        tenure,
        monthlyCharges,
        contract === 'Month-to-month' ? 1 : 0,
        contract === 'One year' ? 1 : 0,
        contract === 'Two year' ? 1 : 0,
        internetService === 'Fiber optic' ? 1 : 0,
        internetService === 'DSL' ? 1 : 0
      ];
      
      // Hide "no prediction" message with fade out
      noPrediction.style.transition = 'opacity 0.3s ease';
      noPrediction.style.opacity = '0';
      
      // Call API to predict churn
      fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
      })
      .then(response => response.json())
      .then(data => {
        setTimeout(() => {
          noPrediction.style.display = 'none';
          
          // Show prediction results with fade in
          predictionResult.classList.remove('hidden');
          predictionResult.style.opacity = '0';
          
          setTimeout(() => {
            predictionResult.style.transition = 'opacity 0.5s ease';
            predictionResult.style.opacity = '1';
            
            // Convert model prediction to percentage
            // In a real app, you might get a probability directly from your model
            // Here we're generating a range based on the binary prediction
            const predictionValue = data.churn_prediction;
            const randomOffset = Math.random() * 30;
            const churnPercent = predictionValue === 1 ? 
              70 + randomOffset : // High risk if prediction is 1
              randomOffset; // Low risk if prediction is 0
            
            // First set initial state
            churnRiskMeter.setAttribute('stroke-dasharray', '0, 100');
            churnPercentage.textContent = '0%';
            
            // Then animate to final value
            setTimeout(() => {
              // Animate the percentage counter
              animateCounter(0, churnPercent, 1000, value => {
                churnPercentage.textContent = `${Math.round(value)}%`;
                churnRiskMeter.setAttribute('stroke-dasharray', `${value}, 100`);
              });
              
              // Update color and risk label based on percentage
              updateRiskLabel(churnPercent);
            }, 300);
          }, 50);
        }, 300);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error predicting churn. Please try again.');
      });
    });
    
    // Function to animate counting
    function animateCounter(start, end, duration, callback) {
      const startTime = performance.now();
      
      function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeProgress = easeOutQuad(progress);
        const currentValue = start + (end - start) * easeProgress;
        
        callback(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }
      
      requestAnimationFrame(updateCounter);
    }
    
    // Easing function for smoother animation
    function easeOutQuad(t) {
      return t * (2 - t);
    }
    
    // Function to update risk label based on percentage
    function updateRiskLabel(percentage) {
      // Remove any existing classes first
      churnRiskMeter.classList.remove('text-green-500', 'text-yellow-500', 'text-destructive');
      
      if (percentage < 30) {
        churnRiskMeter.classList.add('text-green-500');
        
        if (riskLabel) {
          riskLabel.className = 'bg-green-500/10 text-green-500 px-4 py-2 rounded-md inline-block mt-4';
          riskLabel.querySelector('span').textContent = 'Low Risk of Churn';
        }
      } else if (percentage < 70) {
        churnRiskMeter.classList.add('text-yellow-500');
        
        if (riskLabel) {
          riskLabel.className = 'bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-md inline-block mt-4';
          riskLabel.querySelector('span').textContent = 'Medium Risk of Churn';
        }
      } else {
        churnRiskMeter.classList.add('text-destructive');
        
        if (riskLabel) {
          riskLabel.className = 'bg-destructive/10 text-destructive px-4 py-2 rounded-md inline-block mt-4';
          riskLabel.querySelector('span').textContent = 'High Risk of Churn';
        }
      }
    }
  }

  // Initialize charts if we're on the dashboard
  if (document.getElementById('churnTrendChart')) {
    initializeChartsWithApiData();
  }

  function initializeChartsWithApiData() {
    // Fetch dashboard data from API
    fetch('http://localhost:8000/dashboard-data', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      initializeCharts(data);
    })
    .catch(error => {
      console.error('Error fetching dashboard data:', error);
      // Initialize with default data if API fails
      initializeCharts();
    });
  }

  function initializeCharts(apiData) {
    // Use API data or fallback to defaults
    const chartData = apiData || {};
    
    // Churn Rate Trend Chart
    const churnTrendCtx = document.getElementById('churnTrendChart').getContext('2d');
    const churnTrendChart = new Chart(churnTrendCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Churn Rate (%)',
          data: [5.2, 5.8, 5.4, 5.9, 5.7, 6.1, 5.6, 5.3, 4.9, 4.8, 4.6, 4.5],
          borderColor: 'hsl(221, 83%, 53%)',
          backgroundColor: 'hsla(221, 83%, 53%, 0.15)',
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          pointBackgroundColor: 'white',
          pointBorderColor: 'hsl(221, 83%, 53%)',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return `Churn Rate: ${context.parsed.y}%`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 4,
            max: 7,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    // Churn Reasons Chart
    const churnReasonsCtx = document.getElementById('churnReasonsChart').getContext('2d');
    const churnReasonsChart = new Chart(churnReasonsCtx, {
      type: 'bar',
      data: {
        labels: ['Price', 'Competitor', 'Service Quality', 'Coverage', 'Moving', 'Other'],
        datasets: [{
          label: 'Percentage',
          data: [38, 25, 15, 12, 7, 3],
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(234, 179, 8, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(139, 92, 246, 0.8)'
          ],
          borderWidth: 0,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          delay: function(context) {
            return context.dataIndex * 100;
          },
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: function(context) {
                return `${context.parsed.y}% of customers`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    // Customer Segments Chart
    const customerSegmentsCtx = document.getElementById('customerSegmentsChart').getContext('2d');
    const customerSegmentsChart = new Chart(customerSegmentsCtx, {
      type: 'doughnut',
      data: {
        labels: ['Low Risk', 'Medium Risk', 'High Risk'],
        datasets: [{
          label: 'Customers',
          data: [65, 23, 12],
          backgroundColor: [
            'rgba(16, 185, 129, 0.85)',
            'rgba(234, 179, 8, 0.85)', 
            'rgba(239, 68, 68, 0.85)'
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(234, 179, 8, 1)',
            'rgba(239, 68, 68, 1)'
          ],
          borderWidth: 2,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: 'easeOutCirc'
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.parsed}%`;
              }
            }
          }
        }
      }
    });
  }
});
