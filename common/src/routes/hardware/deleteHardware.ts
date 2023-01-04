import { Hardware } from '../../models/Hardware';
import { HardwareDeletedPublisher } from '../../events/publishers/hardware-deleted-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { NotAuthorizedError,currentUser } from '@phibase/common-v2';
const express = require('express');
const Router = express.Router();

Router.delete('/api/v1/manufacture/master-data/hardware/:id',async (req: any, res: any) => {

  //console.log('cur user ',req.currentUser)

  let hardwares = await Hardware.findByIdAndRemove(req.params.id);

  // new HardwareDeletedPublisher(natsWrapper.client).publish({
  //   id: req.params.id,
  // });
  return res.json({
    success: true,
    data: [],
  });
});

export default Router
