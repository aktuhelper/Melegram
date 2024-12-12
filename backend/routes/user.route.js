import express from "express";
import { editProfile, followorunfollow, getProfile, getsuggestedUser, login, logout, register } from "../controllers/user.controller.js";
import { bookmarkPost,addNewPost ,getAllPost} from "../controllers/post.controller.js";
import isAunticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";
const router= express.Router();
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/:id/profile').get(isAunticated,getProfile)
router.route('/profile/edit').post(isAunticated,upload.single('profilePicture'),editProfile)
router.route('/suggested').get(isAunticated,getsuggestedUser)
router.route('/followorunfollow/:id').post(isAunticated,followorunfollow)
router.route('/bookmark/:id').post(isAunticated,bookmarkPost)
export default router