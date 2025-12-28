# ☁️ Cloudflare Worker - Serverless Deployment

This is the **serverless deployment** method for Neko Actions using Cloudflare Workers.

## 🌟 Why Choose This?

- ✅ **100% Free** - Cloudflare's free tier (100k requests/day)
- ✅ **Zero Maintenance** - No server management
- ✅ **Global CDN** - Ultra-low latency worldwide
- ✅ **Auto-Scaling** - Handles traffic spikes automatically
- ✅ **Enterprise Security** - DDoS protection included
- ✅ **99.99% Uptime** - Cloudflare's SLA guarantee

## 📖 Quick Links

- **[Main Documentation](../README.md)** - Complete setup guide with both deployment options
- **[Quick Start Guide](../README.md#option-b-cloudflare-worker-serverless)** - Jump directly to Cloudflare Worker setup
- **[Troubleshooting](../README.md#cloudflare-worker-issues)** - Common issues and solutions

## 🚀 Quick Start

### 1. Create Worker in Cloudflare Dashboard

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Click **Create Application** → **Create Worker**
4. Name it (e.g., `telegram-bot`)
5. Click **Deploy**

### 2. Configure Environment Variables

In your worker settings (**Settings** → **Variables**), add these **required** variables:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
GITHUB_TOKEN=your_github_token
ALLOWED_USER_IDS=your_telegram_id
SECRET_PATH=your_unique_secret_path
```

**Important:** Click **Encrypt** for all tokens!

### 3. Deploy Worker Code

1. Click **Quick Edit** in your worker
2. Delete default code
3. Copy all contents from `cloudflare-edition.js`
4. Paste into editor
5. Click **Save and deploy**

### 4. Setup Webhook

```bash
curl https://YOUR_WORKER.workers.dev/YOUR_SECRET_PATH/setup
```

**Done!** Test by sending `/start` to your Telegram bot.

## 📁 Files in This Directory

- `cloudflare-edition.js` - Complete Cloudflare Worker code

## 🔐 Security Features

This deployment includes **enhanced security**:

1. **Secret Path Protection** - Admin endpoints hidden behind secret path
2. **Minimal Attack Surface** - Unknown paths return empty 404
3. **Zero Information Disclosure** - No error hints or version info
4. **Environment Isolation** - All credentials encrypted by Cloudflare

### Admin Endpoints

Access using your secret path:

```bash
# Check webhook status
curl https://YOUR_WORKER.workers.dev/YOUR_SECRET/webhook-info

# Health check
curl https://YOUR_WORKER.workers.dev/YOUR_SECRET/health

# Reset webhook
curl https://YOUR_WORKER.workers.dev/YOUR_SECRET/delete-webhook
```

## ⚙️ Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TELEGRAM_BOT_TOKEN` | ✅ | - | Bot token from @BotFather |
| `GITHUB_TOKEN` | ✅ | - | GitHub PAT with `repo` scope |
| `ALLOWED_USER_IDS` | ✅ | - | Comma-separated user IDs |
| `SECRET_PATH` | ✅ | - | Secret path for admin endpoints |
| `GITHUB_REPO` | ❌ | `dikeckaan/neko-actions` | Target repository |
| `WORKFLOW_NAME` | ❌ | `telegram-bot.yml` | Workflow filename |
| `GITHUB_BRANCH` | ❌ | `improvements` | Target branch |
| `CLOUDFLARE_TUNNEL_TOKEN` | ❌ | - | Cloudflare Tunnel token |

## 🔧 Advanced: Local Development

Want to test locally before deploying?

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create .dev.vars for local secrets
cat > .dev.vars << EOF
TELEGRAM_BOT_TOKEN=your_token
GITHUB_TOKEN=your_token
ALLOWED_USER_IDS=your_id
SECRET_PATH=test-secret
EOF

# Test locally
wrangler dev

# Deploy to production
wrangler deploy
```

## 📊 Monitoring

View real-time logs in Cloudflare Dashboard:

1. Go to your worker
2. Click **Logs** tab
3. Click **Begin log stream**
4. Interact with your bot to see logs

Or use Wrangler CLI:

```bash
wrangler tail YOUR_WORKER_NAME
```

## 🆚 vs Python Bot

| Feature | Cloudflare Worker | Python Bot |
|---------|------------------|------------|
| **Setup** | 5 minutes | 10-15 minutes |
| **Cost** | Free forever | Requires VPS |
| **Maintenance** | Zero | Manual |
| **Scaling** | Automatic | Limited |
| **Global** | Yes (CDN) | Single location |

## 📞 Need Help?

Check the [Troubleshooting section](../README.md#cloudflare-worker-issues) in the main README.

---

**Note:** For traditional server hosting with full control, check out the [Python Bot deployment](../python-bot/).
