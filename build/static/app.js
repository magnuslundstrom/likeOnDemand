const form = document.querySelector('form');
const messageBox = document.querySelector('#message-box');
const statuses = [
  'Waiting for work 🤓',
  "I'll be right back, got stuff to do 🌌",
  (count, time) => `Finished liking ${count} posts in ${time} seconds 😲`,
  "Something went wrong. Maybe its your login credientials? Maybe the hashtag does'nt have enough posts? Minimum is 10! 🛑",
];

const startLiking = async (event) => {
  event.preventDefault();
  const userName = form.querySelector('#userName').value;
  const password = form.querySelector('#password').value;
  const hashtag = form.querySelector('#hashtag').value;
  const reqBody = { userName, password, hashtag };
  const timeStart = new Date();
  messageBox.textContent = statuses[1];
  const request = await fetch('/cred', {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: {
      'content-type': 'application/json',
    },
  });

  if (request.status !== 200) {
    messageBox.textContent = statuses[3];
  } else {
    const seconds = Math.round(
      Math.abs(timeStart.getTime() - new Date().getTime()) / 1000
    );
    const { status } = await request.json();
    messageBox.textContent = statuses[2](status, seconds);
  }
};

form.addEventListener('submit', startLiking);
