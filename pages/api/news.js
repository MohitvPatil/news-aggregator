import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["enclosure", "enclosure"],
      ["content:encoded", "encodedContent"],
      ["category", "category"],
    ],
  },
});

// RSS feed map
const feedMap = {
  "bbc-news": "https://feeds.bbci.co.uk/news/rss.xml",
  cnn: "http://rss.cnn.com/rss/edition.rss",
  "the-verge": "https://www.theverge.com/rss/index.xml",
  ndtv: "https://feeds.feedburner.com/ndtvnews-top-stories",
  toi: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
  "india-today": "https://www.indiatoday.in/rss/home",
  "economic-times": "https://economictimes.indiatimes.com/rssfeedstopstories.cms",
  "the-hindu": "https://www.thehindu.com/news/national/feeder/default.rss",
  reuters: "http://feeds.reuters.com/reuters/topNews",
  "al-jazeera": "https://www.aljazeera.com/xml/rss/all.xml",
  "deccan-herald": "https://www.deccanherald.com/rss-feed/31",
  mint: "https://www.livemint.com/rss/news",
};

// ✅ helper function (not default export)
function extractImage(item) {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item.mediaContent?.url) return item.mediaContent.url;
  if (item.mediaThumbnail?.url) return item.mediaThumbnail.url;

  const html = item.encodedContent || item.content || "";
  const regexes = [
    /<img[^>]+src=["']([^"']+)["']/i,
    /<img[^>]+data-src=["']([^"']+)["']/i,
    /<img[^>]+srcset=["']([^"'>]+)["']/i,
  ];

  for (const regex of regexes) {
    const match = html.match(regex);
    if (match) return match[1];
  }

  return null;
}

// ✅ only one default export (API route handler)
export default async function handler(req, res) {
  const { source } = req.query;

  if (!source || !feedMap[source]) {
    return res
      .status(400)
      .json({ error: "Missing or invalid 'source' parameter." });
  }

  let feed;
  try {
    feed = await parser.parseURL(feedMap[source]);
  } catch (err) {
    console.error(`Failed to fetch/parse RSS feed for ${source}:`, err.message);
    return res.status(200).json({ articles: [], categories: [] });
  }

  try {
    const articles = feed.items.slice(0, 20).map((item) => {
      const image = extractImage(item);

      const itemCategories = Array.isArray(item.categories)
        ? item.categories
        : item.category
        ? [item.category]
        : [];

      return {
        title: item.title || "No Title",
        link: item.link || "#",
        pubDate: item.pubDate || "",
        description:
          item.contentSnippet || item.content || "No description available.",
        image: image || null,
        categories: itemCategories,
      };
    });

    const categorySet = new Set();
    articles.forEach((article) =>
      (article.categories || []).forEach((cat) => categorySet.add(cat.trim()))
    );

    return res.status(200).json({
      articles,
      categories: Array.from(categorySet),
    });
  } catch (parseErr) {
    console.error("Error processing feed items:", parseErr.message);
    return res.status(500).json({ error: "Failed to process articles." });
  }
}
