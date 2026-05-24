import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Edit() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { getData(); }, []);

  async function getData() {
    const { data } = await supabase.from("snippets").select("*").eq("slug", slug).single();
    setSnippet(data);
  }

  async function updateSnippet(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase
      .from("snippets")
      .update({ title: snippet.title, code: snippet.code, language: snippet.language })
      .eq("id", snippet.id);

    if (error) {
      setError("Gagal update: " + error.message);
      setLoading(false);
      return;
    }

    navigate(`/code/${snippet.slug}`);
  }

  if (!snippet) return <div className="loading">⏳ Memuat...</div>;

  return (
    <div className="container-sm">

      <Link to={`/code/${snippet.slug}`} className="back-link" style={{ marginBottom: 28, display: "inline-flex" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Kembali
      </Link>

      <div className="form-card">
        <h2 className="form-title">Edit Snippet</h2>
        <p className="form-subtitle">Perubahan akan langsung tersimpan.</p>

        {error && <div className="alert-error"><span>⚠</span> {error}</div>}

        <form onSubmit={updateSnippet}>

          <div className="form-group">
            <label className="form-label">Judul</label>
            <input className="form-input" value={snippet.title} onChange={(e) => setSnippet({ ...snippet, title: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label">Kode</label>
            <textarea className="form-input form-textarea" value={snippet.code} onChange={(e) => setSnippet({ ...snippet, code: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label">Bahasa</label>
            <input className="form-input" value={snippet.language} onChange={(e) => setSnippet({ ...snippet, language: e.target.value })} />
          </div>

          <div className="form-actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <Link to={`/code/${snippet.slug}`}>
              <button className="btn btn-ghost" type="button">Batal</button>
            </Link>
          </div>

        </form>
      </div>

    </div>
  );
}

export default Edit;
