export default class NoteQuery {

    public static async getNote(db: any, noteId: number): Promise<any[]> {
        try {
            const note: any = await db.query(`
                SELECT * FROM note
                WHERE id = ${noteId}
            `)

            return note.rows[0];
        } catch(e) {
            throw new Error(e);
        }
    }

    public static async createNote(db: any, user: string, title: string, content: string): Promise<number> {
        try {
            const note: any = await db.query(`
                INSERT INTO note
                (owner, content, created, title)
                VALUES ('${user}', '${content}', to_timestamp(${Date.now() / 1000})::timestamp, '${title}')
                RETURNING id
            `)

            return note.rows[0].id;
        } catch(e) {
            throw new Error(e);
        }
    }

    public static async updateNote(db: any, noteId: number, title: string, content: string): Promise<void> {
        try {
            await db.query(`
                UPDATE note
                SET (content, updated, title) = ('${content}', to_timestamp(${Date.now() / 1000})::timestamp, '${title}')
                WHERE id = ${noteId}
            `)
        } catch(e) {
            throw new Error(e);
        }
    }

    public static async deleteNote(db: any, noteId: number): Promise<void> {
        try {
            await db.query(`
                DELETE FROM note
                WHERE id = ${noteId}
            `)
        } catch(e) {
            throw new Error(e);
        }
    }

    public static async getNoteList(db: any, user: string): Promise<any[]> {
        try {
            const list: any = await db.query(`
                SELECT * FROM note
                WHERE owner = '${user}'
                ORDER BY created
            `)

            return list.rows;
        } catch(e) {
            throw new Error(e);
        }
    }

}