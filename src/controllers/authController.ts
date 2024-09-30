import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

export const login_get = asyncHandler((req: Request, res: Response) => {
  res.json({ message: 'Login successfull', data: null });
});
