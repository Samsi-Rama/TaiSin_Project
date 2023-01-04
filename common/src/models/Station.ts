import mongoose from 'mongoose';

const StationSchema = new mongoose.Schema({
  name: {
    type: String
  },
  hardwares: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hardware'
  }],
  stations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station'
  }],
  props: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
},{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

interface StationDoc {
  name: string;
  hardwares: any;
  stations: any;
  props:any;
  createdAt: Date;
  updatedAt: Date;
}

const Station = mongoose.model<StationDoc>("Station", StationSchema);

export {
  Station
}
