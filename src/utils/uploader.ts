import cloudinary from './cloudinary';
import streamifier from 'streamifier';

export const imageUploader = (file: {
	buffer: string | Buffer | Uint8Array;
}) => {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream((result, err) => {
			if (err) return reject(err);
			resolve(result);
		});

		streamifier.createReadStream(file.buffer).pipe(uploadStream);
	});
};
