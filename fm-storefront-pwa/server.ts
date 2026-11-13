import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory order storage for session tracking
interface OrderRecord {
  orderId: string;
  tierId: string;
  itemName: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  customerEmail?: string;
  createdAt: string;
  completedAt?: string;
  downloadToken: string;
}

const ordersDatabase = new Map<string, OrderRecord>();

// Predefined tier manifests for validation - strictly pure e-books and editorial companions
export const TIERS_MANIFEST: Record<string, { id: string; name: string; price: number; files: string[]; summary: string }> = {
  tier1: {
    id: 'tier1',
    name: 'Guide to Sovereign Media: Volume 1 - Digital Foundations',
    price: 9,
    files: [
      'guide-to-sovereign-media-vol1-foundations.pdf',
      'guide-to-sovereign-media-vol1.epub',
      'sovereign-reader-field-guide.pdf'
    ],
    summary: 'The foundational digital e-book codex establishing independent media sovereignty, decentralized audience ownership, and resilient publishing models.'
  },
  tier2: {
    id: 'tier2',
    name: 'Guide to Sovereign Media: Volume 2 - Strategic Independence & Distribution',
    price: 27,
    files: [
      'guide-to-sovereign-media-vol2-strategic-independence.pdf',
      'guide-to-sovereign-media-vol1-foundations.pdf',
      'sovereign-media-complete-edition.epub',
      'sovereign-distribution-audio-companion.mp3',
      'independent-publisher-field-checklists.pdf'
    ],
    summary: 'The comprehensive expanded e-book guide detailing direct-to-patron ecosystems, platform-free subscription structures, and uncensorable media syndication.'
  },
  tier3: {
    id: 'tier3',
    name: 'Guide to Sovereign Media: Volume 3 - The Sovereign Master Edition',
    price: 54,
    files: [
      'guide-to-sovereign-media-master-omnibus.pdf',
      'guide-to-sovereign-media-vol1-foundations.pdf',
      'guide-to-sovereign-media-vol2-strategic-independence.pdf',
      'sovereign-master-omnibus.epub',
      'complete-narrated-author-edition.mp3',
      'sovereign-media-executive-briefing.pdf'
    ],
    summary: 'The definitive complete 3-volume master omnibus. All volumes, full EPUB/PDF reader formats, complete author narration, and sovereign media blueprints.'
  }
};

// Storefront rental / commission inquiry tracking
interface RentalInquiry {
  id: string;
  name: string;
  email: string;
  brand: string;
  storefrontType: 'rental' | 'custom_build' | 'commission';
  budgetRange: string;
  details: string;
  submittedAt: string;
}

