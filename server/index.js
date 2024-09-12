const express = require("express");
const http = require("http");
const { WebSocketServer} = require("ws");
const { handleMessage } = require('./actions')

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});
  
  wss.on('connection', (ws) => {

    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
      handleMessage(parsedMessage, ws);
    });
  
    

  });
  
const PORT = 8080;

   
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
 