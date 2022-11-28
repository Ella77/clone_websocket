// Put all your frontend code here.
// Put all your frontend code here.
const socket = new WebSocket(`wss://${window.location.host}`);

const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
socket.addEventListener("open", () => {
  console.log("Connected to Server");
});

socket.addEventListener("message", (message) => {
  console.log("Just got this : ", message.data, "from the Server");
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server");
});

// setTimeout(() => {
//   socket.send("hello from the browser");
// }, 10000);

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  console.log(input.value);
  // socket.send({
  //   type: "message",
  //   payload: input.value
  // });
  const li = document.createElement("li");
  li.innerText = `You : ${input.value}`;
  messageList.append(li);
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  // socket.send({
  //   type: "nickname",
  //   payload: input.value
  // });
  socket.send(makeMessage("nickname", input.value));

  input.value = "";
}
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
