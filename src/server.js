import http from "http";
import WebSocket from "ws";
import express from "express";
import { parse } from "path";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// function handleConnection(socket) {
//   console.log(socket);
// }

const sockets = [];
wss.on("connection", (socket) => {
  // console.log(socket);
  sockets.push(socket);
  socket["nickname"] = "Anon";
  socket.send("hello!!!");
  socket.on("close", () => {
    console.log("disconnected from browser");
  });
  socket.on("message", (msg) => {
    console.log("new message", msg);
    const parsed = JSON.parse(msg);
    switch (parsed.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          //send everyone except me
          aSocket.send(`${socket.nickname}: ${parsed.payload}`)
        );
      case "nickname":
        socket["nickname"] = parsed.payload;
    }
    // if (parsed.type === "new_message") {
    //   sockets.forEach((aSocket) => aSocket.send(parsed.payload));
    // } else if (parsed.type === "nickname") {
    //   console.log(parsed.payload);
    // }
  });
});

// Put all your backend code here.

server.listen(process.env.PORT, handleListen);
