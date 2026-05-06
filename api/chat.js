import { WebSocketServer } from 'ws';

let wss;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // WebSocket upgrade
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (!wss) {
      wss = new WebSocketServer({ noServer: true });
      
      req.socket.server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      });
      
      wss.on('connection', (ws) => {
        console.log('User connected');
        
        ws.on('message', (message) => {
          wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
              client.send(message);
            }
          });
        });
        
        ws.on('close', () => console.log('User disconnected'));
      });
    }
    
    res.end();
  } else {
    res.status(405).end();
  }
}
