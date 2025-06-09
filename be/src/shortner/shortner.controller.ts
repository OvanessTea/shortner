import { NextFunction, Request, Response } from "express";
import { getShortURL } from "./shortner.service";

export const createShortURL = async (req: Request, res: Response, next: NextFunction) => {
    const { url } = req.body;

    try {
        const shortLink = await getShortURL(url);
        res.status(201).json({ originalLink: url, shortLink });
    } catch (error) {
        next(error);
    }
}