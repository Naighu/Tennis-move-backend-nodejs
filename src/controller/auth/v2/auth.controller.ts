import { Request, Response } from "express";
import {  sendOk } from "../../../utils/respond";
import { AuthGetLoginBody } from "./types";

export async function login(req: Request, res: Response) {
  const body: AuthGetLoginBody = req.body as AuthGetLoginBody;

  
  return sendOk(res, {
    access_token_sub: req.user!.sub,
    user_email: req.user!.email,
  });
}