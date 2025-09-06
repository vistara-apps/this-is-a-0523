import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Edit3, 
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

const AnalysisResults = ({ results, isAnalyzing, documents, onDocumentChange }) => {
  const [activeTab, setActiveTab] = useState('keywords');
  const [showRewritten, setShowRewritten] = useState({});

  if (isAnalyzing) {
    return (
      <div className="card-elevated">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text mb-2">Analyzing your documents...</h3>
          <p className="text-muted">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-lg font-medium text-text mb-2">Ready to analyze</h3>
          <p className="text-muted">Upload your documents and job description to get AI-powered insights</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'keywords', label: 'Keywords', icon: CheckCircle },
    { id: 'skills', label: 'Skills Gap', icon: AlertCircle },
    { id: 'rewrite', label: 'AI Rewrite', icon: Edit3 }
  ];

  const toggleRewrittenView = (section) => {
    setShowRewritten(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const applyRewrite = (section, rewrittenContent) => {
    const documentType = section.includes('resume') ? 'resume' : 'coverLetter';
    onDocumentChange(documentType, rewrittenContent);
  };

  return (
    <div className="card-elevated">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-text">Analysis Results</h2>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-muted">Analysis Complete</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-muted hover:text-text'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'keywords' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text">Keyword Optimization</h3>
            
            {/* Matched Keywords */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Matched Keywords ({results.keywordAnalysis?.matched?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-2">
                {results.keywordAnalysis?.matched?.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
                  >
                    {keyword}
                  </span>
                )) || <span className="text-green-700">No matched keywords found</span>}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Missing Keywords ({results.keywordAnalysis?.missing?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-2">
                {results.keywordAnalysis?.missing?.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm"
                  >
                    {keyword}
                  </span>
                )) || <span className="text-red-700">All important keywords are present</span>}
              </div>
              {results.keywordAnalysis?.missing?.length > 0 && (
                <p className="text-red-700 text-sm mt-2">
                  Consider incorporating these keywords naturally into your resume and cover letter.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text">Skills Gap Analysis</h3>
            
            <div className="space-y-4">
              {results.skillsGap?.map((gap, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      gap.severity === 'high' ? 'bg-red-500' :
                      gap.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-text">{gap.skill}</h4>
                      <p className="text-muted text-sm mt-1">{gap.suggestion}</p>
                      {gap.alternatives && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-muted">Alternatives: </span>
                          <span className="text-xs text-muted">{gap.alternatives.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-text font-medium">No significant skills gaps detected!</p>
                  <p className="text-muted text-sm">Your profile aligns well with the job requirements.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rewrite' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-text">AI-Powered Rewrites</h3>
            
            {/* Resume Rewrite */}
            {results.rewrittenContent?.resume && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-text">Resume - Optimized Version</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleRewrittenView('resume')}
                      className="flex items-center gap-1 text-sm text-muted hover:text-text"
                    >
                      {showRewritten.resume ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showRewritten.resume ? 'Hide' : 'Preview'}
                    </button>
                    <button
                      onClick={() => applyRewrite('resume', results.rewrittenContent.resume)}
                      className="text-sm text-primary hover:text-primary-600"
                    >
                      Apply Changes
                    </button>
                  </div>
                </div>
                
                {showRewritten.resume && (
                  <div className="bg-gray-50 rounded-md p-4 text-sm whitespace-pre-wrap border">
                    {results.rewrittenContent.resume}
                  </div>
                )}
              </div>
            )}

            {/* Cover Letter Rewrite */}
            {results.rewrittenContent?.coverLetter && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-text">Cover Letter - Optimized Version</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleRewrittenView('coverLetter')}
                      className="flex items-center gap-1 text-sm text-muted hover:text-text"
                    >
                      {showRewritten.coverLetter ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showRewritten.coverLetter ? 'Hide' : 'Preview'}
                    </button>
                    <button
                      onClick={() => applyRewrite('coverLetter', results.rewrittenContent.coverLetter)}
                      className="text-sm text-primary hover:text-primary-600"
                    >
                      Apply Changes
                    </button>
                  </div>
                </div>
                
                {showRewritten.coverLetter && (
                  <div className="bg-gray-50 rounded-md p-4 text-sm whitespace-pre-wrap border">
                    {results.rewrittenContent.coverLetter}
                  </div>
                )}
              </div>
            )}

            {/* Improvements Summary */}
            {results.improvements && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Key Improvements Made</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  {results.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;