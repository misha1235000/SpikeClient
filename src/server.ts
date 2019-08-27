// server

import { config } from './app/shared/config';

// Must run that at first for configuration
import * as apm from 'elastic-apm-node';
apm.start({
    serviceName: config.ELASTIC_APM_SERVICE_NAME,
    serverUrl: config.ELASTIC_APM_SERVER_URL,
    secretToken: config.ELASTIC_APM_SECRET_TOKEN || '',
    active: config.ELASTIC_APM_ACTIVE === 'true' || false,
});

import { Request, Response } from 'express-serve-static-core';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as https from 'https';
import { readFileSync } from 'fs';

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
