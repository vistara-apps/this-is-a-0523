import React, { useState } from 'react';
import { Upload, FileText, Briefcase, Sparkles, Type } from 'lucide-react';
import FileUpload from './FileUpload';

const UploadSection = ({ 
  documents, 
  onDocumentChange, 
  onAnalyze, 
  isAnalyzing, 
  canAnalyze 
}) => {
  const [uploadMode, setUploadMode] = useState({
    resume: 'text', // 'file' or 'text'
    coverLetter: 'text',
    jobDescription: 'text'
  });

  const toggleUploadMode = (type) => {
    setUploadMode(prev => ({
      ...prev,
      [type]: prev[type] === 'file' ? 'text' : 'file'
    }));
    // Clear content when switching modes
    onDocumentChange(type, '');
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-text flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Resume *
              </label>
              <button
                onClick={() => toggleUploadMode('resume')}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {uploadMode.resume === 'file' ? <Type className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                {uploadMode.resume === 'file' ? 'Switch to text' : 'Upload file'}
              </button>
            </div>
            
            {uploadMode.resume === 'file' ? (
              <FileUpload
                onFileContent={(content) => onDocumentChange('resume', content)}
                label=""
                accept=".pdf,.docx,.txt"
              />
            ) : (
              <textarea
                value={documents.resume}
                onChange={(e) => onDocumentChange('resume', e.target.value)}
                placeholder="Paste your resume text here..."
                className="input-field min-h-[120px] resize-none"
              />
            )}
          </div>

          {/* Cover Letter Upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-text flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Cover Letter (Optional)
              </label>
              <button
                onClick={() => toggleUploadMode('coverLetter')}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {uploadMode.coverLetter === 'file' ? <Type className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                {uploadMode.coverLetter === 'file' ? 'Switch to text' : 'Upload file'}
              </button>
            </div>
            
            {uploadMode.coverLetter === 'file' ? (
              <FileUpload
                onFileContent={(content) => onDocumentChange('coverLetter', content)}
                label=""
                accept=".pdf,.docx,.txt"
              />
            ) : (
              <textarea
                value={documents.coverLetter}
                onChange={(e) => onDocumentChange('coverLetter', e.target.value)}
                placeholder="Paste your cover letter text here..."
                className="input-field min-h-[100px] resize-none"
              />
            )}
          </div>

          {/* Job Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-text flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Job Description *
              </label>
              <button
                onClick={() => toggleUploadMode('jobDescription')}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {uploadMode.jobDescription === 'file' ? <Type className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                {uploadMode.jobDescription === 'file' ? 'Switch to text' : 'Upload file'}
              </button>
            </div>
            
            {uploadMode.jobDescription === 'file' ? (
              <FileUpload
                onFileContent={(content) => onDocumentChange('jobDescription', content)}
                label=""
                accept=".pdf,.docx,.txt"
              />
            ) : (
              <textarea
                value={documents.jobDescription}
                onChange={(e) => onDocumentChange('jobDescription', e.target.value)}
                placeholder="Paste the job description you're applying for..."
                className="input-field min-h-[150px] resize-none"
              />
            )}
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
