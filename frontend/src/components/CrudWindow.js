import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

function CrudWindow() {
  const [items, setItems] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', id: null });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  // Fetch items
const fetchItems = async () => {
    try {
      const res = await axios.get(API_BASE + '/items');
      setItems(res.data);
    } catch (err) {
      setError('Failed to fetch items');
    }
  };

  // Fetch activity log
const fetchActivityLog = async () => {
    try {
      const res = await axios.get(API_BASE + '/activity');
      setActivityLog(res.data.reverse());
    } catch (err) {
      setError('Failed to fetch activity log');
    }
  };

  useEffect(() => {
    fetchItems();
    fetchActivityLog();
    // Poll activity log every 5 seconds
    const interval = setInterval(fetchActivityLog, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.description) {
      setError('Name and Description are required');
      return;
    }
    try {
if (isEditing) {
        await axios.put(API_BASE + '/items/' + form.id, {
          name: form.name,
          description: form.description,
        });
      } else {
        await axios.post(API_BASE + '/items', {
          name: form.name,
          description: form.description,
        });
      }
      setForm({ name: '', description: '', id: null });
      setIsEditing(false);
      fetchItems();
      fetchActivityLog();
    } catch (err) {
      setError('Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description, id: item._id });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    setError('');
    try {
await axios.delete(API_BASE + '/items/' + id);
      fetchItems();
      fetchActivityLog();
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '40px' }}>
      <div style={{ flex: 1 }}>
        <h2>{isEditing ? 'Edit Item' : 'Add Item'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            style={{ padding: '8px', fontSize: '16px' }}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            style={{ padding: '8px', fontSize: '16px' }}
          />
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
            {isEditing ? 'Update' : 'Add'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setForm({ name: '', description: '', id: null });
                setError('');
              }}
              style={{ padding: '10px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}
            >
              Cancel
            </button>
          )}
        </form>

        <h2 style={{ marginTop: '40px' }}>Items</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item) => (
            <li key={item._id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <strong>{item.name}</strong>
              <p>{item.description}</p>
              <button onClick={() => handleEdit(item)} style={{ marginRight: '10px' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1 }}>
        <h2>CRUD Activity Log</h2>
        <div
          style={{
            height: '400px',
            overflowY: 'scroll',
            border: '1px solid #ccc',
            padding: '10px',
            backgroundColor: '#f9f9f9',
            fontFamily: 'monospace',
            fontSize: '14px',
          }}
        >
          {activityLog.length === 0 && <p>No activity yet.</p>}
          {activityLog.map((log, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              <div>
                <strong>{log.action}</strong> - {new Date(log.timestamp).toLocaleString()}
              </div>
              <div>Name: {log.item.name}</div>
              <div>Description: {log.item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CrudWindow;
