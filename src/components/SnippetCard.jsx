import { Link } from "react-router-dom";

function SnippetCard({ item }) {
  return (
    <Link to={`/code/${item.slug}`} className="list-card">

      <div className="list-card-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
      </div>

      <div className="list-card-body">
        <h3 className="list-card-title">{item.title}</h3>
        <div className="list-card-meta">
          <span className="list-card-lang">{item.language}</span>
          {item.tags?.slice(0, 3).map((tag, i) => (
            <span className="tag" key={i}>#{tag.trim()}</span>
          ))}
        </div>
      </div>

      <div className="list-card-arrow">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>

    </Link>
  );
}

export default SnippetCard;
