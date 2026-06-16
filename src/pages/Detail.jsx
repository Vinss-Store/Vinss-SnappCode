import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

// Custom dark theme matching our design
const customTheme = {
  'code[class*="language-"]': {
    color: "#e2e8f0",
    background: "none",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: "13.5px",
    lineHeight: "1.8",
    tabSize: 2,
  },
  'pre[class*="language-"]': {
    color: "#e2e8f0",
    background: "#0d0d1a",
    padding: "0",
    margin: "0",
    overflow: "auto",
    borderRadius: "0",
  },
  comment: { color: "#4a4a6a", fontStyle: "italic" },
  prolog: { color: "#4a4a6a" },
  doctype: { color: "#4a4a6a" },
  cdata: { color: "#4a4a6a" },
  punctuation: { color: "#6b7280" },
  property: { color: "#c084fc" },
  tag: { color: "#c084fc" },
  boolean: { color: "#f472b6" },
  number: { color: "#fb923c" },
  constant: { color: "#c084fc" },
  symbol: { color: "#f472b6" },
  deleted: { color: "#f87171" },
  selector: { color: "#a3e635" },
  "attr-name": { color: "#a3e635" },
  string: { color: "#86efac" },
  char: { color: "#86efac" },
  builtin: { color: "#86efac" },
  inserted: { color: "#86efac" },
  operator: { color: "#94a3b8" },
  entity: { color: "#fbbf24", cursor: "help" },
  url: { color: "#94a3b8" },
  variable: { color: "#e2e8f0" },
  atrule: { color: "#c084fc" },
  "attr-value": { color: "#86efac" },
  function: { color: "#60a5fa" },
  "class-name": { color: "#f9a8d4" },
  keyword: { color: "#c084fc", fontWeight: "600" },
  regex: { color: "#fbbf24" },
  important: { color: "#fbbf24", fontWeight: "bold" },
};

function Detail({ user }) {
  const { slug } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [copied, setCopied] = useState(false);

  const isAdmin = !!user;

  useEffect(() => { getDetail(); }, [slug]);

  async function getDetail() {
    const { data } = await supabase
      .from("snippets")
      .select("*")
      .eq("slug", slug)
      .single();

    setSnippet(data);
    await supabase
      .from("snippets")
      .update({ views: (data.views ?? 0) + 1 })
      .eq("id", data.id);
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

  if (!snippet) return (
    <div className="loading">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Memuat...
    </div>
  );

  const lineCount = snippet.code.split("\n").length;

  return (
    <div className="detail-page">

      {/* Top bar */}
      <div className="detail-topbar">
        <Link to="/" className="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Kembali
        </Link>
        <div className="detail-topbar-right">
          <span className="detail-lines">{lineCount} baris</span>
          <span className="card-lang">{snippet.language}</span>
        </div>
      </div>

      {/* Header */}
      <div className="detail-hero">
        <div className="detail-hero-inner">
          <h1 className="detail-title">{snippet.title}</h1>

          <div className="detail-info-row">
            <span className="detail-info-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              {snippet.views ?? 0} views
            </span>
            {snippet.author_name && (
              <span className="detail-info-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                {snippet.author_name}
              </span>
            )}
          </div>

          {snippet.tags?.length > 0 && (
            <div className="tags" style={{ marginTop: 12 }}>
              {snippet.tags.map((tag, i) => <span className="tag" key={i}>{tag}</span>)}
            </div>
          )}

          {/* Action buttons */}
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
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                  </svg>
                  Hapus
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Code block */}
      <div className="code-wrapper">
        {/* Code header bar */}
        <div className="code-header">
          <div className="code-dots">
            <span style={{ background: "#ef4444" }} />
            <span style={{ background: "#f59e0b" }} />
            <span style={{ background: "#10b981" }} />
          </div>
          <span className="code-filename">
            {snippet.title.toLowerCase().replace(/\s+/g, "-")}.{getExt(snippet.language)}
          </span>
          <button className="code-copy-btn" onClick={copyCode}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>

        {/* Syntax highlighter */}
        <div className="code-body">
          <SyntaxHighlighter
            language={snippet.language}
            style={customTheme}
            showLineNumbers
            lineNumberStyle={{
              color: "#2a2a4a",
              fontSize: "12px",
              paddingRight: "20px",
              minWidth: "3em",
              userSelect: "none",
            }}
            customStyle={{
              margin: 0,
              padding: "24px 0 24px 0",
              background: "transparent",
              fontSize: "13.5px",
              lineHeight: "1.8",
            }}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>
      </div>

    </div>
  );
}

function getExt(lang) {
  const map = {
    javascript: "js", typescript: "ts", python: "py",
    java: "java", css: "css", html: "html",
    nodejs: "js", commonjs: "js", php: "php",
    bash: "sh", shell: "sh", json: "json",
    rust: "rs", go: "go", cpp: "cpp", c: "c",
  };
  return map[lang?.toLowerCase()] ?? "txt";
}

export default Detail;
