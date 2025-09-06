// File parsing utilities for PDF and DOCX files
import mammoth from 'mammoth';

// Parse DOCX files
export const parseDocx = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error parsing DOCX file:', error);
    throw new Error('Failed to parse DOCX file. Please try again or use a different format.');
  }
};

// Parse PDF files (simplified implementation)
// Note: For production, consider using a more robust PDF parser like PDF.js
export const parsePdf = async (file) => {
  try {
    // This is a simplified implementation
    // In production, you would use a library like PDF.js or pdf-parse
    const text = await extractTextFromPdf(file);
    return text;
  } catch (error) {
    console.error('Error parsing PDF file:', error);
    throw new Error('Failed to parse PDF file. Please try again or use a different format.');
  }
};

// Simplified PDF text extraction (placeholder)
const extractTextFromPdf = async (file) => {
  // This is a placeholder implementation
  // In a real application, you would use PDF.js or a similar library
  // For now, we'll return a message asking users to copy-paste content
  throw new Error('PDF parsing not fully implemented. Please copy and paste your content instead.');
};

// Parse text files
export const parseText = async (file) => {
  try {
    const text = await file.text();
    return text;
  } catch (error) {
    console.error('Error parsing text file:', error);
    throw new Error('Failed to parse text file. Please try again.');
  }
};

// Main file parser function
export const parseFile = async (file) => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      fileName.endsWith('.docx')) {
    return await parseDocx(file);
  } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return await parsePdf(file);
  } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    return await parseText(file);
  } else {
    throw new Error('Unsupported file type. Please use PDF, DOCX, or TXT files.');
  }
};

// Validate file size and type
export const validateFile = (file, maxSizeMB = 5) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    throw new Error(`File size must be less than ${maxSizeMB}MB`);
  }

  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  const allowedExtensions = ['.pdf', '.docx', '.txt'];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

  if (!allowedTypes.includes(file.type) && !hasValidExtension) {
    throw new Error('Invalid file type. Please use PDF, DOCX, or TXT files.');
  }

  return true;
};

// Extract key information from resume text
export const extractResumeInfo = (text) => {
  const info = {
    email: null,
    phone: null,
    skills: [],
    experience: [],
    education: []
  };

  // Extract email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) {
    info.email = emailMatch[0];
  }

  // Extract phone number (basic pattern)
  const phoneMatch = text.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);
  if (phoneMatch) {
    info.phone = phoneMatch[0];
  }

  // Extract common skills (basic implementation)
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
    'AWS', 'Docker', 'Git', 'Agile', 'Scrum', 'Machine Learning', 'Data Analysis'
  ];

  info.skills = commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );

  return info;
};
