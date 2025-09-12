import { Router } from "express"
import {
  createChildController,
  getAllChildrenController,
  getChildByIdController,
  getChildrenByClientIdController,
  getChildrenByStaffIdController,
  getChildrenBirthdaysController,
} from "../controllers/child.controller"

const childrouter = Router()

childrouter.post("/", createChildController)

childrouter.get("/", getAllChildrenController)

childrouter.get("/:id", getChildByIdController)

childrouter.get("/client/:clientId", getChildrenByClientIdController)

childrouter.get("/staff/:staffId", getChildrenByStaffIdController)

childrouter.get("/birthdays/check", getChildrenBirthdaysController)

export default childrouter
