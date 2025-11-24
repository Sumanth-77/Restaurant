import React from 'react';
import './CategoryBar.css';

export default function CategoryBar({ categories, active, onSelect }) {
  return (
    <div className="category-bar">
      {['All', ...categories].map(cat => (
        <button
          key={cat}
          className={`cat-chip ${active === cat ? 'active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
