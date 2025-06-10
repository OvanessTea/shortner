import { Schema, model } from "mongoose";

interface Shortner {
    originalLink: string;
    shortLink: string;
    owner: Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    checkOwner: (ownerId: Schema.Types.ObjectId) => boolean;
}

const shortnerSchema = new Schema<Shortner>({
    originalLink: { type: String, required: [true, 'Original link is required'] },
    shortLink: { type: String, required: [true, 'Short link is required'] },
    owner: { type: Schema.Types.ObjectId, ref: 'user', required: [true, 'Owner is required'] },
}, { 
    timestamps: true, 
    versionKey: false 
});

shortnerSchema.methods.checkOwner = function (ownerId: Schema.Types.ObjectId) {
    return this.owner.toString() === ownerId.toString();
}

export const ShortnerModel = model<Shortner>('Shortner', shortnerSchema);