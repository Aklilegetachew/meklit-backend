import { Request, Response } from "express"
import {
  createClass,
  getAllClasses,
  getClassById,
  getClassChildren,
} from "../services/class.service"

export const createClassController = async (req: Request, res: Response) => {
  try {
    const newClass = await createClass(req.body)
    res.status(201).json(newClass)
  } catch (err: any) {
    res.status(err.statusCode || 400).json({ error: err.message })
  }
}

export const getAllClassesController = async (_req: Request, res: Response) => {
  try {
    const classes = await getAllClasses()
    res.json(classes)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

export const getClassByIdController = async (req: Request, res: Response) => {
  try {
    const classData = await getClassById(req.params.id)
    if (!classData) {
      return res.status(404).json({ error: "Class not found" })
    }
    res.json(classData)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

export const getClassChildrenController = async (
  req: Request,
  res: Response
) => {
  try {
    const children = await getClassChildren(req.params.classId)
    res.json(children)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}
