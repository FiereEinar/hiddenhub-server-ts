import mongoose from 'mongoose';

mongoose.set({ strictQuery: false });
const mongoDB = process.env.MONGO_URI;

async function main(): Promise<void> {
	if (mongoDB === undefined) throw new Error('Mongo URI Not Found');
	await mongoose.connect(mongoDB);
}

export default () => main().catch((err) => console.log(err));
