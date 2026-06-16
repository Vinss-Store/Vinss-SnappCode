import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Edit() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => { getData(); }, []);

  async function getData() {
    const { data } = await supabase
      .from("snippets")
      .select("*")
      .eq("slug", slug)
      .single();
    setSnippet(data);
  }

  async function updateSnippet(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Bersihkan slug dari input
    const cleanSlug = snippet.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const { error } = await supabase
      .from("snippets")
      .update({
        title: snippet.title,
        slug: cleanSlug,
        code: snippet.code,
        language: snippet.language,
        tags: typeof snippet.tags === "string"
          ? snippet.tags.split(",").map(t => t.trim()).filter(Boolean)
          : snippet.tags,
        author_name: snippet.author_name || "Anonymous",
      })
      .eq("id", snippet.id);

    if (error) {
      setError("Gagal update: " + error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Navigate ke slug baru kalau berubah
    setTimeout(() => navigate(`/code/${cleanSlug}`), 800);
  }

  if (!snippet) return <div className="loading">⏳ Memuat...</div>;

  const tagsValue = Array.isArray(snippet.tags)
    ? snippet.tags.join(", ")
    : snippet.tags || "";

  return (
    <div className="container-sm">

      <Link to={`/code/${slug}`} className="back-link" style={{ marginBottom: 28, display: "inline-flex" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Kembali
      </Link>

      <div className="form-card">
        <h2 className="form-title">Edit Snippet</h2>
        <p className="form-subtitle">Semua field bisa diedit oleh admin.</p>

        {success && (
          <div className="alert-success">
            <span>✓</span> Berhasil disimpan! Mengalihkan...
          </div>
        )}

        {error && (
          <div className="alert-error">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={updateSnippet}>

          <div className="form-group">
            <label className="form-label">Judul</label>
            <input
              className="form-input"
              value={snippet.title}
              onChange={(e) => setSnippet({ ...snippet, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Slug (URL)</label>
            <input
              className="form-input"
              value={snippet.slug}
              onChange={(e) => setSnippet({ ...snippet, slug: e.target.value })}
              placeholder="contoh: nama-snippet"
            />
            <p className="form-hint">URL: /code/{snippet.slug}</p>
          </div>

          <div className="form-group">
            <label className="form-label">Bahasa</label>
            <input
              className="form-input"
              value={snippet.language}
              onChange={(e) => setSnippet({ ...snippet, language: e.target.value })}
              placeholder="javascript, python, css..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <input
              className="form-input"
              value={tagsValue}
              onChange={(e) => setSnippet({ ...snippet, tags: e.target.value })}
              placeholder="ai, bot, downloader"
            />
            <p className="form-hint">Pisahkan dengan koma</p>
          </div>

          <div className="form-group">
            <label className="form-label">Nama Pembuat</label>
            <input
              className="form-input"
              value={snippet.author_name || ""}
              onChange={(e) => setSnippet({ ...snippet, author_name: e.target.value })}
              placeholder="Anonymous"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Kode</label>
            <textarea
              className="form-input form-textarea"
              value={snippet.code}
              onChange={(e) => setSnippet({ ...snippet, code: e.target.value })}
              required
            />
          </div>

          <div className="form-actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <Link to={`/code/${slug}`}>
              <button className="btn btn-ghost" type="button">Batal</button>
            </Link>
          </div>

        </form>
      </div>

    </div>
  );
}

export default Edit;
