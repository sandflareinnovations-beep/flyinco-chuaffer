import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Home, CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/Components/ui/button";

export default function BookingSuccess({ onReset }) {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-[#1e2435] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden"
            >
                {/* Glow effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-green-500/20 blur-3xl rounded-full" />

                {/* Success Icon Animation */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.2,
                    }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg shadow-green-500/30"
                >
                    <CheckCircle size={40} className="text-white" strokeWidth={3} />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-white mb-2"
                >
                    Booking Confirmed!
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/60 mb-8"
                >
                    Your ride has been successfully scheduled. We've sent a confirmation details to your email.
                </motion.p>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid gap-3"
                >
                    <Button
                        onClick={() => {
                            onReset();
                            navigate("/profile");
                        }}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold h-11"
                    >
                        <CalendarCheck size={18} className="mr-2" />
                        View My Bookings
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => {
                            onReset();
                            navigate("/");
                        }}
                        className="w-full border-white/10 text-white hover:bg-white/5 h-11"
                    >
                        <Home size={18} className="mr-2" />
                        Return Home
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}
