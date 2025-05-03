import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTokens } from '../../hooks/useTokens';
import { addTokens } from '../../services/firebase/tokens';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const TokenPurchasePage = () => {
  const { currentUser } = useAuth();
  const { tokens } = useTokens();
  const navigate = useNavigate();
  
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const tokenPackages = [
    { id: 'basic', name: 'Basic', tokens: 5, price: 25 },
    { id: 'standard', name: 'Standard', tokens: 20, price: 80, popular: true },
    { id: 'premium', name: 'Premium', tokens: 50, price: 150 }
  ];
  
  const handleSelectPackage = (packageId) => {
    setSelectedPackage(packageId);
  };
  
  const handlePurchase = async () => {
    if (!selectedPackage) {
      setError('Please select a token package');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const selectedPkg = tokenPackages.find(pkg => pkg.id === selectedPackage);
      
      // In a real application, you would integrate with a payment gateway here
      // For now, we'll just simulate a successful payment and add tokens
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add tokens to user account
      await addTokens(currentUser.uid, selectedPkg.tokens);
      
      setSuccess(`Successfully purchased ${selectedPkg.tokens} tokens!`);
      setSelectedPackage(null);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/agent');
      }, 2000);
      
    } catch (err) {
      console.error('Error processing token purchase:', err);
      setError('Error processing your purchase: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          Buy Tokens
        </h1>
        <Button 
          to="/agent"
          variant="secondary"
        >
          Back to Dashboard
        </Button>
      </div>
      
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        padding: '1.5rem', 
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ 
          backgroundColor: '#e0f2fe',
          borderRadius: '9999px',
          width: '3rem',
          height: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#0369a1" style={{ width: '1.5rem', height: '1.5rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            Your Current Balance
          </h2>
          <p style={{ margin: 0 }}>
            You currently have <span style={{ fontWeight: 'bold', color: '#0369a1' }}>{tokens} token{tokens !== 1 ? 's' : ''}</span>
          </p>
        </div>
      </div>
      
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
          {success}
        </div>
      )}
      
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Select a Token Package
      </h2>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {tokenPackages.map((pkg) => (
          <div 
            key={pkg.id}
            style={{ 
              border: selectedPackage === pkg.id ? '2px solid #2563eb' : '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              position: 'relative',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              transform: selectedPackage === pkg.id ? 'translateY(-4px)' : 'none',
              boxShadow: selectedPackage === pkg.id ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
            }}
            onClick={() => handleSelectPackage(pkg.id)}
          >
            {pkg.popular && (
              <div style={{ 
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                Most Popular
              </div>
            )}
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
              {pkg.name}
            </h3>
            
            <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#2563eb', textAlign: 'center', marginBottom: '1rem' }}>
              ${pkg.price}
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pkg.tokens}</span> Tokens
            </div>
            
            <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem' }}>
              {pkg.tokens} agent proposals
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <input 
                type="radio" 
                id={`pkg-${pkg.id}`} 
                name="tokenPackage" 
                checked={selectedPackage === pkg.id}
                onChange={() => handleSelectPackage(pkg.id)}
                style={{ marginRight: '0.5rem' }}
              />
              <label htmlFor={`pkg-${pkg.id}`}>Select</label>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          Each token allows you to submit one proposal to a buyer or seller.
        </p>
        
        <Button 
          onClick={handlePurchase}
          disabled={!selectedPackage || loading}
          size="large"
        >
          {loading ? 'Processing...' : 'Purchase Tokens'}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
            How Tokens Work
          </h2>
        </CardHeader>
        <CardBody>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Why do I need tokens?
            </h3>
            <p>
              Tokens ensure that only serious agents submit proposals to clients. This helps maintain a high-quality experience for buyers and sellers.
            </p>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              How are tokens used?
            </h3>
            <p>
              Each time you submit a proposal to a buyer or seller, one token is deducted from your account. There are no recurring fees or hidden costs.
            </p>
          </div>
          
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Do tokens expire?
            </h3>
            <p>
              No, your tokens never expire. You can use them at any time to submit proposals to potential clients.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TokenPurchasePage;