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

import { configurePassport } from './passport';
const passport = require('passport');
const cookieParser = require('cookie-parser');
import * as jwt from 'jsonwebtoken';
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
        key: readFileSync(config.PRIVATE_KEY_PATH).toString(),
        cert: readFileSync(config.CERT_PATH),
    };

    public app: any;
    private port = config.CLIENT_PORT;

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        this.app = express();
        configurePassport();
        this.app.use(express.json());
        this.app.use(express.urlencoded({
            extended: false
        }));
        this.app.use(cookieParser());
        const session = require('express-session');
       /* const sessionize = session({
            secret: 'this is a secret key here now',
            resave: false,
            saveUninitialized: true
        });*/
        this.app.use(session({
            secret: 'secretcode',
            resave: false,
            saveUninitialized: true
        }));

        this.app.use(passport.initialize());
        this.app.use(passport.session());

        // Health check for Load Balancer
        this.app.get('/health', (req, res) => res.status(200).send('alive'));

        /* GET home page. */
        this.app.get('/auth/', passport.authenticate('shraga'), (req, res, next) => {
            res.status(200); // .json(req.user);
        });

        /* GET home page. */
        this.app.post('/auth/callback', passport.authenticate('shraga'), async (req, res, next) => {
        // res.send(req.user);
            const token = await jwt.sign({ ...req.user }, this.options.key, {
                algorithm: 'RS256'
            });

            // tslint:disable-next-line:radix
            res.cookie('authorization', token, { maxAge: (parseInt(req.user.exp) * 1000) - Date.now(), httpOnly: false });
            res.redirect('/');
        });

        this.app.use((req, res, next) => {
            if (!req.user) {
                res.redirect('/auth');
            } else {
                next();
            }
        });

        this.app.get('/logout', (req, res) => {
        });

        // Redirect to docs site
        this.app.get('/help', (req, res) => {
	    
            res.redirect('http://' + req.hostname + ':3001');
        });

        this.app.get('*', (req, res) => {
            if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
                res.sendFile(path.resolve(`./dist/SpikeClient/${req.url}`));
            } else {
                res.sendFile(path.resolve('./dist/SpikeClient/index.html'));
            }
        });

        https.createServer(this.options, this.app).listen(this.port, () => {
            console.log(`Spike client is running on port ${this.port} as https.`);
        });
    }
}

const server = Server.bootstrap();
export default server.app;
