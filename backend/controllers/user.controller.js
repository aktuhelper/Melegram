import { User } from '../models/user_model.js'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/datauri.js';
import { Post } from '../models/posts.model.js';
export const register = async (req, res) => {   //registration API logic
    try {
        const { username, email, password } = req.body;
        if (!username || !password || !email) {
            return res.status(401).json({
                message: 'something is missing please check!',
                success: false
            })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(401).json({
                message: 'Try different email!',
                success: false
            });
        }
        const hashedpassword = await bcrypt.hash(password, 10); //pass hashing
        await User.create({                                     //account creation 
            username,
            email,
            password: hashedpassword
        })
        return res.status(201).json({
            message: "Account created successfully!",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const login = async (req, res) => {                           //login API logic
    try {
        const { email, password } = req.body;
        if (!password || !email) {
            return res.status(401).json({
                message: 'something is missing please check!',
                success: false
            })
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: 'Incorrect email or password!',
                success: false
            })
        };
        const ispasswordMatch = await bcrypt.compare(password, user.password);
        if (!ispasswordMatch) {
            return res.status(401).json({
                message: 'Incorrect email or password!',
                success: false
            })
        };
        //user details for frontend
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' })
        //populate each post in post array
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user.posts,
            posts: populatedPosts
        }//token geneartion

        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        })
    }
    catch (error) {
        console.log(error)
    }
};
//logout API logic
export const logout = async (_, res) => {
    try {
        return res.cookie("token", " ", { maxAge: 0 }).json({
            message: "Logout Successfully!",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
};
//getProfile API Logic
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts',createdAt:-1}).populate('bookmark')
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
//editProfile API Logic
export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture)
            cloudResponse = await cloudinary.uploader.upload(fileUri)
        }
        const user = await User.findById(userId).select('-password')
        if (!user) {
            return res.status(404).json({
                message: 'User not Found',
                success: false
            })
        }
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;
        await user.save();
        return res.status(200).json({
            message: "Profile edited Successfully",
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
    }
};
//suggestedUser API Logic
export const getsuggestedUser = async (req, res) => {
    try {
        const suggestedUser = await User.find({ _id: { $ne: req.id } }).select("-password")
        if (!suggestedUser) {
            return res.status(400).json({
                message: 'cuurently do not have any User!',
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            users: suggestedUser
        })
    } catch (error) {
        console.log(error)
    }
};
export const followorunfollow = async (req, res) => {  //FolloworUnfollow API Logic
    try {
        const followkarnewala = req.id;
        const followhonewala = req.params.id;
        if (followkarnewala === followhonewala) {// id similar check
            return res.status(400).json({
                message: 'You cannot follow or unfollow yourself!',
                success: false
            })
        }
        const user = await User.findById(followkarnewala);// user or target user find
        const targetUser = await User.findById(followhonewala);
        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not Found!',
                success: false
            })
        }
        //folllow or unfollow logic
        const isfollowing = user.following.includes(followhonewala);
        if (isfollowing) {
            //unfollow logic
            await Promise.all([
                User.updateOne({ _id: followkarnewala }, { $pull: { following: followhonewala } }),
                User.updateOne({ _id: followhonewala }, { $pull: { followers: followkarnewala } })])
            return res.status(200).json({ message: 'unfollowed successfully', success: true })
        } else {
            //follow logic
            await Promise.all([//promise used to handle two or more documents in DB
                User.updateOne({ _id: followkarnewala }, { $push: { following: followhonewala } }),
                User.updateOne({ _id: followhonewala }, { $push: { followers: followkarnewala } })
            ])
            return res.status(200).json({ message: 'followed sucessfully', success: true })
        }
    } catch (error) {
        console.log(error)
    }
}