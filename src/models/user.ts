import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IProfile {
	url: string;
	publicID: string;
}

export interface ICover extends IProfile {}

export interface IUser {
	_id: string;
	firstname: string;
	lastname: string;
	username: string;
	password: string;
	isOnline: boolean;
	bio?: string;
	friends: [IUser];
	dateJoined: Date;
	profile: IProfile;
	cover: ICover;
	refreshToken: string;
}

const UserSchema = new Schema<IUser>({
	firstname: { type: String, minLength: 1, required: true },
	lastname: { type: String, minLength: 1, required: true },
	username: { type: String, minLength: 1, required: true, unique: true },
	password: { type: String, minLength: 1, required: true },
	isOnline: { type: Boolean, default: false },
	bio: { type: String, default: '' },
	friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	dateJoined: { type: Date, default: Date.now },
	profile: {
		url: String,
		publicID: String,
	},
	cover: {
		url: String,
		publicID: String,
	},
	refreshToken: { type: String },
});

export default mongoose.model('User', UserSchema);
