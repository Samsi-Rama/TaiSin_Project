import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Note } from '../../models/note';
import { RequestValidationError, BadRequestError } from '@phibase/common-v2';

const router = express.Router();

router.delete(
  '/api/v1/common/notes/:id',
  [
    
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
      throw new BadRequestError("Error getting note "+req.params.id)
    }
    if(!note){
      console.error("Note is not found")
      throw new BadRequestError("Note is not found")
    }

    // Delete transaction
    try {
      await note.remove();

    } catch (err) {
      throw new BadRequestError("ERROR: "+err)
    
    }

  res.status(200).send({data:note});
  },
);

export { router as deleteNoteRouter };
