import { Schema, model } from "mongoose";

interface User {
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<User>({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (email: string) => {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: "Invalid email address",
        },
    },
    password: { 
        type: String, 
        required: true,
        minlength: [6, "Password must be at least 6 characters long"],
        validate: {
            validator: (password: string) => {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
            },
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
        select: false,
    },
}, { 
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform: (_doc, ret) => {
            delete ret.password;
            return ret;
        },
    },
});

export const UserModel = model<User>("User", userSchema);