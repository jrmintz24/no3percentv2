// src/components/services/ServiceDocuments.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { Button } from '../common/Button';

const ServiceDocuments = ({ serviceId, transactionId, userRole }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (!serviceId) return;

    const documentsQuery = query(
      collection(db, 'transactionDocuments'),
      where('serviceId', '==', serviceId)
    );

    const unsubscribe = onSnapshot(documentsQuery, (snapshot) => {
      const docsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocuments(docsData);
    });

    return () => unsubscribe();
  }, [serviceId]);

  if (documents.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#6b7280',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem'
      }}>
        <p>No documents uploaded for this service yet.</p>
        <Button
          onClick={() => window.location.href = `#documents`}
          style={{ marginTop: '1rem' }}
        >
          Upload Document
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
        Service Documents
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {documents.map(doc => (
          <div key={doc.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📄</span>
              <div>
                <h5 style={{ fontWeight: '500' }}>{doc.title}</h5>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280' 
                }}>
                  Uploaded by: {doc.uploadedByRole} • {doc.createdAt?.toDate?.()?.toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="secondary"
                onClick={() => window.open(doc.fileUrl, '_blank')}
                size="small"
              >
                View
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = doc.fileUrl;
                  a.download = doc.fileName;
                  a.click();
                }}
                size="small"
              >
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceDocuments;