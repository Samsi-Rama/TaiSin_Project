import { Hardware } from '../../models/Hardware';

import { HardwareUpdatedPublisher } from '../../events/publishers/hardware-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const express = require('express');
const Router = express.Router();

Router.put('/api/v1/manufacture/master-data/hardware/schedule/:id', async (req: any, res: any) => {
  let hardware = await Hardware.findByIdAndUpdate(req.params.id,{
    $set:{
      'props.scheduledMaintanance.day':req.body.schedules
    }
  },{new:true})
  //publishes hardware
  if(hardware){
    console.log('Hardware schedule found');
    
    await new HardwareUpdatedPublisher(natsWrapper.client).publish({
      id: hardware.id,
      name: hardware.name,
      type: hardware.type,
      protocol: hardware.protocol,
      port: hardware.port,
      ip: hardware.ip,
      props:hardware.props,
    })

  }

  

  return res.json({
    success: true,
    data: await Hardware.findById(req.params.id),
  });
});

export default Router
