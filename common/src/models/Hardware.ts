import mongoose from 'mongoose';

const HardwareSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  ip: {
    type: String,
  },
  type: {
    type: String,
  },
  protocol: {
    type: String,
  },
  port: {
    type: Number,
  },
  props: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
},
{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

interface HardwareDoc {
  name : string;
  ip: string;
  type: string;
  protocol: string;
  port: number;
  props: any;
  createdAt: Date;
  updatedAt: Date;
}

const Hardware = mongoose.model<HardwareDoc>("Hardware", HardwareSchema);

export {
  Hardware
}
