// src/components/services/ServiceTaskList.js

import React, { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';

const ServiceTaskList = ({ tasks, serviceId, userRole }) => {
  const { currentUser } = useAuth();
  const [updating, setUpdating] = useState(null);

  const handleTaskToggle = async (taskIndex) => {
    try {
      setUpdating(taskIndex);
      
      const task = tasks[taskIndex];
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      
      // Create updated tasks array
      const updatedTasks = tasks.map((t, index) => 
        index === taskIndex 
          ? {
              ...t,
              status: newStatus,
              completedBy: newStatus === 'completed' ? currentUser.uid : null,
              completedAt: newStatus === 'completed' ? serverTimestamp() : null
            }
          : t
      );

      // Update service document
      await updateDoc(doc(db, 'transactionServices', serviceId), {
        tasks: updatedTasks,
        updatedAt: serverTimestamp()
      });

      // Check if all tasks are completed and update service confirmation
      const allCompleted = updatedTasks.every(t => t.status === 'completed');
      if (allCompleted && userRole === 'agent') {
        await updateDoc(doc(db, 'transactionServices', serviceId), {
          agentConfirmed: true,
          agentConfirmedAt: serverTimestamp()
        });
      }

    } catch (error) {
      console.error('Error updating task:', error);
      // You might want to show an error message to the user here
    } finally {
      setUpdating(null);
    }
  };

  const canCompleteTask = (task) => {
    if (task.assignee === 'both') return true;
    if (task.assignee === 'agent' && userRole === 'agent') return true;
    if (task.assignee === 'client' && userRole === 'client') return true;
    return false;
  };

  const getTaskStatusColor = (status) => {
    return status === 'completed' ? '#059669' : '#6b7280';
  };

  const getTaskBgColor = (status) => {
    return status === 'completed' ? '#f9fafb' : 'white';
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        color: '#6b7280',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem'
      }}>
        No tasks available for this service
      </div>
    );
  }

  return (
    <div>
      <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
        Service Tasks
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tasks.map((task, index) => (
          <div 
            key={task.id || index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: getTaskBgColor(task.status)
            }}
          >
            <div style={{ marginRight: '1rem', marginTop: '0.125rem' }}>
              {canCompleteTask(task) ? (
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => handleTaskToggle(index)}
                  disabled={updating === index}
                  style={{ 
                    width: '1.25rem', 
                    height: '1.25rem',
                    cursor: updating === index ? 'wait' : 'pointer'
                  }}
                />
              ) : (
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  disabled={true}
                  style={{ 
                    width: '1.25rem', 
                    height: '1.25rem',
                    opacity: 0.5
                  }}
                />
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h5 style={{ 
                  fontWeight: '500',
                  marginBottom: '0.25rem',
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  color: getTaskStatusColor(task.status)
                }}>
                  {task.title}
                </h5>
                {task.priority === 'high' && (
                  <span style={{
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    High Priority
                  </span>
                )}
              </div>
              
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                marginBottom: '0.5rem' 
              }}>
                {task.description}
              </p>
              
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                fontSize: '0.75rem', 
                color: '#9ca3af' 
              }}>
                <span>Assigned to: {task.assignee}</span>
                {task.deadline && (
                  <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                )}
                {task.completedAt && (
                  <span>
                    Completed: {task.completedAt.toDate ? 
                      task.completedAt.toDate().toLocaleDateString() : 
                      new Date(task.completedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Task Progress Summary */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <span style={{ fontWeight: '500' }}>Progress</span>
          <span style={{ fontWeight: '500' }}>
            {tasks.filter(t => t.status === 'completed').length} / {tasks.length}
          </span>
        </div>
        
        <div style={{ 
          width: '100%', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '9999px',
          height: '0.5rem'
        }}>
          <div style={{
            width: `${(tasks.filter(t => t.status === 'completed').length / tasks.length) * 100}%`,
            backgroundColor: '#2563eb',
            height: '100%',
            borderRadius: '9999px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    </div>
  );
};

export default ServiceTaskList;