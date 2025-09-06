import React from 'react';
import { Upload, FileText, Briefcase, Sparkles } from 'lucide-react';

const UploadSection = ({ 
  documents, 
  onDocumentChange, 
  onAnalyze, 
  isAnalyzing, 
  canAnalyze 
}) => {
  const handleFileUpload = (type, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onDocumentChange(type, e.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="card-elevated">
        <h2 className="text-2xl font-semibold text-text mb-6 flex items-center gap-2">
          <Upload className="w-6 h-6 text-primary" />
          Upload Documents
        </h2>

        {/* Resume Upload */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Resume *
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept=".txt,.doc,.docx"
                onChange={(e) => e.target.files[0] && handleFileUpload('resume', e.target.files[0])}
                className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-600"
              />
              <div className="relative">
                <textarea
                  value={documents.resume}
                  onChange={(e) => onDocumentChange('resume', e.target.value)}
                  placeholder="Or paste your resume text here..."
                  className="input-field min-h-[120px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Cover Letter Upload */}
          <div>
            <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Cover Letter (Optional)
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept=".txt,.doc,.docx"
                onChange={(e) => e.target.files[0] && handleFileUpload('coverLetter', e.target.files[0])}
                className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-600"
              />
              <textarea
                value={documents.coverLetter}
                onChange={(e) => onDocumentChange('coverLetter', e.target.value)}
                placeholder="Or paste your cover letter text here..."
                className="input-field min-h-[100px] resize-none"
              />
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Job Description *
            </label>
            <textarea
              value={documents.jobDescription}
              onChange={(e) => onDocumentChange('jobDescription', e.target.value)}
              placeholder="Paste the job description you're applying for..."
              className="input-field min-h-[150px] resize-none"
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onAnalyze}
            disabled={!canAnalyze || isAnalyzing || !documents.resume || !documents.jobDescription}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze & Optimize
              </>
            )}
          </button>
          
          {!canAnalyze && (
            <p className="text-sm text-muted mt-2 text-center">
              You've used all your free scans. Upgrade to Pro for unlimited access.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadSection;