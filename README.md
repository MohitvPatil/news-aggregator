# 📰 News Aggregator – Powered by Next.js

A dynamic, real-time news aggregator that allows users to:

- Select categories (India, World, Movies, Sports, Business, Health, etc.)
- Filter news by Indian and international outlets (e.g., The Hindu, Times of India, BBC, CNN)
- Switch between Dark/Light mode with a toggle switch
- Expand lengthy news descriptions
- See 3-column responsive news layout
- Add/Remove categories via an Edit Mode
- Automatically fetch RSS feeds from selected news portals

---

## 📁 Project Structure

```
news-aggregator/
├── public/
│   ├── default.jpg                  # Fallback image for articles
│   ├── sun.svg, moon.svg           # Icons for dark/light mode
├── pages/
│   ├── index.js                    # Main front-end page
│   ├── api/
│   │   └── news.js                 # API route to fetch RSS feeds
├── lib/
│   └── rssParser.js               # Centralized RSS parser config
├── styles/
│   └── globals.css                # Custom global styles
├── .gitignore
├── package.json
├── README.md
```

---

## ⚙️ Dependencies

Install the following:

```bash
npm install rss-parser
npm install axios
npm install next react react-dom
```

Ensure you're using:

- Node.js v16+ (LTS)
- Next.js 13 or 14+

---

## 🛠️ Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/MohitvPatil/news-aggregator.git
cd news-aggregator

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

Visit `http://localhost:3000` to view your site.

---

## 🌐 RSS Feed Integration

- The backend uses `rss-parser` in `pages/api/news.js` to fetch news from selected sources.
- Each outlet's category list is dynamically mapped (when available).

---

## 🌓 Dark Mode / Light Mode

- Toggle between themes using the sun/moon icon on the top right.
- Fully styled using CSS variables and Next.js class toggling.

---

## ✏️ Category Management

- Categories are shown below the site title.
- Click the "Edit" button to add/remove categories using the search bar.

---

## 🧪 Testing

Make sure you check:

- All selected channels show valid images or fall back to `default.jpg`
- Expand/collapse functionality works
- Category changes reflect in news list

---

## 🚀 Deployment

Deploy to Vercel (recommended):

1. Push the project to GitHub
2. Visit https://vercel.com
3. Import your GitHub repository
4. Follow the prompts (Vercel detects Next.js automatically)

Alternatively, use Netlify or your custom server.

---

## 🧩 Future Enhancements (Suggested)

- User login system with Firebase or Auth0
- Bookmarking / saving articles
- Notification or refresh badge for newly fetched headlines
- Integration with official News APIs (e.g., NewsAPI, NYT API)

---

## 👨‍💻 Maintainer

Developed by [Mohit Patil]  
Contact: [mohitvpatil2003@gmail.com]

---

## 📜 License

This project is licensed under the MIT License.