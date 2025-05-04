// src/config/services.js

export const serviceCategories = {
    buyer: [
      { id: 'search', name: 'Property Search & Discovery', icon: '🔍' },
      { id: 'viewing', name: 'Property Viewing', icon: '👁️' },
      { id: 'research', name: 'Market Research', icon: '📊' },
      { id: 'financing', name: 'Financial & Lending Services', icon: '💰' },
      { id: 'inspection', name: 'Due Diligence & Inspections', icon: '🔎' },
      { id: 'negotiation', name: 'Negotiation & Advocacy', icon: '🤝' },
      { id: 'transaction', name: 'Transaction Management', icon: '📝' },
      { id: 'post-purchase', name: 'Post-Purchase Support', icon: '🏠' }
    ],
    seller: [
      { id: 'complete', name: 'Full Service', icon: '🌟' },
      { id: 'basic', name: 'Basic Listing', icon: '📋' },
      { id: 'preparation', name: 'Property Preparation', icon: '🏡' },
      { id: 'marketing', name: 'Marketing & Exposure', icon: '📢' },
      { id: 'showing', name: 'Showing Services', icon: '🚪' },
      { id: 'negotiation', name: 'Negotiation', icon: '🤝' },
      { id: 'transaction', name: 'Transaction Support', icon: '📝' },
      { id: 'post-sale', name: 'Post-Sale Services', icon: '✅' }
    ]
  };
  
  export const buyerServices = [
    // Property Search & Discovery Services
    {
      id: 'property-search',
      name: 'Customized Property Search',
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
      id: 'pre-listing-notifications',
      name: 'Pre-Listing Notifications',
      category: 'search',
      description: 'Get early access to properties before they hit the market through agent networks.',
      icon: '🔔',
      fullDescription: `Pre-market property access includes:
      • Agent network listings
      • Coming soon properties
      • Pocket listings
      • Early notification system
      • Priority access opportunities`,
      defaultIncluded: false,
      estimatedTime: '2-5 hours per property',
      typicalCost: '$200-500'
    },
    {
      id: 'off-market-access',
      name: 'Off-Market Property Access',
      category: 'search',
      description: 'Access exclusive properties not listed on MLS through private networks.',
      icon: '🔒',
      fullDescription: `Off-market property search includes:
      • Private seller connections
      • Agent-to-agent networking
      • Direct property owner outreach
      • Exclusive listing access
      • Non-public opportunities`,
      defaultIncluded: false,
      estimatedTime: '5-15 hours',
      typicalCost: '$500-1,500'
    },
    {
      id: 'investment-property-search',
      name: 'Investment Property Identification',
      category: 'search',
      description: 'Specialized search for income-producing properties with ROI analysis.',
      icon: '📈',
      fullDescription: `Investment property services:
      • Cash flow property search
      • ROI calculations
      • Rental market analysis
      • Multi-family opportunities
      • Investment strategy consultation`,
      defaultIncluded: false,
      estimatedTime: '10-20 hours',
      typicalCost: '$750-2,000'
    },
    {
      id: 'neighborhood-analysis',
      name: 'Neighborhood Analysis',
      category: 'search',
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
      id: 'school-district-research',
      name: 'School District Research',
      category: 'search',
      description: 'In-depth analysis of school districts, ratings, and educational opportunities.',
      icon: '🎓',
      fullDescription: `School research includes:
      • District performance data
      • Individual school ratings
      • Test score analysis
      • Extracurricular programs
      • School boundary maps`,
      defaultIncluded: false,
      estimatedTime: '2-4 hours',
      typicalCost: '$200-400'
    },
    
    // Property Viewing Services
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
      id: 'virtual-tours',
      name: 'Virtual Property Tours',
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
    },
    {
      id: 'private-showings',
      name: 'Private/After-Hours Showings',
      category: 'viewing',
      description: 'Arranged private viewings outside of regular showing hours.',
      icon: '🌙',
      fullDescription: `Special showing arrangements:
      • After-hours property access
      • Private viewing sessions
      • Weekend appointments
      • Holiday viewing coordination
      • Exclusive showing opportunities`,
      defaultIncluded: false,
      estimatedTime: '2-3 hours per showing',
      typicalCost: '$150-250 per showing'
    },
    
    // Market Research Services
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
      id: 'investment-analysis',
      name: 'Investment Property Analysis',
      category: 'research',
      description: 'Detailed financial analysis for investment properties including ROI calculations.',
      icon: '💹',
      fullDescription: `Investment analysis includes:
      • Cash flow projections
      • ROI calculations
      • Cap rate analysis
      • Rental market research
      • Tax implication overview`,
      defaultIncluded: false,
      estimatedTime: '4-6 hours per property',
      typicalCost: '$400-600 per analysis'
    },
    
    // Financial & Lending Services
    {
      id: 'mortgage-assistance',
      name: 'Mortgage & Financing Assistance',
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
      id: 'pre-approval-strategy',
      name: 'Pre-Approval Strategy',
      category: 'financing',
      description: 'Strategic approach to mortgage pre-approval to strengthen your offers.',
      icon: '✅',
      fullDescription: `Pre-approval planning includes:
      • Lender selection strategy
      • Documentation preparation
      • Credit optimization advice
      • Timing recommendations
      • Multiple lender comparison`,
      defaultIncluded: false,
      estimatedTime: '3-5 hours',
      typicalCost: '$300-500'
    },
    {
      id: 'down-payment-assistance',
      name: 'Down Payment Programs',
      category: 'financing',
      description: 'Research and assistance with down payment assistance programs and grants.',
      icon: '💵',
      fullDescription: `Down payment assistance includes:
      • Program eligibility review
      • Grant opportunity research
      • Application assistance
      • First-time buyer programs
      • State and local programs`,
      defaultIncluded: false,
      estimatedTime: '3-5 hours',
      typicalCost: '$300-500'
    },
    {
      id: 'first-time-buyer-assistance',
      name: 'First-Time Buyer Assistance',
      category: 'financing',
      description: 'Specialized guidance for first-time homebuyers including education and resources.',
      icon: '🏡',
      fullDescription: `First-time buyer support:
      • Homebuyer education
      • Special program access
      • Credit counseling referrals
      • Budgeting assistance
      • Process walkthrough`,
      defaultIncluded: false,
      estimatedTime: '5-10 hours',
      typicalCost: '$500-1,000'
    },
    
    // Due Diligence & Inspection Services
    {
      id: 'inspection-coordination',
      name: 'Home Inspection Coordination',
      category: 'inspection',
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
      id: 'specialized-inspections',
      name: 'Specialized Inspections',
      category: 'inspection',
      description: 'Coordination of specialized inspections like pest, radon, mold, or structural.',
      icon: '🔬',
      fullDescription: `Specialized inspection services:
      • Pest and termite inspection
      • Radon testing
      • Mold inspection
      • Structural engineering
      • Pool/spa inspection`,
      defaultIncluded: false,
      estimatedTime: '2-4 hours per inspection',
      typicalCost: '$200-400 per coordination'
    },
    {
      id: 'permit-research',
      name: 'Permit & Title Research',
      category: 'inspection',
      description: 'Research property permits, title history, and any legal issues.',
      icon: '📑',
      fullDescription: `Permit and title research includes:
      • Building permit history
      • Title search coordination
      • Lien verification
      • Property boundary review
      • Easement identification`,
      defaultIncluded: false,
      estimatedTime: '3-5 hours',
      typicalCost: '$300-500'
    },
    
    // Negotiation & Advocacy Services
    {
      id: 'negotiation',
      name: 'Offer Strategy & Negotiation',
      category: 'negotiation',
      description: 'Expert negotiation on price, terms, and conditions to get you the best deal possible.',
      icon: '🤝',
      fullDescription: `Strategic negotiation services:
      • Initial offer strategy and pricing
      • Counter-offer management
      • Contingency negotiations
      • Repair request negotiations
      • Closing cost negotiations
      • Direct communication with seller's agent`,
      defaultIncluded: true,
      estimatedTime: '5-10 hours',
      typicalCost: 'Included in commission'
    },
    {
      id: 'multiple-offer-strategy',
      name: 'Multiple Offer Strategy',
      category: 'negotiation',
      description: 'Specialized strategies for winning in competitive multiple offer situations.',
      icon: '🎯',
      fullDescription: `Competitive offer strategies:
      • Escalation clause drafting
      • Offer presentation enhancement
      • Pre-inspection strategy
      • Flexible closing terms
      • Personal letter writing`,
      defaultIncluded: false,
      estimatedTime: '3-5 hours',
      typicalCost: '$300-500'
    },
    {
      id: 'contingency-planning',
      name: 'Contingency Planning',
      category: 'negotiation',
      description: 'Strategic planning for offer contingencies to balance protection and competitiveness.',
      icon: '📋',
      fullDescription: `Contingency management includes:
      • Inspection contingency strategy
      • Financing contingency planning
      • Appraisal gap coverage
      • Home sale contingency options
      • Waiver risk assessment`,
      defaultIncluded: false,
      estimatedTime: '2-4 hours',
      typicalCost: '$200-400'
    },
    
    // Transaction Management Services
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
      id: 'timeline-management',
      name: 'Timeline Management',
      category: 'transaction',
      description: 'Proactive management of all deadlines and milestones throughout the transaction.',
      icon: '📅',
      fullDescription: `Timeline coordination includes:
      • Deadline tracking
      • Milestone reminders
      • Contingency period management
      • Extension coordination
      • Critical date monitoring`,
      defaultIncluded: false,
      estimatedTime: '2-4 hours',
      typicalCost: '$200-400'
    },
    
    // Post-Purchase Support Services
    {
      id: 'move-in-coordination',
      name: 'Move-in Coordination',
      category: 'post-purchase',
      description: 'Assistance with moving logistics and utility transfers.',
      icon: '🚚',
      fullDescription: `Move-in support includes:
      • Moving company recommendations
      • Utility transfer assistance
      • Change of address coordination
      • Key and access coordination
      • Move-in checklist`,
      defaultIncluded: false,
      estimatedTime: '3-5 hours',
      typicalCost: '$300-500'
    },
    {
      id: 'contractor-referrals',
      name: 'Contractor Referrals',
      category: 'post-purchase',
      description: 'Vetted contractor recommendations for repairs and improvements.',
      icon: '🔧',
      fullDescription: `Contractor referral service:
      • Licensed contractor recommendations
      • Multiple bid coordination
      • Work scope review
      • Contract review assistance
      • Quality assurance follow-up`,
      defaultIncluded: false,
      estimatedTime: '2-4 hours',
      typicalCost: '$200-400'
    },
    {
      id: 'home-warranty-setup',
      name: 'Home Warranty Setup',
      category: 'post-purchase',
      description: 'Assistance with selecting and setting up home warranty coverage.',
      icon: '🛡️',
      fullDescription: `Warranty assistance includes:
      • Warranty comparison
      • Coverage recommendation
      • Claims assistance
      • Renewal reminders
      • Vendor coordination`,
      defaultIncluded: false,
      estimatedTime: '2-3 hours',
      typicalCost: '$150-300'
    },
    {
      id: 'annual-home-review',
      name: 'Annual Home Review',
      category: 'post-purchase',
      description: 'Annual check-in to review property value and maintenance needs.',
      icon: '📊',
      fullDescription: `Annual review includes:
      • Current value assessment
      • Maintenance recommendations
      • Market update
      • Refinance opportunities
      • Equity analysis`,
      defaultIncluded: false,
      estimatedTime: '2-3 hours annually',
      typicalCost: '$200-400 per year'
    }
  ];
  
  export const sellerServices = [
    // Full Service
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
    
    // Basic Services
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
    
    // Property Preparation Services
    {
      id: 'pre-listing-inspection',
      name: 'Pre-Listing Inspection',
      category: 'preparation',
      description: 'Professional inspection before listing to identify and address issues.',
      icon: '🔍',
      fullDescription: `Pre-listing inspection includes:
      • Full home inspection
      • Report review
      • Repair recommendations
      • Cost estimates
      • Disclosure preparation`,
      defaultIncluded: false,
      estimatedTime: '3-4 hours',
      typicalCost: '$300-500'
    },
    {
      id: 'home-staging',
      name: 'Home Staging Consultation',
      category: 'preparation',
      description: 'Professional staging advice to showcase your home\'s best features.',
      icon: '🎨',
      fullDescription: `Staging consultation includes:
      • Room-by-room recommendations
      • Furniture arrangement
      • Decluttering guidance
      • Color scheme suggestions
      • Curb appeal enhancement`,
      defaultIncluded: false,
      estimatedTime: '2-3 hours',
      typicalCost: '$200-400'
    },
    {
      id: 'professional-staging',
      name: 'Professional Home Staging',
      category: 'preparation',
      description: 'Full professional staging service with furniture and decor rental.',
      icon: '🛋️',
      fullDescription: `Complete staging package:
      • Professional consultation
      • Furniture rental and placement
      • Artwork and accessories
      • Monthly maintenance
      • De-staging service`,
      defaultIncluded: false,
      estimatedTime: '1-2 days setup',
      typicalCost: '$2,000-5,000'
    },
    
    // Marketing Services
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
    
    // Showing Services
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
      id: 'broker-open-house',
      name: 'Broker Open House',
      category: 'showing',
      description: 'Special open house event exclusively for real estate agents.',
      icon: '🏢',
      fullDescription: `Broker event includes:
      • Agent-only invitation
      • Professional presentation
      • Marketing materials
      • Refreshments
      • Feedback collection`,
      defaultIncluded: false,
      estimatedTime: '3-4 hours',
      typicalCost: '$150-300'
    },
    {
      id: 'private-showings',
      name: 'Private Showing Management',
      category: 'showing',
      description: 'Coordination and hosting of private property showings.',
      icon: '🔑',
      fullDescription: `Private showing services:
      • Showing scheduling
      • Agent accompaniment
      • Property presentation
      • Buyer pre-qualification
      • Feedback follow-up`,
      defaultIncluded: true,
      estimatedTime: '1-2 hours per showing',
      typicalCost: 'Included in commission'
    },
    
    // Negotiation Services
    {
      id: 'contract-negotiation',
      name: 'Contract Negotiation',
      category: 'negotiation',
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
      id: 'repair-negotiation',
      name: 'Repair Negotiation',
      category: 'negotiation',
      description: 'Negotiation of repair requests and credits after inspection.',
      icon: '🔧',
      fullDescription: `Repair negotiation includes:
      • Inspection response
      • Repair vs credit strategy
      • Contractor estimates
      • Counter proposals
      • Final agreement`,
      defaultIncluded: true,
      estimatedTime: '3-5 hours',
      typicalCost: 'Included in commission'
    },
    
    // Transaction Management Services
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
    },
    {
      id: 'closing-assistance',
      name: 'Closing Assistance',
      category: 'transaction',
      description: 'Support through the closing process including document review and signing.',
      icon: '✍️',
      fullDescription: `Closing support includes:
      • Document review
      • Closing appointment attendance
      • Fund verification
      • Key transfer
      • Final documentation`,
      defaultIncluded: true,
      estimatedTime: '3-5 hours',
      typicalCost: 'Included in commission'
    },
    
    // Post-Sale Services
    {
      id: 'moving-assistance',
      name: 'Moving Assistance',
      category: 'post-sale',
      description: 'Help with moving logistics and coordination.',
      icon: '🚚',
      fullDescription: `Moving support includes:
      • Moving company referrals
      • Packing service coordination
      • Utility transfer assistance
      • Address change notifications
      • Moving day coordination`,
      defaultIncluded: false,
      estimatedTime: '3-5 hours',
      typicalCost: '$300-500'
    },
    {
      id: 'tax-documentation',
      name: 'Tax Documentation Assistance',
      category: 'post-sale',
      description: 'Help organizing sale documentation for tax purposes.',
      icon: '📝',
      fullDescription: `Tax documentation support:
      • Document organization
      • Cost basis calculation
      • Improvement documentation
      • 1099-S coordination
      • Tax preparer referral`,
      defaultIncluded: false,
      estimatedTime: '2-3 hours',
      typicalCost: '$200-300'
    }
  ];
  
  // Additional service categories for future expansion
  export const additionalServices = {
    luxury: [
      { id: 'luxury-marketing', name: 'Luxury Marketing Package', icon: '💎' },
      { id: 'international-marketing', name: 'International Marketing', icon: '🌍' },
      { id: 'celebrity-privacy', name: 'Celebrity Privacy Services', icon: '🕶️' },
      { id: 'luxury-staging', name: 'Luxury Home Staging', icon: '🏛️' },
      { id: 'private-jet-showings', name: 'Private Jet Showings', icon: '✈️' },
      { id: 'concierge-services', name: 'Concierge Services', icon: '🎩' },
      { id: 'white-glove-transaction', name: 'White-Glove Transaction Management', icon: '🧤' }
    ],
    investment: [
      { id: 'investment-analysis', name: 'Investment Property Analysis', icon: '📈' },
      { id: 'rental-analysis', name: 'Rental Income Analysis', icon: '🏘️' },
      { id: '1031-exchange', name: '1031 Exchange Assistance', icon: '🔄' },
      { id: 'portfolio-management', name: 'Portfolio Management', icon: '💼' },
      { id: 'multi-family-expertise', name: 'Multi-Family Expertise', icon: '🏢' },
      { id: 'commercial-property', name: 'Commercial Property Services', icon: '🏬' },
      { id: 'property-management', name: 'Property Management Referrals', icon: '🔑' },
      { id: 'market-trend-forecasting', name: 'Market Trend Forecasting', icon: '📊' }
    ],
    relocation: [
      { id: 'area-orientation', name: 'Area Orientation Tours', icon: '🗺️' },
      { id: 'school-district-tours', name: 'School District Tours', icon: '🏫' },
      { id: 'temporary-housing', name: 'Temporary Housing Assistance', icon: '🏨' },
      { id: 'moving-company-referrals', name: 'Moving Company Referrals', icon: '🚛' },
      { id: 'utility-setup', name: 'Utility Setup Assistance', icon: '💡' },
      { id: 'community-introduction', name: 'Community Introduction', icon: '👋' },
      { id: 'employment-resources', name: 'Employment Resources', icon: '💼' },
      { id: 'spousal-career-assistance', name: 'Spousal Career Assistance', icon: '👥' }
    ],
    commercial: [
      { id: 'commercial-listing', name: 'Commercial Listing', icon: '🏢' },
      { id: 'tenant-analysis', name: 'Tenant Analysis', icon: '👥' },
      { id: 'lease-negotiation', name: 'Lease Negotiation', icon: '📄' },
      { id: 'zoning-research', name: 'Zoning Research', icon: '🗺️' }
    ]
  };
  
  // Service packages for quick selection
  export const servicePackages = {
    buyer: {
      essential: {
        name: 'Essential Services',
        description: 'Core services for straightforward transactions',
        services: [
          'property-search',
          'property-showings',
          'negotiation',
          'contract-review',
          'inspection-coordination',
          'closing-coordination'
        ]
      },
      full: {
        name: 'Full Service',
        description: 'Comprehensive support throughout the transaction',
        services: [
          'property-search',
          'property-showings',
          'virtual-tours',
          'market-analysis',
          'mortgage-assistance',
          'negotiation',
          'multiple-offer-strategy',
          'contract-review',
          'inspection-coordination',
          'closing-coordination',
          'timeline-management'
        ]
      },
      premium: {
        name: 'Premium Experience',
        description: 'White-glove service with all available amenities',
        services: [
          'property-search',
          'pre-listing-notifications',
          'off-market-access',
          'property-showings',
          'virtual-tours',
          'private-showings',
          'market-analysis',
          'neighborhood-analysis',
          'mortgage-assistance',
          'pre-approval-strategy',
          'first-time-buyer-assistance',
          'negotiation',
          'multiple-offer-strategy',
          'contingency-planning',
          'contract-review',
          'inspection-coordination',
          'specialized-inspections',
          'closing-coordination',
          'timeline-management',
          'move-in-coordination',
          'contractor-referrals',
          'home-warranty-setup'
        ]
      }
    },
    seller: {
      essential: {
        name: 'Essential Services',
        description: 'Core listing services for basic exposure',
        services: [
          'mls-listing',
          'yard-sign',
          'professional-photography',
          'contract-negotiation',
          'closing-assistance'
        ]
      },
      full: {
        name: 'Full Service',
        description: 'Complete marketing and selling package',
        services: [
          'full-service',
          'home-staging',
          'professional-photography',
          'marketing-materials',
          'social-media',
          'open-houses',
          'private-showings',
          'repair-negotiation',
          'closing-assistance'
        ]
      },
      premium: {
        name: 'Premium Experience',
        description: 'Luxury service with maximum exposure',
        services: [
          'full-service',
          'pre-listing-inspection',
          'professional-staging',
          'professional-photography',
          'virtual-staging',
          'marketing-materials',
          'social-media',
          'email-marketing',
          'open-houses',
          'broker-open-house',
          'private-showings',
          'contract-negotiation',
          'repair-negotiation',
          'transaction-coordination',
          'closing-assistance',
          'moving-assistance',
          'tax-documentation'
        ]
      }
    }
  };
  
  export default {
    serviceCategories,
    buyerServices,
    sellerServices,
    additionalServices,
    servicePackages
  };