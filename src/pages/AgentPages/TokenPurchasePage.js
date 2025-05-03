import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { addTokens } from '../../services/firebase/tokens';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const TokenPurchasePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Token package options
  const tokenPackages = [
    { id: 'basic', name: 'Basic', tokens: 5, price: 20 },
    { id: 'standard', name: 'Standard', tokens: 15, price: 50, popular: true },
    { id: 'premium', name: 'Premium', tokens: 50, price: 150 }
  ];
  
  const handlePurchase = async () => {
    if (!selectedPackage) {
      setError('Please select a token package');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Get the selected package details
      const packageDetails = tokenPackages.find(pkg => pkg.id === selectedPackage);
      
      // In a real app, you would integrate with a payment processor here
      // For now, we'll just add the tokens directly
      
      await addTokens(currentUser.uid, packageDetails.tokens, {
        packageId: packageDetails.id,
        amount: packageDetails.price,
        currency: 'USD',
        method: 'demo',
        timestamp: new Date()
      });
      
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/agent');
      }, 2000);
    } catch (error) {
      setError('Error purchasing tokens: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Buy Bid Tokens
      </h1>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '1rem', 
          borderRadius: '0.375rem', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          backgroundColor: '#dcfce7', 
          color: '#15803d', 
          padding: '1rem', 
          borderRadius: '0.375rem', 
          marginBottom: '1rem' 
        }}>
          Purchase successful! Redirecting to dashboard...
        </div>
      )}
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {tokenPackages.map((pkg) => (
          <Card 
            key={pkg.id}
            style={{ 
              marginBottom: 0,
              borderColor: selectedPackage === pkg.id ? '#2563eb' : undefined,
              borderWidth: selectedPackage === pkg.id ? '2px' : undefined,
              borderStyle: selectedPackage === pkg.id ? 'solid' : undefined,
              position: 'relative',
              overflow: 'visible'
            }}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            {pkg.popular && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '-12px',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                Popular
              </div>
            )}
            
            <CardHeader style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {pkg.name}
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
                ${pkg.price}
              </div>
            </CardHeader>
            
            <CardBody>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                textAlign: 'center', 
                margin: '1rem 0' 
              }}>
                {pkg.tokens} Tokens
              </div>
              
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                <li>Access to all listings</li>
                <li>Submit bids to clients</li>
                <li>No monthly commitment</li>
              </ul>
            </CardBody>
            
            <CardFooter>
              <Button 
                fullWidth 
                variant={selectedPackage === pkg.id ? 'primary' : 'secondary'}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {selectedPackage === pkg.id ? 'Selected' : 'Select'} 
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Button 
          size="large" 
          disabled={!selectedPackage || loading || success}
          onClick={handlePurchase}
        >
          {loading ? 'Processing...' : 'Complete Purchase'}
        </Button>
        
        <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
          This is a demo application. No actual payment will be processed.
        </p>
      </div>
    </div>
  );
};

export default TokenPurchasePage;