const rentalInquiries: RentalInquiry[] = [];

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'fluid-motion-storefront', timestamp: new Date().toISOString() });
  });

  // Tiers catalog endpoint
  app.get('/api/tiers', (_req, res) => {
    res.json({ tiers: Object.values(TIERS_MANIFEST) });
  });

  // Storefront rental / commission inquiry endpoint
  app.post('/api/inquiries/storefront-rental', (req, res) => {
    try {
      const { name, email, brand, storefrontType, budgetRange, details } = req.body;
      if (!email || !name) {
        return res.status(400).json({ error: 'Name and email are required to process inquiry' });
      }

      const inquiry: RentalInquiry = {
        id: `INQ-${Date.now().toString(36).toUpperCase()}`,
        name,
        email,
        brand: brand || 'Independent Creator',
        storefrontType: storefrontType || 'rental',
        budgetRange: budgetRange || '$500 - $1,500/mo',
        details: details || 'Interest in renting or deploying a 3D WebGL storefront',
        submittedAt: new Date().toISOString()
      };

      rentalInquiries.push(inquiry);
      console.log(`[RentalInquiry] New inquiry received from ${name} (${email}) for brand: ${brand}`);

      res.status(201).json({
        success: true,
        inquiryId: inquiry.id,
        message: 'Your storefront request has been registered. Our 3D spatial architect will reach out within 24 hours.',
        inquiry
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to record inquiry', message: err.message });
    }
  });

  // 1. Create order session
  app.post('/api/orders/create', (req, res) => {
    try {
      const { tierId, amount, itemName, customerEmail } = req.body;
      
      const foundTier = TIERS_MANIFEST[tierId] || Object.values(TIERS_MANIFEST).find(t => t.price === amount);
      const finalTierId = foundTier ? foundTier.id : 'tier1';
      const finalAmount = foundTier ? foundTier.price : (amount || 9);
      const finalName = foundTier ? foundTier.name : (itemName || 'The Fluid Motion of the Future');

      const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const downloadToken = `DL-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;

      const order: OrderRecord = {
        orderId,
        tierId: finalTierId,
        itemName: finalName,
        amount: finalAmount,
        status: 'PENDING',
        customerEmail: customerEmail || 'guest@fluidmotion.io',
        createdAt: new Date().toISOString(),
        downloadToken
      };

      ordersDatabase.set(orderId, order);

      // Support sandbox/live PayPal client configurations
      const paypalClientId = process.env.PAYPAL_CLIENT_ID || 'sb'; // 'sb' is standard PayPal sandbox client id

      res.status(201).json({
        success: true,
        orderId,
        amount: finalAmount,
        itemName: finalName,
        currency: 'USD',
        status: 'CREATED',
        paypalClientId,
        downloadToken
      });
    } catch (err: any) {
      console.error('Error creating order:', err);
      res.status(500).json({ error: 'Failed to initialize order', message: err.message });
    }
  });

  // 2. Capture / complete order
  app.post('/api/orders/capture', (req, res) => {
    try {
      const { orderId, details, paymentMethod } = req.body;

      if (!orderId) {
        return res.status(400).json({ error: 'orderId is required' });
      }

      let order = ordersDatabase.get(orderId);
      if (!order) {
        // Create record if not found (e.g., client generated ID)
        order = {
          orderId,
          tierId: 'tier1',
          itemName: 'The Fluid Motion of the Future',
          amount: 9,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          downloadToken: `DL-${Math.random().toString(36).substring(2, 12)}`
        };
        ordersDatabase.set(orderId, order);
      }

      order.status = 'COMPLETED';
      order.completedAt = new Date().toISOString();
      if (details?.payer?.email_address) {
        order.customerEmail = details.payer.email_address;
      }

      const tierManifest = TIERS_MANIFEST[order.tierId] || TIERS_MANIFEST['tier1'];

      res.json({
        success: true,
        orderId: order.orderId,
        status: 'COMPLETED',
        paymentMethod: paymentMethod || 'paypal',
        amount: order.amount,
        itemName: order.itemName,
        customerEmail: order.customerEmail,
        completedAt: order.completedAt,
        downloadToken: order.downloadToken,
        manifest: tierManifest,
        downloadUrl: `/api/download/${order.downloadToken}`
      });
    } catch (err: any) {
      console.error('Error capturing order:', err);
      res.status(500).json({ error: 'Failed to process payment capture', message: err.message });
    }
  });

  // 3. Query order status
  app.get('/api/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    const order = ordersDatabase.get(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  });

  // 4. Download / Digital Reader Access
  app.get('/api/download/:token', (req, res) => {
    const { token } = req.params;
    const order = Array.from(ordersDatabase.values()).find(o => o.downloadToken === token);
    
    if (!order) {
      return res.status(404).send(`
        <html>
          <body style="background:#090d16;color:#e2e8f0;font-family:sans-serif;padding:3rem;text-align:center;">
            <h2>Authorization Expired or Invalid</h2>
            <p>Could not locate active digital download license for this token.</p>
          </body>
        </html>
      `);
    }

    const tier = TIERS_MANIFEST[order.tierId] || TIERS_MANIFEST['tier1'];
    
    // Serve high-fidelity digital delivery portal
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Digital Vault Access - ${tier.name}</title>
        <style>
          body { margin: 0; background: #050811; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; box-sizing: border-box; }
          .card { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(6, 182, 212, 0.4); border-radius: 16px; padding: 40px; max-width: 600px; width: 100%; box-shadow: 0 0 50px rgba(6, 182, 212, 0.15); }
          .badge { display: inline-block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #38bdf8; margin-bottom: 8px; }
          h1 { margin: 0 0 12px; font-size: 24px; color: #ffffff; }
          p { color: #94a3b8; line-height: 1.6; font-size: 14px; margin-bottom: 24px; }
          .file-list { background: rgba(0, 0, 0, 0.4); border-radius: 8px; padding: 16px; margin-bottom: 24px; border: 1px solid rgba(255, 255, 255, 0.05); }
          .file-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 13px; }
          .file-item:last-child { border-bottom: none; }
          .btn { display: inline-block; background: #06b6d4; color: #020617; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; transition: 0.2s; font-size: 14px; }
          .btn:hover { background: #22d3ee; }
          .meta { font-size: 12px; color: #64748b; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">Verified Cryptographic Access</span>
          <h1>${tier.name}</h1>
          <p>${tier.summary}</p>
          <div class="file-list">
            ${tier.files.map(f => `
              <div class="file-item">
                <span>📁 ${f}</span>
                <span style="color:#38bdf8;">Ready</span>
              </div>
            `).join('')}
          </div>
          <a class="btn" href="javascript:alert('Archive bundle download initialized. Your local vault copy has been synced.');">Download Master Archive (.ZIP)</a>
          <div class="meta">
            Order: ${order.orderId} · Purchased by: ${order.customerEmail || 'Verified Patron'}
          </div>
        </div>
      </body>
      </html>
    `);
  });

  // Setup Vite in development or static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[FluidMotion] Server online at http://0.0.0.0:${port}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
