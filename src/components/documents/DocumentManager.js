// src/components/documents/DocumentManager.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardBody } from '../common/Card';
import { Button } from '../common/Button';

const DocumentManager = ({ transactionId, services, userRole }) => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const documentCategories = [
    { id: 'contracts', name: 'Contracts & Agreements', icon: '📄' },
    { id: 'inspections', name: 'Inspection Reports', icon: '🔍' },
    { id: 'financial', name: 'Financial Documents', icon: '💰' },
    { id: 'disclosures', name: 'Disclosures', icon: '📋' },
    { id: 'title', name: 'Title Documents', icon: '📜' },
    { id: 'insurance', name: 'Insurance', icon: '🛡️' },
    { id: 'other', name: 'Other Documents', icon: '📎' }
  ];

  useEffect(() => {
    if (!transactionId) return;

    const documentsQuery = query(
      collection(db, 'transactionDocuments'),
      where('transactionId', '==', transactionId)
    );

    const unsubscribe = onSnapshot(documentsQuery, (snapshot) => {
      const docsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocuments(docsData);
    });

    return () => unsubscribe();
  }, [transactionId]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Create storage reference
      const fileRef = ref(storage, `transactions/${transactionId}/documents/${Date.now()}_${file.name}`);
      
      // Upload file
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Create document record
      const documentData = {
        transactionId,
        serviceId: selectedService || null,
        title: file.name,
        category: selectedCategory || 'other',
        fileUrl: downloadURL,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadedBy: currentUser.uid,
        uploadedByRole: userRole,
        status: 'uploaded',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'transactionDocuments'), documentData);
      
      // Reset selections
      setSelectedService('');
      setSelectedCategory('');
      event.target.value = ''; // Reset file input
      
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploading(false);
    }
  };

  const groupDocumentsByCategory = () => {
    const grouped = {};
    documentCategories.forEach(category => {
      grouped[category.id] = documents.filter(doc => doc.category === category.id);
    });
    return grouped;
  };

  const groupedDocuments = groupDocumentsByCategory();

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Documents</h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem'
            }}
          >
            <option value="">Tag to Service (Optional)</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.serviceName}
              </option>
            ))}
          </select>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem'
            }}
          >
            <option value="">Select Category</option>
            {documentCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          
          <label>
            <input
              type="file"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              disabled={uploading}
            />
            <Button
              as="span"
              disabled={uploading}
              style={{ cursor: uploading ? 'wait' : 'pointer' }}
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </label>
        </div>
      </div>

      {/* Document Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {documentCategories.map(category => {
          const categoryDocs = groupedDocuments[category.id] || [];
          
          return (
            <Card key={category.id}>
              <CardBody>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  {category.icon} {category.name}
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    fontWeight: '400'
                  }}>
                    ({categoryDocs.length})
                  </span>
                </h3>
                
                {categoryDocs.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {categoryDocs.map(doc => (
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
                            <h4 style={{ fontWeight: '500' }}>{doc.title}</h4>
                            <div style={{ 
                              fontSize: '0.875rem', 
                              color: '#6b7280',
                              display: 'flex',
                              gap: '1rem'
                            }}>
                              <span>Uploaded by: {doc.uploadedByRole}</span>
                              <span>{doc.createdAt?.toDate?.()?.toLocaleDateString()}</span>
                              {doc.serviceId && (
                                <span style={{
                                  backgroundColor: '#dbeafe',
                                  color: '#1e40af',
                                  padding: '0.125rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.75rem'
                                }}>
                                  {services.find(s => s.id === doc.serviceId)?.serviceName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button
                            variant="secondary"
                            onClick={() => window.open(doc.fileUrl, '_blank')}
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
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: '2rem',
                    border: '2px dashed #e5e7eb',
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    No documents in this category yet
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentManager;