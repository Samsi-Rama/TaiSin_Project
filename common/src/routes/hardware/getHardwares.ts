import { Hardware } from '../../models/Hardware';

import { mongoQuery } from '@phibase/common-v2'
const express = require('express');
const Router = express.Router();

Router.get('/api/v1/manufacture/master-data/hardwares', mongoQuery , async (req: any, res: any) => {
  
  let hardwares = await Hardware.find(req.mongoQuery);

  return res.json({
    success: true,
    data: hardwares,
  });
})

export default Router
