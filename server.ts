import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Default Admin configuration
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'abualss3ud@gmail.com').toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@2026!';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'abu-alsaud-super-secret-secure-admin-session-key-2026';

// Active Session Tokens Store (in memory with timestamps)
const activeSessions = new Map<string, { email: string; expiresAt: number; createdAt: number }>();

function generateSessionToken(email: string): string {
  const random = crypto.randomBytes(32).toString('hex');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(`${email}:${random}`).digest('hex');
  const token = `adm_${random}_${signature}`;
  
  // 7 days expiration
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  activeSessions.set(token, { email, expiresAt, createdAt: Date.now() });
  return token;
}

function verifyAdminSession(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const session = activeSessions.get(token);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized: Session expired' });
  }

  (req as any).adminUser = {
    email: session.email,
    name: 'Mohamed Abu Al-Saud',
    role: 'superadmin',
  };

  next();
}

// ==========================================
// 1. AUTHENTICATION API ROUTES
// ==========================================

// Login endpoint
app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (cleanEmail !== ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Secure timing-safe password comparison
    const inputHash = crypto.createHash('sha256').update(password).digest();
    const expectedHash = crypto.createHash('sha256').update(ADMIN_PASSWORD).digest();

    if (inputHash.length !== expectedHash.length || !crypto.timingSafeEqual(inputHash, expectedHash)) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = generateSessionToken(cleanEmail);

    return res.json({
      success: true,
      token,
      user: {
        email: cleanEmail,
        name: 'Mohamed Abu Al-Saud',
        role: 'superadmin',
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
});

// Check Session / Verify endpoint
app.get('/api/admin/me', verifyAdminSession, (req: Request, res: Response) => {
  return res.json({
    authenticated: true,
    user: (req as any).adminUser,
  });
});

// Logout endpoint
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    activeSessions.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

// ==========================================
// 2. PUBLIC INQUIRY / CONTACT API
// ==========================================

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  date: string;
  status: 'unread' | 'read' | 'archived';
}

const serverMessages: ContactSubmission[] = [
  {
    id: 'msg-seed-1',
    name: 'Karim Hassan',
    email: 'karim@techventures.io',
    subject: 'Web Application Development Inquiry',
    company: 'TechVentures Studio',
    projectType: 'Full-Stack Platform',
    budget: '$5,000 - $10,000',
    timeline: '1-2 Months',
    message: 'Hello Mohamed, we loved your portfolio and would like to collaborate on building our next SaaS web dashboard with Next.js & PostgreSQL.',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    status: 'unread',
  },
  {
    id: 'msg-seed-2',
    name: 'Sarah Al-Mansoor',
    email: 'sarah@designflow.agency',
    subject: 'Design Systems & UI Architecture Consulting',
    company: 'DesignFlow Agency',
    projectType: 'UI/UX & Design Tokens',
    budget: '$3,000 - $6,000',
    timeline: '3-4 Weeks',
    message: 'Hi Mohamed, we are looking for a Senior UI/UX engineer to architect our multi-brand design tokens system in React and Tailwind.',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    status: 'read',
  },
];

app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const { name, email, subject, message, company, projectType, budget, timeline } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const newMsg: ContactSubmission = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: String(name).trim(),
      email: String(email).trim(),
      subject: subject ? String(subject).trim() : 'Project Inquiry',
      message: String(message).trim(),
      company: company ? String(company).trim() : '',
      projectType: projectType ? String(projectType).trim() : 'Web Application',
      budget: budget ? String(budget).trim() : 'Flexible',
      timeline: timeline ? String(timeline).trim() : 'Flexible',
      date: new Date().toISOString().split('T')[0],
      status: 'unread',
    };

    serverMessages.unshift(newMsg);

    return res.json({ success: true, messageId: newMsg.id, message: 'Message sent successfully' });
  } catch (err: any) {
    console.error('Contact submission error:', err);
    return res.status(500).json({ error: 'Failed to process inquiry' });
  }
});

// Admin Messages list
app.get('/api/admin/messages', verifyAdminSession, (req: Request, res: Response) => {
  return res.json({ messages: serverMessages });
});

// Mark message as read/unread
app.put('/api/admin/messages/:id/status', verifyAdminSession, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const msg = serverMessages.find((m) => m.id === id);
  if (!msg) {
    return res.status(404).json({ error: 'Message not found' });
  }
  if (status && ['read', 'unread', 'archived'].includes(status)) {
    msg.status = status;
  }
  return res.json({ success: true, message: msg });
});

// Delete message
app.delete('/api/admin/messages/:id', verifyAdminSession, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = serverMessages.findIndex((m) => m.id === id);
  if (index !== -1) {
    serverMessages.splice(index, 1);
    return res.json({ success: true });
  }
  return res.status(404).json({ error: 'Message not found' });
});

// ==========================================
// 3. SERVER INITIALIZATION & VITE MIDDLEWARE
// ==========================================

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
