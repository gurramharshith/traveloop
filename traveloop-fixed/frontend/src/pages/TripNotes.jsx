import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './TripNotes.css';

function TripNotes() {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => { fetchNotes(); }, [id]);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/notes/${id}`, { headers });
      const data = await res.json();
      setNotes(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const addNote = async () => {
    if (!newContent.trim()) return;
    await fetch(`/api/notes/${id}`, {
      method: 'POST', headers,
      body: JSON.stringify({ content: newContent.trim() }),
    });
    setNewContent('');
    fetchNotes();
  };

  const saveEdit = async (noteId) => {
    await fetch(`/api/notes/${id}/${noteId}`, {
      method: 'PUT', headers,
      body: JSON.stringify({ content: editContent }),
    });
    setEditingId(null);
    fetchNotes();
  };

  const deleteNote = async (noteId) => {
    if (!confirm('Delete this note?')) return;
    await fetch(`/api/notes/${id}/${noteId}`, { method: 'DELETE', headers });
    fetchNotes();
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditContent(note.content);
  };

  if (loading) return <div className="loading">Loading notes...</div>;

  return (
    <div className="notes-container">
      <div className="notes-header">
        <div>
          <h1>📓 Trip Notes & Journal</h1>
          <p>{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to={`/trip/${id}`} className="btn btn-outline">← Back</Link>
      </div>

      {/* Add Note */}
      <div className="add-note-section">
        <textarea
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          placeholder="Write a note, reminder, or journal entry..."
          rows="4"
          className="note-textarea"
        />
        <button className="btn btn-primary" onClick={addNote} disabled={!newContent.trim()}>
          + Add Note
        </button>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="empty-notes">
          <p>📝 No notes yet. Start journaling your trip!</p>
        </div>
      ) : (
        <div className="notes-list">
          {notes.map(note => (
            <div key={note._id} className="note-card">
              {editingId === note._id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows="4"
                    className="note-textarea"
                    autoFocus
                  />
                  <div className="note-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => saveEdit(note._id)}>Save</button>
                    <button className="btn btn-outline btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p className="note-content">{note.content}</p>
                  <div className="note-footer">
                    <span className="note-timestamp">
                      {new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="note-actions">
                      <button className="btn-text" onClick={() => startEdit(note)}>✏️ Edit</button>
                      <button className="btn-text danger" onClick={() => deleteNote(note._id)}>🗑 Delete</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TripNotes;
