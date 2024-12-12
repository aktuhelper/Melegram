import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/posts.model.js";
import { User } from "../models/user_model.js";
import { Comment } from "../models/comment.model.js"
import { getReceiverSocketId,io } from "../socket/socket.js";
export const addNewPost = async (req, res) => {    // API for Creating new Post
    try {
        // Validate input fields
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id; // Assuming the user is authenticated and id is available in req.id

        if (!caption || caption.trim().length === 0) {
            return res.status(400).json({ message: "Caption cannot be empty!" });
        }
        if (!image) {
            return res.status(400).json({ message: "Please Upload the Image!" });
        }

        // Resize and optimize the image using sharp
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // Convert image buffer to base64 URI
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

        // Upload to Cloudinary
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        if (!cloudResponse || !cloudResponse.secure_url) {
            return res.status(500).json({ message: "Error uploading image to Cloudinary" });
        }

        // Create a new post in the database
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url, // Store image URL from Cloudinary
            author: authorId,
        
        });

        // Add the post to the user's posts array
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        // Populate the author data (excluding password)
        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New Post Added!',
            post,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while adding the post." });
    }
};

export const getAllPost = async (req, res) => { //API for getting all Post
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
};

export const getUserPost = async (req, res) => { //Api for getting post at user home page
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'username profilePicture'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'author',
                select: 'username profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
};
export const likePost = async (req, res) => {  //like API 
    try {
        const likekarnewalaid = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId)
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });
        //like logic started
        await post.updateOne({ $addToSet: { likes: likekarnewalaid } }) //$addToSet: for unique user
        console.log(post.likes)
        await post.save();
        //socket implemenation for  notificaion
        const user= await User.findById(likekarnewalaid).select('username profilePicture')
          console.log(user)
        const postOwnerId= post.author.toString();
        if(postOwnerId !== likekarnewalaid){
            const notification={
                type:'like',
                userId: likekarnewalaid,
                userDetails:user,
                postId,
                message:'Your post was Liked'
            }
            const postOwnerSocketId=getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification)
        }

        return res.status(200).json({
            message: 'Post liked!',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
};
export const dislikePost = async (req, res) => {  //API LOGIC FOR DISLIKE
    try {
        const likekarnewalaid = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId)
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });
        await post.updateOne({ $pull: { likes: likekarnewalaid } }) //$pull: to remove user
        await post.save();
        const user= await User.findById(likekarnewalaid).select('username profilePicture')
        const postOwnerId= post.author.toString();
        if(postOwnerId !== likekarnewalaid){
            const notification={
                type:'dislike',
                userId: likekarnewalaid,
                postId,
                message:'Your post was Disliked'
            }
            const postOwnerSocketId=getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification)
        }

        return res.status(200).json({
            message: 'Post Disliked!',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
};
export const addComment = async (req, res) => { // API for adding comment
    try {
        const postId = req.params.id;
        const commenterId = req.id; // ID of the user commenting
        const { text } = req.body; // Comment text

        // Ensure the comment text is not empty
        if (!text) {
            return res.status(400).json({
                message: 'Comment text is required!',
                success: false
            });
        }

        // Find the post being commented on
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found!',
                success: false
            });
        }

        // Create the comment
        const comment = await Comment.create({
            text,
            author: commenterId,
            post: postId
        });

        // Populate the comment with author details (username and profile picture)
        await comment.populate({
            path: 'author',
            select: "username profilePicture"
        });

        // Add the comment to the post's comment array
        post.comments.push(comment._id);
        await post.save();

        // Notify the post owner (except when the commenter is the post owner)
        const postOwnerId = post.author.toString();
        if (postOwnerId !== commenterId) {
            // Fetch the commenter details for the notification
            const commenter = await User.findById(commenterId).select('username profilePicture');

            const notification = {
                type: 'comment',
                userId: commenterId,
                userDetails: commenter,
                postId,
                message: `${commenter.username} commented on your post`
            };

            // Get the post owner's socket ID
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);

            // Emit the notification to the post owner's socket
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        // Return the response with the newly added comment
        return res.status(201).json({
            message: 'Comment added!',
            comment,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while adding the comment.',
            success: false
        });
    }
};

export const getCommentofPost = async (req, res) => { //API for getting comment of the post
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }.populate('author', 'username,profilePicture'));
        if (!comments) return res.status(404).json({ message: 'No comment found!', success: false });
        return res.status(200).json({ success: true, comments })
    } catch (error) {
        console.log(error)
    }
};
export const deletePost = async (req, res) => { //API for Delete Post
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not Found', success: false })
        //check if logged in user is owner of the post
        if (post.author.toString() !== authorId) return res.status(403).json({ message: 'Unauthorized' });
        //deletePost
        await Post.findByIdAndDelete(postId);
        //remove postId from user post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();
        //delete associated comments
        await Comment.deleteMany({ post: postId })
        return res.status(200).json({
            success: true,
            message: 'Post deleted'
        })
    } catch (error) {
        console.log(error)
    }
};
export const bookmarkPost = async (req, res) => { //API for Bookmark Post
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not Found!', success: false })
        const user = await User.findById(authorId);
        if (user.bookmark.includes(post._id)) {
            await user.updateOne({ $pull: { bookmark: post._id } });
            await user.save();
            return res.status(200).json({ type: 'unsaved', message: 'Post removed from Bookmark', success: true })
        } else {
            await user.updateOne({ $addToSet: { bookmark: post._id } });
            await user.save();
            return res.status(200).json({ type: 'saved', message: 'Post Bookmarked', success: true })
        }
    } catch (error) {
        console.log(error)
    }
};
