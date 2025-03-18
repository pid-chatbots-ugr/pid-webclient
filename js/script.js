// Asignar eventos para enviar mensaje con el botón o presionando "Enter"
document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Función para enviar el mensaje
function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  if (message === '') return;

  // Añadir mensaje saliente al chat
  addMessage(message, 'outgoing');
  input.value = '';

  // Agregar indicador de "typing" mientras se espera la respuesta
  const typingIndicator = addTypingIndicator();

  //data = {"user":"usuario","message":message,"metadata":{}}
  // Petición REST POST al backend (reemplaza la URL y lógica según tu servicio)
  fetch('http://localhost:5000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({user:"user", message: message })
  })
    .then(response => response.json())
    .then(data => {
      // Elimina el indicador de typing y muestra el mensaje entrante
      removeTypingIndicator(typingIndicator);
      addMessage(data.response, 'incoming');
    })
    .catch(error => {
      removeTypingIndicator(typingIndicator);
      console.error('Error:', error);
      addMessage('Error al comunicarse con el servidor.', 'incoming');
    });
}

// Función para agregar mensajes al chat
function addMessage(text, type) {
  const chatMessages = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message', type);

  const messageText = document.createElement('div');
  messageText.classList.add('message-text');
  messageText.textContent = text;

  messageDiv.appendChild(messageText);
  chatMessages.appendChild(messageDiv);

  // Auto-scroll al último mensaje
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función para agregar el indicador de typing
function addTypingIndicator() {
  const chatMessages = document.getElementById('chatMessages');
  const typingDiv = document.createElement('div');
  typingDiv.classList.add('chat-message', 'incoming', 'typing');

  const indicator = document.createElement('div');
  indicator.classList.add('message-text');
  // Agregamos tres puntos animados
  indicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';

  typingDiv.appendChild(indicator);
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return typingDiv;
}

// Función para eliminar el indicador de typing
function removeTypingIndicator(indicator) {
  if (indicator) {
    indicator.remove();
  }
}
