const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let broadcaster;
const listeners = new Set();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'broadcaster') {
      broadcaster = ws;
      ws.isBroadcaster = true;
    } else if (parsedMessage.type === 'listener') {
      listeners.add(ws);
      ws.isListener = true;
      if (broadcaster) {
        broadcaster.send(JSON.stringify({ type: 'newListener' }));
      }
    } else if (parsedMessage.type === 'offer' && ws.isListener) {
      if (broadcaster) {
        broadcaster.send(JSON.stringify({ type: 'offer', offer: parsedMessage.offer }));
      }
    } else if (parsedMessage.type === 'answer' && ws.isBroadcaster) {
      listeners.forEach(listener => {
        if (listener.readyState === WebSocket.OPEN) {
          listener.send(JSON.stringify({ type: 'answer', answer: parsedMessage.answer }));
        }
      });
    } else if (parsedMessage.type === 'candidate') {
      if (ws.isBroadcaster) {
        listeners.forEach(listener => {
          if (listener.readyState === WebSocket.OPEN) {
            listener.send(JSON.stringify({ type: 'candidate', candidate: parsedMessage.candidate }));
          }
        });
      } else if (ws.isListener && broadcaster) {
        broadcaster.send(JSON.stringify({ type: 'candidate', candidate: parsedMessage.candidate }));
      }
    }
  });

  ws.on('close', () => {
    if (ws.isBroadcaster) {
      broadcaster = null;
      listeners.forEach(listener => listener.send(JSON.stringify({ type: 'broadcasterDisconnected' })));
    } else if (ws.isListener) {
      listeners.delete(ws);
    }
  });
});

server.listen(4000, () => {
  console.log('Relay server is running on port 4000');
});