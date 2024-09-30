import { Request,Response } from "express";
import asyncHandler from "express-async-handler";
import JsonResponse from "../models/response";

export const login_get = asyncHandler((req: Request, res: Response) => {
  res.json(new JsonResponse(true, null, 'Login successfull', ""));
});
