if (!userData) {
  window.location = '/sign-in';
}
const user = JSON.parse(userData);
const socket = io(apiBaseUrl);
let messages = [];
let users = [];
let currentUserToChat = null;
const inputArea = document.getElementById('input');
const selectMessage = document.getElementById('select');
const messagesArea = document.getElementById('messages');
const messagesInput = inputArea.querySelector('#message');
const sendButton = inputArea.querySelector('#send');
const messageList = document.getElementById('messages');
const exit = document.getElementById("exit");
const cUser = document.getElementById("currentUser");
cUser.textContent = user.name;

exit.onclick = () => {
  localStorage.setItem('user', '');
  window.location = '/sign-in';
}

const createMessage = (message) => `
<li class="d-flex justify-content-between">                
  <div>
    <div class="header">
      <strong class="primary-font">${message.from.name}</strong>
    </div>
    <p class="mb-0">
      ${message.text}
    </p>
    <br/>
  </div>
</li>
`
const createUser = (user) => `
<li class="active grey lighten-3 p-2">
  <a class="d-flex justify-content-between" href="javascript:void(0)" data-user="${user.id}">
    <div>
      <strong>${user.name}</strong>
    </div>
  <a/>
  <br/>
</li>
`;

const openUserChat = (user) => {
  currentUserToChat = user;
  selectMessage.hidden = true;
  inputArea.hidden = false;
  messagesArea.hidden = false;
  messagesInput.value = '';
  messageList.hidden = false;
  messagesInput.placeholder = 'Type message for '+currentUserToChat.name;
  getMessages();
};

const addMessage = (message) => {
  message.from = message.fromId === user.id ? user : currentUserToChat;
  message.to = message.toId === user.id ? user : currentUserToChat;
  messageList.prepend(document.createRange().createContextualFragment(createMessage(message)).querySelector('*'))
};

sendButton.onclick = async () => {
  const value = messagesInput.value;
  messagesInput.value = '';
  if (!value) {
    return alert("Can't send empty message");
  }
  const data = { text: value, fromId: user.id, toId: currentUserToChat.id };
  const response = await fetch(apiBaseUrl + '/api/messages/create', {
    method: 'POST',
    body: JSON.stringify(data),
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(res => res.json());

  if (response.error) {
    alert("Couldn't send message");
  } else {
    addMessage(response.result);
  }
}

(async () => {
  users = await fetch(apiBaseUrl + '/api/users/all').then(res => res.json());
  const userList = document.getElementById('user-list');
  if (users.length) {
    userList.innerHTML = "";
    users.forEach(u => {
      if (u.id !== user.id) {
        const userHTML = createUser(u);
        const userNode = document.createRange().createContextualFragment(userHTML).querySelector('*');
        userNode.onclick = () => openUserChat(u);
        userList.appendChild(userNode);
      }
    })
  }
})();

const printMessages = () => {
  messageList.innerHTML = '';
  const msgs = (messages || []);
  const conversation = msgs.filter(m => (m.toId === user.id && m.fromId === currentUserToChat.id) || (m.fromId === user.id && m.toId === currentUserToChat.id));
  conversation.forEach(m => addMessage(m));
};

const getMessages = async () => {
  messages = await fetch(apiBaseUrl + '/api/messages/all').then(res => res.json());
  if (currentUserToChat) {
    printMessages();
  }
};

socket.on('message', msg => {
  if (msg.fromId !== user.id) {
    if (!currentUserToChat || msg.fromId !== currentUserToChat.id) {
      alert((((users.find(u => u.id === msg.fromId)) || {}).name || 'unknown')+  ': '+msg.text);
    }
    getMessages();
  }
});

getMessages();
