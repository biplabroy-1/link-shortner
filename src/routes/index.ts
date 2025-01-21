import { urlMap } from "../urlMaps";
import { Router } from "express";
const router = Router();
router.post("/create", async (req, res) => {
	const { link } = req.body;
	const existingLink = await urlMap.findOne({ longUrl: link });

	if (existingLink) {
		res.send({ Links: existingLink.shortUrl });
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
	res.json({ Link: newLink });
});

router.delete("/delete", (_, res) => {

    urlMap.deleteMany({}, (err) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Deleted all links");
        }
    });
});

export default router;
