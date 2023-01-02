import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Note } from '../../models/note';
import { RequestValidationError, BadRequestError } from '@phibase/common-v2';
import { mongoQuery } from '@phibase/common-v2';

const router = express.Router();

router.get(
  '/api/v1/common/notes',
  mongoQuery,
  [
    
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    var notes;
    
    try{
      notes = await Note.find(req.mongoQuery)  
    }catch(err){
      throw new BadRequestError("ERROR: "+err)
    }
    
    res.status(200).send(notes);
  },
);

export { router as getNotesRouter };
