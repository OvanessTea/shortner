import { Router } from "express";
import { createUser, loginUser, logoutUser } from "./user.controller";

const router = Router();

router.post("/users", createUser);
router.post("/users/login", loginUser);
router.post("/users/logout", logoutUser);

export default router;