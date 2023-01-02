import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Note } from '../../models/note';
import { RequestValidationError, BadRequestError } from '@phibase/common-v2';

const router = express.Router();

router.post(
  '/api/v1/common/notes',
  [
    body('subject')
      .notEmpty().withMessage('Subject cannot be empty'),
    body('creator'),
    body('receiver')
      .notEmpty().withMessage('Receiver required'),
    body('content')
      .notEmpty().withMessage('Content cannot be empty'),
    body('contentHistory')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    
    var note;
    try{
      note= new Note(req.body);
      await note.save();
      
    }catch(err){
      console.log(err)
      throw new BadRequestError("error to add note "+err)
    }
    
    res.status(200).send({data:note});
  },
);

export { router as addNoteRouter };
