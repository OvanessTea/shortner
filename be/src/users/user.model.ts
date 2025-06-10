import { Model, Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import NotAuthorizedError from "../errors/not-authorized-error";
import { compare, genSalt, hash } from "bcryptjs";

interface User {
    _id?: Schema.Types.ObjectId;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    generateToken: () => string;
}

interface UserDoc extends Document, User {

}

interface UserModel extends Model<UserDoc> {
    findByCredentials: (email: string, password: string) => Promise<UserDoc | never>;
}

const userSchema = new Schema<UserDoc, UserModel>({
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

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await genSalt(10);
        this.password = await hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
}

userSchema.statics.findByCredentials = async function (email: string, password: string) {
    const user = await this.findOne({ email }).select("+password").orFail(new NotAuthorizedError("User not found"));
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) throw new NotAuthorizedError("Invalid password");
    
    return user;
}

export const UserModel = model<UserDoc, UserModel>("User", userSchema);