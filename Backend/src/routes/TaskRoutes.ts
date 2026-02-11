import { Router } from "express";
import { createTask, getTasks, updateTask, deleteTask} from "../controllers/TaskController.js";

const router = Router();

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
