import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGO_URI = process.env.MONGO_URI;

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    role: { type: String, enum: ["customer", "admin", "driver", "staff"], default: "customer" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function run() {
    try {
        await mongoose.connect(MONGO_URI, {
            tls: true,
            tlsAllowInvalidCertificates: false,
        });
        console.log("✅ Connected to MongoDB");

        // Update existing staff user role
        const updated = await User.findOneAndUpdate(
            { email: "staff@flyinco.com" },
            { $set: { role: "staff" } },
            { new: true }
        );

        if (updated) {
            console.log(`✅ Updated staff@flyinco.com → role: ${updated.role}`);
        } else {
            // Create fresh if not found
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash("Staff@123", salt);
            const newUser = await User.create({
                firstName: "Staff",
                lastName: "Flyinco",
                email: "staff@flyinco.com",
                phone: "+97300000001",
                password: hashed,
                role: "staff",
            });
            console.log(`✅ Created new staff user → role: ${newUser.role}`);
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}

run();
