import { NextFunction, Request, Response } from "express"
import * as CenterService from "../services/center.service"

export const getCenters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const logs = await CenterService.getAllCenters()
    res.json(logs)
  } catch (err) {
    next(err)
  }
}

export const createCenters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = {
    ...req.body,
    timestamp: new Date(req.body.timestamp),
  }

  try {
    const logs = await CenterService.createCenter(body)
    res.json(logs)
  } catch (err) {
    next(err)
  }
}

export const getCenterById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.params.id) {
    res.json({ msg: "parameter id is missing" })
  }
  try {
    const id = req.params.id
    const response = await CenterService.getCenterById(id)
    res.json({ msg: "succssful", data: response })
  } catch (error) {
    next(error)
  }
}
