import express from 'express';
import cors from 'cors';
import multer, {Multer} from 'multer';
import path from 'path';

import ServerManager from './ServerManager';
import {ServerStatus} from './ServerStatus';

const serverManager = (async () => {
  return new ServerManager();
})();

const app: express.Express = express();
const port: Number = 3000;
const upload: Multer = multer({dest: './temp/'});

app.use(cors());

app.get('/server-status', (_, response) => {
  console.log('⚠️ 📋 Client request: status of the servers...');
  serverManager.then((manager: ServerManager) => {
    const status: ServerStatus[] = manager.getServersStatus();
    response.json(status);
    console.log('☑️ 📋 Client request: status of the servers fulfilled!');
  });
});

app.get('/server-status/add-server', (_, response) => {
  console.log('⚠️ 🗄️ Client request: add new server...');
  serverManager.then((serverManager) => {
  console.log('Creating new server...');
  const error: Error | void = serverManager.createNewServer();
  error ? console.log(error.message) : console.log('☑️ 🗄️ Client request: added new server!');
  response.status(200);
  });
});

app.get('/server-status/restart-server/', (request, _) => {
  console.log(`⚠️ 🗄️ Client request: restart server ${request.query.server}...`);
  serverManager.then((serverManager) => {
    if (request.query.server) {
      serverManager.restartServer(request.query.server.toString());
    }
    console.log('☑️ 🗄️ Client request: server restarted!');
  });
});

app.post('/send-image', upload.single('image'), (request, response) => {
  serverManager.then((serverManager) => {
    if (request.file) {
      serverManager.sendImageToServer(() => {
        console.log('⚠️ 🖼️ Sending image with quote to client...');
        console.log(`Image path: ${path.resolve(__dirname, '../temp/temp')}`);
        response.sendFile(path.resolve(__dirname, '../temp/temp'));
        serverManager.clearTemp();
      });
    } else {
      response.status(200);
    }
  });
});

app.listen(port, () => {
  console.log('====================✔️✔️====================');
  console.log(`Middleware started at http://localhost:${port}`);
  console.log('============================================');
  console.log();
});
