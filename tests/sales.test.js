const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const { Sales } = require('../src/models/Sales');
const { Entity } = require('../src/models/Entity'); 
const { Account } = require('../src/models/Account'); 
const salesRouter = require('../src/controllers/SalesRouter');

// Create a valid ObjectId for testing
const mockUserId = new mongoose.Types.ObjectId();

// Mocking validateJwt middleware
jest.mock('../src/utils/authHelpers', () => ({
  validateJwt: (req, res, next) => {
    req.userId = mockUserId;
    next();
  }
}));

const app = express();
app.use(express.json());

app.use('/api/sales', salesRouter);

describe('Sales API', () => {
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

  let saleId;

  it('should create a new sale', async () => {
    const response = await request(app)
      .post('/api/sales')
      .send({
        customer: new mongoose.Types.ObjectId(),
        date: '2024-08-11',
        dueDate: '2024-08-18',
        description: 'Test Sale',
        category: new mongoose.Types.ObjectId(),
        amount: 100.0,
        tax: '10%',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toHaveProperty('_id');
    expect(response.body.result).toHaveProperty('description', 'Test Sale');

    saleId = response.body.result._id;
    console.log('Created saleId:', saleId);
  });

  it('should fetch all sales', async () => {
    const response = await request(app).get('/api/sales');
    console.log('Fetched sales:', response.body.result);

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBeInstanceOf(Array);
    expect(response.body.result.length).toBeGreaterThan(0);
  });

  it('should fetch a sale by ID', async () => {
    console.log('Fetching sale by ID:', saleId);
    const response = await request(app).get(`/api/sales/${saleId}`);
    console.log('Fetched sale by ID:', response.body.result);

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toHaveProperty('_id', saleId);
  });

  it('should return 404 for non-existing sale by ID', async () => {
    const nonExistingId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/sales/${nonExistingId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Sale record not found');
  });
});
