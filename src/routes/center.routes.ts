import { Router } from "express"
import {
  createCenters,
  getCenterById,
  getCenters,
} from "../controllers/center.controller"

const centerrouter = Router()

centerrouter.get("/", getCenters)
centerrouter.get("/:id", getCenterById)
centerrouter.post("/", createCenters)

export default centerrouter
