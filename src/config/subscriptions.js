// src/config/subscriptions.js

export const subscriptionTiers = {
    starter: {
      id: 'starter',
      name: 'Starter',
      price: 0,
      monthlyTokens: 0,
      welcomeTokens: 1, // One-time bonus
      tokenDiscount: 0,
      features: [
        'Basic agent profile',
        'Access to all listings',
        'Standard proposal submission',
        'Basic analytics (7 days)',
        'Email notifications'
      ],
      limits: {
        savedSearches: 0,
        proposalTemplates: 0,
        analyticsRetention: 7
      }
    },
    professional: {
      id: 'professional',
      name: 'Professional',
      price: 49,
      monthlyTokens: 10,
      tokenDiscount: 0.20, // 20% off
      features: [
        'Enhanced agent profile',
        'Featured badge',
        'Priority in search results',
        'Advanced analytics (30 days)',
        'Email + SMS notifications',
        'Saved searches (up to 10)',
        'Proposal templates (up to 5)',
        'Calendar integration'
      ],
      limits: {
        savedSearches: 10,
        proposalTemplates: 5,
        analyticsRetention: 30
      }
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      price: 99,
      monthlyTokens: 25,
      tokenDiscount: 0.30, // 30% off
      features: [
        'All Professional features',
        'Premium badge',
        'Top priority in search results',
        'Advanced analytics (90 days)',
        'Unlimited saved searches',
        'Unlimited proposal templates',
        'API access',
        'Bulk proposal submissions',
        'Custom branding',
        'Priority support'
      ],
      limits: {
        savedSearches: -1, // Unlimited
        proposalTemplates: -1, // Unlimited
        analyticsRetention: 90
      }
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      monthlyTokens: 100,
      tokenDiscount: 0.40, // 40% off
      features: [
        'All Premium features',
        'Multiple agent accounts (up to 5)',
        'White-label options',
        'Advanced analytics (full history)',
        'Custom API integration',
        'Dedicated account manager',
        'Custom reporting',
        'Team collaboration tools',
        'Training sessions'
      ],
      limits: {
        savedSearches: -1,
        proposalTemplates: -1,
        analyticsRetention: -1, // Full history
        teamMembers: 5
      }
    }
  };
  
  // Token packages with base prices
  export const tokenPackages = {
    basic: {
      id: 'basic',
      name: 'Basic',
      tokens: 5,
      basePrice: 25
    },
    standard: {
      id: 'standard',
      name: 'Standard',
      tokens: 20,
      basePrice: 80,
      popular: true
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      tokens: 50,
      basePrice: 150
    }
  };
  
  // Calculate discounted price based on subscription tier
  export const getTokenPackagePrice = (packageId, subscriptionTier = 'starter') => {
    const tokenPackage = tokenPackages[packageId];
    const tier = subscriptionTiers[subscriptionTier];
    
    if (!tokenPackage || !tier) return null;
    
    const discountedPrice = tokenPackage.basePrice * (1 - tier.tokenDiscount);
    return {
      originalPrice: tokenPackage.basePrice,
      discountedPrice: Math.round(discountedPrice * 100) / 100, // Round to 2 decimals
      discount: tier.tokenDiscount,
      pricePerToken: discountedPrice / tokenPackage.tokens
    };
  };