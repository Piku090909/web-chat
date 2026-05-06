class ChatApp {
  constructor() {
    this.ws = null;
    this.username = 'alexpiku';
    this.connect();
    this.initElements();
    this.initEvents();
  }

  initElements() {
    this.messagesEl = document.getElementById('messages');
    this.usernameEl = document.getElementById('username');
    this.messageEl = document.getElementById('message');
  }

  initEvents() {
    this.messageEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  connect() {
    this.ws = new WebSocket(`wss://${window.location.host}/api/chat`);
    
    this.ws.onopen = () => {
      console.log('✅ Connected to chat!');
      this.addSystemMessage('Connected to live chat!');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.addMessage(data.username, data.text, data.isOwn);
    };

    this.ws.onclose = () => {
      this.addSystemMessage('Disconnected. Reconnecting...');
      setTimeout(() => this.connect(), 2000);
    };
  }

  addMessage(username, text, isOwn = false) {
    const div = document.createElement('div');
    div.className = `message ${isOwn ? 'own' : 'other'}`;
    div.innerHTML = `<strong>${username}:</strong> ${this.escapeHtml(text)}`;
    this.messagesEl.appendChild(div);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  addSystemMessage(text) {
    const div = document.createElement('div');
    div.className = 'message other';
    div.style.background = '#ffc107';
    div.style.fontStyle = 'italic';
    div.innerHTML = text;
    this.messagesEl.appendChild(div);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  sendMessage() {
    const username = this.usernameEl.value.trim() || 'Anonymous';
    const text = this.messageEl.value.trim();
    
    if (text && this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = { username, text, isOwn: true };
      this.ws.send(JSON.stringify(message));
      this.messageEl.value = '';
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

new ChatApp();

function sendMessage() {
  document.querySelector('chat-app')?.sendMessage(); // Legacy support
  }
