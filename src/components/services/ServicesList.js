// src/components/services/ServicesList.js

import React, { useState } from 'react';
import ServiceWorkspace from './ServiceWorkspace';
import { Card, CardBody } from '../common/Card';

const ServicesList = ({ services, transactionId, userRole }) => {
  const [expandedServices, setExpandedServices] = useState({});

  // Sort services by status (active first, then pending, then completed)
  const sortedServices = [...services].sort((a, b) => {
    const statusOrder = {
      'in-progress': 0,
      'pending': 1,
      'completed': 2
    };
    return (statusOrder[a.status] || 3) - (statusOrder[b.status] || 3);
  });

  // Group services by status
  const groupedServices = {
    'in-progress': sortedServices.filter(s => s.status === 'in-progress'),
    'pending': sortedServices.filter(s => s.status === 'pending'),
    'completed': sortedServices.filter(s => s.status === 'completed')
  };

  const toggleServiceExpansion = (serviceId) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  if (services.length === 0) {
    return (
      <Card>
        <CardBody style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            No Services Found
          </h3>
          <p style={{ color: '#6b7280' }}>
            Services will appear here once they are created for this transaction.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
          Transaction Services
        </h2>
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          fontSize: '0.875rem'
        }}>
          <span style={{ color: '#6b7280' }}>
            Total Services: {services.length}
          </span>
          <span style={{ color: '#059669' }}>
            Completed: {groupedServices.completed.length}
          </span>
        </div>
      </div>

      {/* Status Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <Card>
          <CardBody style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '0.25rem' 
              }}>
                In Progress
              </h3>
              <p style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#2563eb' 
              }}>
                {groupedServices['in-progress'].length}
              </p>
            </div>
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              backgroundColor: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              ⚡
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '0.25rem' 
              }}>
                Pending
              </h3>
              <p style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#f59e0b' 
              }}>
                {groupedServices.pending.length}
              </p>
            </div>
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              ⏳
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '0.25rem' 
              }}>
                Completed
              </h3>
              <p style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#059669' 
              }}>
                {groupedServices.completed.length}
              </p>
            </div>
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              ✓
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Service Groups */}
      {Object.entries(groupedServices).map(([status, statusServices]) => {
        if (statusServices.length === 0) return null;

        return (
          <div key={status} style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {status === 'in-progress' && <span style={{ color: '#2563eb' }}>⚡</span>}
              {status === 'pending' && <span style={{ color: '#f59e0b' }}>⏳</span>}
              {status === 'completed' && <span style={{ color: '#059669' }}>✓</span>}
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')} Services
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {statusServices.map(service => (
                <ServiceWorkspace
                  key={service.id}
                  service={service}
                  transactionId={transactionId}
                  userRole={userRole}
                  isExpanded={expandedServices[service.id]}
                  onToggle={() => toggleServiceExpansion(service.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServicesList;