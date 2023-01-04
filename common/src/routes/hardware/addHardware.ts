import { Hardware } from '../../models/Hardware';
import { Station } from '../../models/Station';
import { HardwareCreatedPublisher } from '../../events/publishers/hardware-created-publisher';
import { StationCreatedPublisher } from '../../events/publishers/station-created-publisher';
import { StationUpdatedPublisher } from '../../events/publishers/station-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { currentUser,requireAuth } from '@phibase/common-v2';

import express  from 'express'
//const express = require('express');
const Router = express.Router();

Router.post('/api/v1/manufacture/master-data/hardware/add',async (req: any, res: any) => {
  
  console.log("test backend awal")
  let hardware = new Hardware({ ...req.body });
  await hardware.save();

  //publishes hardware
  // await new HardwareCreatedPublisher(natsWrapper.client).publish({
  //   id: hardware.id,
  //   name: hardware.name,
  //   type: hardware.type,
  //   protocol: hardware.protocol,
  //   port: hardware.port,
  //   ip: hardware.ip,
  //   props: hardware.props,
  // });

  var stationTemp;
  console.log("test backend tengah")
  //station assinged handler
  if(hardware.props.station){
    if(hardware.props.station.isNew){
      stationTemp=await Station.create({
        name:hardware.props.station.name,
        hardwares:[hardware.id],
        stations:[],
        })
        console.log("test backend if")
      //publishes create new station
      // await new StationCreatedPublisher(natsWrapper.client).publish({
      //   id:stationTemp.id,
      //   name:stationTemp.name,
      //   hardwares:stationTemp.hardwares
      // })
    }else{
      stationTemp = await Station.findByIdAndUpdate(hardware.props.station.name,{
        $push:{hardwares:hardware.id}
      },{new:true})

      if(stationTemp){
        // publishes update station
        await new StationUpdatedPublisher(natsWrapper.client).publish({
          id:stationTemp.id,
          name:stationTemp.name,
          hardwares:stationTemp.hardwares
        })
      }
      console.log("test backend else")
    }
    
  }

  return res.json(
  {
    success: true,
    data: hardware
  });
});

export default Router
