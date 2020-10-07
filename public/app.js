const form = document.querySelector('form');
const messageBox = document.querySelector('#message-box');
const counter = document.querySelector('#counter');
const submitBtn = document.querySelector('#submitBtn');
document.querySelector('#init-message-time').textContent = generateTimeStamp();

const startLiking = async (event) => {
  event.preventDefault();
  const userName = form.querySelector('#userName').value;
  const password = form.querySelector('#password').value;
  const hashtag = form.querySelector('#hashtag').value;
  const reqBody = { userName, password, hashtag };
  counter.textContent = 0;
  submitBtn.disabled = true;
  submitBtn.classList.add('opacity-50');
  const request = await fetch('/set-cookies', {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: {
      'content-type': 'application/json',
    },
  });

  if (request.status !== 200) {
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-50');
    return logMessage('<p>You might have empty fields or given</p>');
  }

  const eventSource = new EventSource('/like');
  eventSource.addEventListener('message', (e) => {
    console.log(e.data);
    if (e.data === 'stop') {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-50');
      return eventSource.close();
    }

    if (e.data.includes('[')) {
      const [url, count] = JSON.parse(e.data);
      counter.textContent = count;
      const message = `<p>This <a href="${url}" class="text-blue-500">photo</a> was just liked!</p>`;
      logMessage(message);
    } else if (e.data.includes('alreadyLikedStreak')) {
      const streakCount = parseInt(e.data.split(':')[1]);
      if (streakCount >= 6) {
        const message = `<p>Session ended streak reached limit!</p>`;
        logMessage(message);
      } else {
        const message = `<p>Photo already liked - streak: ${streakCount}</p>`;
        logMessage(message);
      }
    } else if (e.data.includes('finalCount')) {
      const finalCount = e.data.split(':')[1];
      const message = `No photos left - final count: ${finalCount}`;
      logMessage(message);
    } else {
      logMessage(e.data);
    }
  });
};

form.addEventListener('submit', startLiking);

function logMessage(message) {
  const log = `<div class="flex items-center py-2 border-b border-1 border-gray-400"><span class="text-gray-500 text-sm italic mr-3">${generateTimeStamp()}</span>${message}</div>`;
  document.querySelector('#console').insertAdjacentHTML('afterbegin', log);
}

function generateTimeStamp() {
  const date = new Date();
  const hrs = date.getHours();
  const mins = date.getMinutes();
  let secs = date.getSeconds();

  if (secs < 10) {
    secs = `0${secs}`;
  }
  return `${hrs}:${mins}:${secs}`;
}
