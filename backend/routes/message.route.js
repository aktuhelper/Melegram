import express from "express";
import isAunticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";
import { sendMessage } from "../controllers/message.controller.js";
const router= express.Router();
router.route('/send/:id').post(isAunticated,sendMessage)

export default router
