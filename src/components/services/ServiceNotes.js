// src/components/services/ServiceNotes.js

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

const ServiceNotes = ({ notes, serviceId, userRole }) => {
  const { currentUser } = useAuth();
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setLoading(true);
      
      await addDoc(collection(db, 'serviceNotes'), {
        serviceId,
        content: newNote.trim(),
        createdBy: currentUser.uid,
        createdByRole: userRole,
        createdAt: serverTimestamp()
      });

      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    
    if (date.toDate) {
      return date.toDate().toLocaleString();
    }
    
    return new Date(date).toLocaleString();
  };

  return (
    <div>
      <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
        Service Notes
      </h4>
      
      {/* Add Note Form */}
      <form onSubmit={handleAddNote} style={{ marginBottom: '1.5rem' }}>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note about this service..."
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            minHeight: '100px',
            marginBottom: '0.5rem',
            resize: 'vertical'
          }}
          disabled={loading}
        />
        <Button 
          type="submit" 
          disabled={loading || !newNote.trim()}
        >
          {loading ? 'Adding Note...' : 'Add Note'}
        </Button>
      </form>
      
      {/* Notes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} style={{
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '0.5rem' 
              }}>
                <div>
                  <span style={{ 
                    fontWeight: '500',
                    marginRight: '0.5rem'
                  }}>
                    {note.createdByRole === 'agent' ? 'Agent' : 'Client'}
                  </span>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280' 
                  }}>
                    {formatDate(note.createdAt)}
                  </span>
                </div>
              </div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#6b7280',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem'
          }}>
            No notes added yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceNotes;