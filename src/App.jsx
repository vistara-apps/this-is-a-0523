import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import AnalysisResults from './components/AnalysisResults';
import SubscriptionModal from './components/SubscriptionModal';
import AuthModal from './components/AuthModal';
import { useSubscription } from './hooks/useSubscription';
import { useAuth } from './contexts/AuthContext';
import { analyzeDocuments } from './utils/aiAnalysis';
import { saveDocument, saveScanResult } from './lib/supabase';

function App() {
  const [documents, setDocuments] = useState({
    resume: '',
    coverLetter: '',
    jobDescription: ''
  });
  
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { subscription, scansUsed, incrementScans, upgradeToPro } = useSubscription();
  const { user, userProfile, loading: authLoading } = useAuth();

  const handleDocumentChange = (type, content) => {
    setDocuments(prev => ({
      ...prev,
      [type]: content
    }));
  };

  const handleAnalyze = async () => {
    // Check if user is authenticated (in production mode)
    if (import.meta.env.VITE_SUPABASE_URL && !user) {
      setShowAuthModal(true);
      return;
    }

    // Check if user has exceeded free tier
    const currentSubscription = userProfile?.subscription_status || subscription.type;
    if (currentSubscription === 'free' && scansUsed >= 3) {
      setShowSubscriptionModal(true);
      return;
    }

    // Validate required fields
    if (!documents.resume || !documents.jobDescription) {
      alert('Please provide both a resume and job description to analyze.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const results = await analyzeDocuments(documents);
      setAnalysisResults(results);
      incrementScans();

      // Save to database if user is authenticated
      if (user) {
        try {
          // Save documents
          const resumeDoc = await saveDocument(user.id, 'resume', documents.resume);
          const jobDescDoc = await saveDocument(user.id, 'job_description', documents.jobDescription);
          
          // Save scan result
          await saveScanResult(user.id, resumeDoc.document_id, jobDescDoc.document_id, results);
        } catch (dbError) {
          console.error('Failed to save to database:', dbError);
          // Don't fail the analysis if database save fails
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again or check your API configuration.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpgradeSubscription = () => {
    upgradeToPro();
    setShowSubscriptionModal(false);
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        subscription={userProfile?.subscription_status || subscription}
        scansUsed={scansUsed}
        onUpgrade={() => setShowSubscriptionModal(true)}
        user={user}
        onSignIn={() => setShowAuthModal(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-text mb-4 animate-fade-in">
            Tailor your resume and cover letter to perfection
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-3xl mx-auto animate-fade-in">
            Use AI to optimize your application documents against specific job descriptions. 
            Increase your chances of passing ATS screening and landing interviews.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <UploadSection
            documents={documents}
            onDocumentChange={handleDocumentChange}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            canAnalyze={(userProfile?.subscription_status || subscription.type) === 'pro' || scansUsed < 3}
          />
          
          <AnalysisResults
            results={analysisResults}
            isAnalyzing={isAnalyzing}
            documents={documents}
            onDocumentChange={handleDocumentChange}
          />
        </div>
      </main>

      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onUpgrade={handleUpgradeSubscription}
          scansUsed={scansUsed}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}

export default App;
