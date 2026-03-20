# VibeCheck PH 🇵🇭

> **Paste anywhere. Get the real Vibe. Huwag maging sus!**

An AI-powered web application that helps Filipinos detect disinformation, fake news, and scams. Built for the **InterCICSkwela Hackathon Challenge #2: Digital Literacy and Combating Disinformation**.

![VibeCheck PH Banner](./public/og-image.png)

---

## 🎯 Hackathon Challenge Alignment

### Challenge #2: Digital Literacy and Combating Disinformation

VibeCheck PH directly addresses:
- **SDG 4 (Quality Education)**: Promotes digital literacy education through interactive analysis and contextual tips
- **SDG 16 (Peace, Justice, and Strong Institutions)**: Combats disinformation that undermines public trust and democratic institutions

### Problem Statement

The Philippines faces a critical challenge with online disinformation. According to recent studies:
- 7 out of 10 Filipinos have difficulty identifying fake news
- Social media scams cost Filipinos billions of pesos annually
- Fake news spreads 6x faster than accurate information

### Our Solution

VibeCheck PH provides an **accessible, engaging, and educational** tool that:
1. Analyzes any text or URL for potential disinformation
2. Provides a "Vibe Score" using familiar Filipino slang
3. Lists specific red flags with explanations
4. Offers actionable digital literacy tips
5. Makes sharing results fun with meme generation

---

## 🤖 AI Disclosure

**This application uses Google Gemini 1.5 Flash API** for content analysis.

The AI model:
- Analyzes text patterns, language, and content structure
- Identifies common disinformation and scam tactics
- Generates explanations in Tagalog-English (Taglish)
- Provides confidence scores for transparency

> **Note**: AI analysis is a tool to assist, not replace, critical thinking. Always verify important information from official sources.

---

## ⚡ Features

### Core Features
- **🔍 Vibe Check**: Paste any text or URL for instant AI analysis
- **📊 Vibe Meter**: Visual 0-100 score with Filipino slang labels
- **🚩 Red Flag Detection**: Identifies specific warning signs
- **💡 Literacy Tips**: Contextual advice for each analysis
- **⚔️ Vibe Battle**: Compare two posts side-by-side
- **🎨 Meme Generator**: Create shareable result images
- **👤 User Dashboard**: Track history and maintain streaks

### Philippine-Specific Detection
- Government impersonation (PAGASA, DOH, DepEd, etc.)
- GCash/e-wallet scam patterns
- Celebrity endorsement fraud
- Typhoon/disaster fake alerts
- Job scam recruitment
- Fake news about local events

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| UI Components | shadcn/ui + Radix UI |
| Icons | Lucide React |
| AI | Google Gemini 1.5 Flash API |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Deployment | Vercel |
| State Management | React Hooks + Context |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Supabase account (free tier works)
- Google AI Studio account for Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vibecheck-ph.git
   cd vibecheck-ph
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your values:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql` in the SQL Editor

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Getting API Keys

#### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key to your `.env.local`

#### Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy the URL and anon key

---

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/vibecheck-ph)

---

## 📁 Project Structure

```
vibecheck-ph/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes (analyze, reports)
│   │   ├── auth/              # Login/Signup pages
│   │   ├── battle/            # Vibe Battle page
│   │   ├── dashboard/         # User dashboard
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── features/          # Feature components
│   │   ├── layout/            # Header, Footer
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and configs
│   │   ├── supabase/          # Supabase client setup
│   │   ├── examples.ts        # Pre-loaded examples
│   │   └── utils.ts           # Helper functions
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── supabase/                  # Database schema
├── .env.example               # Environment template
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## 🎨 Design System

### Color Palette (Cyber-Pinoy Theme)

| Name | Hex | Usage |
|------|-----|-------|
| Background | `#0f0c29` | Main background |
| Primary | `#facc15` | Accent, CTAs |
| Secondary | `#a855f7` | Purple accents |
| Accent | `#22d3ee` | Cyan highlights |
| Safe | `#22c55e` | Low score (legit) |
| Caution | `#facc15` | Medium score |
| Danger | `#ef4444` | High score (sus) |

### Typography
- **Headings**: Space Grotesk (bold, futuristic)
- **Body**: Inter (clean, readable)

---

## 🔮 Why VibeCheck PH?

### Innovation
- **First-of-its-kind** Tagalog-aware disinformation detector
- **Gamified approach** makes digital literacy engaging
- **Mobile-first design** reaches users where they consume content

### Impact
- Empowers Filipinos to make informed decisions
- Reduces spread of viral misinformation
- Builds long-term digital literacy skills
- Creates a community of fact-checkers

### Scalability
- Serverless architecture handles any traffic
- Modular design allows feature expansion
- API-ready for integration with messaging apps

---

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

---

## 📜 License

This project is open source under the MIT License.

---

## 👥 Team

Built with 💛 for the InterCICSkwela Hackathon 2024

---

## 🙏 Acknowledgments

- Google Gemini AI for powering our analysis
- Supabase for database and authentication
- Vercel for hosting
- shadcn/ui for beautiful components
- The Filipino community fighting disinformation

---

**Huwag maging sus! Use VibeCheck PH! 🇵🇭**
