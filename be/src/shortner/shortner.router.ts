import { Router } from "express";
import { createShortURL } from "./shortner.controller";

const router = Router();

router.post('/shortner', createShortURL);

export default router;