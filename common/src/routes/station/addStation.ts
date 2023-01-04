import { Station } from '../../models/Station';
import { StationCreatedPublisher } from '../../events/publishers/station-created-publisher';
import { natsWrapper } from '../../nats-wrapper';
const express = require('express');
const Router = express.Router();

Router.post('/api/v1/manufacture/master-data/station/add', async (req: any, res: any) => {
  

  //process production line (stations in station)
  if(req.body.stations.length>0){
    var stationList:any=[];
    var tempStation
    for (let i = 0; i < req.body.stations.length; i++) {
      let curStation = req.body.stations[i];
      if(curStation.isNew){
        tempStation =await Station.create({
        name:curStation.name,
        hardwares:[],
        stations:[],
        props:{
          app:req.body.props.app
        }
        })
        stationList.push(tempStation.id)
        // await new StationCreatedPublisher(natsWrapper.client).publish({
        //   id:tempStation.id,
        //   name:tempStation.name,
        //   hardwares:[],
        //   stations:[],
        //   props:tempStation.props
        // })
      }else{
        stationList.push(curStation.name)
      }
    }

    req.body.stations=stationList;
  }
  
  
  let station = new Station({ ...req.body });

  await station.save();

  // await new StationCreatedPublisher(natsWrapper.client).publish({
  //   id:station.id,
  //   name:station.name,
  //   hardwares:station.hardwares,
  //   stations:station.stations,
  //   props:station.props
  // })

  await Station.populate(station,'hardwares stations')

  return res.json({
    success: true,
    data: station
  });
})

export default Router;
