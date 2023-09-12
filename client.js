document.addEventListener('DOMContentLoaded', () => {
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');
  const messageList = document.getElementById('messageList');

  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message) {
      await sendMessage(message);
      messageInput.value = '';
      await refreshMessages();
    }
  });

  async function sendMessage(message) {
    try {
      await fetch('/addMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `message=${encodeURIComponent(message)}`,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async function refreshMessages() {
    try {
      const response = await fetch('/');
      const html = await response.text();
      messageList.innerHTML = extractMessagesFromHTML(html);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  function extractMessagesFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const messageItems = doc.querySelectorAll('#messageList li');
    return Array.from(messageItems).map((item) => item.textContent);
  }

  // Initial message load
  refreshMessages();
});
