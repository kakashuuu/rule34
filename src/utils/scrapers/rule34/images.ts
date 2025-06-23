import { load } from "cheerio";
import axios from "axios";

export const resolvedImages = async (urls: string[]) => {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 12; SM-S906N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36",
  };

  const images: string[] = [];

  for (const url of urls) {
    try {
      const response = await axios.get(url, { headers });
      const $ = load(response.data);
      const src = $("#image").attr("src");

      if (src && !src.endsWith(".svg")) {
        images.push(src.startsWith("http") ? src : `https:${src}`);
      }
    } catch (e) {
      console.warn(`Failed to fetch ${url}`);
    }
  }

  return images;
};
