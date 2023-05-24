'use strict';

const { app } = require('../src/server');
const { db } = require('../src/models');
const supertest = require('supertest');

const request = supertest(app);

let TOKEN;

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});


describe('Non-auth Routes', () => {

  test('proof of life', async () => {
    const response = await request.get('/');
    expect(response.status).toEqual(200);
  });
  
  test('404 on bad route', async () => {
    const response = await request.get('/foo');
    expect(response.status).toEqual(404);
  });
  
  test('404 on bad method', async () => {
    const response = await request.post('/');
    expect(response.status).toEqual(404);
  });

  test('/api/v1 food & clothes READ ALL', async () => {
    let response = await request.get('/api/v1/food');
    expect(response.status).toEqual(200);
    response = await request.get('/api/v1/clothes');
    expect(response.status).toEqual(200);
  });

  test('/api/v1 food & clothes CREATE', async () => {
    let response = await request.post('/api/v1/food').send({
      name: 'food',
      calories: '9001',
      type: 'protein',
    });
    expect(response.status).toEqual(201);
    response = await request.post('/api/v1/clothes').send({
      name: 'shirt',
      color: 'black',
      size: 'large',
    });
    expect(response.status).toEqual(201);
  });

  test('/api/v1 food & clothes READ ONE', async () => {
    let response = await request.get('/api/v1/food/1');
    expect(response.status).toEqual(200);
    response = await request.get('/api/v1/clothes/1');
    expect(response.status).toEqual(200);
  });

  test('/api/v1 food & clothes UPDATE', async () => {
    let response = await request.put('/api/v1/food/1').send({
      name: 'food',
      calories: '9001',
      type: 'protein',
    });
    expect(response.status).toEqual(200);
    response = await request.put('/api/v1/clothes/1').send({
      name: 'shirt',
      color: 'black',
      size: 'large',
    });
    expect(response.status).toEqual(200);
  });

  test('/api/v1 food & clothes DELETE', async () => {
    let response = await request.delete('/api/v1/food/1');
    expect(response.status).toEqual(200);
    response = await request.delete('/api/v1/clothes/1');
    expect(response.status).toEqual(200);
  });

});



describe('Auth Routes', () => {

  test('allow for signup', async () => {
    const response = await request.post('/signup').send({
      username: 'Tester', 
      password: 'pass',
      role: 'admin',
    });

    expect(response.status).toEqual(201);
  });

  test('allow for signin', async () => {
    const response = await request.post('/signin').set('Authorization', 'Basic VGVzdGVyOnBhc3M=');

    expect(response.status).toEqual(200);
  });

  test('/api/v2 food & clothes READ ALL', async () => {
    let response = await request.get('/api/v2/food').set('Authorization', 'Basic VGVzdGVyOnBhc3M=');
    expect(response.status).toEqual(200);
    response = await request.get('/api/v2/clothes').set('Authorization', 'Basic VGVzdGVyOnBhc3M=');
    expect(response.status).toEqual(200);
  });

  test('/api/v2 food & clothes CREATE', async () => {
    let response = await request.post('/api/v2/food').send({
      name: 'food',
      calories: '9001',
      type: 'protein',
    }).set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toEqual(201);
    response = await request.post('/api/v2/clothes').send({
      name: 'shirt',
      color: 'black',
      size: 'large',
    }).set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toEqual(201);
  });

  test('/api/v2 food & clothes READ ONE', async () => {
    let response = await request.get('/api/v2/food/1').set('Authorization', 'Basic VGVzdGVyOnBhc3M=');
    expect(response.status).toEqual(200);
    response = await request.get('/api/v2/clothes/1').set('Authorization', 'Basic VGVzdGVyOnBhc3M=');
    expect(response.status).toEqual(200);
  });

  test('/api/v2 food & clothes UPDATE', async () => {
    let response = await request.put('/api/v2/food/1').send({
      name: 'food',
      calories: '9001',
      type: 'protein',
    }).set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toEqual(200);
    response = await request.put('/api/v2/clothes/1').send({
      name: 'shirt',
      color: 'black',
      size: 'large',
    }).set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toEqual(200);
  });

  test('/api/v2 food & clothes DELETE', async () => {
    let response = await request.delete('/api/v2/food/1').set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toEqual(200);
    response = await request.delete('/api/v2/clothes/1').set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toEqual(200);
  });

});