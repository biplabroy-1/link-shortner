import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./connectDB";
import routes from "./routes/index";
import { urlMap } from "./urlMaps";
import type { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
connectDB();

// Use the routes defined in routes.ts
app.use("/api", routes);

// Handle incoming requests for short URLs
app.get("/:shortUrl", async (req: Request, res: Response) => {
	const { shortUrl } = req.params;
	try {
		const url = await urlMap.findOne({ shortUrl });

		if (!url) {
			res.status(404).json({ error: "URL not found" });
		} else {
			res.redirect(url.longUrl || "");
		}
	} catch (error) {
		res.status(500).json({ error: "Failed to retrieve URL" });
	}
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
