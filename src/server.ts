import { Request, Response } from 'express-serve-static-core';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as https from 'https';
import { readFileSync } from 'fs';
import { config } from './app/shared/config';

const express = require('express');

const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.svg',
    '.woff2',
    '.woff',
    '.ttf',
];

class Server {
    private readonly options = {
        key: readFileSync(config.PRIVATE_KEY_PATH),
        cert: readFileSync(config.CERT_PATH),
    };

    public app: any;
    private port = config.CLIENT_PORT;

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        this.app = express();

        // Health check for Load Balancer
        this.app.get('/health', (req, res) => res.status(200).send('alive'));

        this.app.get('*', (req: Request, res: Response) => {
            if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
                res.sendFile(path.resolve(`./dist/serverRegisterClient/${req.url}`));
            } else {
                res.sendFile(path.resolve('./dist/serverRegisterClient/index.html'));
            }
        });

        https.createServer(this.options, this.app).listen(this.port, () => {
            console.log(`Spike client is running on port ${this.port} as https.`);
        });
    }
}

const server = Server.bootstrap();
export default server.app;
