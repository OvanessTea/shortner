import { Router } from "express";
import { createUser } from "./user.controller";

const router = Router();

router.post("/users", createUser);

export default router;