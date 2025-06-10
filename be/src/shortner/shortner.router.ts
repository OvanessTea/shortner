import { Router } from "express";
import { createShortURL, getShortURLs } from "./shortner.controller";

const router = Router();

router.post('/shortner', createShortURL);
router.get('/shortner', getShortURLs);

export default router;