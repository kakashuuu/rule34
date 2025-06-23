import { load } from "cheerio";
import axios from "axios";
import { resolvedImages } from "./images";

export const scraper = async (search: string) => {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 12; SM-S906N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36",
  };

  const searchURL = `https://rule34.xxx/index.php?page=post&s=list&tags=${encodeURIComponent(search)}`;
  const response = await axios.get(searchURL, { headers });
  const $ = load(response.data);
  const postLinks: string[] = [];

  $("span.thumb a").each((_, el) => {
    const href = $(el).attr("href");
    if (href) postLinks.push(`https://rule34.xxx/${href}`);
  });

  return resolvedImages(postLinks);
};
