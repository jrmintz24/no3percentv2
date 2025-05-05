// src/components/transaction/TransactionTimeline.js
import React, { useMemo } from 'react';

const TransactionTimeline = ({ transaction, services }) => {
  const timelineEvents = useMemo(() => {
    const events = [];
    
    // Add major milestones
    events.push({
      id: 'proposal-accepted',
      type: 'milestone',
      title: 'Proposal Accepted',
      date: transaction.timeline?.proposalAccepted,
      status: 'completed',
      icon: '✓'
    });
    
    // Add service events
    services.forEach(service => {
      if (service.startedAt) {
        events.push({
          id: `service-${service.id}-started`,
          type: 'service',
          title: `${service.serviceName} Started`,
          date: service.startedAt,
          status: 'completed',
          icon: '▶'
        });
      }
      
      if (service.completedAt) {
        events.push({
          id: `service-${service.id}-completed`,
          type: 'service',
          title: `${service.serviceName} Completed`,
          date: service.completedAt,
          status: 'completed',
          icon: '✓'
        });
      }
      
      // Add task completions
      service.tasks?.forEach(task => {
        if (task.completedAt) {
          events.push({
            id: `task-${service.id}-${task.id}`,
            type: 'task',
            title: task.title,
            date: task.completedAt,
            status: 'completed',
            icon: '✓',
            parentService: service.serviceName
          });
        }
      });
    });
    
    // Add future milestones
    if (transaction.timeline?.expectedClosing) {
      events.push({
        id: 'expected-closing',
        type: 'milestone',
        title: 'Expected Closing',
        date: transaction.timeline.expectedClosing,
        status: 'pending',
        icon: '🏠'
      });
    }
    
    // Sort by date
    return events.sort((a, b) => {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date || 0);
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date || 0);
      return dateA - dateB;
    });
  }, [transaction, services]);

  const getEventStyle = (event) => {
    switch (event.type) {
      case 'milestone':
        return {
          dot: event.status === 'completed' ? '#059669' : '#9ca3af',
          bg: event.status === 'completed' ? '#dcfce7' : '#f3f4f6',
          text: event.status === 'completed' ? '#065f46' : '#374151'
        };
      case 'service':
        return {
          dot: '#2563eb',
          bg: '#dbeafe',
          text: '#1e40af'
        };
      case 'task':
        return {
          dot: '#8b5cf6',
          bg: '#ede9fe',
          text: '#5b21b6'
        };
      default:
        return {
          dot: '#6b7280',
          bg: '#f3f4f6',
          text: '#374151'
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
        Transaction Timeline
      </h2>
      
      <div style={{ position: 'relative' }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute',
          left: '1rem',
          top: '1.5rem',
          bottom: '1.5rem',
          width: '2px',
          backgroundColor: '#e5e7eb'
        }} />
        
        {/* Timeline events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {timelineEvents.map((event, index) => {
            const style = getEventStyle(event);
            
            return (
              <div key={event.id} style={{ display: 'flex', position: 'relative' }}>
                {/* Event dot */}
                <div style={{
                  position: 'absolute',
                  left: '0.5rem',
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '50%',
                  backgroundColor: style.dot,
                  border: '2px solid white',
                  boxShadow: '0 0 0 2px ' + style.dot,
                  zIndex: 1
                }} />
                
                {/* Event content */}
                <div style={{
                  marginLeft: '3rem',
                  flex: 1,
                  backgroundColor: style.bg,
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <h4 style={{ 
                      fontWeight: '600',
                      color: style.text
                    }}>
                      {event.icon} {event.title}
                    </h4>
                    <span style={{ 
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      {formatDate(event.date)}
                    </span>
                  </div>
                  
                  {event.parentService && (
                    <p style={{ 
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      Part of: {event.parentService}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TransactionTimeline;