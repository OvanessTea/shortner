import { Schema, model } from "mongoose";

interface Shortner {
    originalLink: string;
    shortLink: string;
    owner: Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const shortnerSchema = new Schema<Shortner>({
    originalLink: { type: String, required: [true, 'Original link is required'] },
    shortLink: { type: String, required: [true, 'Short link is required'] },
    owner: { type: Schema.Types.ObjectId, ref: 'user', required: [true, 'Owner is required'] },
}, { 
    timestamps: true, 
    versionKey: false 
});

export const ShortnerModel = model<Shortner>('Shortner', shortnerSchema);