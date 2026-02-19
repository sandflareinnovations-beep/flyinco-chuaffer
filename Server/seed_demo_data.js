import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Booking from "./models/Booking.js";
import connectDB from "./config/db.js";

dotenv.config();

const users = [
    {
        firstName: "Admin",
        lastName: "User",
        email: "admin@flyinco.com",
        phone: "+973 33692021",
        password: "password123",
        role: "admin",
    },
    {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+973 12345678",
        password: "password123",
        role: "customer",
    },
    {
        firstName: "Ali",
        lastName: "Hassan",
        email: "ali.driver@flyinco.com",
        phone: "+973 33334444",
        password: "password123",
        role: "driver",
        vehicle: "Toyota Land Cruiser",
        vehicleType: "SUV",
        availability: true,
    },
    {
        firstName: "Raj",
        lastName: "Kumar",
        email: "raj.driver@flyinco.com",
        phone: "+973 55556666",
        password: "password123",
        role: "driver",
        vehicle: "Mercedes S-Class",
        vehicleType: "Sedan",
        availability: true,
    },
    {
        firstName: "Sarah",
        lastName: "Jones",
        email: "sarah.driver@flyinco.com",
        phone: "+973 77778888",
        password: "password123",
        role: "driver",
        vehicle: "BMW 7 Series",
        vehicleType: "Sedan",
        availability: false,
    },
    {
        firstName: "Mike",
        lastName: "Smith",
        email: "mike.driver@flyinco.com",
        phone: "+973 99990000",
        password: "password123",
        role: "driver",
        vehicle: "Toyota Hiace",
        vehicleType: "Minibus",
        availability: true,
    }
];

const main = async () => {
    try {
        await connectDB();

        // 1. Seed Users
        console.log("Checking Users...");
        const existingUsers = await User.countDocuments();
        let createdUsers = [];

        if (existingUsers < 2) {
            console.log("Seeding Users...");
            // Delete existing just to be clean if it's very few? No, better to upsert or just add missing.
            // Let's just create them if they don't exist by email.
            for (const u of users) {
                const exists = await User.findOne({ email: u.email });
                if (!exists) {
                    const newUser = await User.create(u);
                    console.log(`Created user: ${u.email}`);
                    createdUsers.push(newUser);
                } else {
                    createdUsers.push(exists);
                }
            }
        } else {
            console.log("Users already exist, fetching them...");
            createdUsers = await User.find({});
        }

        const drivers = createdUsers.filter(u => u.role === "driver");
        const customers = createdUsers.filter(u => u.role === "customer" || u.role === "admin"); // Admins can book too

        // 2. Seed Bookings
        console.log("Checking Bookings...");
        const existingBookings = await Booking.countDocuments();

        if (existingBookings < 5) {
            console.log("Seeding Bookings...");

            const services = ["Airport Transfer", "Chauffeur Service", "City Tour", "Hotel Transfer"];
            const vehicles = ["Sedan", "SUV", "Minibus", "Coach"];
            const statuses = ["pending", "confirmed", "completed", "cancelled"];

            const bookings = [];

            // Generate 20 bookings
            for (let i = 0; i < 20; i++) {
                // Random customer
                const customer = customers[Math.floor(Math.random() * customers.length)];
                // Random driver (optional)
                const assignedDriver = Math.random() > 0.3 ? drivers[Math.floor(Math.random() * drivers.length)] : null;

                // Random Date (Past/Future)
                const date = new Date();
                const daysOffset = Math.floor(Math.random() * 60) - 30; // +/- 30 days
                date.setDate(date.getDate() + daysOffset);

                const status = date < new Date() ? "completed" : statuses[Math.floor(Math.random() * statuses.length)];

                bookings.push({
                    user: customer._id,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    email: customer.email,
                    countryCode: "+973",
                    contactNumber: customer.phone,
                    service: services[Math.floor(Math.random() * services.length)],
                    pickupLocation: "Bahrain International Airport",
                    dropLocation: "Four Seasons Hotel",
                    pickupDate: date,
                    pickupTime: "14:00",
                    passengers: Math.floor(Math.random() * 3) + 1,
                    luggage: Math.floor(Math.random() * 2) + 1,
                    vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
                    vehicleModel: "Standard",
                    status: status,
                    amount: Math.floor(Math.random() * 50) + 20,
                    assignedDriver: assignedDriver ? assignedDriver._id : null,
                    invoiceIssued: Math.random() > 0.7
                });
            }

            await Booking.insertMany(bookings);
            console.log(`Created ${bookings.length} bookings.`);
        } else {
            console.log("Bookings already exist.");
        }

        console.log("Seed complete!");
        process.exit(0);

    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
};

main();
