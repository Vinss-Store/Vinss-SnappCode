import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import SnippetCard from "../components/SnippetCard";

function Dashboard() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getSnippets(); }, []);

  async function getSnippets() {
    const { data } = await supabase
      .from("snippets")
      .select("*")
      .order("created_at", { ascending: false });

    setSnippets(data || []);
    setLoading(false);
  }

  return (
    <div className="container">

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>{snippets.length} snippet tersimpan</p>
        </div>
        <Link to="/create">
          <button className="btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Upload Snippet
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="loading">⏳ Memuat...</div>
      ) : snippets.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📂</div>
          <p>Belum ada snippet. Mulai upload!</p>
        </div>
      ) : (
        <div className="list-cards">
          {snippets.map((item) => (
            <SnippetCard key={item.id} item={item} />
          ))}
        </div>
      )}

    </div>
  );
}

export default Dashboard;
