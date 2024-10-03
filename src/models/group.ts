import mongoose from 'mongoose';
import { ICover, IProfile, IUser } from './user';

const Schema = mongoose.Schema;

export interface IGroup {
	_id: string;
	name: string;
	members: [IUser];
	admins: [IUser];
	createdAt: Date;
	profile: IProfile;
	cover: ICover;
}

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
