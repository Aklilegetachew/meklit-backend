import { Request, Response, NextFunction } from "express"
import * as UserService from "../services/user.service"

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserService.getAllUsers()
    res.json(users)
  } catch (error) {
    next(error)
  }
}
