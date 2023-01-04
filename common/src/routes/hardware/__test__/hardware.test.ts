import request from 'supertest';
import { createApp } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';


let hardwareId: any = null;
let updateName: string = "Hardware Update";


test('Create Hardware', async () => {
  let authorization = await global.login();
  let app = await global.getApp();
  

  var response = await request(app)
        .post('/api/v1/manufacture/master-data/hardware/add')
        .send({
          name: 'Test Hardware',
          ip: '127.0.0.1',
          type: 'PLC',
          protocol: 'TCP',
          port: 8080,
          props:{
            app:'phibase-test',
            station:{name:'yes',isNew:true}
          }
        })
        .expect(401)

  response = await request(app)
        .post('/api/v1/manufacture/master-data/hardware/add')
        .send({
          name: 'Test Hardware',
          ip: '127.0.0.1',
          type: 'PLC',
          protocol: 'TCP',
          port: 8080,
          props:{
            app:'phibase-test',
            station:{name:'yes',isNew:true}
          }
        })
        .set("Authorization",authorization)
        .expect(200)
  hardwareId = response.body.data.id;

  expect(response.status).toBe(200);

  //create station result
  response =await request(app)
        .get('/api/v1/manufacture/master-data/stations').set("Authorization",authorization);

  expect(response.body.data.length).toBe(1);

  expect(response.body.data[0].createdAt).toBe(response.body.data[0].updatedAt)


  expect(natsWrapper.client.publish).toHaveBeenCalled();
});




test('Get Hardware', async () => {
  let authorization = await global.login();
  let app = await global.getApp();

  let response = await request(app)
        .get('/api/v1/manufacture/master-data/hardware/'+hardwareId).set("Authorization",authorization);

  expect(response.body.data.id).toBe(hardwareId);
});

test('Get Hardwares with Query', async () => {
  let authorization = await global.login();
  let app = await global.getApp();

  let response = await request(app)
        .get('/api/v1/manufacture/master-data/hardwares?props[app]=phibase-test')
        .set("Authorization",authorization).expect(200);

  expect(response.body.data.length).toBe(1);
  expect(response.body.data[0].props.app).toBe('phibase-test')

  response = await request(app)
        .get('/api/v1/manufacture/master-data/hardwares?props[app]=XXX')
        .set("Authorization",authorization).expect(200);

  expect(response.body.data.length).toBe(0);
});

test('Get Hardware Should Not Found', async () => {
  let authorization = await global.login();
  let app = await global.getApp();

  let response = await request(app)
        .get('/api/v1/manufacture/master-data/hardware/000000000000')
        .set("Authorization",authorization);

  expect(response.status).toBe(404);
});

test('Update Hardware', async () => {
  let authorization = await global.login();
  let app = await global.getApp();

  let response = await request(app)
        .put('/api/v1/manufacture/master-data/hardware/'+hardwareId)
        .send({
          name: updateName
        })
        .expect(401);


  response = await request(app)
        .put('/api/v1/manufacture/master-data/hardware/'+hardwareId)
        .send({
          name: updateName
        })
        .set("Authorization",authorization).expect(200);

  expect(response.body.data.name).toBe(updateName);

  expect(response.body.data.createdAt).not.toBe(response.body.data.updatedAt);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

test('Get Hardwares', async () => {
  let app = await global.getApp();

  let response = await request(app)
        .get('/api/v1/manufacture/master-data/hardwares');

  expect(response.body.data.length).toBe(1);
});

test('Add Schedule Hardwares', async () => {
  let app = await global.getApp();

  let response = await request(app)
        .post('/api/v1/manufacture/master-data/hardware/schedule')
        .send({
          hardware:hardwareId,
          schedules: [0,3,4]
        });

  expect(response.body.data.props.scheduledMaintanance.day[0]).toBe(0);
  expect(response.body.data.props.scheduledMaintanance.day[1]).toBe(3);
  expect(response.body.data.props.app).toBe('phibase-test')

  response = await request(app)
        .post('/api/v1/manufacture/master-data/hardware/schedule')
        .send({
          hardware:hardwareId,
          schedules: [0,3,4]
        });
  expect(response.status).toBe(400);
});

test('Edit Schedule Hardwares', async () => {
  let app = await global.getApp();

  let response = await request(app)
      .put('/api/v1/manufacture/master-data/hardware/schedule/'+hardwareId)
      .send({
        hardware:hardwareId,
        schedules: [0,1,4]
      });

      expect(response.body.data.props.scheduledMaintanance.day[1]).toBe(1);
      expect(response.body.data.props.app).toBe('phibase-test')
});

test('Delete Hardware', async () => {
  let authorization = await global.login();
  let app = await global.getApp();

  await request(app).delete('/api/v1/manufacture/master-data/hardware/'+hardwareId).expect(401);
  await request(app).delete('/api/v1/manufacture/master-data/hardware/'+hardwareId)
    .set('Authorization',authorization).expect(200);

  let response = await request(app)
        .get('/api/v1/manufacture/master-data/hardwares')
        ;

  expect(response.body.data.length).toBe(0);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
