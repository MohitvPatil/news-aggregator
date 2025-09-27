import { useEffect, useState } from "react";
import axios from "axios";
import backgroundImage from "D:/VScodes/News Aggregator/public/background.webp";

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

  const backgroundImageStyle = {
    backgroundImage: `url(${backgroundImage.src})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",            // allows background to cover entire page
    width: "100%",
  };

  return (
    <div style={backgroundImageStyle}>
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
