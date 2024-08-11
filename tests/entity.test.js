const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const { Entity } = require('../src/models/Entity');
const entityRouter = require('../src/controllers/EntityRouter');

const app = express();
app.use(express.json());

jest.mock('../src/utils/authHelpers', () => ({
  validateJwt: (req, res, next) => {
    req.userId = new mongoose.Types.ObjectId(); // Mock userId for tests
    next();
  }
}));

app.use('/api/entities', entityRouter);

describe('Entity API', () => {
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

  let entityId;

  beforeEach(async () => {
    const entity = new Entity({
      name: 'Test Entity',
      ABN: '12345678901',
      email: 'test@example.com',
      address: '123 Test St',
      postcode: '1234',
      type: 'customer',
      user: new mongoose.Types.ObjectId(),
    });
    const savedEntity = await entity.save();
    entityId = savedEntity._id;
  });

  afterEach(async () => {
    await Entity.deleteMany({});
  });

  it('should fetch all entities', async () => {
    const response = await request(app).get('/api/entities');
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBeInstanceOf(Array);
    expect(response.body.result.length).toBeGreaterThan(0);
  });

  it('should fetch an entity by ID', async () => {
    const response = await request(app).get(`/api/entities/${entityId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toHaveProperty('_id', entityId.toString());
    expect(response.body.result).toHaveProperty('name', 'Test Entity');
  });

  it('should return 404 for non-existing entity by ID', async () => {
    const nonExistingId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/entities/${nonExistingId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Entity not found');
  });

  it('should fetch entities by type', async () => {
    const response = await request(app).get(`/api/entities/findByType/customer`);
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBeInstanceOf(Array);
    expect(response.body.result.length).toBeGreaterThan(0);
    expect(response.body.result[0]).toHaveProperty('type', 'customer');
  });

  it('should return 404 if no entities are found for a type', async () => {
    const response = await request(app).get(`/api/entities/findByType/vendor`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'No Entity found for this type');
  });

  it('should create a new entity', async () => {
    const newEntityData = {
      name: 'New Entity',
      ABN: '09876543210',
      email: 'new@example.com',
      address: '456 New St',
      postcode: '5678',
      type: 'vendor',
    };

    const response = await request(app)
      .post('/api/entities')
      .send(newEntityData);

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toHaveProperty('_id');
    expect(response.body.result).toHaveProperty('name', 'New Entity');

    const createdEntity = await Entity.findById(response.body.result._id);
    expect(createdEntity).not.toBeNull();
    expect(createdEntity).toHaveProperty('name', 'New Entity');
  });

  it('should return 400 for invalid entity creation', async () => {
    const invalidEntityData = {
      name: '',
      ABN: '09876543210',
      email: 'new@example.com',
      address: '456 New St',
      postcode: '5678',
      type: 'vendor',
    };

    const response = await request(app)
      .post('/api/entities')
      .send(invalidEntityData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Error creating entity');
  });
});
