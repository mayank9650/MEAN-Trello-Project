import { NextFunction, Request, Response } from "express";
import userModel from "../models/user";
import { UserDocument } from "../types/user.interface";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config";

const normalizeUser = (user: UserDocument) => {
  const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret);
  return {
    email: user.email,
    username: user.username,
    id: user.id,
    token,
  };
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = new userModel({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    });
    const saveUser = await newUser.save();
    res.status(200).json(normalizeUser(saveUser));
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      console.log("err", err);
      const messages = Object.values(err.errors).map((err) => err.message);
      return res.status(422).json(messages);
    }

    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
    const user = await userModel.findOne({ email }).select("+password");
    if (user) {
      const isMatchingPassword = await user.validatePassword(password);
      if (isMatchingPassword) {
        return res.status(200).json(normalizeUser(user));
      }
    }
    return res.status(400).json({ message: "Invalid email or password" });
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      console.log("err", err);
      const messages = Object.values(err.errors).map((err) => err.message);
      return res.status(422).json(messages);
    }
  }
};
