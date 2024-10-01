export type loginBody = {
	username: string;
	password: string;
};

export type signupBody = {
	firstname: string;
	lastname: string;
	username: string;
	password: string;
};

export type jwtPayload = {
	username: string;
	iat?: number;
	exp?: number;
};
