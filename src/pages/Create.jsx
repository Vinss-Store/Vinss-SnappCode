import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Create() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function uploadSnippet(e) {
    e.preventDefault();
    setLoading(true);

    const slug = title.toLowerCase().replaceAll(" ", "-") + "-" + Date.now();
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("snippets").insert([{
      title,
      slug,
      code,
      language,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      author_name: user ? "Admin" : (author.trim() || "Anonymous"),
      is_admin: !!user,
      views: 0
    }]);

    setSuccess(true);
    setLoading(false);
    setTitle(""); setCode(""); setLanguage("javascript"); setTags(""); setAuthor("");
  }

  return (
    <div className="container-sm">

      <Link to="/" className="back-link" style={{ marginBottom: 28, display: "inline-flex" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Kembali
      </Link>

      <div className="form-card">
        <h2 className="form-title">Upload Snippet</h2>
        <p className="form-subtitle">Siapapun bisa upload. Edit & hapus hanya untuk admin.</p>

        {success && (
          <div className="alert-success">
            <span>✓</span>
            Snippet berhasil diupload!{" "}
            <Link to="/" style={{ color: "var(--green)", fontWeight: 600, textDecoration: "underline" }}>
              Lihat di Home →
            </Link>
          </div>
        )}

        <form onSubmit={uploadSnippet}>

          <div className="form-group">
            <label className="form-label">Judul *</label>
            <input className="form-input" placeholder="Nama snippet..." value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Nama Kamu</label>
            <input className="form-input" placeholder="Opsional, contoh: Budi" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Kode *</label>
            <textarea className="form-input form-textarea" placeholder="// Paste kode di sini..." value={code} onChange={(e) => setCode(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Bahasa</label>
            <input className="form-input" placeholder="javascript, python, css..." value={language} onChange={(e) => setLanguage(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <input className="form-input" placeholder="ai, bot, downloader" value={tags} onChange={(e) => setTags(e.target.value)} />
            <p className="form-hint">Pisahkan dengan koma</p>
          </div>

          <div className="form-actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Mengupload..." : "Upload Snippet"}
            </button>
            <Link to="/"><button className="btn btn-ghost" type="button">Batal</button></Link>
          </div>

        </form>
      </div>

    </div>
  );
}

export default Create;
