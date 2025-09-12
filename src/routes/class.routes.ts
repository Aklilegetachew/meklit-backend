import { Router } from "express"
import {
  createClassController,
  getAllClassesController,
  getClassByIdController,
  getClassChildrenController,
} from "../controllers/class.controller"

const classRoutes = Router()

classRoutes.post("/", createClassController)

classRoutes.get("/", getAllClassesController)

classRoutes.get("/:id", getClassByIdController)

classRoutes.get("/:classId/children", getClassChildrenController)

export default classRoutes
