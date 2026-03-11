# Convertt — Headless Next.js Project

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page (Server Component)
├── components/
│   ├── Navbar/             # Navigation bar
│   ├── HeroSection/        # Section 1: Hero + Marquee
│   ├── BrandLogoSection/   # Section 2: Brand logos grid
│   └── CaseStudySection/   # Section 3: Tabs + Before/After slider
├── lib/
│   └── api.ts              # ← Yahan API calls hain (sirf yeh file update karein)
├── types/
│   └── index.ts            # TypeScript types
└── styles/
    └── globals.css
```

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Ko Connect Karna

Jab aapki WordPress headless API ready ho, sirf **`src/lib/api.ts`** file update karein:

```typescript
// Pehle (hardcoded data):
export async function getHeroData(): Promise<HeroData> {
  return { ... hardcoded data ... }
}

// Baad mein (real API):
export async function getHeroData(): Promise<HeroData> {
  const res = await fetch(`${API_BASE}/api/hero`, {
    next: { revalidate: 3600 } // ISR: 1 hour cache
  })
  return res.json()
}
```

### .env.local setup:
```
NEXT_PUBLIC_API_URL=https://convertt.co/wp-json/wp/v2
```

---

## Components

| Component | Type | Description |
|-----------|------|-------------|
| `Navbar` | Client | Fixed top navigation |
| `HeroSection` | Server | Hero + animated CTA |
| `MarqueeSection` | Client | Auto-scrolling product cards |
| `BrandLogoSection` | Server | Logo grid + partner logos |
| `CaseStudySection` | Client | Industry tabs + before/after slider |
