import { load } from "cheerio";
import axios from "axios";

export const resolvedImages = async (urls: string[]) => {
  let postPages: string[] = [];
  let fullImages: string[] = [];

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36"
  };

  for (let url of urls) {
    try {
      const response = await axios.get(url, { headers });
      const $ = load(response.data);

      // Get links to post pages from thumbnails
      $("span.thumb a").each((_, el) => {
        const href = $(el).attr("href");
        if (href) postPages.push("https://rule34.xxx/" + href);
      });
    } catch (err) {
      console.error(`❌ Failed to fetch URL: ${url}`);
    }
  }

  for (let postUrl of postPages) {
    try {
      const res = await axios.get(postUrl, { headers });
      const $ = load(res.data);
      const fullImage = $("#image").attr("src");
      if (fullImage && !fullImage.endsWith(".svg")) {
        fullImages.push(fullImage.startsWith("http") ? fullImage : "https:" + fullImage);
      }
    } catch (err) {
      console.error(`⚠️ Failed to fetch image from post: ${postUrl}`);
    }
  }

  return fullImages;
};
