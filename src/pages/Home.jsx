import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import SnippetCard from "../components/SnippetCard";

const PER_PAGE = 10;

function Home() {
  const [snippets, setSnippets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { setPage(1); }, [search]);
  useEffect(() => { getSnippets(); }, [search, page]);

  async function getSnippets() {
    setLoading(true);
    let query = supabase
      .from("snippets")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);

    if (search) query = query.ilike("title", `%${search}%`);

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

      <div className="hero">
        <div className="hero-badge">Code Snippets</div>
        <h1>Scraper Code <span>by Vinss</span></h1>
        <p>Kumpulan snippet kode siap pakai. Cari, salin, dan gunakan langsung di proyekmu.</p>

        {total > 0 && (
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">{total}</div>
              <div className="hero-stat-label">Snippets</div>
            </div>
            <div className="hero-divider" />
            <div className="hero-stat">
              <div className="hero-stat-num">Free</div>
              <div className="hero-stat-label">Semua gratis</div>
            </div>
            <div className="hero-divider" />
            <div className="hero-stat">
              <div className="hero-stat-num">Open</div>
              <div className="hero-stat-label">Bisa upload</div>
            </div>
          </div>
        )}
      </div>

      <div className="search-wrap">
        <span className="search-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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

      {loading ? (
        <div className="loading">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          Memuat snippet...
        </div>
      ) : snippets.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <p>Tidak ada snippet ditemukan.</p>
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
              <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
              <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>

              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={i} className="page-dots">…</span>
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

              <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
              <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

    </div>
  );
}

export default Home;
