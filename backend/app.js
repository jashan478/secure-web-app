const express = require('express');
const { v4: uuidv4 } = require('uuid');

const cors = require('cors');

const users = require('./data/users.json');
const facts = require('./data/chucknorris.json');

const port = 3333;

const sessions = {};

const createMiddleware = (app) => {
    app.use(express.json());
    app.use(cors());

    app.use((req, res, next) => {
        console.info(`Request received: ${req.method} ${req.path}`);

        next();
    });

    app.use(['/fact', '/logout'], (req, res, next) => {
        const authHeaderValue = req.header('Authorization');

        if (!authHeaderValue) {
            res.status(401);
            res.json({ message: 'Authorization header is missing.' });
            return;
        }

        const token = authHeaderValue.replace('Bearer ', '');

        if (token in sessions) {
            next();
        } else {
            res.status(401);
            res.json({ message: 'Authorization token is invalid.' });
        }
    });
}

const createRoutes = (app) => {
    app.post('/login', (req, res) => {

        const { username, password } = req.body;

        if (!username || !password) {
            res.status(401);
            res.json({ message: 'The username or password is invalid.' });
            return;
        }

        let found = false;

        for (const user of users) {
            if (user.username === username && user.password === password) {
                found = user;
                break;
            }
        }

        if (found) {
            const uuid = uuidv4();

            sessions[uuid] = found;

            res.status(200);
            res.json({
                message: 'The username and password is correct.',
                uuid
            });
        } else {
            res.status(401);
            res.json({ message: 'The username or password is invalid.' });
        }
    });

    app.get('/fact', (req, res) => {
        const max = facts.length - 1;

        const index = Math.floor(Math.random() * max) + 1;

        res.status(200);
        res.json({ fact: facts[index] });
    });

    app.post('/logout', (req, res) => {
        const token = req.header('Authorization').replace('Bearer ', '');

        delete sessions[token];

        res.status(200);
        res.json({ message: 'You have been logged out.' });
    });
}

const start = () => {
    const app = express();

    createMiddleware(app);
    createRoutes(app);

    app.listen(port, () => {
        console.log(`API is running on http://localhost:${port}`);
    });
}

start();