import mongoose from 'mongoose';

// An interface that describes the properties
// that are required to create a new Note
interface NoteAttrs {
  subject         ?: string;
  creator         ?: string;
  receiver        ?: string;
  content         ?: string;
  contentHistory  ?: string[];
}

// An interface that describes the properties
// that a Note Model has
interface NoteModel extends mongoose.Model<NoteDoc> {
  build(attrs: NoteAttrs): NoteDoc;
}

// An interface that describes the properties
// that a Note Document has
interface NoteDoc extends mongoose.Document {
  subject         : string;
  creator         : string;
  receiver        : string;
  content         : string;
  contentHistory  : string[];
  updatedAt       : Date;
}

const NoteSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required.'],
    },
    creator: {
      type: String,
    },
    receiver: {
      type: String,
      required: [true, 'Receiver is required.'],
    },
    content: {
      type: String,
      required: [true, 'Content cannot be empty.'],
    },
    contentHistory:[
      {type:String}
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);


NoteSchema.statics.build = (attrs: NoteAttrs) => {
  return new Note(attrs);
};

const Note = mongoose.model<NoteDoc, NoteModel>('Note', NoteSchema);

export { Note };
