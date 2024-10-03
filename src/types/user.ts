export type changePasswordBody = {
	oldPassword: string;
	newPassword: string;
	confirmNewPassword: string;
};

export type updateUserBody = {
	firstname: string;
	lastname: string;
	username: string;
	bio: string;
};
