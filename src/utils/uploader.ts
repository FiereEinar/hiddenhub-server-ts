import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import cloudinary from './cloudinary';
import streamifier from 'streamifier';

export const imageUploader = (
	file: Express.Multer.File
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> => {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream((err, result) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(result);
		});

		streamifier.createReadStream(file.buffer).pipe(uploadStream);
	});
};
