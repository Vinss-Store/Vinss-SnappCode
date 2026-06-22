import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import SnippetCard from "../components/SnippetCard";
import "./Home.css";

const PER_PAGE = 10;

function Explore() {
  const [snippets, setSnippets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("semua");

  const categories = [
    { id: "semua", label: "âœ¨ Semua" },
    { id: "scraper", label: "ðŸ•·ï¸ Scraper" },
    { id: "bot", label: "ðŸ¤– Bot" },
    { id: "downloader", label: "ðŸ“¥ Downloader" },
    { id: "api", label: "ðŸ”Œ API" },
    { id: "tools", label: "ðŸ› ï¸ Tools" }
  ];

  useEffect(() => { setPage(1); }, [search, selectedCategory]);
  useEffect(() => { getSnippets(); }, [search, selectedCategory, page]);

  async function getSnippets() {
    setLoading(true);
    let query = supabase
      .from("snippets")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    if (selectedCategory && selectedCategory !== "semua") {
      const capCat = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).toLowerCase();
      query = query.or(
        `tags.cs.{"${selectedCategory.toLowerCase()}"},tags.cs.{"${capCat}"},tags.cs.{"${selectedCategory.toUpperCase()}"}`
      );
    }

    const { data, count } = await query;
    setSnippets(data || []);
    setTotal(count || 0);
    setLoading(false);
  }

  const totalPages = Math.ceil(total / PER_PAGE);

  function getPageNumbers() {
    const pages = [];
    const delta = 2;
    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);
    if (left > 1) pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (right < totalPages) pages.push(totalPages);
    return pages;
  }

  return (
    <div className="container">
      
      {/* Back Link */}
      <Link to="/" className="back-link" style={{ marginBottom: 28, display: "inline-flex" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Kembali ke Beranda
      </Link>

      {/* Explorer Header */}
      <section style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, color: "var(--text-h)", letterSpacing: "-1px", marginBottom: 12 }}>
          Eksplorasi Kode Snippet
        </h1>
        <p style={{ color: "var(--text)", fontSize: "14.5px", maxWidth: "600px", lineHeight: 1.6 }}>
          Temukan pustaka kode scraper, bot, downloader, dan utilitas siap pakai. Gunakan fitur pencarian dan kategori untuk memfilter hasil.
        </p>
      </section>

      {/* Search & Stats Header */}
      <div className="snippets-grid-header" style={{ borderTop: "1px solid var(--border)", paddingTop: 32 }}>
        <div style={{ fontSize: "14px", color: "var(--text-2)", fontWeight: 600 }}>
        </div>
        
        <div className="search-wrap" style={{ margin: 0, width: "100%", maxWidth: "340px" }}>
          <span className="search-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            className="search"
            placeholder="Cari snippet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="categories-filter-wrap" style={{ marginTop: 24, marginBottom: 32 }}>
        <div className="categories-pills">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Snippet Catalog List */}
      {loading ? (
        <div className="loading">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          Memuat snippet...
        </div>
      ) : snippets.length === 0 ? (
        <div className="empty" style={{ border: "1px solid var(--border)", borderRadius: "var(--r-lg)", background: "var(--bg-2)" }}>
          <div className="empty-icon">ðŸ“­</div>
          <p>Tidak ada snippet ditemukan untuk pencarian atau kategori ini.</p>
        </div>
      ) : (
        <>
          <div className="list-cards">
            {snippets.map((item) => (
              <SnippetCard key={item.id} item={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1}>Â«</button>
              <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>â€¹</button>

              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={i} className="page-dots">â€¦</span>
                ) : (
                  <button
                    key={i}
                    className={`page-btn ${p === page ? "page-btn-active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                )
              )}

              <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>â€º</button>
              <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>Â»</button>
            </div>
          )}
        </>
      )}

      {/* Bottom Contribution Invitation CTA */}
      <section className="cta-section" style={{ borderTop: "none", paddingTop: 40 }}>
        <div className="cta-box" style={{ background: "var(--bg-2)" }}>
          <div className="cta-box-inner">
            <h2>Punya Kode Keren untuk Dibagikan?</h2>
            <p>Bagikan karya snippet Anda (seperti bot telegram, script downloader, scraper, dll.) untuk membantu mempercepat development proyek developer lainnya.</p>
            <div className="cta-buttons">
              <Link to="/create" className="btn">
                Bagikan Snippet Anda +
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

    </div>
  );
}

export default Explore;

