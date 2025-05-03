// src/config/services.js

export const buyerServices = [
    {
      id: 'property-search',
      name: 'Property Search Assistance',
      category: 'search',
      description: 'Your agent will actively search for properties matching your criteria, including off-market opportunities and pre-market listings.',
      icon: '🔍',
      fullDescription: `Comprehensive property search including:
      • Access to MLS and off-market properties
      • Daily updates on new listings
      • Personalized property recommendations
      • Comparative market analysis for each property
      • Coordination of property viewings`,
      defaultIncluded: true,
      estimatedTime: '10-20 hours',
      typicalCost: 'Included in commission'
    },
    {
      id: 'property-showings',
      name: 'Property Showings',
      category: 'viewing',
      description: 'Scheduled property tours with your agent who will point out key features, potential issues, and answer questions.',
      icon: '🏠',
      fullDescription: `Professional property viewing services:
      • Flexible scheduling including evenings and weekends
      • Detailed property evaluation during visits
      • Identification of potential issues or red flags
      • Neighborhood analysis and local insights
      • Follow-up reports after each viewing`,
      defaultIncluded: true,
      estimatedTime: '2-3 hours per property',
      typicalCost: 'Included in commission'
    },
    {
      id: 'negotiation',
      name: 'Negotiation Representation',
      category: 'transaction',
      description: 'Expert negotiation on price, terms, and conditions to get you the best deal possible.',
      icon: '🤝',
      fullDescription: `Strategic negotiation services:
      • Initial offer strategy and pricing
      • Counter-offer management
      • Contingency negotiations
      • Repair request negotiations
      • Closing cost negotiations
      • Direct communication with seller\'s agent`,
      defaultIncluded: true,
      estimatedTime: '5-10 hours',
      typicalCost: 'Included in commission'
    },
    {
      id: 'market-analysis',
      name: 'Comparative Market Analysis',
      category: 'research',
      description: 'Detailed analysis of comparable properties to ensure you\'re making competitive offers.',
      icon: '📊',
      fullDescription: `In-depth market analysis including:
      • Recent sales data for similar properties
      • Current market trends and conditions
      • Price per square foot analysis
      • Days on market statistics
      • Pricing strategy recommendations`,
      defaultIncluded: true,
      estimatedTime: '2-4 hours per property',
      typicalCost: 'Included in commission'
    },
    {
      id: 'contract-review',
      name: 'Contract Review & Support',
      category: 'transaction',
      description: 'Thorough review of all contracts and legal documents with explanations of terms and conditions.',
      icon: '📄',
      fullDescription: `Complete contract support:
      • Purchase agreement review and explanation
      • Addendum preparation and review
      • Contingency management
      • Timeline coordination
      • Legal compliance verification`,
      defaultIncluded: true,
      estimatedTime: '3-5 hours',
      typicalCost: 'Included in commission'
    },
    {
      id: 'inspection-coordination',
      name: 'Inspection Coordination',
      category: 'transaction',
      description: 'Scheduling and attending property inspections, reviewing reports, and negotiating repairs.',
      icon: '🔎',
      fullDescription: `Full inspection process management:
      • Inspector selection and scheduling
      • Attendance at all inspections
      • Report review and interpretation
      • Repair negotiation strategy
      • Re-inspection coordination if needed`,
      defaultIncluded: true,
      estimatedTime: '4-6 hours',
      typicalCost: 'Included in commission'
    },
    {
      id: 'closing-coordination',
      name: 'Closing Coordination',
      category: 'transaction',
      description: 'Management of all closing activities including document preparation and final walkthrough.',
      icon: '🔑',
      fullDescription: `Complete closing process management:
      • Timeline management
      • Document preparation and review
      • Final walkthrough coordination
      • Closing appointment scheduling
      • Key transfer arrangements`,
      defaultIncluded: true,
      estimatedTime: '5-8 hours',
      typicalCost: 'Included in commission'
    },
    {
      id: 'mortgage-assistance',
      name: 'Mortgage Lender Recommendations',
      category: 'financing',
      description: 'Connect with trusted mortgage professionals and assistance with the lending process.',
      icon: '🏦',
      fullDescription: `Financing support services:
      • Vetted lender recommendations
      • Rate comparison assistance
      • Pre-approval guidance
      • Loan program explanation
      • Documentation support`,
      defaultIncluded: true,
      estimatedTime: '2-3 hours',
      typicalCost: 'Included in commission'
    },
    {
      id: 'market-trends',
      name: 'Market Trend Analysis',
      category: 'research',
      description: 'Regular updates on market conditions, price trends, and inventory levels in your target areas.',
      icon: '📈',
      fullDescription: `Ongoing market intelligence:
      • Monthly market reports
      • Price trend analysis
      • Inventory level tracking
      • Interest rate impact analysis
      • Investment potential assessment`,
      defaultIncluded: false,
      estimatedTime: '2-3 hours monthly',
      typicalCost: '$200-300/month'
    },
    {
      id: 'neighborhood-analysis',
      name: 'Neighborhood Analysis',
      category: 'research',
      description: 'Detailed reports on schools, crime rates, amenities, and future development plans.',
      icon: '🏘️',
      fullDescription: `Comprehensive area research:
      • School district analysis
      • Crime statistics
      • Local amenities mapping
      • Development plans review
      • Community demographics`,
      defaultIncluded: false,
      estimatedTime: '3-5 hours per area',
      typicalCost: '$300-500 per report'
    },
    {
      id: 'virtual-tours',
      name: 'Virtual Tours',
      category: 'viewing',
      description: 'Live video tours of properties for remote viewing or preliminary screening.',
      icon: '📱',
      fullDescription: `Remote viewing services:
      • Live video walkthrough
      • Recorded tour availability
      • Real-time Q&A during tours
      • Detailed property notes
      • Follow-up consultation`,
      defaultIncluded: false,
      estimatedTime: '1 hour per property',
      typicalCost: '$100-150 per tour'
    }
  ];
  
  export const sellerServices = [
    {
      id: 'full-service',
      name: 'Full Listing Service',
      category: 'complete',
      description: 'Complete end-to-end selling service including marketing, showings, negotiations, and closing.',
      icon: '🌟',
      fullDescription: `Comprehensive selling package:
      • Professional photography and videography
      • MLS listing and syndication
      • Open houses and private showings
      • Marketing across all channels
      • Full negotiation support
      • Transaction management through closing`,
      defaultIncluded: true,
      estimatedTime: '40-60 hours total',
      typicalCost: '2.5-3% commission'
    },
    {
      id: 'limited-service',
      name: 'Limited Service Listing',
      category: 'basic',
      description: 'Essential listing services with MLS exposure while you handle showings and negotiations.',
      icon: '📋',
      fullDescription: `Core listing services:
      • MLS listing and syndication
      • Basic photography
      • Yard sign and lockbox
      • Contract preparation
      • Limited consultation`,
      defaultIncluded: false,
      estimatedTime: '10-15 hours total',
      typicalCost: '1-1.5% commission'
    },
    {
      id: 'professional-photography',
      name: 'Professional Photography',
      category: 'marketing',
      description: 'High-quality photos, virtual tours, and drone photography to showcase your property.',
      icon: '📸',
      fullDescription: `Professional visual marketing:
      • HDR photography
      • Drone/aerial photos
      • Virtual tour creation
      • Video walkthrough
      • Photo editing and enhancement`,
      defaultIncluded: false,
      estimatedTime: '2-3 hours',
      typicalCost: '$300-800'
    },
    {
      id: 'virtual-staging',
      name: 'Virtual Staging',
      category: 'marketing',
      description: 'Digital furniture and decor added to photos to help buyers visualize the space.',
      icon: '🖼️',
      fullDescription: `Digital staging services:
      • Professional virtual staging
      • Multiple design options
      • Before/after comparisons
      • Revision rounds included
      • Print and digital formats`,
      defaultIncluded: false,
      estimatedTime: '2-3 days turnaround',
      typicalCost: '$50-150 per room'
    },
    {
      id: 'open-houses',
      name: 'Open House Events',
      category: 'showing',
      description: 'Professionally hosted open houses with marketing and follow-up with attendees.',
      icon: '🚪',
      fullDescription: `Open house management:
      • Event planning and promotion
      • Professional hosting
      • Visitor registration
      • Follow-up with attendees
      • Feedback collection`,
      defaultIncluded: false,
      estimatedTime: '4-5 hours per event',
      typicalCost: '$200-300 per event'
    },
    {
      id: 'marketing-materials',
      name: 'Premium Marketing Materials',
      category: 'marketing',
      description: 'Custom property brochures, flyers, and feature sheets for digital and print distribution.',
      icon: '📑',
      fullDescription: `Marketing collateral creation:
      • Custom property brochures
      • Feature sheets
      • Email marketing templates
      • Social media graphics
      • Direct mail postcards`,
      defaultIncluded: false,
      estimatedTime: '3-5 hours',
      typicalCost: '$300-500'
    },
    {
      id: 'mls-listing',
      name: 'MLS Listing Only',
      category: 'basic',
      description: 'List your property on the MLS for maximum exposure to buyer agents.',
      icon: '🏢',
      fullDescription: `MLS exposure package:
      • Full MLS listing
      • Syndication to major sites
      • Basic listing management
      • Status updates
      • Limited support`,
      defaultIncluded: false,
      estimatedTime: '2-3 hours setup',
      typicalCost: '$299-499 flat fee'
    },
    {
      id: 'yard-sign',
      name: 'Yard Sign & Lockbox',
      category: 'basic',
      description: 'Professional yard signage and secure lockbox for buyer agent access.',
      icon: '📍',
      fullDescription: `Physical marketing tools:
      • Professional yard sign
      • Rider signs as needed
      • Secure lockbox
      • Installation included
      • Sign maintenance`,
      defaultIncluded: false,
      estimatedTime: '1 hour setup',
      typicalCost: '$100-150'
    },
    {
      id: 'social-media',
      name: 'Social Media Marketing',
      category: 'marketing',
      description: 'Targeted social media campaigns on Facebook, Instagram, and other platforms.',
      icon: '📱',
      fullDescription: `Social media promotion:
      • Facebook/Instagram ads
      • Targeted campaigns
      • Boosted posts
      • Story highlights
      • Performance tracking`,
      defaultIncluded: false,
      estimatedTime: '5-10 hours monthly',
      typicalCost: '$300-500 + ad spend'
    },
    {
      id: 'email-marketing',
      name: 'Email Marketing Campaign',
      category: 'marketing',
      description: 'Targeted email campaigns to agent networks and potential buyers.',
      icon: '📧',
      fullDescription: `Email marketing services:
      • Agent network outreach
      • Buyer database marketing
      • Custom email templates
      • Campaign analytics
      • Follow-up sequences`,
      defaultIncluded: false,
      estimatedTime: '3-5 hours',
      typicalCost: '$200-300'
    },
    {
      id: 'contract-negotiation',
      name: 'Contract Negotiation',
      category: 'transaction',
      description: 'Expert negotiation of offers, counteroffers, and contract terms.',
      icon: '⚖️',
      fullDescription: `Negotiation services:
      • Offer evaluation
      • Counteroffer strategy
      • Terms negotiation
      • Contingency management
      • Multiple offer handling`,
      defaultIncluded: false,
      estimatedTime: '5-10 hours',
      typicalCost: '0.5-1% commission'
    },
    {
      id: 'transaction-coordination',
      name: 'Transaction Coordination',
      category: 'transaction',
      description: 'Management of all paperwork, deadlines, and closing activities.',
      icon: '📊',
      fullDescription: `Transaction management:
      • Document preparation
      • Timeline management
      • Vendor coordination
      • Closing preparation
      • Post-closing support`,
      defaultIncluded: false,
      estimatedTime: '10-15 hours',
      typicalCost: '$500-800 flat fee'
    }
  ];
  
  export const serviceCategories = {
    buyer: [
      { id: 'search', name: 'Property Search', icon: '🔍' },
      { id: 'viewing', name: 'Property Viewing', icon: '👁️' },
      { id: 'research', name: 'Market Research', icon: '📊' },
      { id: 'transaction', name: 'Transaction Support', icon: '📝' },
      { id: 'financing', name: 'Financing Assistance', icon: '💰' }
    ],
    seller: [
      { id: 'complete', name: 'Full Service', icon: '🌟' },
      { id: 'basic', name: 'Basic Listing', icon: '📋' },
      { id: 'marketing', name: 'Marketing Services', icon: '📢' },
      { id: 'showing', name: 'Showing Services', icon: '🚪' },
      { id: 'transaction', name: 'Transaction Support', icon: '📝' }
    ]
  };