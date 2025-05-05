// src/components/services/ServiceWorkspace.js

import React, { useState, useEffect } from 'react';
import { doc, updateDoc, serverTimestamp, collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Button } from '../common/Button';
import ServiceTaskList from './ServiceTaskList';
import ServiceDocuments from './ServiceDocuments';
import ServiceNotes from './ServiceNotes';
import ServiceCompletion from './ServiceCompletion';

const ServiceWorkspace = ({ service, transactionId, userRole, isExpanded, onToggle }) => {
  const { currentUser } = useAuth();
  const [activeSection, setActiveSection] = useState('tasks');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!service.id) return;

    // Subscribe to service notes
    const notesQuery = query(
      collection(db, 'serviceNotes'),
      where('serviceId', '==', service.id)
    );

    const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      }));
    });

    return () => unsubscribe();
  }, [service.id]);

  const handleStartService = async () => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'transactionServices', service.id), {
        status: 'in-progress',
        startedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error starting service:', error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#059669';
      case 'in-progress': return '#2563eb';
      case 'pending': return '#9ca3af';
      default: return '#6b7280';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'completed': return '#dcfce7';
      case 'in-progress': return '#dbeafe';
      case 'pending': return '#f3f4f6';
      default: return '#f9fafb';
    }
  };

  // Calculate task progress
  const totalTasks = service.tasks?.length || 0;
  const completedTasks = service.tasks?.filter(task => task.status === 'completed').length || 0;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card style={{ marginBottom: '1.5rem' }}>
      <CardHeader 
        style={{ 
          backgroundColor: getStatusBgColor(service.status),
          borderBottom: '1px solid #e5e7eb',
          cursor: 'pointer'
        }}
        onClick={onToggle}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '1.5rem' }}>
              {isExpanded ? '▼' : '▶'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                {service.serviceName}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: getStatusColor(service.status),
                  backgroundColor: 'white',
                  border: `1px solid ${getStatusColor(service.status)}`
                }}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1).replace('-', ' ')}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {completedTasks}/{totalTasks} tasks completed
                </span>
                {totalTasks > 0 && (
                  <div style={{ width: '100px', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '9999px' }}>
                    <div 
                      style={{ 
                        width: `${taskProgress}%`, 
                        height: '100%', 
                        backgroundColor: getStatusColor(service.status),
                        borderRadius: '9999px',
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {service.status === 'pending' && userRole === 'agent' && !isExpanded && (
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                handleStartService();
              }} 
              disabled={loading}
            >
              {loading ? 'Starting...' : 'Start Service'}
            </Button>
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardBody>
          {/* Section Navigation */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '1.5rem'
          }}>
            {['tasks', 'documents', 'notes', 'completion'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                style={{
                  padding: '0.5rem 0',
                  fontWeight: activeSection === section ? '600' : '400',
                  color: activeSection === section ? '#2563eb' : '#6b7280',
                  borderBottom: activeSection === section ? '2px solid #2563eb' : 'none',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Section Content */}
          {activeSection === 'tasks' && (
            <ServiceTaskList 
              tasks={service.tasks || []}
              serviceId={service.id}
              userRole={userRole}
            />
          )}

          {activeSection === 'documents' && (
            <ServiceDocuments
              serviceId={service.id}
              transactionId={transactionId}
              userRole={userRole}
            />
          )}

          {activeSection === 'notes' && (
            <ServiceNotes
              notes={notes}
              serviceId={service.id}
              userRole={userRole}
            />
          )}

          {activeSection === 'completion' && (
            <ServiceCompletion
              service={service}
              userRole={userRole}
            />
          )}

          {/* Start Service Button for Expanded View */}
          {service.status === 'pending' && userRole === 'agent' && (
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <Button onClick={handleStartService} disabled={loading}>
                {loading ? 'Starting Service...' : 'Start Service'}
              </Button>
            </div>
          )}
        </CardBody>
      )}
    </Card>
  );
};

export default ServiceWorkspace;