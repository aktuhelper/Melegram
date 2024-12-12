import express from 'express';
import isAunticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";
import { bookmarkPost,addNewPost ,getAllPost, getUserPost, likePost, dislikePost, addComment, getCommentofPost, deletePost} from "../controllers/post.controller.js";
const router= express.Router();
router.route("/addPost").post(isAunticated,upload.single('image'),addNewPost);
router.route("/all").get(isAunticated,getAllPost);
router.route("userpost/all").get(isAunticated,getUserPost);
router.route("/:id/like").get(isAunticated,likePost);
router.route("/:id/dislike").get(isAunticated,dislikePost);
router.route("/:id/comment").post(isAunticated,addComment);
router.route("/:id/comment/all").post(isAunticated,getCommentofPost);
router.route("/delete/:id").delete(isAunticated,deletePost);
router.route("/:id/bookmark").get(isAunticated,bookmarkPost);
export default router