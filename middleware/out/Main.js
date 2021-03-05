"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const ServerManager_1 = __importDefault(require("./ServerManager"));
const serverManager = (async () => {
    return new ServerManager_1.default();
})();
const app = express_1.default();
const port = 3000;
const upload = multer_1.default({ dest: './temp/' });
app.use(cors_1.default());
app.get('/server-status', (_, response) => {
    console.log('⚠️ 📋 Client request: status of the servers...');
    serverManager.then((manager) => {
        const status = manager.getServersStatus();
        response.json(status);
        console.log('☑️ 📋 Client request: status of the servers fulfilled!');
    });
});
app.get('/server-status/add-server', (_, response) => {
    console.log('⚠️ 🗄️ Client request: add new server...');
    serverManager.then((serverManager) => {
        console.log('Creating new server...');
        const error = serverManager.createNewServer();
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
                console.log(`Image path: ${path_1.default.resolve(__dirname, '../temp/temp')}`);
                response.sendFile(path_1.default.resolve(__dirname, '../temp/temp'));
                serverManager.clearTemp();
            });
        }
        else {
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
