import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, Building2, Send, Loader2, ArrowRight } from 'lucide-react';

interface StorefrontRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StorefrontRentalModal: React.FC<StorefrontRentalModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [brand, setBrand] = useState('');
  const [storefrontType, setStorefrontType] = useState<'rental' | 'custom_build' | 'commission'>('rental');
  const [budgetRange, setBudgetRange] = useState('$299 - $500/mo (Turnkey Rental)');
  const [details, setDetails] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inquiryId, setInquiryId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please enter your name and email to proceed.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/inquiries/storefront-rental', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          brand,
          storefrontType,
          budgetRange,
          details
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setIsSuccess(true);
        setInquiryId(data.inquiryId);
      } else {
        throw new Error(data.error || 'Failed to submit inquiry');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending request. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div 
        className="relative w-full max-w-2xl glass-panel-glow rounded-2xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl z-10 my-auto text-left"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/5"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                Storefront Inquiry Registered
              </span>
              <h3 className="text-2xl font-bold text-white font-display mt-1">
                We'll Build Your 3D Sovereign Realm
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you, <strong className="text-white">{name}</strong>. Your inquiry reference <span className="font-mono text-cyan-400">{inquiryId}</span> has been logged. Our 3D spatial architect will reach out to <strong className="text-white">{email}</strong> within 24 hours.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs cursor-pointer shadow-lg transition-all"
              >
                Return to 3D Exhibition
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Custom Spatial Commerce</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
                Rent or Build a 3D Storefront Like Ours
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Deploy an ultra-immersive WebGL exhibition hall with glowing neon display cases, PayPal instant checkout, and integrated ambient radio for your brand or books.
              </p>
            </div>

            {/* Storefront engagement model */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {[
                {
                  id: 'rental',
                  title: 'Monthly Turnkey Rental',
                  price: '$299/mo',
                  desc: 'Hosted 3D room with your branding & PayPal integration.'
                },
                {
                  id: 'custom_build',
                  title: 'Custom 3D Architecture',
                  price: 'From $2,400',
                  desc: 'Bespoke 3D models, custom tunnel, full code ownership.'
                },
                {
                  id: 'commission',
                  title: 'Publisher Partnership',
                  price: 'Revenue Share',
                  desc: 'Collaborative sovereign media launch & co-marketing.'
                }
              ].map((model) => (
                <div
                  key={model.id}
                  onClick={() => {
                    setStorefrontType(model.id as any);
                    setBudgetRange(model.price);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    storefrontType === model.id
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'bg-black/40 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-bold text-white">{model.title}</span>
                  </div>
                  <div className="text-xs font-mono text-cyan-300 font-semibold mb-1">{model.price}</div>
                  <div className="text-[11px] text-slate-400 leading-tight">{model.desc}</div>
                </div>
              ))}
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@publisher.com"
                  className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Brand or Project Name</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Sovereign Press"
                  className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Launch Timeline</label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/15 focus:border-cyan-400 text-xs text-white outline-none"
                >
                  <option value="Immediate (< 2 weeks)">Immediate (&lt; 2 weeks)</option>
                  <option value="Within 30 Days">Within 30 Days</option>
                  <option value="Exploratory / Planning Stage">Exploratory / Planning Stage</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                What products or experiences do you want to showcase?
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="e.g. 3 e-book tiers like yours, physical merchandise, audiobooks, or a branded digital gallery..."
                className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none resize-none"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Storefront Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
