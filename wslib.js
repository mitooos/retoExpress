const WebSocket = require("ws");
const { Message } = require("./models/message");

const clients = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", async (message) => {
      let parsedMessage = JSON.parse(message);
      parsedMessage.ts = Date.now();
      await Message.create(parsedMessage);
      sendMessages();
    });
  });
};

const sendMessages = async () => {
  let messages = await Message.findAll();
  clients.forEach((client) => client.send(JSON.stringify(messages)));
};

module.exports.sendMessages = sendMessages;

exports.wsConnection = wsConnection;
