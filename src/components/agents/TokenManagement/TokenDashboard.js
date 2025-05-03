import React from 'react';
import { Link } from 'react-router-dom';
import { useTokens } from '../../../hooks/useTokens';
import { Card, CardHeader, CardBody } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';

const TokenDashboard = () => {
  const { tokens, loading, error } = useTokens();
  
  return (
    <Card style={{ marginBottom: '2rem' }}>
      <CardHeader>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
          Your Tokens
        </h3>
      </CardHeader>
      
      <CardBody>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            Loading token balance...
          </div>
        ) : error ? (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: '#b91c1c', 
            padding: '0.75rem', 
            borderRadius: '0.375rem', 
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        ) : (
          <>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{ 
                backgroundColor: '#e0f2fe',
                borderRadius: '9999px',
                width: '3.5rem',
                height: '3.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#0369a1" style={{ width: '2rem', height: '2rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Available Tokens
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0369a1' }}>
                  {tokens}
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                Each token allows you to submit one proposal to a client.
              </p>
              
              <Button
                to="/agent/buy-tokens"
                fullWidth
              >
                {tokens > 0 ? 'Buy More Tokens' : 'Buy Tokens'}
              </Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default TokenDashboard;