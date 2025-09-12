import { Request, Response } from "express"
import {
  createChild,
  getAllChildren,
  getChildrenByClientId,
  getChildrenByStaffId,
  getChildById,
  getChildrenBirthdays,
} from "../services/child.service"

export const createChildController = async (req: Request, res: Response) => {
  try {
    const child = await createChild(req.body)
    res.status(201).json(child)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getAllChildrenController = async (
  _req: Request,
  res: Response
) => {
  try {
    const children = await getAllChildren()
    res.json(children)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getChildByIdController = async (req: Request, res: Response) => {
  try {
    const child = await getChildById(req.params.id)
    if (!child) return res.status(404).json({ error: "Child not found" })
    res.json(child)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getChildrenByClientIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const children = await getChildrenByClientId(req.params.clientId)
    res.json(children)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getChildrenByStaffIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const children = await getChildrenByStaffId(req.params.staffId)
    res.json(children)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getChildrenBirthdaysController = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await getChildrenBirthdays()
    res.json(result)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
