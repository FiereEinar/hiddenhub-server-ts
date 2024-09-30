import mongoose from "mongoose";

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: { type: String, minLength: 3, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  profile: {
    url: String,
    publicID: String,
  },
  cover: {
    url: String,
    publicID: String,
  },
});

export default mongoose.model('Group', GroupSchema);
