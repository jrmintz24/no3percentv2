// src/components/transaction/TransactionOverview.js

import React from 'react';
import { Card, CardBody } from '../common/Card';

const TransactionOverview = ({ transaction, services, isAgent }) => {
  // Calculate progress metrics
  const totalTasks = services.reduce((sum, service) => sum + (service.tasks?.length || 0), 0);
  const completedTasks = services.reduce((sum, service) => 
    sum + (service.tasks?.filter(task => task.status === 'completed').length || 0), 0
  );
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group services by status
  const servicesByStatus = {
    pending: services.filter(s => s.status === 'pending'),
    'in-progress': services.filter(s => s.status === 'in-progress'),
    completed: services.filter(s => s.status === 'completed')
  };

  // Find next actions
  const getNextActions = () => {
    const actions = [];
    
    services.forEach(service => {
      if (service.status === 'in-progress') {
        const nextTask = service.tasks?.find(task => 
          task.status === 'pending' && 
          ((isAgent && task.assignee === 'agent') || 
           (!isAgent && task.assignee === 'client') ||
           task.assignee === 'both')
        );
        
        if (nextTask) {
          actions.push({
            service: service.serviceName,
            task: nextTask
          });
        }
      }
    });
    
    return actions;
  };

  const nextActions = getNextActions();

  // Get timeline dates
  const getFormattedDate = (date) => {
    if (!date) return 'Not set';
    if (date.toDate) {
      return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {/* Overall Progress Card */}
      <Card>
        <CardBody>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Transaction Progress
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Overall Progress</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{progress}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#2563eb',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>
                {completedTasks}/{totalTasks}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Tasks Completed
              </div>
            </div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: progress === 100 ? '#dcfce7' : '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              color: progress === 100 ? '#059669' : '#2563eb',
              fontSize: '1.125rem'
            }}>
              {progress}%
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Service Status Card */}
      <Card>
        <CardBody>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Service Status
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(servicesByStatus).map(([status, statusServices]) => (
              <div key={status} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 
                      status === 'completed' ? '#059669' :
                      status === 'in-progress' ? '#2563eb' : '#9ca3af'
                  }} />
                  <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>
                    {status.replace('-', ' ')}
                  </span>
                </div>
                <span style={{
                  backgroundColor: 
                    status === 'completed' ? '#dcfce7' :
                    status === 'in-progress' ? '#dbeafe' : '#f3f4f6',
                  color: 
                    status === 'completed' ? '#059669' :
                    status === 'in-progress' ? '#2563eb' : '#6b7280',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {statusServices.length}
                </span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Next Actions Card */}
      <Card>
        <CardBody>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Your Next Actions
          </h3>
          
          {nextActions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {nextActions.map((action, index) => (
                <div key={index} style={{
                  padding: '1rem',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '0.5rem'
                }}>
                  <h4 style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    {action.task.title}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    {action.task.description}
                  </p>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{
                      backgroundColor: '#dcfce7',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '0.375rem'
                    }}>
                      {action.service}
                    </span>
                    {action.task.deadline && (
                      <span>Due: {new Date(action.task.deadline).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem'
            }}>
              No pending actions for you at the moment
            </div>
          )}
        </CardBody>
      </Card>

      {/* Key Dates Card */}
      <Card>
        <CardBody>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Important Dates
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.75rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem'
            }}>
              <span style={{ color: '#6b7280' }}>Offer Accepted</span>
              <span style={{ fontWeight: '500' }}>
                {getFormattedDate(transaction.timeline?.proposalAccepted)}
              </span>
            </div>
            
            {transaction.timeline?.inspectionDeadline && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem'
              }}>
                <span style={{ color: '#6b7280' }}>Inspection Deadline</span>
                <span style={{ fontWeight: '500' }}>
                  {getFormattedDate(transaction.timeline.inspectionDeadline)}
                </span>
              </div>
            )}
            
            {transaction.timeline?.expectedClosing && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem',
                backgroundColor: '#fef3c7',
                borderRadius: '0.5rem'
              }}>
                <span style={{ color: '#92400e' }}>Expected Closing</span>
                <span style={{ fontWeight: '600', color: '#92400e' }}>
                  {getFormattedDate(transaction.timeline.expectedClosing)}
                </span>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TransactionOverview;