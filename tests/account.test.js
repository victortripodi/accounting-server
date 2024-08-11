const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const { Account } = require('../src/models/Account');
const accountRouter = require('../src/controllers/AccountRouter');

const app = express();
app.use(express.json());

app.use('/api/accounts', accountRouter);

describe('Account API', () => {
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

  let accountId;

  it('should create a new account for testing', async () => {
    const account = new Account({
      code: '1001',
      name: 'Cash',
      type: 'Asset',
    });

    const savedAccount = await account.save();
    accountId = savedAccount._id;

    expect(savedAccount).toHaveProperty('_id');
    expect(savedAccount).toHaveProperty('name', 'Cash');
  });

  it('should fetch all accounts', async () => {
    const response = await request(app).get('/api/accounts');

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBeInstanceOf(Array);
    expect(response.body.result.length).toBeGreaterThan(0);
  });

  it('should fetch an account by ID', async () => {
    const response = await request(app).get(`/api/accounts/findById/${accountId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toHaveProperty('_id', accountId.toString());
    expect(response.body.result).toHaveProperty('name', 'Cash');
  });

  it('should return 404 for non-existing account by ID', async () => {
    const nonExistingId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/accounts/findById/${nonExistingId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Account not found');
  });

  it('should fetch accounts by type', async () => {
    const response = await request(app).get(`/api/accounts/findByType/Asset`);

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBeInstanceOf(Array);
    expect(response.body.result.length).toBeGreaterThan(0);
    expect(response.body.result[0]).toHaveProperty('type', 'Asset');
  });

  it('should return 404 if no accounts are found for a type', async () => {
    const response = await request(app).get(`/api/accounts/findByType/Liability`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'No accounts found for this type');
  });
});
