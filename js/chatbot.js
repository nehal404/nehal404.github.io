class PortfolioChatbot {
            constructor() {
                this.messageInput = document.getElementById('messageInput');
                this.messagesContainer = document.getElementById('messagesContainer');
                this.sendButton = document.getElementById('sendButton');
                this.typingIndicator = document.getElementById('typingIndicator');
                
                this.backendUrl = 'https://portfolio-chatbot-backend-j8t9yjneu-nehals-projects-166c9d08.vercel.app/api/chat';
                
                this.init();
            }

            init() {
                this.messageInput.addEventListener('input', () => {
                    this.messageInput.style.height = 'auto';
                    this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
                });

                this.messageInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.sendMessage();
                    }
                });

            }

            addMessage(content, type) {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${type}`;
                
                const avatar = document.createElement('div');
                avatar.className = 'message-avatar';
                avatar.textContent = type === 'user' ? 'YOU' : 'NA';
                
                const messageContent = document.createElement('div');
                messageContent.className = 'message-content';
                messageContent.innerHTML = this.formatMessage(content);
                
                messageDiv.appendChild(avatar);
                messageDiv.appendChild(messageContent);
                
                if (type === 'user') {
                    const welcomeMessage = document.querySelector('.welcome-message');
                    const sampleQuestions = document.querySelector('.sample-questions');
                    if (welcomeMessage) welcomeMessage.remove();
                    if (sampleQuestions) sampleQuestions.remove();
                }
                
                this.messagesContainer.appendChild(messageDiv);
                this.scrollToBottom();
                
                return messageDiv;
            }

            formatMessage(content) {
                return content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/```(.*?)```/gs, '<code>$1</code>')
                    .replace(/`(.*?)`/g, '<code>$1</code>')
                    .replace(/\n/g, '<br>');
            }

            showTyping() {
                this.typingIndicator.classList.add('show');
                this.scrollToBottom();
            }

            hideTyping() {
                this.typingIndicator.classList.remove('show');
            }

            scrollToBottom() {
                setTimeout(() => {
                    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
                }, 100);
            }

            showError(message) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.innerHTML = `Warning: ${message}`;
                this.messagesContainer.appendChild(errorDiv);
                this.scrollToBottom();
                
                setTimeout(() => errorDiv.remove(), 5000);
            }

            async sendMessage() {
                // Debug logging
                console.log('sendMessage called, conversationHistory:', this.conversationHistory);
                
                const message = this.messageInput.value.trim();
                if (!message) return;

                // Initialize conversationHistory if it doesn't exist
                if (!this.conversationHistory) {
                    this.conversationHistory = [];
                    console.warn('conversationHistory was undefined, initializing as empty array');
                }

                this.messageInput.disabled = true;
                this.sendButton.disabled = true;
                this.sendButton.innerHTML = '<span>Sending...</span>';

                // Add user message to conversation history
                this.conversationHistory.push({ role: 'user', content: message });

                this.addMessage(message, 'user');
                this.messageInput.value = '';
                this.messageInput.style.height = 'auto';

                this.showTyping();

                try {
                    // Send entire conversation history for context awareness
                    const response = await fetch(this.backendUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            messages: [...this.conversationHistory] // Send full conversation
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    let aiResponse = '';
                    let aiMessageDiv = null;

                    this.hideTyping();
                    aiMessageDiv = this.addMessage('', 'ai');
                    const aiMessageContent = aiMessageDiv.querySelector('.message-content');

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split('\n');

                        for (const line of lines) {
                            if (line.trim() === '') continue;
                            
                            if (line.startsWith('0:"') && line.endsWith('"')) {
                                const text = line.slice(3, -1)
                                    .replace(/\\"/g, '"')
                                    .replace(/\\n/g, '\n');
                                
                                aiResponse += text;
                                aiMessageContent.innerHTML = this.formatMessage(aiResponse);
                                this.scrollToBottom();
                            }
                        }
                    }

                    // Add AI response to conversation history
                    if (aiResponse.trim()) {
                        this.conversationHistory.push({ role: 'assistant', content: aiResponse });
                    } else {
                        aiResponse = 'Sorry, I could not generate a response.';
                        aiMessageContent.innerHTML = this.formatMessage(aiResponse);
                        this.conversationHistory.push({ role: 'assistant', content: aiResponse });
                    }

                } catch (error) {
                    console.error('Error:', error);
                    this.hideTyping();
                    
                    // Remove the failed user message from history
                    if (this.conversationHistory.length > 0) {
                        this.conversationHistory.pop();
                    }
                    
                    if (error.message.includes('Failed to fetch')) {
                        this.showError('Unable to connect to the AI service. Please check your internet connection and try again.');
                    } else if (error.message.includes('400')) {
                        this.showError('Invalid request format. Please try again.');
                    } else {
                        this.showError('Something went wrong. Please try again later.');
                    }
                } finally {
                    this.messageInput.disabled = false;
                    this.sendButton.disabled = false;
                    this.sendButton.innerHTML = '<span>Send</span>';
                    this.messageInput.focus();
                }
            }

            // Method to clear conversation history if needed
            clearConversation() {
                this.conversationHistory = [];
                const messages = this.messagesContainer.querySelectorAll('.message');
                messages.forEach(msg => msg.remove());
                
                // Re-add welcome message
                const welcomeDiv = document.createElement('div');
                welcomeDiv.className = 'welcome-message';
                welcomeDiv.innerHTML = `
                    <p>Hi! I'm Nehal's AI assistant. I can answer questions about her experience, projects, and skills.</p>
                    <p>Try asking about her work on RoboDoc, AI projects, or biotechnology research!</p>
                `;
                this.messagesContainer.appendChild(welcomeDiv);
                
                // Re-add sample questions
                const sampleDiv = document.createElement('div');
                sampleDiv.className = 'sample-questions';
                sampleDiv.innerHTML = `
                    <div class="sample-question" onclick="askQuestion('Tell me about RoboDoc project')">
                        Tell me about RoboDoc project
                    </div>
                    <div class="sample-question" onclick="askQuestion('What are Nehal\\'s main technical skills?')">
                        What are Nehal's main technical skills?
                    </div>
                    <div class="sample-question" onclick="askQuestion('What awards has she won?')">
                        What awards has she won?
                    </div>
                    <div class="sample-question" onclick="askQuestion('Tell me about her AI and IoT projects')">
                        Tell me about her AI and IoT projects
                    </div>
                `;
                this.messagesContainer.appendChild(sampleDiv);
            }
        }

        // Navigation functionality
        function toggleMobileMenu() {
            const navLinks = document.getElementById('navLinks');
            const hamburger = document.getElementById('hamburger');
            
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        }

        function askQuestion(question) {
            const chatbot = window.chatbot;
            if (chatbot) {
                chatbot.messageInput.value = question;
                chatbot.sendMessage();
            }
        }

        function sendMessage() {
            const chatbot = window.chatbot;
            if (chatbot) {
                chatbot.sendMessage();
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            window.chatbot = new PortfolioChatbot();

            const hamburger = document.getElementById('hamburger');
            if (hamburger) {
                hamburger.addEventListener('click', toggleMobileMenu);
            }

            document.addEventListener('click', (e) => {
                const navLinks = document.getElementById('navLinks');
                const hamburger = document.getElementById('hamburger');
                
                if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });