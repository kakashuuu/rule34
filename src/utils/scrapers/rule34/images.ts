import { load } from "cheerio";
import axios from "axios";

export async function resolvedImages(urls: string[]) {
  const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" };
  const postPages: string[] = [];
  const fullImages: string[] = [];

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  // Gather post URLs
  for (const url of urls) {
    try {
      const res = await axios.get(url, { headers });
      const $ = load(res.data);
      $("span.thumb a").each((_, el) => {
        const href = $(el).attr("href");
        if (href) postPages.push("https://rule34.xxx/" + href);
      });
      await sleep(300);
    } catch (_) { /* handle/log */ }
  }

  // Fetch full images
  for (const postUrl of postPages) {
    try {
      const res = await axios.get(postUrl, { headers });
      const $ = load(res.data);
      let full = $("#image, img#image").attr("src") || "";
      if (full && !full.endsWith(".svg")) {
        full = full.startsWith("//") ? `https:${full}` : full;
        fullImages.push(full);
      }
      await sleep(300);
    } catch (_) { /* handle/log */ }
  }

  return fullImages;
}
