import NoteQuery from "../src/query/note-query";
import UserQuery from "../src/query/user-query";
import dbConnect from "../src/utils/db-connect";
import createHash from "../src/utils/create-hash";
import createJwt from "../src/utils/create-jwt";

describe('check user and not query', () => {
  beforeAll(async () => {
    const db: any = await dbConnect();
    const hash: string = await createHash('test_password');
    const token: string = createJwt('test_user');

    await UserQuery.addUser(db, 'test_user', hash, token)
    await db.end();
  })

  afterAll(async () => {
    const db: any = await dbConnect();
    await UserQuery.deleteUser(db, 'test_user');
    await db.end();
  })
  
  test('create note', async () => {
    const db: any = await dbConnect();

    const noteId = await NoteQuery.createNote(db, 'test_user', 'test_title', 'test_content');
    const noteWithTimestamps: any = await NoteQuery.getNote(db, noteId);

    const note: any = {};
    for (let key in noteWithTimestamps) {
      if (!['updated', 'created', 'id'].includes(key)) note[key] = noteWithTimestamps[key];
    }
    
    expect(note).toEqual({
      owner: 'test_user',
      content: 'test_content',
      title: 'test_title'
    });

    await db.end();
  });

  test('change note', async () => {
    const db: any = await dbConnect();

    const noteId = await NoteQuery.createNote(db, 'test_user', 'test_title', 'test_content');
    await NoteQuery.updateNote(db, noteId, 'updated_title', 'updated_content')
    const noteWithTimestamps: any = await NoteQuery.getNote(db, noteId);

    const note: any = {};
    for (let key in noteWithTimestamps) {
      if (!['updated', 'created', 'id'].includes(key)) note[key] = noteWithTimestamps[key];
    }
    
    expect(note).toEqual({
      owner: 'test_user',
      content: 'updated_content',
      title: 'updated_title'
    });

    await db.end();
  });

  test('delete note', async () => {
    const db: any = await dbConnect();

    const noteId = await NoteQuery.createNote(db, 'test_user', 'test_title', 'test_content');
    await NoteQuery.deleteNote(db, noteId);

    await db.end();
  });

})