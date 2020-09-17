const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = (msg) => {
  renderMessages(JSON.parse(msg.data));
};

const formatTimeStamp = (timespamp) => {
  return new Date(timespamp);
};

const renderMessages = (data) => {
  const html = data
    .map(
      (item) =>
        `<div class="message">
        <p>Message:${item.message}</p><p>Author: ${
          item.author
        }</p><p>Date: ${formatTimeStamp(item.ts)}</p>
        </div>`
    )
    .join(" ");
  document.getElementById("messages").innerHTML = html;
};

const handleSubmit = (evt) => {
  evt.preventDefault();
  const message = document.getElementById("message");
  const author = document.getElementById("author");
  ws.send(
    JSON.stringify({
      message: message.value,
      author: author.value,
    })
  );
  message.value = "";
  author.value = "";
};

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);
