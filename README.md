# JobMatch AI

**Tailor your resume and cover letter to perfection, powered by AI.**

JobMatch AI is a web application that uses artificial intelligence to help job seekers optimize their resumes and cover letters against specific job descriptions. The app provides ATS keyword optimization, skills gap analysis, and AI-powered content rewriting to increase your chances of landing interviews.

## 🚀 Features

### Core Features
- **ATS Keyword Optimization**: Scans uploaded resumes and cover letters against job descriptions to identify missing keywords and suggest their inclusion
- **Skills Gap Analysis**: Compares skills and experience against job requirements, highlighting any gaps with actionable suggestions
- **AI-Powered Rewriting**: Rewrites sentences and paragraphs to improve clarity, conciseness, and overall impact
- **Tone & Style Adjustment**: Adjusts the tone and style to better match industry or company culture

### Technical Features
- **File Upload Support**: Upload PDF, DOCX, or TXT files, or paste content directly
- **Real-time Analysis**: Get instant feedback on your documents
- **User Authentication**: Secure user accounts with Supabase (optional)
- **Subscription Management**: Freemium model with Stripe integration (optional)
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Progressive Enhancement**: Works in demo mode without any external services

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Authentication**: Supabase Auth (optional)
- **Database**: Supabase PostgreSQL (optional)
- **Payments**: Stripe (optional)
- **File Processing**: Mammoth.js for DOCX, React Dropzone for uploads
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- OpenAI API key (optional - app works with mock data without it)
- Supabase project (optional - for authentication and data persistence)
- Stripe account (optional - for payment processing)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/vistara-apps/this-is-a-0523.git
cd this-is-a-0523
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup (Optional)
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```env
# OpenAI Configuration (optional - enables real AI analysis)
VITE_OPENAI_API_KEY=your-openai-api-key-here

# Supabase Configuration (optional - enables auth & data persistence)
VITE_SUPABASE_URL=your-supabase-url-here
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Stripe Configuration (optional - enables payments)
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key-here
```

### 4. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎯 Usage

### Demo Mode (No Setup Required)
The app works immediately without any configuration:
- Uses mock AI analysis data
- Local storage for subscription management
- No authentication required

### Production Mode (With API Keys)
With proper environment variables configured:
- Real OpenAI-powered analysis
- User authentication and data persistence
- Stripe-powered subscription management

### How to Use
1. **Upload Documents**: Upload or paste your resume and cover letter
2. **Add Job Description**: Paste the job description you're applying for
3. **Analyze**: Click "Analyze & Optimize" to get AI-powered insights
4. **Review Results**: See keyword matches, skills gaps, and rewritten content
5. **Download**: Copy the optimized content for your applications

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/          # React components
│   ├── AnalysisResults.jsx
│   ├── AuthModal.jsx
│   ├── FileUpload.jsx
│   ├── Header.jsx
│   ├── SubscriptionModal.jsx
│   └── UploadSection.jsx
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── hooks/              # Custom hooks
│   └── useSubscription.js
├── lib/                # External service integrations
│   ├── stripe.js
│   └── supabase.js
├── utils/              # Utility functions
│   ├── aiAnalysis.js
│   └── fileParser.js
└── App.jsx             # Main application component
```

### Data Model
- **User**: userId, email, subscriptionStatus, createdAt
- **Document**: documentId, userId, type, content, createdAt
- **JobDescription**: jobDescriptionId, userId, content, createdAt
- **ScanResult**: scanResultId, documentId, jobDescriptionId, optimizationSuggestions, skillsGapAnalysis, rewrittenContent, createdAt

## 🔧 Configuration

### Supabase Setup (Optional)
1. Create a new Supabase project
2. Run the following SQL to create tables:

```sql
-- Users table
CREATE TABLE users (
  user_id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscription_status TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'resume', 'cover_letter', 'job_description'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scan results table
CREATE TABLE scan_results (
  scan_result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(document_id) ON DELETE CASCADE,
  job_description_id UUID REFERENCES documents(document_id) ON DELETE CASCADE,
  optimization_suggestions JSONB,
  skills_gap_analysis JSONB,
  rewritten_content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own documents" ON documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own scan results" ON scan_results FOR ALL USING (auth.uid() = user_id);
```

### Stripe Setup (Optional)
1. Create a Stripe account
2. Create a product and price for the Pro subscription
3. Set up webhooks for subscription events
4. Update the `priceId` in `src/lib/stripe.js`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Environment Variables for Production
Make sure to set all environment variables in your deployment platform:
- `VITE_OPENAI_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`

## 🧪 Testing

### Run Development Server
```bash
npm run dev
```

### Test Features
1. **File Upload**: Test with PDF, DOCX, and TXT files
2. **AI Analysis**: Test with and without OpenAI API key
3. **Authentication**: Test signup/signin flows
4. **Subscription**: Test free tier limits and upgrade flow
5. **Responsive Design**: Test on different screen sizes

## 📝 Business Model

- **Free Tier**: 3 scans per month
- **Pro Tier**: $10/month for unlimited scans
- **Features**: All core features available in free tier, Pro removes limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@jobmatch-ai.com or create an issue in this repository.

## 🔮 Roadmap

- [ ] PDF parsing improvements
- [ ] Multiple resume templates
- [ ] Industry-specific optimizations
- [ ] Chrome extension
- [ ] Mobile app
- [ ] Integration with job boards
- [ ] Team collaboration features

---

**Built with ❤️ by the JobMatch AI team**
