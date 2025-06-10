import { Router } from "express";
import { createShortURL, deleteShortURL, getShortURLs, updateShortURL } from "./shortner.controller";

const router = Router();

router.post('/shortner', createShortURL);
router.get('/shortner', getShortURLs);
router.patch('/shortner/:id', updateShortURL);
router.delete('/shortner/:id', deleteShortURL);

export default router;