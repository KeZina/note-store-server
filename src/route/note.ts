import express from 'express';
import dbConnect from '../utils/db-connect';
import checkToken from '../utils/check-token';
import NoteQuery from '../query/note-query';

const router: any = express.Router();

router.post('/note/get-list', async (req: Request, res: any): Promise<void> => {
    const request: any = req.body;
    const {token, name} = request;
    let db: any;

    try {   
        await checkToken(token, name);
        db = await dbConnect();
       
        const list: any[] = await NoteQuery.getNoteList(db, name);

        res.json({
            list,
            message: `Note was created`,
            status: 1,
        })
    } catch(e) {
        const err = {message: e.message, stack: e.stack};

        res.json({
            message: err,
            status: 0
        })
    } finally {
        db && db.end();
    }
})

router.get('/note/get-note', async (req: Request, res: any): Promise<void> => {
    const request: any = req.headers;
    const {note} = request;
    let db: any;

    try {   
        db = await dbConnect();
        const noteData: any = await NoteQuery.getNote(db, note);

        res.json({
            noteData,
            message: `Received note`,
            status: 1,
        })
    } catch(e) {
        const err = {message: e.message, stack: e.stack};

        res.json({
            message: err,
            status: 0
        })
    } finally {
        db && db.end();
    }
})

router.post('/note/note-create', async (req: Request, res: any): Promise<void> => {
    const request: any = req.body;
    const {token, name, title, content} = request;
    let db: any;

    try {   
        await checkToken(token, name);
        db = await dbConnect();

        await NoteQuery.createNote(db, name, title, content);

        res.json({
            message: `Note was created`,
            status: 1,
        })
    } catch(e) {
        const err = {message: e.message, stack: e.stack};

        res.json({
            message: err,
            status: 0
        })
    } finally {
        db && db.end();
    }
})

router.post('/note/note-update', async (req: Request, res: any): Promise<void> => {
    const request: any = req.body;
    const {token, name, noteId, title, content} = request;
    let db: any;

    try {   
        await checkToken(token, name);
        db = await dbConnect();
        await NoteQuery.updateNote(db, noteId, title, content);

        res.json({
            message: `Note was created`,
            status: 1,
        })
    } catch(e) {
        const err = {message: e.message, stack: e.stack};

        res.json({
            message: err,
            status: 0
        })
    } finally {
        db && db.end();
    }
})

router.post('/note/note-delete', async (req: Request, res: any): Promise<void> => {
    const request: any = req.body;
    const {token, name, noteId} = request;
    let db: any;

    try {   
        await checkToken(token, name);
        db = await dbConnect();
       
        await NoteQuery.deleteNote(db, noteId);
        const list: any[] = await NoteQuery.getNoteList(db, name);

        res.json({
            list,
            message: `Note was created`,
            status: 1,
        })
    } catch(e) {
        const err = {message: e.message, stack: e.stack};

        res.json({
            message: err,
            status: 0
        })
    } finally {
        db && db.end();
    }
})

export default router;