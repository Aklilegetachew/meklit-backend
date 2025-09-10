import { NextFunction, Request, Response } from "express"
import * as staffServices from "../services/staff.service"


export const getStaffMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const logs = await staffServices.getAllStaffmembers()
    res.json(logs)
  } catch (err) {
    next(err)
  }
}

export const createStaffMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = {
    ...req.body,
    timestamp: new Date(req.body.timestamp),
  }

  try {
    const logs = await staffServices.createStaffmember(body)
    res.json(logs)
  } catch (err) {
    next(err)
  }
}
