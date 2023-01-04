import { Hardware } from '../../models/Hardware';

import { HardwareUpdatedPublisher } from '../../events/publishers/hardware-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { NotAuthorizedError,currentUser } from '@phibase/common-v2';

const express = require('express');
const Router = express.Router();

Router.put('/api/v1/manufacture/master-data/hardware/:id',async (req: any, res: any) => {

  //console.log('cur user ',req.currentUser)

  // if(!req.currentUser){
  //   throw new NotAuthorizedError();
  // }
  let hardwares=await Hardware.findByIdAndUpdate(req.params.id,{...req.body,updatedAt:new Date()},{new:true})
  //await hardwares.updateOne({$set: {...req.body}}, {new:true});
  console.log('hardwares ',hardwares)
  // if(hardwares){
  //   await new HardwareUpdatedPublisher(natsWrapper.client).publish({
  //     id: hardwares.id,
  //     name: hardwares.name,
  //     type: hardwares.type,
  //     protocol: hardwares.protocol,
  //     port: hardwares.port,
  //     ip: hardwares.ip,
  //     props: hardwares.props,
  //   })
  // }

  

  return res.json({
    success: true,
    data: hardwares,
  });
});

export default Router
