import { Input } from './input';
import { Button } from './button';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
    const [input, setInput] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const {user}= useSelector(store=>store.auth)
    const navigate = useNavigate();
    const dispatch=useDispatch();
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('https://melegram.onrender.com/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
              dispatch(setAuthUser(res.data.user)) //dispatch means fuction calling
                navigate('/');
                toast.success(res.data.message);
                setInput({
                    email: '',
                    password: ''
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };
 useEffect(()=>{
     if(user) {
        navigate("/")
     }
 },[])
    return (
        <div className="flex items-center justify-center w-screen h-screen bg-[#0F0F0F]">
            <form
                onSubmit={signupHandler}
                className="bg-[#1A1A1A] text-white shadow-xl rounded-lg flex flex-col gap-5 px-10 py-8 w-full max-w-md"
            >
                {/* Header */}
                <div className="my-4">
                    <h1 className="text-center font-bold text-2xl text-white">
                        Welcome Back to <span className="my-8 pl-1 font-bold text-2xl text-[#FF6F61] tracking-wide" style={{ fontFamily: 'Pacifico, cursive' }}>Chattsphere</span>
                    </h1>
                    <p className="text-center text-gray-400 text-sm mt-2">
                        Login to your account to stay connected!
                    </p>
                </div>

                {/* Email Field */}
                <div>
                    <label className="block font-medium text-gray-300 mb-1">Email</label>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="w-full px-4 py-2 border border-gray-600 bg-[#2A2A2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Password Field */}
                <div>
                    <label className="block font-medium text-gray-300 mb-1">Password</label>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="w-full px-4 py-2 border border-gray-600 bg-[#2A2A2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Submit Button */}
                {loading ? (
                    <Button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait...
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                    >
                        Login
                    </Button>
                )}

                {/* Signup Redirect */}
                <span className="text-center text-gray-400">
                    New to Chattsphere?{' '}
                    <Link to="/signup" className="text-blue-400 hover:underline">
                        Signup
                    </Link>
                </span>
            </form>
        </div>
    );
};

export default Login;
