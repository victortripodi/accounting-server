const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const { Journal } = require('../src/models/Journal');
const { JournalLine } = require('../src/models/JournalLine');
const { Account } = require('../src/models/Account');
const journalRouter = require('../src/controllers/JournalRouter');

const app = express();
app.use(express.json());

jest.mock('../src/utils/authHelpers', () => ({
  validateJwt: (req, res, next) => {
    req.userId = new mongoose.Types.ObjectId(); // Generate mock userId for each test case
    next();
  }
}));

describe('Journal API', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/vtax_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  let journalId;
  let accountId;

  beforeEach(async () => {
    const account = new Account({ code: '1001', name: 'Cash', type: 'Asset' });
    const savedAccount = await account.save();
    accountId = savedAccount._id;

    const journal = new Journal({ title: 'Test Journal', date: '2024-08-11', user: new mongoose.Types.ObjectId() });
    const savedJournal = await journal.save();
    journalId = savedJournal._id;

    const journalLine = new JournalLine({ journal: journalId, account: accountId, amount: 100.0, entryType: 'DR' });
    await journalLine.save();
  });

  afterEach(async () => {
    await JournalLine.deleteMany({});
    await Journal.deleteMany({});
    await Account.deleteMany({});
  });

  it('should fetch all journals', async () => {
    const response = await request(app).get('/api/journals');
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBeInstanceOf(Array);
    expect(response.body.result.length).toBeGreaterThan(0);
  });

  it('should fetch a journal by ID with lines', async () => {
    const response = await request(app).get(`/api/journals/${journalId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toHaveProperty('title', 'Test Journal');
    expect(response.body.result.lines).toBeInstanceOf(Array);
    expect(response.body.result.lines.length).toBeGreaterThan(0);
    expect(response.body.result.lines[0]).toHaveProperty('amount', 100.0);
  });

  it('should create a new journal', async () => {
    const response = await request(app)
      .post('/api/journals')
      .send({
        date: '2024-08-11',
        title: 'New Test Journal',
        lines: [
          { accountId: accountId, amount: 200.0, type: 'CR' }
        ]
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toHaveProperty('_id');
    expect(response.body.result).toHaveProperty('title', 'New Test Journal');

    const createdJournal = await Journal.findById(response.body.result._id);
    expect(createdJournal).not.toBeNull();

    const createdLines = await JournalLine.find({ journal: createdJournal._id });
    expect(createdLines.length).toBe(1);
    expect(createdLines[0]).toHaveProperty('amount', 200.0);
  });

  it('should delete a journal by ID', async () => {
    const response = await request(app).delete(`/api/journals/${journalId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Journal line deleted successfully');

    const deletedJournal = await Journal.findById(journalId);
    expect(deletedJournal).toBeNull();

    const associatedLines = await JournalLine.find({ journal: journalId });
    expect(associatedLines.length).toBe(0);
  });

  it('should return 404 for non-existing journal by ID', async () => {
    const nonExistingId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/journals/${nonExistingId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Journal line not found');
  });
});
