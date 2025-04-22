import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader
} from "@/components/ui/dialog";
import axios from 'axios';
import { CiUser } from "react-icons/ci";
const Header = () => {
    const [openDailog, setopenDailog] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            setUser(storedUser);
        } catch (error) {
            console.error("Error parsing user data:", error);
        }
    }, []);

    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'application/json'
            }
        }).then((resp) => {
            console.log("User Profile:", resp.data);
            localStorage.setItem('user', JSON.stringify(resp.data));
            setUser(resp.data);
            setopenDailog(false);
        }).catch((error) => {
            console.error("Error fetching user profile:", error);
        });
    };

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => GetUserProfile(codeResponse),
        onError: (error) => console.log(error),
        flow: 'implicit',
        scope: "profile email",
        prompt: "select_account"  // Ensures the user sees the Google account chooser
    });
    const handleLogout = () => {
        googleLogout();
        localStorage.clear();
        setUser(null);
    };

    const navigate = useNavigate();
    return (
        <div className='mb-20'>
            <motion.nav
                className="fixed top-0 left-0 w-full flex justify-between items-center px-12 py-4 
                   bg-white shadow-md border-b border-gray-200 z-50"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <motion.a
                    href="/"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <img src="/logo1.png" alt="Logo" className="h-16 w-56" />
                </motion.a>

                {user ? (
                    <div className='flex gap-6 items-center'>
                        <Popover>
                            <PopoverTrigger>
                                <motion.img
                                    src={user?.picture || <motion.img
                                        src={user?.picture || "/icons8-male-user-48.png"}
                                        onError={(e) => { e.target.src = "/icons8-male-user-48.png"; }} // Handle broken images
                                        alt="User Profile"
                                        className="size-10 rounded-full cursor-pointer"
                                    />}
                                    onError={(e) => { e.target.src = "/icons8-male-user-48.png"; }} // Fallback if image fails to load
                                    alt="User Profile"
                                    className="size-10 rounded-full cursor-pointer"
                                />
                            </PopoverTrigger>
                            <PopoverContent className="w-40 p-2 bg-white shadow-md rounded-lg">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
                                >
                                    Logout
                                </button>
                            </PopoverContent>
                        </Popover>
                        <motion.div whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(255, 165, 0, 0.6)" }}>

                            <Button onClick={() => navigate('/my-trips')}>
                                My Trips
                            </Button>
                        </motion.div>
                    </div>
                ) : (
                    <>
                        <motion.div whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(255, 165, 0, 0.6)" }}>
                            <Button
                                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg transition"
                                onClick={() => setopenDailog(true)}
                            >
                                Sign In
                            </Button>
                        </motion.div>

                        <Dialog open={openDailog} onOpenChange={setopenDailog}>
                            <DialogContent>
                                <DialogHeader>
                                    <img src="/logo.svg" alt="Logo" className="size-[50%]" />
                                    <h2 className="font-bold mt-5 text-lg text-black">Sign in with Google</h2>
                                    <DialogDescription>
                                        Sign in with Google authentication securely
                                    </DialogDescription>
                                </DialogHeader>
                                <Button className="w-full mt-5 flex items-center justify-center gap-2" onClick={() => login()}>
                                    <FcGoogle className="h-7 w-7" /> Sign In with Google
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </motion.nav>
        </div>
    );
};

export default Header;