import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PackingChecklist.css';

const CATEGORIES = ['clothing', 'documents', 'electronics', 'toiletries', 'other'];
const CATEGORY_ICONS = { clothing: '👕', documents: '📄', electronics: '💻', toiletries: '🧴', other: '🎒' };

function PackingChecklist() {
  const { id } = useParams();
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('other');
  const [filterCategory, setFilterCategory] = useState('all');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => { fetchChecklist(); }, [id]);

  const fetchChecklist = async () => {
    try {
      const res = await fetch(`/api/checklists/${id}`, { headers });
      const data = await res.json();
      setChecklist(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const addItem = async () => {
    if (!newItem.trim()) return;
    await fetch(`/api/checklists/${id}/items`, {
      method: 'POST', headers,
      body: JSON.stringify({ name: newItem.trim(), category: newCategory }),
    });
    setNewItem('');
    fetchChecklist();
  };

  const toggleItem = async (itemId) => {
    await fetch(`/api/checklists/${id}/items/${itemId}/toggle`, { method: 'PUT', headers });
    fetchChecklist();
  };

  const deleteItem = async (itemId) => {
    await fetch(`/api/checklists/${id}/items/${itemId}`, { method: 'DELETE', headers });
    fetchChecklist();
  };

  const resetAll = async () => {
    if (!confirm('Mark all items as unpacked?')) return;
    await fetch(`/api/checklists/${id}/reset`, { method: 'POST', headers });
    fetchChecklist();
  };

  if (loading) return <div className="loading">Loading checklist...</div>;

  const items = checklist?.items || [];
  const filtered = filterCategory === 'all' ? items : items.filter(i => i.category === filterCategory);
  const packed = items.filter(i => i.isPacked).length;

  return (
    <div className="checklist-container">
      <div className="checklist-header">
        <div>
          <h1>🎒 Packing Checklist</h1>
          <p>{packed} / {items.length} items packed</p>
        </div>
        <div className="checklist-header-actions">
          <Link to={`/trip/${id}`} className="btn btn-outline">← Back</Link>
          {items.length > 0 && (
            <button className="btn btn-secondary" onClick={resetAll}>Reset All</button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {items.length > 0 && (
        <div className="packing-progress">
          <div className="packing-progress-bar">
            <div className="packing-progress-fill" style={{ width: `${(packed / items.length) * 100}%` }} />
          </div>
          <span>{Math.round((packed / items.length) * 100)}% packed</span>
        </div>
      )}

      {/* Add Item */}
      <div className="add-item-section">
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addItem()}
          placeholder="Add item (press Enter)"
          className="add-item-input"
        />
        <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="category-select">
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={addItem}>Add</button>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <button className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`} onClick={() => setFilterCategory('all')}>
          All ({items.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = items.filter(i => i.category === cat).length;
          return count > 0 ? (
            <button key={cat} className={`filter-btn ${filterCategory === cat ? 'active' : ''}`} onClick={() => setFilterCategory(cat)}>
              {CATEGORY_ICONS[cat]} {cat} ({count})
            </button>
          ) : null;
        })}
      </div>

      {/* Items by category */}
      {filtered.length === 0 ? (
        <div className="empty-checklist">
          <p>No items yet. Add something to pack!</p>
        </div>
      ) : (
        <div className="checklist-items">
          {CATEGORIES.filter(cat => filterCategory === 'all' || filterCategory === cat).map(cat => {
            const catItems = filtered.filter(i => i.category === cat);
            if (catItems.length === 0) return null;
            return (
              <div key={cat} className="category-group">
                <h3 className="category-title">{CATEGORY_ICONS[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
                {catItems.map(item => (
                  <div key={item._id} className={`checklist-item ${item.isPacked ? 'packed' : ''}`}>
                    <input
                      type="checkbox"
                      checked={item.isPacked}
                      onChange={() => toggleItem(item._id)}
                      className="item-checkbox"
                    />
                    <span className="item-name">{item.name}</span>
                    <button className="btn-icon" onClick={() => deleteItem(item._id)}>✕</button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PackingChecklist;
