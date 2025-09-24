import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const fallbackCategories = [
    "All", "India", "World", "Movies", "Sport", "Data", "Health", "Science", "Business"
  ];
  const [categories, setCategories] = useState(fallbackCategories);
  const [category, setCategory] = useState("All");
  const [source, setSource] = useState("bbc-news");
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`/api/news?source=${source}`);
        setArticles(res.data.articles || []);

        const apiCats = res.data.categories;
        if (apiCats && apiCats.length > 0) {
          const uniqueCats = Array.from(new Set(["All", ...apiCats.map((c) => c.trim()).filter(Boolean)]));
          setCategories(uniqueCats);
        } else {
          setCategories(fallbackCategories);
        }
      } catch (err) {
        console.error("Fetch error:", err.message);
        setCategories(fallbackCategories);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 60000);
    return () => clearInterval(interval);
  }, [source]);

  useEffect(() => {
    if (category === "All") {
      setFilteredArticles(articles);
    } else {
      const keyword = category.toLowerCase();
      const filtered = articles.filter(
        (a) =>
          a.title?.toLowerCase().includes(keyword) ||
          a.description?.toLowerCase().includes(keyword) ||
          (a.categories || []).some((c) => c.toLowerCase().includes(keyword))
      );
      setFilteredArticles(filtered);
    }
  }, [category, articles]);

  const toggleExpand = (index) => {
    setExpandedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const addCategory = () => {
    const clean = newCategory.trim();
    if (clean && !categories.includes(clean)) {
      setCategories([...categories, clean]);
      setNewCategory("");
    }
  };

  const removeCategory = (cat) => {
    if (cat !== "All") {
      setCategories(categories.filter((c) => c !== cat));
      if (category === cat) setCategory("All");
    }
  };

  return (
    <div className={darkMode ? "dark" : "light"}>
      <style jsx>{`
        .light {
          background-color: #f4f4f4;
          color: #000;
        }
        .dark {
          background-color: #121212;
          color: #eee;
        }
        .container {
          max-width: 1200px;
          margin: auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .top-bar {
          background: #002a4e;
          color: white;
          padding: 12px 20px;
          border-bottom: 3px solid rgba(119, 109, 51, 1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .top-left,
        .top-center,
        .top-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .top-left { justify-content: flex-start; }
        .top-right { justify-content: flex-end; }
        .title {
          font-size: 28px;
          font-weight: 700;
        }
        .auth-button {
          padding: 6px 12px;
          background: rgba(119, 109, 51, 1);
          color: #002a4e;
          border: 1px solid #002a4e;
          border-radius: 6px;
        }
        .toggle-switch {
          position: relative;
          width: 50px;
          height: 26px;
          background: #eee;
          border-radius: 50px;
          cursor: pointer;
        }
        .toggle-slider {
          position: absolute;
          top: 2px;
          left: 2px;
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: #002a4e;
          transition: 0.3s;
        }
        .dark .toggle-switch {
          background: #333;
        }
        .dark .toggle-slider {
          transform: translateX(24px);
          background: rgba(119, 109, 51, 1);
        }
        .categories {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin: 20px 0;
          gap: 8px;
        }
        .cat-btn {
          padding: 6px 12px;
          border: 1px solid #aaa;
          background: white;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          color: #002a4e;
        }
        .cat-btn.active {
          background: #002a4e;
          color: white;
        }
        .dark .cat-btn {
          background: #222;
          color: rgba(119, 109, 51, 1);
        }
        .dark .cat-btn.active {
          background: rgba(119, 109, 51, 1);
          color: #002a4e;
        }
        .edit-control {
          display: flex;
          justify-content: center;
          margin-top: 10px;
          gap: 10px;
        }
        .edit-control input {
          padding: 6px;
          font-size: 14px;
        }
        .edit-control button {
          padding: 6px 10px;
          font-size: 14px;
        }
        .remove-btn {
          color: red;
          background: none;
          border: none;
          margin-left: 4px;
          cursor: pointer;
        }
        .card-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }
        .card {
          background: white;
          border: 1px solid #ccc;
          border-radius: 10px;
          padding: 20px;
        }
        .dark .card {
          background: #1c1c1c;
          border: 1px solid #444;
        }
        .card img {
          width: 66%;
          margin: 0 auto 10px;
          border-radius: 6px;
          display: block;
        }
        .card a {
          font-size: 18px;
          font-weight: bold;
          text-decoration: none;
          color: #0040cc;
        }
        .dark .card a {
          color: #90caf9;
        }
        .description {
          font-size: 14px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 8;
          -webkit-box-orient: vertical;
        }
        .expanded {
          -webkit-line-clamp: unset !important;
        }
        .expand-btn {
          margin-top: 6px;
          padding: 4px 8px;
          font-size: 12px;
          background: #002a4e;
          color: white;
          border: none;
          border-radius: 4px;
        }
        .date {
          font-size: 12px;
          margin-top: 10px;
          font-style: italic;
          opacity: 0.6;
        }
      `}</style>

      <div className="container">
        <div className="top-bar">
          <div className="top-left">
            <div className="toggle-switch" onClick={() => setDarkMode(!darkMode)}>
              <div className="toggle-slider" />
            </div>
          </div>
          <div className="top-center">
            <div className="title">🗞️ News Aggregator</div>
          </div>
          <div className="top-right">
            <button className="auth-button">Login / Sign In</button>
          </div>
        </div>

        <hr />

        <div className="categories">
          {categories.map((cat) => (
            <div key={cat}>
              <button
                className={`cat-btn ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
              {editMode && cat !== "All" && (
                <button className="remove-btn" onClick={() => removeCategory(cat)}>
                  ✖
                </button>
              )}
            </div>
          ))}
          <button className="cat-btn" onClick={() => setEditMode(!editMode)}>
            {editMode ? "Done" : "Edit"}
          </button>
        </div>

        {editMode && (
          <div className="edit-control">
            <input
              type="text"
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={addCategory}>Add</button>
          </div>
        )}

        <hr />

        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <label style={{ fontWeight: "bold" }}>News Source:</label>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="bbc-news">BBC News</option>
            <option value="cnn">CNN</option>
            <option value="the-verge">The Verge</option>
            <option value="ndtv">NDTV</option>
            <option value="toi">Times of India</option>
            <option value="india-today">India Today</option>
            <option value="economic-times">Economic Times</option>
            <option value="the-hindu">The Hindu</option>
            <option value="reuters">Reuters</option>
            <option value="al-jazeera">Al Jazeera</option>
            <option value="deccan-herald">Deccan Herald</option>
            <option value="mint">Mint</option>
          </select>
        </div>

        <div className="card-container">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <div key={index} className="card">
                {article.image && !article.image.includes("default.jpg") && (
                  <img src={article.image} alt="News" />
                )}
                <a href={article.link} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
                <p className={`description ${expandedIndexes.includes(index) ? "expanded" : ""}`}>
                  {article.description}
                </p>
                {article.description?.length > 300 && (
                  <button className="expand-btn" onClick={() => toggleExpand(index)}>
                    {expandedIndexes.includes(index) ? "Collapse" : "Expand"}
                  </button>
                )}
                <p className="date">{new Date(article.pubDate).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No articles found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
