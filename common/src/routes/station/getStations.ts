import { Station } from '../../models/Station';

import { mongoQuery } from '@phibase/common-v2'
const express = require('express');
const Router = express.Router();

Router.get('/api/v1/manufacture/master-data/stations', mongoQuery,async (req: any, res: any) => {
  
  let stations = await Station.find(req.mongoQuery);

  await Station.populate(stations,'hardwares stations')
  await Station.populate(stations,'stations.hardwares')

  return res.json({
    success: true,
    data: stations
  });
})

export default Router;
