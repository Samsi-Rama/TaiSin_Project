const express = require('express');
const Router = express.Router();

import { Hardware } from '../../models/Hardware';
import { NotFoundError,currentUser,NotAuthorizedError } from '@phibase/common-v2';

Router.get('/api/v1/manufacture/master-data/hardware/:id',  currentUser,async (req: any, res: any) => {

  //console.log('cur user ',req.currentUser)

  if(!req.currentUser){
    throw new NotAuthorizedError();
  }
  let hardware = await Hardware.findById(req.params.id);

  if (hardware === null) {
    throw new NotFoundError()
  }

  return res.json({
    success: true,
    data: hardware,
  });
})

export default Router
