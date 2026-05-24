import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function Detail({ user }) {
  const { slug } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [copied, setCopied] = useState(false);

  const isAdmin = !!user;

  useEffect(() => { getDetail(); }, [slug]);

  async function getDetail() {
    const { data } = await supabase.from("snippets").select("*").eq("slug", slug).single();
    setSnippet(data);
    await supabase.from("snippets").update({ views: (data.views ?? 0) + 1 }).eq("id", data.id);
  }

  async function deleteSnippet() {
    if (!confirm("Hapus snippet ini?")) return;
    const { error } = await supabase.from("snippets").delete().eq("id", snippet.id);
    if (error) { alert("Gagal hapus: " + error.message); return; }
    location.href = "/";
  }

  function copyCode() {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!snippet) return <div className="loading">⏳ Memuat...</div>;

  return (
    <div className="container">

      <Link to="/" className="back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Kembali
      </Link>

      <div className="detail-header">
        <span className="card-lang" style={{ marginTop: 16 }}>{snippet.language}</span>
        <h1>{snippet.title}</h1>

        <div className="detail-meta">
          {snippet.author_name && (
            <span className="detail-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              {snippet.author_name}
            </span>
          )}
          <span className="detail-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            {snippet.views ?? 0} views
          </span>
        </div>

        {snippet.tags?.length > 0 && (
          <div className="tags" style={{ marginTop: 12 }}>
            {snippet.tags.map((tag, i) => <span className="tag" key={i}>{tag}</span>)}
          </div>
        )}

        <div className="detail-actions">
          <button className="btn" onClick={copyCode}>
            {copied ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Tersalin!
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Salin Kode
              </>
            )}
          </button>

          {isAdmin && (
            <>
              <Link to={`/edit/${snippet.slug}`}>
                <button className="btn btn-ghost">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
              </Link>
              <button className="btn btn-danger" onClick={deleteSnippet}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
                Hapus
              </button>
            </>
          )}
        </div>
      </div>

      <SyntaxHighlighter
        language={snippet.language}
        style={oneDark}
        customStyle={{
          borderRadius: 14,
          fontSize: 13.5,
          lineHeight: 1.75,
          border: "1px solid #1e1e35",
          margin: 0,
          background: "#0d0d1a"
        }}
        showLineNumbers
        lineNumberStyle={{ color: "#2a2a45", minWidth: "2.5em" }}
      >
        {snippet.code}
      </SyntaxHighlighter>

    </div>
  );
}

export default Detail;
