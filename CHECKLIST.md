# VibeCheck PH - Hackathon Submission Checklist

## InterCICSkwela Hackathon Compliance

### Rule Compliance ✅

- [x] **Rule #1**: Team of 2-4 members from CIC - _Team roster ready_
- [x] **Rule #2**: Original work created during hackathon - _100% original code_
- [x] **Rule #3**: AI Tools Disclosure - _Google Gemini API clearly stated in README and UI footer_
- [x] **Rule #4**: Challenge alignment - _Challenge #2: Digital Literacy & Combating Disinformation_
- [x] **Rule #5**: Academic honesty - _Clean, documented code ready for defense_
- [x] **Rule #10**: Functional prototype + Video ready - _3-5 min script in VIDEO_SCRIPT.md_
- [x] **Rule #11**: GitHub submission - _.gitignore and README configured_

### SDG Alignment ✅

- [x] **SDG 4 (Quality Education)**: Digital literacy education through interactive learning
- [x] **SDG 16 (Peace, Justice, Strong Institutions)**: Fighting disinformation for informed citizens

---

## Technical Checklist

### Core Features ✅

- [x] Landing page with text/URL input
- [x] "CHECK VIBE" button with loading state
- [x] Vibe Meter (0-100 gradient bar)
- [x] Filipino slang labels (CHILL NA CHILL, PARANG LEGIT, MEDYO SUS, SUS NA SUS)
- [x] AI-powered analysis with Gemini API
- [x] Red flags detection (scam, fake news indicators)
- [x] Pinoy-English explanation (3 sentences)
- [x] Digital literacy tips (3 actionable tips)
- [x] Pre-loaded examples (6 PH-specific scenarios)
- [x] Meme generator with shareable images
- [x] Vibe Battle (side-by-side comparison)
- [x] Social sharing (Facebook, Twitter, TikTok, Copy)

### User System ✅

- [x] Supabase authentication (Email/Password)
- [x] User profiles with streak tracking
- [x] "My Reports" history page
- [x] Streak counter ("X days na walang fake news!")
- [x] Total checks counter

### Design System ✅

- [x] Mobile-first responsive (320px+)
- [x] Cyber-Pinoy dark theme
- [x] Color palette: #0f0c29 (bg), #facc15 (yellow), #a855f7 (purple)
- [x] Inter + Space Grotesk typography
- [x] WCAG 2.1 AA accessibility
- [x] Keyboard navigation support
- [x] ARIA labels on interactive elements

### Tech Stack ✅

- [x] Next.js 15 (App Router)
- [x] TypeScript (strict mode)
- [x] Tailwind CSS + shadcn/ui
- [x] Lucide React icons
- [x] Google Gemini 1.5 Flash API
- [x] Supabase (Auth + Database)
- [x] PWA manifest configured

---

## Deployment Checklist

### Environment Variables Required

```bash
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Supabase Setup

1. Create new project at supabase.com
2. Run the SQL schema from `supabase-schema.sql`
3. Enable Email Auth in Authentication settings
4. Copy URL and anon key to environment variables

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy (automatic builds on push)

---

## Video Demo Script Ready

Location: `VIDEO_SCRIPT.md`

- [x] ~30 sec intro (problem statement)
- [x] ~2 min feature demo walkthrough
- [x] ~1 min tech stack explanation
- [x] ~30 sec impact & future plans
- [x] Total: ~4 minutes

---

## Files Ready for Submission

```
vibecheck-ph/
├── README.md              # Project documentation
├── VIDEO_SCRIPT.md        # Demo video script
├── CHECKLIST.md           # This file
├── .env.example           # Environment template
├── package.json           # Dependencies
├── src/                   # Source code
│   ├── app/               # Next.js pages & API
│   ├── components/        # React components
│   ├── lib/               # Utilities & config
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript types
└── public/                # Static assets
```

---

## Pre-Demo Testing

### Manual Test Cases

1. [ ] Paste fake news text → Should show high score (70-100)
2. [ ] Paste legitimate news → Should show low score (0-40)
3. [ ] Test scam message → Should detect scam indicators
4. [ ] Try pre-loaded examples → All 6 should work
5. [ ] Generate meme → Should create downloadable image
6. [ ] Use Vibe Battle → Compare two posts side-by-side
7. [ ] Sign up new account → Should create profile
8. [ ] Check dashboard → Should show reports history
9. [ ] Test on mobile → Should be responsive
10. [ ] Share to social → Should open share dialog

### Performance Targets

- [ ] LCP < 2.5s
- [ ] INP < 100ms
- [ ] CLS < 0.1

---

## Team Defense Preparation

### Key Questions to Prepare For

1. **How does the Gemini API analyze content?**
   - Structured prompt with scoring criteria
   - Returns JSON with score, flags, explanation, tips

2. **Why these specific Filipino red flags?**
   - Based on common PH disinformation patterns
   - Includes urgency language, emotional manipulation, fake authority claims

3. **How is user data protected?**
   - Supabase RLS policies restrict data to owner
   - No sensitive data stored (just content hashes for reports)

4. **What makes this innovative?**
   - First PH-focused fake news detector with Filipino slang
   - Gamification (streaks) encourages continued use
   - Meme generator makes sharing fun and educational

5. **Future roadmap?**
   - Browser extension for real-time checking
   - Community reporting and verification
   - Integration with local news fact-checkers (VERA Files, Rappler)

---

## Final Steps Before Submission

1. [ ] Test all features one more time
2. [ ] Record 3-5 minute demo video
3. [ ] Push final code to GitHub
4. [ ] Submit GitHub link via Google Form
5. [ ] Submit video link via Google Form

---

**Good luck, Team! Laban lang! 🇵🇭**
