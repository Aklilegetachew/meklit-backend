import { Router } from "express"
import {
  createStaffMember,
  getStaffById,
  getStaffMembers,
} from "../controllers/staff.controller"

const staffmanagmentRoutes = Router()

staffmanagmentRoutes.get("/", getStaffMembers)
staffmanagmentRoutes.post("/", createStaffMember)
staffmanagmentRoutes.get("/:id", getStaffById)

export default staffmanagmentRoutes
