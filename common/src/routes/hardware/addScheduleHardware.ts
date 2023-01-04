import { Hardware } from '../../models/Hardware';
import { HardwareUpdatedPublisher } from '../../events/publishers/hardware-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

import { BadRequestError } from '@phibase/common-v2';

const express = require('express');
const Router = express.Router();

Router.post('/api/v1/manufacture/master-data/hardware/schedule', async (req: any, res: any) => {

  var body= req.body;

  let hardware= await Hardware.findById(body.hardware);

  if(!hardware){
    throw new BadRequestError('Hardware not found');
  }
  console.log('schedule maintanance ',hardware.props.scheduledMaintanance)
  if(hardware.props.scheduledMaintanance){
    
    throw new BadRequestError('scheduled is already set for hardware');
  }

  hardware = await Hardware.findByIdAndUpdate(body.hardware,{
    $set:{
      'props.scheduledMaintanance.day':body.schedules
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
  console.log(hardware)
  return res.json({
    success: true,
    data: hardware
  });
});

export default Router
