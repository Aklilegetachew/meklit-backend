import { Router } from "express"
import {
  createStaffMember,
  getStaffMembers,
} from "../controllers/staff.controller"

const staffmanagmentRoutes = Router()

staffmanagmentRoutes.get("/", getStaffMembers)
staffmanagmentRoutes.post("/", createStaffMember)

export default staffmanagmentRoutes
