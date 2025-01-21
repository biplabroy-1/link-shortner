import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./connectDB";
import routes from "./routes";
import { urlMap, type IUrlMap } from "./urlMaps";
import type { Request, Response } from "express";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
connectDB();

// Use the routes defined in routes.ts
app.use("/api", routes);

// Handle incoming requests for short URLs
app.get("/:shortCode", async (req, res) => {
	const { shortCode } = req.params;

	try {
		const url = await urlMap.findOne({ shortCode });

		if (!url) {
			return res.status(404).json({ error: "URL not found" });
		}

		// Redirect to the original URL
		res.send(url.originalUrl);
	} catch (error) {
		res.status(500).json({ error: "Failed to retrieve URL" });
	}
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
