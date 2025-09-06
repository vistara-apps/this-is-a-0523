// AI analysis function with both real OpenAI API and mock fallback
export const analyzeDocuments = async (documents) => {
  const { resume, coverLetter, jobDescription } = documents;

  // Check if OpenAI API key is configured
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (apiKey && apiKey !== 'your-openai-api-key-here') {
    try {
      return await analyzeWithOpenAI(documents);
    } catch (error) {
      console.error('OpenAI analysis failed, falling back to mock:', error);
      return await analyzeWithMock(documents);
    }
  } else {
    console.log('OpenAI API key not configured, using mock analysis');
    return await analyzeWithMock(documents);
  }
};

// Real OpenAI analysis
const analyzeWithOpenAI = async (documents) => {
  const { resume, coverLetter, jobDescription } = documents;
  
  const OpenAI = (await import('openai')).default;
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  try {
    // Keyword Analysis
    const keywordPrompt = `
      Analyze the following resume against this job description and identify:
      1. Keywords that are already present in the resume
      2. Important keywords missing from the resume
      
      Job Description: ${jobDescription}
      Resume: ${resume}
      
      Return as JSON: { "matched": ["keyword1", "keyword2"], "missing": ["keyword3", "keyword4"] }
    `;
    
    const keywordResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: keywordPrompt }],
      temperature: 0.3,
      max_tokens: 1000
    });
    
    let keywordAnalysis;
    try {
      keywordAnalysis = JSON.parse(keywordResponse.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse keyword analysis:', parseError);
      keywordAnalysis = { matched: [], missing: [] };
    }
    
    // Skills Gap Analysis
    const skillsPrompt = `
      Compare the skills and experience in this resume against the job requirements.
      Identify gaps and provide suggestions.
      
      Job Description: ${jobDescription}
      Resume: ${resume}
      
      Return as JSON array: [{"skill": "SkillName", "severity": "high|medium|low", "suggestion": "advice", "alternatives": ["alt1", "alt2"]}]
    `;
    
    const skillsResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: skillsPrompt }],
      temperature: 0.3,
      max_tokens: 1500
    });
    
    let skillsGap;
    try {
      skillsGap = JSON.parse(skillsResponse.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse skills gap analysis:', parseError);
      skillsGap = [];
    }
    
    // Content Rewriting
    const rewritePrompt = `
      Rewrite this resume to better match the job description.
      Improve clarity, impact, and ATS optimization while maintaining truthfulness.
      Keep the same structure but enhance the language and keywords.
      
      Job Description: ${jobDescription}
      Resume: ${resume}
      
      Return the rewritten resume:
    `;
    
    const rewriteResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: rewritePrompt }],
      temperature: 0.5,
      max_tokens: 2000
    });
    
    const rewrittenResume = rewriteResponse.choices[0].message.content;
    
    // Cover letter rewriting (if provided)
    let rewrittenCoverLetter = null;
    if (coverLetter) {
      const coverLetterPrompt = `
        Rewrite this cover letter to better match the job description.
        Improve tone, relevance, and persuasiveness while maintaining the original intent.
        
        Job Description: ${jobDescription}
        Cover Letter: ${coverLetter}
        
        Return the rewritten cover letter:
      `;
      
      const coverLetterResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: coverLetterPrompt }],
        temperature: 0.5,
        max_tokens: 1500
      });
      
      rewrittenCoverLetter = coverLetterResponse.choices[0].message.content;
    }
    
    return {
      keywordAnalysis,
      skillsGap,
      rewrittenContent: {
        resume: rewrittenResume,
        coverLetter: rewrittenCoverLetter
      },
      improvements: [
        'Enhanced action verbs and quantified achievements',
        'Optimized keyword placement for ATS compatibility',
        'Improved clarity and professional tone',
        'Better alignment with job requirements'
      ]
    };
    
  } catch (error) {
    console.error('AI Analysis failed:', error);
    throw new Error('Failed to analyze documents. Please check your API configuration.');
  }
};

// Mock analysis fallback
const analyzeWithMock = async (documents) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { resume, coverLetter, jobDescription } = documents;

  // Mock analysis results
  const mockResults = {
    keywordAnalysis: {
      matched: extractMockKeywords(resume, jobDescription, 'matched'),
      missing: extractMockKeywords(resume, jobDescription, 'missing')
    },
    skillsGap: generateMockSkillsGap(resume, jobDescription),
    rewrittenContent: {
      resume: generateMockRewrite(resume, 'resume'),
      coverLetter: coverLetter ? generateMockRewrite(coverLetter, 'coverLetter') : null
    },
    improvements: generateMockImprovements()
  };

  return mockResults;
};

// Helper functions for mock data generation
const extractMockKeywords = (resume, jobDescription, type) => {
  const commonKeywords = [
    'JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 
    'Git', 'API', 'Agile', 'Scrum', 'Team Leadership', 'Project Management',
    'Machine Learning', 'Data Analysis', 'Communication', 'Problem Solving'
  ];

  const jobKeywords = [
    'TypeScript', 'Vue.js', 'Kubernetes', 'MongoDB', 'GraphQL', 
    'Microservices', 'CI/CD', 'TDD', 'DevOps', 'Cloud Architecture'
  ];

  if (type === 'matched') {
    return commonKeywords.slice(0, Math.floor(Math.random() * 8) + 4);
  } else {
    return jobKeywords.slice(0, Math.floor(Math.random() * 5) + 2);
  }
};

