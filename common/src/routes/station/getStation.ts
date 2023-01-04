const express = require('express');
const Router = express.Router();

import { NotFoundError } from '@phibase/common-v2';
import { Station } from '../../models/Station';

Router.get('/api/v1/manufacture/master-data/station/:id', async (req: any, res: any) => {
  let station = await Station.findById(req.params.id);

  if (station === null) {
    throw new NotFoundError();
  }

  return res.json({
    success: true,
    data: station
  });
})

export default Router;
