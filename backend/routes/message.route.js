import express from "express";
import isAunticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";
import { getMessage,sendMessage } from "../controllers/message.controller.js";
const router= express.Router();
router.route('/send/:id').post(isAunticated,sendMessage)
router.route('/all/:id').get(isAunticated,getMessage)
export default router