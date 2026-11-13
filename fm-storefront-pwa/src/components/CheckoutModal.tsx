import React from 'react';
import { X, Check, BookOpen, Clock, FileText } from 'lucide-react';
import { TierItem, OrderState } from '../types/store';
import { PayPalCheckout } from './PayPalCheckout';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: TierItem | null;
  onOrderComplete?: (order: OrderState) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  tier,
  onOrderComplete
}) => {
  if (!isOpen || !tier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Glassmorphic Modal Dialog */}
      <div 
        className="relative w-full max-w-3xl glass-panel-glow rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30 z-10 my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        {/* Top glowing ambient gradient bar */}
        <div 
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${tier.accentColor}, transparent)`
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/5 z-20"
          aria-label="Close checkout modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Book Details & Deliverables */}
          <div className="md:col-span-6 p-6 sm:p-8 bg-black/30 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
            <div>
              {/* Highlight badge/tag unboxed */}
              <div className="flex items-center gap-2 text-xs font-mono mb-2" style={{ color: tier.accentColor }}>
                <span>{tier.highlight}</span>
                <span aria-hidden="true">·</span>
                <span>Pure E-Book Edition</span>
                <span aria-hidden="true">·</span>
                <span>Immediate Delivery</span>
              </div>

              <h2 id="checkout-modal-title" className="text-xl sm:text-2xl font-bold text-white font-display leading-tight mb-2">
                {tier.name}
              </h2>

              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                {tier.tagline}
              </p>

              {/* Cover preview + Book Specs */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 mb-6">
                <img
                  src={tier.coverImage}
                  alt={tier.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-22 object-cover rounded-md shadow-md border border-white/15"
                />
                <div className="text-xs space-y-1 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{tier.pagesCount} Pages (Rich Figures)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{tier.readTime} Comprehensive Read</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{tier.format}</span>
                  </div>
                </div>
              </div>

              {/* What's included checklist */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Included in this Vault
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {tier.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Price value callout */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-baseline gap-2">
              <span className="text-xs text-slate-400 font-mono">Special Direct Pricing:</span>
              <span className="text-2xl font-bold font-mono text-white">${tier.price}</span>
              <span className="text-xs text-slate-500 line-through font-mono">${tier.originalPrice}</span>
              <span className="text-xs text-emerald-400 font-medium ml-auto">Save {Math.round((1 - tier.price / tier.originalPrice) * 100)}%</span>
            </div>
          </div>

          {/* Right Column: Explicitly Rendered <PayPalCheckout /> */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-center bg-slate-950/60">
            <PayPalCheckout
              amount={tier.price}
              itemName={tier.name}
              tierId={tier.id}
              onOrderComplete={onOrderComplete}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
