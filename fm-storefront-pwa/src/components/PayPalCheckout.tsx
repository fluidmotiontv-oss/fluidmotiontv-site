import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ExternalLink, Mail, Clock } from 'lucide-react';
import { OrderState } from '../types/store';

export interface PayPalCheckoutProps {
  amount: number;
  itemName: string;
  tierId?: string;
  onOrderComplete?: (order: OrderState) => void;
  onCancel?: () => void;
}

const PAYPAL_BUSINESS = 'fluidmotion.tv@gmail.com';

export const PayPalCheckout: React.FC<PayPalCheckoutProps> = ({
  amount, itemName, tierId = 'tier1', onOrderComplete, onCancel
}) => {
  const [customerEmail, setCustomerEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card'>('paypal');
  const [awaitingPayment, setAwaitingPayment] = useState(false);

  const startCheckout = () => {
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMsg('Please enter a valid email — your license is delivered there.');
      return;
    }
    setErrorMsg(null);
    const params = new URLSearchParams({
      cmd: '_xclick', business: PAYPAL_BUSINESS,
      item_name: `${itemName} [${tierId}]`, amount: String(amount),
      currency_code: 'USD', no_shipping: '1', no_note: '1', custom: customerEmail,
    });
    window.open(`https://www.paypal.com/cgi-bin/webscr?${params.toString()}`, '_blank', 'noopener');
    setAwaitingPayment(true);
  };

  if (awaitingPayment) {
    return (
      <div className="space-y-6 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
          <Clock className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Checkout Window Opened</span>
          <h3 className="text-xl font-bold text-white mt-1 font-display">Complete Your Payment</h3>
          <p className="text-xs text-slate-300 mt-1.5 max-w-sm mx-auto">
            A secure PayPal window opened in a new tab for <strong className="text-white">{itemName}</strong> (${amount}).
            {paymentMethod === 'card' && ' You can pay by card there — no PayPal account needed.'}
          </p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-left text-xs font-mono space-y-2">
          <div className="flex justify-between text-slate-400"><span>Deliver To</span><span className="text-cyan-400">{customerEmail}</span></div>
          <div className="flex justify-between text-slate-400"><span>Amount</span><span className="text-slate-200">${amount}.00 USD</span></div>
        </div>
        <div className="space-y-3">
          <button onClick={() => { setAwaitingPayment(false); if (onOrderComplete) onOrderComplete({ orderId: 'PP-' + Date.now(), amount, itemName, customerEmail, downloadToken: 'email-delivery', completedAt: new Date().toISOString(), downloadUrl: '' }); }}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer">
            <CheckCircle2 className="w-4 h-4" />
            <span>I&apos;ve Completed My Payment</span>
          </button>
          <button onClick={() => setAwaitingPayment(false)}
            className="w-full py-2.5 px-6 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs hover:text-white transition-colors cursor-pointer">
            &larr; Back to Payment Options
          </button>
          <p className="text-[11px] text-slate-500">Your license + e-book bundle is emailed to you after payment clears (usually minutes).</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Selected Tier</span>
          <h4 className="text-sm font-semibold text-white truncate max-w-[260px] sm:max-w-xs">{itemName}</h4>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold font-mono tabular-nums text-white">${amount}</span>
          <span className="text-[10px] text-slate-400 block font-mono">USD &middot; Instant</span>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">Delivery Email Address</label>
        <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="your.email@company.com"
          className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder-slate-500 outline-none transition-all" />
        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <Mail className="w-3 h-3" /> Your e-book bundle &amp; license are delivered to this address.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-lg border border-white/5">
        <button type="button" onClick={() => setPaymentMethod('paypal')}
          className={`py-2 px-3 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${paymentMethod === 'paypal' ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' : 'text-slate-400 hover:text-white'}`}>
          <span className="font-bold text-amber-400">Pay</span><span className="font-bold text-sky-400">Pal</span>
        </button>
        <button type="button" onClick={() => setPaymentMethod('card')}
          className={`py-2 px-3 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${paymentMethod === 'card' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30' : 'text-slate-400 hover:text-white'}`}>
          <span>Credit / Debit Card</span>
        </button>
      </div>
      {errorMsg && (<div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300">{errorMsg}</div>)}
      <div className="pt-1 space-y-3">
        <button onClick={startCheckout}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer">
          <span>{paymentMethod === 'paypal' ? 'PayPal' : 'Secure Card'} Checkout — ${amount}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </button>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>256-bit encrypted &middot; Processed by PayPal &middot; No card data touches this site</span>
        </div>
      </div>
    </div>
  );
};
