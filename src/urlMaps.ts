import mongoose, { type Document, Schema } from "mongoose";

// Define the interface for the URL mapping
export interface IUrlMap extends Document {
	longUrl: string;
	shortUrl: string;
	date: Date;
}

const urlMapSchema = new Schema({
	longUrl: {
        type: String,
        required: true,
        unique: true,
    },
	shortUrl: {
		type: String,
		required: true,
		unique: true,
	},
	date: {
		type: Date,
		default: () => new Date(),
	},
});

export const urlMap = mongoose.model<IUrlMap>("urlMap", urlMapSchema);
