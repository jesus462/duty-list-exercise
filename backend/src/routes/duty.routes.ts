import { Router } from "express";
import { DutyController } from "../controllers/duty.controller";

const router = Router();

router.get("/", DutyController.getAll);
router.post("/", DutyController.create);
router.put("/:id", DutyController.update);
router.delete("/:id", DutyController.delete);

export default router;
