import { TierItem } from '../types/store';

import coverTier1 from '../assets/images/sovereign_tier1_cover_1790840939593.jpg';
import coverTier2 from '../assets/images/sovereign_tier2_cover_1790840954523.jpg';
import coverTier3 from '../assets/images/sovereign_tier3_cover_1790840967471.jpg';

export const TIERS_DATA: TierItem[] = [
  {
    id: 'tier1',
    name: 'Guide to Sovereign Media: Volume 1 - Digital Foundations',
    shortTitle: 'Sovereign Foundations',
    tagline: 'The foundational digital codex for independent media ownership and decentralized audience sovereignty.',
    price: 9,
    originalPrice: 24,
    highlight: 'Neon Starter Edition',
    accentColor: '#00f0ff', // Electric Neon Cyan
    glowColor: 'rgba(0, 240, 255, 0.45)',
    coverImage: coverTier1,
    pagesCount: 160,
    readTime: '3.8 hours',
    format: 'PDF · EPUB · Reader View',
    deliverables: [
      'Complete Volume 1 E-Book (160 Pages)',
      'Universal EPUB + High-Res Typographic PDF',
      'Sovereign Media Field Guide & Principles',
      'Immediate Secure PayPal Digital Vault Delivery'
    ],
    keyTopics: [
      'Breaking dependency on rent-seeking platforms',
      'Direct-to-audience cryptographic publishing',
      'Resilient media hosting & audience ownership'
    ],
    threePosition: [-3.8, 0, 0] // Left display case
  },
  {
    id: 'tier2',
    name: 'Guide to Sovereign Media: Volume 2 - Strategic Independence & Distribution',
    shortTitle: 'Strategic Independence',
    tagline: 'The comprehensive strategy guide for building self-sustaining media empires and uncensorable syndication.',
    price: 27,
    originalPrice: 68,
    highlight: 'Most Popular',
    accentColor: '#10b981', // Neon Emerald
    glowColor: 'rgba(16, 185, 129, 0.55)',
    coverImage: coverTier2,
    pagesCount: 390,
    readTime: '9.5 hours',
    format: 'PDF · EPUB · Audio Companion',
    deliverables: [
      'Volume 2 Expanded Strategic Guide (390 Pages)',
      'Includes Volume 1 Digital Foundations ($9 E-Book)',
      'Independent Publisher Distribution Checklists',
      'Sovereign Syndication Audio Companion (MP3)',
      'Complete DRM-Free Multi-Device Reading Bundle'
    ],
    keyTopics: [
      'Syndication blueprints for independent creators',
      'Zero-middleman patron monetization models',
      'Uncensorable media archive strategies'
    ],
    threePosition: [0, 0.25, 0.4] // Center elevated display case
  },
  {
    id: 'tier3',
    name: 'Guide to Sovereign Media: Volume 3 - The Sovereign Master Edition',
    shortTitle: 'The Master Edition',
    tagline: 'The complete 3-volume master omnibus with full audiobook narration and executive sovereign media briefings.',
    price: 54,
    originalPrice: 149,
    highlight: 'Complete Master Omnibus',
    accentColor: '#f59e0b', // Neon Gold / Amber
    glowColor: 'rgba(245, 158, 11, 0.65)',
    coverImage: coverTier3,
    pagesCount: 560,
    readTime: '14+ hours',
    format: 'PDF · EPUB · Audiobook MP3',
    deliverables: [
      'Complete Sovereign Master Omnibus (560 Pages)',
      'All 3 Full E-Book Volumes in Pristine Formats',
      'Full Unabridged Audiobook Narration (Lossless Audio)',
      'Executive Sovereign Media Briefing Documents',
      'Curated Independent Media Publishing Blueprints',
      'Lifetime Free Revision & Addendum Updates'
    ],
    keyTopics: [
      'Sovereign media network topology & governance',
      'Perpetual intellectual property distribution',
      'Building enduring institutional media archives'
    ],
    threePosition: [3.8, 0, 0] // Right display case
  }
];