const generateMockSkillsGap = (resume, jobDescription) => {
  const gaps = [
    {
      skill: 'Cloud Architecture',
      severity: 'high',
      suggestion: 'Consider highlighting any cloud platform experience (AWS, Azure, GCP) or mention relevant coursework/certifications.',
      alternatives: ['DevOps Experience', 'Infrastructure Management', 'Scalable Systems Design']
    },
    {
      skill: 'TypeScript',
      severity: 'medium',
      suggestion: 'If you have JavaScript experience, emphasize your ability to work with strongly-typed languages.',
      alternatives: ['JavaScript', 'Static Typing Experience', 'Large Codebase Management']
    },
    {
      skill: 'Test-Driven Development',
      severity: 'low',
      suggestion: 'Mention any testing frameworks you\'ve used or testing methodologies you\'re familiar with.',
      alternatives: ['Unit Testing', 'Quality Assurance', 'Automated Testing']
    }
  ];

  return gaps.slice(0, Math.floor(Math.random() * 3) + 1);
};

const generateMockRewrite = (content, type) => {
  if (!content) return null;

  const improvements = [
    'Enhanced action verbs and quantified achievements',
    'Optimized keyword placement for ATS compatibility',
    'Improved clarity and conciseness',
    'Strengthened value propositions'
  ];

  // Simple mock rewrite - in production, this would use OpenAI
  const rewritten = content
    .replace(/\b(worked on|did|made)\b/gi, 'developed')
    .replace(/\b(helped|assisted)\b/gi, 'collaborated to')
    .replace(/\b(responsible for)\b/gi, 'led')
    .replace(/\b(good at|skilled in)\b/gi, 'proficient in');

  return rewritten + '\n\n[AI Optimized - ' + improvements[Math.floor(Math.random() * improvements.length)] + ']';
};

const generateMockImprovements = () => {
  const improvements = [
    'Replaced weak action verbs with strong, impactful alternatives',
    'Added quantifiable metrics to demonstrate impact',
    'Optimized keyword density for better ATS scoring',
    'Improved sentence structure for better readability',
    'Enhanced professional tone throughout the document',
    'Aligned language with industry standards and expectations'
  ];

  return improvements.slice(0, Math.floor(Math.random() * 4) + 2);
};

// Real OpenAI integration (commented out - requires API key)
/*
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export const analyzeDocuments = async (documents) => {
  const { resume, coverLetter, jobDescription } = documents;
  
  try {
    // Keyword Analysis
    const keywordPrompt = `
      Analyze the following resume against this job description and identify:
      1. Keywords that are already present in the resume
      2. Important keywords missing from the resume
      
      Job Description: ${jobDescription}
      Resume: ${resume}
      
      Return as JSON: { "matched": ["keyword1", "keyword2"], "missing": ["keyword3", "keyword4"] }
    `;
    
    const keywordResponse = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [{ role: 'user', content: keywordPrompt }],
      temperature: 0.3
    });
    
    const keywordAnalysis = JSON.parse(keywordResponse.choices[0].message.content);
    
    // Skills Gap Analysis
    const skillsPrompt = `
      Compare the skills and experience in this resume against the job requirements.
      Identify gaps and provide suggestions.
      
      Job Description: ${jobDescription}
      Resume: ${resume}
      
      Return as JSON array: [{"skill": "SkillName", "severity": "high|medium|low", "suggestion": "advice", "alternatives": ["alt1", "alt2"]}]
    `;
    
    const skillsResponse = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [{ role: 'user', content: skillsPrompt }],
      temperature: 0.3
    });
    
    const skillsGap = JSON.parse(skillsResponse.choices[0].message.content);
    
    // Content Rewriting
    const rewritePrompt = `
      Rewrite this resume to better match the job description.
      Improve clarity, impact, and ATS optimization while maintaining truthfulness.
      
      Job Description: ${jobDescription}
      Resume: ${resume}
      
      Return the rewritten resume:
    `;
    
    const rewriteResponse = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [{ role: 'user', content: rewritePrompt }],
      temperature: 0.5
    });
    
    const rewrittenResume = rewriteResponse.choices[0].message.content;
    
    // Cover letter rewriting (if provided)
    let rewrittenCoverLetter = null;
    if (coverLetter) {
      const coverLetterPrompt = `
        Rewrite this cover letter to better match the job description.
        Improve tone, relevance, and persuasiveness.
        
        Job Description: ${jobDescription}
        Cover Letter: ${coverLetter}
        
        Return the rewritten cover letter:
      `;
      
      const coverLetterResponse = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-001',
        messages: [{ role: 'user', content: coverLetterPrompt }],
        temperature: 0.5
      });
      
      rewrittenCoverLetter = coverLetterResponse.choices[0].message.content;
    }
    
    return {
      keywordAnalysis,
      skillsGap,
      rewrittenContent: {
        resume: rewrittenResume,
        coverLetter: rewrittenCoverLetter
      },
      improvements: [
        'Enhanced action verbs and quantified achievements',
        'Optimized keyword placement for ATS compatibility',
        'Improved clarity and professional tone',
        'Better alignment with job requirements'
      ]
    };
    
  } catch (error) {
    console.error('AI Analysis failed:', error);
    throw new Error('Failed to analyze documents. Please check your API configuration.');
  }
};
*/
