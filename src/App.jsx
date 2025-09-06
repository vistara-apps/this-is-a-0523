import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import AnalysisResults from './components/AnalysisResults';
import SubscriptionModal from './components/SubscriptionModal';
import { useSubscription } from './hooks/useSubscription';
import { analyzeDocuments } from './utils/aiAnalysis';

function App() {
  const [documents, setDocuments] = useState({
    resume: '',
    coverLetter: '',
    jobDescription: ''
  });
  
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  const { subscription, scansUsed, incrementScans, upgradeToPro } = useSubscription();

  const handleDocumentChange = (type, content) => {
    setDocuments(prev => ({
      ...prev,
      [type]: content
    }));
  };

  const handleAnalyze = async () => {
    // Check if user has exceeded free tier
    if (subscription.type === 'free' && scansUsed >= 3) {
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

  return (
    <div className="min-h-screen bg-background">
      <Header 
        subscription={subscription}
        scansUsed={scansUsed}
        onUpgrade={() => setShowSubscriptionModal(true)}
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
            canAnalyze={subscription.type === 'pro' || scansUsed < 3}
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
    </div>
  );
}

export default App;