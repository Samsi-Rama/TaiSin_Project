import { Station } from '../../models/Station';
import { StationDeletedPublisher } from '../../events/publishers/station-deleted-publisher';
import { natsWrapper } from '../../nats-wrapper';
const express = require('express');
const Router = express.Router();

Router.delete('/api/v1/manufacture/master-data/station/:id', async (req: any, res: any) => {
  await Station.findByIdAndDelete(req.params.id);
  // new StationDeletedPublisher(natsWrapper.client).publish({
  //   id: req.params.id,
  // });
  return res.json({
    success: true,
    data: []
  });
})

export default Router;
