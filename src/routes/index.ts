import { urlMap } from "../urlMaps";
import { Router, type Request, type Response } from "express";
const router = Router();

router.post("/create", async (req: Request, res: Response) => {
	const { link } = req.body;
	const existingLink = await urlMap.findOne({ longUrl: link });
	const fullUrl = `${req.protocol}://${req.get("host")}/`;

	if (existingLink) {
		res.send({
			"Link Exist": existingLink.shortUrl,
			ShortURL: `${fullUrl}${existingLink.shortUrl}`,
		});
	}
	let shortUrl: string;
	let existingShortLink: string;
	do {
		// Generate a new random short URL
		shortUrl = Math.random().toString(36).substring(2, 7);

		// Check if the generated short URL already exists in the database
		existingShortLink = (await urlMap.findOne({ shortUrl })) || "";

		// If it doesn't exist, proceed to save the new link
	} while (existingShortLink);
	const newLink = new urlMap({
		longUrl: link,
		shortUrl,
	});
	await newLink.save();
	res.json({
		Link: newLink.shortUrl,
		ShortURL: `${fullUrl}${newLink.shortUrl}`,
	});
});

router.delete("/delete", async (req: Request, res: Response) => {
	const { link } = req.body;
	const deletedUrl = await urlMap.findOneAndDelete({ longUrl: link });
	if (!deletedUrl) {
		res.status(404).json({ error: "URL not found" });
	}
	res.json({ Link: deletedUrl });
});

export default router;
