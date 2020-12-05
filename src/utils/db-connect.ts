import {Client} from 'pg';
import config from 'config';

const dbConnect = async (): Promise<Client> => {
    try {
        const dbConfig: Client = config.get('db');
        const {user, host, database, password, port} = dbConfig;

        const db = new Client({
            user,
            host,
            database,
            password,
            port
        })

        await db.connect();
        return db;
    } catch(e) {
        throw new Error(e);
    }
}

export default dbConnect;