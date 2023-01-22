
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('messages', chatContainer.innerHTML);
  });
  window.addEventListener('load', () => {
    const storedContent = localStorage.getItem('messages');
    if (storedContent) {
      chatContainer.innerHTML = storedContent;
    }
  });



// create a button to reset
const resetButton = document.querySelector('.reset-button');
resetButton.addEventListener('click', () => {
  if (confirm("Are you sure you want to delete all messages?")) {
    chatContainer.innerHTML = '';
    localStorage.removeItem('messages');
  } else {
    // Don't do anything if the user clicks cancel
  }
});






  
  
import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')
const loadingIndicator = document.querySelector('.loading')
let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0;
  
    function typeCharacter() {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeCharacter, 20);
      }
    }
  
    typeCharacter();
  }
  

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    const className = isAi ? 'ai' : 'user';
    const imgSrc = isAi ? bot : user;
    const imgAlt = isAi ? 'bot' : 'user';
    
    return `
      <div class="wrapper ${className}">
        <div class="chat">
          <div class="profile">
            <img src=${imgSrc} alt=${imgAlt} />
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
    `;
  }
 let firstTopic = '';
  let messages=[];
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    messages.push(formData.get('prompt'));
    if (formData.get('prompt') === messages[messages.length-2]) {
    }
  // check if firstTopic is empty
  if (!firstTopic) {
    firstTopic = formData.get('prompt');
}

// check if the current message is the same as the first topic
if (formData.get('prompt') === firstTopic) {
  // do something (e.g. display a message, change the color of the text, etc.)
}
    // user's chatstripe
    const userChatStripe = document.createElement('div');
    userChatStripe.innerHTML = chatStripe(false, formData.get('prompt'));
    
    chatContainer.appendChild(userChatStripe);
  
    // to clear the textarea input 
    form.reset();
  
    // bot's chatstripe
    const uniqueId = generateUniqueId();
    const botChatStripe = document.createElement('div');
    botChatStripe.innerHTML = chatStripe(true, '', uniqueId);
    chatContainer.appendChild(botChatStripe);
    loadingIndicator.style.display = 'flex';
  
    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;
  
    // specific message div 
    const messageDiv = document.getElementById(uniqueId);
  
    // messageDiv.innerHTML = "..."
    await loader(messageDiv);
  
    const request = new XMLHttpRequest();
    request.open('POST', 'http://localhost:5000');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({ prompt: formData.get('prompt') }));
    request.onload = () => {
      clearInterval(loadInterval);
      messageDiv.innerHTML = '';
  
      if (request.status === 200) {
        const data = JSON.parse(request.response);
        const parsedData = data.bot.trim(); // trims any trailing spaces/'\n' 
  
        typeText(messageDiv, parsedData);
      } else {
        messageDiv.innerHTML = 'Something went wrong';
        alert(request.responseText);
      }
    };
  };
  


form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 119) {
        handleSubmit(e)
    }
})

request.addEventListener('load', () => {
    clearInterval(loadInterval);
    messageDiv.innerHTML = '';
  
    if (request.status === 200) {
      const data = JSON.parse(request.response);
      // messageDiv.innerHTML = data.response;
      typeText(messageDiv, data.response);
    } else {
      // messageDiv.innerHTML = 'Error';
      typeText(messageDiv, 'Error');
    }
  
    loadingIndicator.style.display = 'none';
  });
  

function openNewTab() {
    // open a new tab with a specific URL
    window.open('https://www.example.com', '_blank');
  }
  
function moveButton() {
  const button = document.querySelector('.but-new');
  button.style.left = '-20px';
}



function isValidQuestion(input) {
    // Check if the input starts with a question word
    const questionWords = ['what', 'where', 'when', 'why', 'how'];
    const inputWords = input.toLowerCase().split(' ');
    if (!questionWords.includes(inputWords[0])) {
      return false;
    }
  
    // Check if the input is a complete sentence
    const lastChar = input[input.length - 1];
    if (lastChar !== '.' && lastChar !== '!' && lastChar !== '?') {
      return false;
    }
  
    // Check if the input is within the specified length range
    const MIN_LENGTH = 10;
    if (input.length < MIN_LENGTH) {
      return false;
    }
  
    return true;


    let userInputs = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const userInput = formData.get('prompt');
  userInputs.push(userInput);
  // send user input to the server to be stored
  postUserInput(userInput);
});

async function postUserInput(input) {
    try {
        const response = await fetch('/store-user-input', {
            method: 'POST',
            body: JSON.stringify({ input }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

  }
  document.getElementById("add-phrase-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const phrase = document.getElementById("phrase").value;
  const reply = document.getElementById("reply").value;
  phrases[phrase] = reply;
  alert("Phrase added successfully!");
});
