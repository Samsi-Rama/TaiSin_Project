import request from 'supertest';
import { createApp } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

let stationId: any = null;
let updateName: string = "Test Update";

test('Create Station & PL', async () => {
  let app = await global.getApp();

  let response = await request(app)
        .post('/api/v1/manufacture/master-data/station/add')
        .send({
          name: 'Test Station',
          hardwares: [],
          stations: [],
          props:{
            app:'phibase-test'
          }
        })
  stationId = response.body.data.id;
  expect(response.status).toBe(200);

  expect(response.body.data.createdAt).toBe(response.body.data.updatedAt)

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  
});

test('Get Stations with Query', async () => {
  let app = await global.getApp();

  let response = await request(app)
        .get('/api/v1/manufacture/master-data/stations?props[app]=phibase-test');

  expect(response.body.data.length).toBe(1);
  expect(response.body.data[0].props.app).toBe('phibase-test')

  response = await request(app)
        .get('/api/v1/manufacture/master-data/stations?props[app]=phibase');

  expect(response.body.data.length).toBe(0);
});

test('Get Station', async () => {
  let app = await global.getApp();

  let response = await request(app)
        .get('/api/v1/manufacture/master-data/station/'+stationId);

  expect(response.body.data.id).toBe(stationId);
});

test('Get Station Should Not Found', async () => {
  let app = await global.getApp();

  let response = await request(app)
        .get('/api/v1/manufacture/master-data/station/000000000000');

  expect(response.status).toBe(404);
});

test('Update Station', async () => {
  let app = await global.getApp();

  let response = await request(app)
        .put('/api/v1/manufacture/master-data/station/'+stationId)
        .send({
          name: updateName,
          hardwares:[],
          stations:[],
        });

  expect(response.body.data.name).toBe(updateName);

  expect(response.body.data.createdAt).not.toBe(response.body.data.updatedAt)
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

test('Get Stations', async () => {
  let app = await global.getApp();

  let response = await request(app)
        .get('/api/v1/manufacture/master-data/stations');

  expect(response.body.data.length).toBe(1);
});

test('Delete Station', async () => {
  let app = await global.getApp();

  await request(app).delete('/api/v1/manufacture/master-data/station/'+stationId);

  let response = await request(app)
        .get('/api/v1/manufacture/master-data/stations');

  expect(response.body.data.length).toBe(0);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
