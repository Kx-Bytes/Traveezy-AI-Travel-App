import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
    return (
        <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
            {/* Geometric background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full filter blur-3xl"></div>
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            </div>

            {/* Floating grid pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-[length:60px_60px]"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 container mx-auto px-6 py-24 md:py-32 lg:py-40 flex flex-col items-center">
                {/* Animated headline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-orange-400">
                            Next-Gen Travel Planning
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                        AI-powered itineraries that adapt to your preferences, budget, and travel style
                    </p>
                </motion.div>

                {/* Feature cards grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 w-full max-w-5xl"
                >
                    {[
                        {
                            icon: "⚡",
                            title: "Instant Planning",
                            desc: "Generate complete itineraries in seconds"
                        },
                        {
                            icon: "🧠",
                            title: "Smart Adaptations",
                            desc: "Auto-adjusts based on weather and closures"
                        },
                        {
                            icon: "💰",
                            title: "Budget Optimized",
                            desc: "Finds the best value experiences"
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 transition-all hover:border-cyan-400/30"
                        >
                            <div className="text-3xl mb-3">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-slate-400">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-center"
                >
                    <div className="mb-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 inline-block max-w-2xl">
                        <p className="text-slate-300 text-lg">
                            Ready to experience stress-free travel planning?
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/create-trip">
                            <motion.div 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.98 }}
                                className="relative"
                            >
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-orange-500 rounded-lg filter blur-md opacity-70 animate-pulse"></div>
                                {/* Main button */}
                                <Button className="relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-lg text-lg shadow-xl hover:shadow-orange-500/40 transition-all duration-300 border border-orange-400/30">
                                    Start Planning Now
                                    <span className="ml-2">✨</span>
                                </Button>
                            </motion.div>
                        </Link>
                        <Link to="/demo">
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                <Button className="px-8 py-4 bg-slate-700/50 border border-slate-600 text-white font-bold rounded-lg text-lg hover:bg-slate-700 transition-all">
                                    See Live Demo
                                </Button>
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="mt-16 text-slate-400 text-sm flex flex-wrap justify-center gap-6"
                >
                    <div className="flex items-center">
                        <span className="mr-2">⭐️⭐️⭐️⭐️⭐️</span>
                        <span>4.9/5 from 2k+ travelers</span>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2">✈️</span>
                        <span>50k+ itineraries created</span>
                    </div>
                </motion.div>
            </div>

            {/* Floating animated elements */}
            <motion.div
                animate={{
                    y: [0, -15, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-20 left-10 w-8 h-8 rounded-full bg-cyan-400/30 blur-xl"
            />
            <motion.div
                animate={{
                    y: [0, 20, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute top-1/3 right-16 w-12 h-12 rounded-full bg-orange-400/20 blur-xl"
            />
        </div>
    );
};

export default Hero;