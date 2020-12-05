import http from 'http';
import express from 'express';
import config from 'config';
import user from './route/user';
import note from './route/note';

const app: any = express();
const port: number = config.get('port');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(user);
app.use(note);

const start = async (): Promise<void> => {
    try {
        const server = http.createServer(app);

        server.on('error', (e: Error) => {
            console.log(`Start server error: ${e.message}`)
        });

        server.listen(port, () => {          
            console.log(`Start server on ${port}`);
        });
    } catch(e) {
        console.log(`start server error: ${e.message}`);
        process.exit();
    }
}

start();