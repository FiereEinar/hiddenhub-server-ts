import mongoose from 'mongoose';
import { IProfile, IUser } from './user';
import { IGroup } from './group';

const Schema = mongoose.Schema;

export interface IMessageImage extends IProfile {}

export interface IMessage {
	_id: string;
	sender: IUser;
	receiver: IUser | null;
	group: IGroup;
	message: string;
	image: IMessageImage;
	dateSent: Date;
	dateEdited: Date;
	seen: boolean;
	edited: boolean;
}

const MessageSchema = new Schema({
	sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	receiver: { type: Schema.Types.ObjectId, ref: 'User', default: null },
	group: { type: Schema.Types.ObjectId, ref: 'Group', default: null },
	message: String,
	image: {
		url: String,
		publicID: String,
	},
	dateSent: { type: Date, default: Date.now },
	dateEdited: { type: Date, default: Date.now },
	seen: { type: Boolean, default: false },
	edited: { type: Boolean, default: false },
});

export default mongoose.model('Message', MessageSchema);
