import { Example } from "@/types";

export const EXAMPLES: Example[] = [
  {
    id: "fake-typhoon",
    title: "Fake Typhoon Alert",
    content: `⚠️ BREAKING NEWS ⚠️ SUPER TYPHOON BAGYO-BAGYO will hit Metro Manila in 3 HOURS!
Signal No. 5 na! PAGASA di pa naglalabas ng advisory pero reliable source namin sa gobyerno nagsabi!
EVACUATE NOW! Share para maligtas ang pamilya mo! Like and share = 1 prayer 🙏`,
    category: "fake",
    description: "Uses fear, urgency, and claims insider sources without official verification",
    source: "Common social media pattern",
  },
  {
    id: "real-deped",
    title: "Official DepEd Announcement",
    content: `For Immediate Release | Department of Education

DepEd announces the official school calendar for SY 2024-2025. Classes will begin on August 5, 2024, for public schools nationwide.

The calendar includes:
- First Quarter: Aug 5 - Oct 25, 2024
- Second Quarter: Oct 28 - Jan 10, 2025
- Third Quarter: Jan 13 - Mar 21, 2025
- Fourth Quarter: Mar 24 - Jun 6, 2025

For more information, visit deped.gov.ph

#DepEdNewsUpdate`,
    category: "real",
    description: "Official format, specific dates, official source cited",
    source: "DepEd Official Communications Pattern",
  },
  {
    id: "scam-gcash",
    title: "GCash Scam Message",
    content: `[GCash] Congratulations! Ikaw ang lucky winner ng P50,000! Claim mo na ang prize mo!
Click this link: gcash-promo-winner.xyz/claim
I-enter lang ang GCash MPIN at OTP mo para makuha agad!
Limited time lang to, mag-expire in 24 hours! Act now!!!`,
    category: "scam",
    description: "Phishing attempt with suspicious URL, asks for sensitive info",
    source: "Reported scam pattern",
  },
  {
    id: "fake-celeb",
    title: "Fake Celebrity Endorsement",
    content: `SHOCKING! Si Vice Ganda nagbenta na ng bahay para bumili ng Bitcoin!
Kita nya 500 MILLION in just 1 week!
'Di ko na kailangan mag-Its Showtime,' sabi nya.
Register ka na rin sa crypto-ph-invest.com - guaranteed 10x return in 1 month!
Verified ito ng ABS-CBN (pero di nila pinapalabas sa TV kasi ayaw ng mga elitista!)`,
    category: "fake",
    description: "Celebrity name drop, unrealistic returns, conspiracy angle",
    source: "Common crypto scam pattern",
  },
  {
    id: "real-doh",
    title: "DOH Health Advisory",
    content: `DOH ADVISORY: Increase in dengue cases reported in NCR

The Department of Health urges the public to practice the 4S strategy:
- Search and destroy mosquito breeding sites
- Self-protect using mosquito repellent
- Seek early consultation if symptoms appear
- Say yes to fogging in your area

Dengue symptoms: high fever, severe headache, pain behind eyes, joint pain, rash

Report cases to your nearest health center. Source: DOH official website`,
    category: "real",
    description: "Verified health information with actionable advice",
    source: "DOH Official",
  },
  {
    id: "fake-promo",
    title: "Fake Job Posting",
    content: `URGENT HIRING! NO EXPERIENCE NEEDED!
💰 P80,000 - P150,000/month (LEGIT!)
🏠 Work from Home
📱 Gamit lang phone

Requirements:
- 18 years old above
- May GCash account
- Kaya mag-like at share

PM ako ASAP! Limited slots na lang!
Padala ka lang ng P500 registration fee para ma-confirm slot mo.
Madaming naging MILLIONAIRE na dito! Check mo testimonials sa comment!`,
    category: "scam",
    description: "Unrealistic salary, requires payment, vague job description",
    source: "Common job scam pattern",
  },
];

export function getExampleById(id: string): Example | undefined {
  return EXAMPLES.find((ex) => ex.id === id);
}

export function getExamplesByCategory(category: "fake" | "real" | "scam"): Example[] {
  return EXAMPLES.filter((ex) => ex.category === category);
}
