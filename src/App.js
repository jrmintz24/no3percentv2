// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AgentLandingPage from './pages/AgentLandingPage';
import BuyerLandingPage from './pages/BuyerLandingPage';
import SellerLandingPage from './pages/SellerLandingPage';
import FAQPage from './pages/FAQPage';
import ServicesPage from './pages/ServicesPage';
import BuyerServicesPage from './pages/BuyerServicesPage';
import SellerServicesPage from './pages/SellerServicesPage';
import HowItWorksBuyersPage from './pages/HowItWorksBuyersPage';
import HowItWorksSellersPage from './pages/HowItWorksSellersPage';
import HowItWorksAgentsPage from './pages/HowItWorksAgentsPage';

// Agent Pages
import AgentDashboardPage from './pages/AgentPages/AgentDashboardPage';
import TokenPurchasePage from './pages/AgentPages/TokenPurchasePage';
import ListingBrowser from './components/agents/ListingBrowser';
import AgentBuyerListingDetail from './components/agents/AgentBuyerListingDetail';
import AgentSellerListingDetail from './components/agents/AgentSellerListingDetail';
import AgentProposals from './components/agents/AgentProposals';
import ProposalDetail from './components/agents/ProposalDetail';
import ListingSearch from './components/agents/ListingSearch';
import AgentClientsPage from './components/agents/AgentClientsPage';
import SubscriptionManager from './components/agents/SubscriptionManager';

// Buyer Pages
import BuyerDashboardPage from './pages/BuyerPages/BuyerDashboardPage';
import BuyerListingForm from './components/buyer/BuyerListingForm';
import BuyerListingDetail from './components/buyer/BuyerListingDetail';
import BuyerListings from './components/buyer/BuyerListings';
import BuyerProposals from './components/buyer/BuyerProposals';

// Seller Pages
import SellerDashboardPage from './pages/SellerPages/SellerDashboardPage';
import SellerListingForm from './components/seller/SellerListingForm';
import SellerListingDetail from './components/seller/SellerListingDetail';
import SellerListings from './components/seller/SellerListings';
import SellerProposals from './components/seller/SellerProposals';

// Scheduling Components
import AgentAvailabilityCalendar from './components/scheduling/AgentAvailabilityCalendar';
import AppointmentsDashboard from './components/scheduling/AppointmentsDashboard';

// Shared Components
import ProtectedRoute from './routes/ProtectedRoute';
import UserProfile from './components/user/UserProfile';
import ProposalResponse from './components/shared/ProposalResponse';
import MessagesList from './components/shared/MessagesList';
import MessageChannel from './components/shared/MessageChannel';
import RootRedirect from './components/RootRedirect';

// Admin Pages
import VerificationRequests from './pages/AdminPages/VerificationRequests';

// NEW: Transaction Components
import TransactionDashboard from './pages/TransactionDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Header />
          <main>
            <Routes>
              {/* Root redirect based on user role */}
              <Route path="/" element={<RootRedirect />} />
              
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/agents" element={<AgentLandingPage />} />
              <Route path="/buyers" element={<BuyerLandingPage />} />
              <Route path="/sellers" element={<SellerLandingPage />} />
              <Route path="/faq" element={<FAQPage />} />
              
              {/* Service Pages */}
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/buyers" element={<BuyerServicesPage />} />
              <Route path="/services/sellers" element={<SellerServicesPage />} />
              
              {/* How It Works Pages */}
              <Route path="/how-it-works" element={<HowItWorksBuyersPage />} />
              <Route path="/how-it-works-sellers" element={<HowItWorksSellersPage />} />
              <Route path="/how-it-works-agents" element={<HowItWorksAgentsPage />} />
              
              {/* NEW: Transaction Route - accessible by all authenticated users */}
              <Route 
                path="/transaction/:transactionId" 
                element={
                  <ProtectedRoute>
                    <TransactionDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Agent Routes */}
              <Route 
                path="/agent/*" 
                element={
                  <ProtectedRoute requiredRole="agent">
                    <Routes>
                      <Route path="/" element={<AgentDashboardPage />} />
                      <Route path="dashboard" element={<AgentDashboardPage />} />
                      <Route path="buy-tokens" element={<TokenPurchasePage />} />
                      <Route path="listings" element={<ListingBrowser />} />
                      <Route path="buyer-listing/:listingId" element={<AgentBuyerListingDetail />} />
                      <Route path="seller-listing/:listingId" element={<AgentSellerListingDetail />} />
                      <Route path="proposals" element={<AgentProposals />} />
                      <Route path="proposals/:proposalId" element={<ProposalDetail />} />
                      <Route path="clients" element={<AgentClientsPage />} />
                      <Route path="search" element={<ListingSearch />} />
                      <Route path="profile" element={<UserProfile />} />
                      <Route path="messages" element={<MessagesList />} />
                      <Route path="messages/:channelId" element={<MessageChannel />} />
                      <Route path="availability" element={<AgentAvailabilityCalendar />} />
                      <Route path="appointments" element={<AppointmentsDashboard />} />
                      <Route path="subscription" element={<SubscriptionManager />} />
                      {/* NEW: Transaction route for agents */}
                      <Route path="transaction/:transactionId" element={<TransactionDashboard />} />
                    </Routes>
                  </ProtectedRoute>
                } 
              />
              
              {/* Buyer Routes */}
              <Route 
                path="/buyer/*" 
                element={
                  <ProtectedRoute requiredRole="buyer">
                    <Routes>
                      <Route path="/" element={<BuyerDashboardPage />} />
                      <Route path="dashboard" element={<BuyerDashboardPage />} />
                      <Route path="create-listing" element={<BuyerListingForm />} />
                      <Route path="listing/:listingId" element={<BuyerListingDetail />} />
                      <Route path="my-listings" element={<BuyerListings />} />
                      <Route path="proposals" element={<BuyerProposals />} />
                      <Route path="proposals/:proposalId" element={<ProposalResponse />} />
                      <Route path="profile" element={<UserProfile />} />
                      <Route path="messages" element={<MessagesList />} />
                      <Route path="messages/:channelId" element={<MessageChannel />} />
                      <Route path="appointments" element={<AppointmentsDashboard />} />
                      {/* NEW: Transaction route for buyers */}
                      <Route path="transaction/:transactionId" element={<TransactionDashboard />} />
                    </Routes>
                  </ProtectedRoute>
                } 
              />
              
              {/* Seller Routes */}
              <Route 
                path="/seller/*" 
                element={
                  <ProtectedRoute requiredRole="seller">
                    <Routes>
                      <Route path="/" element={<SellerDashboardPage />} />
                      <Route path="dashboard" element={<SellerDashboardPage />} />
                      <Route path="create-listing" element={<SellerListingForm />} />
                      <Route path="listing/:listingId" element={<SellerListingDetail />} />
                      <Route path="my-listings" element={<SellerListings />} />
                      <Route path="proposals" element={<SellerProposals />} />
                      <Route path="proposals/:proposalId" element={<ProposalResponse />} />
                      <Route path="profile" element={<UserProfile />} />
                      <Route path="messages" element={<MessagesList />} />
                      <Route path="messages/:channelId" element={<MessageChannel />} />
                      <Route path="appointments" element={<AppointmentsDashboard />} />
                      {/* NEW: Transaction route for sellers */}
                      <Route path="transaction/:transactionId" element={<TransactionDashboard />} />
                    </Routes>
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Routes>
                      <Route path="dashboard" element={<VerificationRequests />} />
                      <Route path="verification-requests" element={<VerificationRequests />} />
                    </Routes>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;