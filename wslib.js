const WebSocket = require("ws");
const Persistence = require("./persistence/persistence");

const clients = [];
const messagesCollection = "messages";

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", async (message) => {
      Persistence.insertItem(message, messagesCollection);
      sendMessages();
    });
  });

  const sendMessages = async () => {
    let messages = await Persistence.getAllItems(messagesCollection);
    clients.forEach((client) => client.send(JSON.stringify(messages)));
  };
};

exports.wsConnection = wsConnection;
