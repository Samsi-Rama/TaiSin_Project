import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Note } from '../../models/note';
import { RequestValidationError, BadRequestError, propUpdate } from '@phibase/common-v2';

const router = express.Router();

router.put(
  '/api/v1/common/notes/:id',
  [
    body('subject')
      .notEmpty().withMessage('Subject cannot be empty'),
    body('creator'),
    body('receiver')
      .notEmpty().withMessage('Receiver required'),
    body('content')
      .notEmpty().withMessage('Content cannot be empty'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    
    var note;
    
    try {
      note = await Note.findById(req.params.id);
    } catch (err) {
      throw new BadRequestError("The Note with "+req.params.id+" does not found")
    }

    if(note===null){
      throw new BadRequestError("note is null")
    }
    
    var arrContent: Array<string> = note.contentHistory;
    arrContent.push(`${note.content} (${note.updatedAt})`)
    
    try {
      note = await Note.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new:true,
          runValidators:true
        }
      );

      if(note===null){
        throw new BadRequestError("note is null")
      }
      note.contentHistory = arrContent;
      console.log(note.contentHistory)
      await note.save();

      //publish item through nats publisher
      var idNote=(note.id)?note.id.toString():note._id.toString();
      
      // Update time
      note.updatedAt = new Date();

      await note.save();
    } catch (err) {
      throw new BadRequestError("failed note update")
    }

    res.status(200).send({data:note});
  },
);

export { router as updateNoteRouter };
