# DEPLOYMENT GUIDE - Bastuku Investments Landing Page

## Phase 4: Production Deployment & Domain Connection

This guide covers deploying your static landing page and connecting it to Bastuku Investments' custom domain.

---

## Part 1: DEPLOYMENT OPTIONS

### Option A: GitHub Pages (RECOMMENDED - Free & Easy)

GitHub Pages provides free static site hosting directly from your repository.

#### Setup Steps:

1. **Push code to GitHub** (see `GITHUB_SETUP.md`)

2. **Enable GitHub Pages:**
   - Go to your repository: `https://github.com/YOUR_USERNAME/bastuku-investments-landing`
   - Click **Settings** → **Pages** (left sidebar)
   - Under "Source", select **Deploy from a branch**
   - Select branch: **main**
   - Select folder: **/ (root)**
   - Click **Save**

3. **Get your GitHub Pages URL:**
   - GitHub will display: `https://YOUR_USERNAME.github.io/bastuku-investments-landing/`
   - This will be live in < 1 minute

#### Advantages:

- ✅ Free hosting
- ✅ SSL certificate included
- ✅ Automatic updates when you push to GitHub
- ✅ No server maintenance
- ✅ Scalable infrastructure

#### Disadvantages:

- ❌ Must use GitHub's URL subdomain (unless using custom domain)

---

### Option B: Netlify (Easy Alternative)

Netlify offers free hosting with more features than GitHub Pages.

#### Setup Steps:

1. Sign up at [Netlify.com](https://netlify.com)

2. Click **Add new site** → **Import an existing project**

3. Select Git provider: GitHub

4. Authorize Netlify to access your GitHub account

5. Select repository: `bastuku-investments-landing`

6. Configure build settings:
   - Build command: (leave blank - static site, no build)
   - Publish directory: `.` (or leave blank if files are in root)

7. Click **Deploy site**

#### Advantages:

- ✅ Free with custom domain
- ✅ Better analytics
- ✅ Form submissions handling
- ✅ Automatic deployments
- ✅ Environment variables support

---

### Option C: Vercel (Alternative for Next.js, but works here too)

Similar to Netlify, very fast delivery.

#### Setup: Visit [Vercel.com](https://vercel.com), import GitHub repo, done.

---

## Part 2: CUSTOM DOMAIN SETUP

### Prerequisites:

- Domain name (already registered with provider like GoDaddy, Namecheap, etc.)
- Admin access to domain's DNS settings

### Step 1: Prepare Your Domain at Registrar

Log in to your domain registrar (GoDaddy, Namecheap, Route 53, etc.)

**Find DNS Management/Settings** - Usually under:

- "Domain Settings"
- "DNS Management"
- "Manage DNS"
- "Advanced Settings"

---

## Part 3: GITHUB PAGES + CUSTOM DOMAIN

### Option A: Using GitHub Pages with Custom Domain

#### Method 1: Via GitHub Settings (Easiest)

1. Go to repository **Settings** → **Pages**
2. Under "Custom domain", enter your domain: `bastuku-investments.zm` (or with www)
3. Click **Save**
4. GitHub will create a `CNAME` file automatically

#### Method 2: Manual CNAME File

Create a file named `CNAME` in your repository root with content:

```
bastuku-investments.zm
```

Push to GitHub:

```powershell
git add CNAME
git commit -m "Add custom domain CNAME record"
git push origin main
```

#### DNS Configuration for GitHub Pages:

Go to your domain registrar and add **A Records** (pointing to GitHub's IP addresses):

```
Type: A
Host: @
Value: 185.199.108.153

Type: A
Host: @
Value: 185.199.109.153

Type: A
Host: @
Value: 185.199.110.153

Type: A
Host: @
Value: 185.199.111.153
```

**For www subdomain** (optional):

```
Type: CNAME
Host: www
Value: YOUR_USERNAME.github.io
```

**Verification:**

- Wait 15-30 minutes for DNS propagation
- Visit `https://bastuku-investments.zm`
- Visit `https://www.bastuku-investments.zm` (if configured)

#### Enable HTTPS (Automatic):

- GitHub automatically issues SSL/TLS certificates via Let's Encrypt
- Check **"Enforce HTTPS"** in Settings → Pages

---

## Part 4: NETLIFY + CUSTOM DOMAIN

### Option B: Using Netlify with Custom Domain

#### Step 1: Configure Netlify Domain Settings

1. Go to your Netlify site dashboard
2. Navigate to **Domain settings**
3. Under "Custom domains", click **Add domain**
4. Enter your domain: `bastuku-investments.zm`
5. Netlify will provide nameserver addresses

#### Step 2: Update Nameservers at Registrar

1. Log in to your domain registrar
2. Find **Nameserver** settings (NOT DNS records)
3. Replace with Netlify's nameservers:
   - `dns1.p01.nsone.net`
   - `dns2.p02.nsone.net`
   - `dns3.p03.nsone.net`
   - `dns4.p04.nsone.net`

(Get exact values from Netlify dashboard)

#### Step 3: HTTPS (Automatic)

- Netlify automatically provisions SSL/TLS via Let's Encrypt
- This happens automatically; no action needed

#### Verification:

- Wait 24-48 hours for nameserver propagation (can be faster)
- Visit `https://bastuku-investments.zm`

---

## Part 5: BEST PRACTICE DNS RECORDS

### Complete DNS Configuration Reference

If using GitHub Pages with custom DNS records (not nameservers):

```
# A Records - Direct GitHub
Type: A
Host: @
TTL: 3600
Value: 185.199.108.153

Type: A
Host: @
TTL: 3600
Value: 185.199.109.153

Type: A
Host: @
TTL: 3600
Value: 185.199.110.153

Type: A
Host: @
TTL: 3600
Value: 185.199.111.153

# AAAA Records - IPv6 Support
Type: AAAA
Host: @
TTL: 3600
Value: 2606:50c0:8000::153

Type: AAAA
Host: @
TTL: 3600
Value: 2606:50c0:8001::153

Type: AAAA
Host: @
TTL: 3600
Value: 2606:50c0:8002::153

Type: AAAA
Host: @
TTL: 3600
Value: 2606:50c0:8003::153

# WWW Subdomain CNAME
Type: CNAME
Host: www
TTL: 3600
Value: YOUR_USERNAME.github.io

# Email Records (Optional - add if email needed)
Type: MX
Priority: 10
Value: mail.your-email-provider.com
```

### Email Configuration (Optional)

If Bastuku needs email (`info@bastuku-investments.zm`):

Add MX records from your email provider:

```
Type: MX
Priority: 10
Value: aspmx.l.google.com

Type: MX
Priority: 20
Value: alt1.aspmx.l.google.com

Type: TXT
Name: google-site-verification
Value: [verification string from email provider]
```

---

## Part 6: DEPLOYMENT CHECKLIST

Before going live, verify:

### Code Quality

- [ ] All links work correctly
- [ ] Images load properly
- [ ] Contact form fields display correctly
- [ ] Mobile responsiveness tested (768px, 1024px, 1440px)
- [ ] Dark mode works on all pages
- [ ] No console errors (F12 → Console tab)

### Performance

- [ ] PageSpeed Insights score > 80
- [ ] Lighthouse score > 90
- [ ] Load time < 3 seconds
- [ ] Images optimized (compressed)

### SEO & Analytics

- [ ] Meta description present
- [ ] `og:` tags for social sharing
- [ ] Structured data/schema.org (optional)
- [ ] Google Analytics code added (if desired)
- [ ] Sitemap.xml present (optional)

### Security

- [ ] HTTPS enabled ✅ (automatic)
- [ ] No hardcoded credentials
- [ ] .gitignore includes sensitive files
- [ ] No exposed API keys in code

### Domain & DNS

- [ ] Domain purchased and registered
- [ ] DNS records configured
- [ ] Domain points to hosting provider
- [ ] CNAME or A records verified
- [ ] SSL certificate active
- [ ] www subdomain configured (if needed)

---

## Part 7: POST-DEPLOYMENT TASKS

### Monitor Live Site

```powershell
# Check site health via command line
$url = "https://bastuku-investments.zm"

# Test page load
[System.Net.ServicePointManager]::SecurityProtocol += [System.Net.SecurityProtocolType]::Tls12
$response = Invoke-WebRequest -Uri $url
$response.StatusCode  # Should show 200
```

### Set Up Monitoring (Optional)

- **Uptime Monitoring**: Use UptimeRobot.com (free)
- **Performance Monitoring**: Use Google Analytics
- **Error Tracking**: Use Sentry.io (free tier)

### Regular Maintenance

```powershell
# Update repository regularly
git pull origin main
git add .
git commit -m "Update: [description]"
git push origin main
```

---

## Part 8: TROUBLESHOOTING

### "Domain not connecting to site"

**Solution 1: Check DNS Propagation**

```powershell
nslookup bastuku-investments.zm
dig bastuku-investments.zm
```

Expected output should show GitHub IPs or your hosting provider.

**Solution 2: Verify DNS Records**

- Log in to registrar
- Confirm A records are exact (no typos)
- Wait 24-48 hours for full propagation

### "SSL certificate not working"

**Solution:**

- GitHub/Netlify automatically provisions certificate
- Wait 5-10 minutes after domain configuration
- Try in incognito/private browser mode
- Uncheck browser's "Always HTTPS" setting if enabled

### "www subdomain not working"

**Solution:**

- Ensure CNAME record added for www
- Value should be: `YOUR_USERNAME.github.io` (GitHub Pages)
- Or use A records for www (less common)

### "Site shows old content"

**Solution:**

```powershell
# Force refresh without cache
Ctrl + Shift + Delete  # Windows/Linux
Cmd + Shift + Delete    # macOS

# Or clear GitHub Pages cache
# Hard refresh in browser: Ctrl + Shift + R
```

---

## Part 9: CUSTOM DOMAIN PROVIDERS & DNS

### Popular Domain Registrars

| Provider           | DNS Interface | Notes                       |
| ------------------ | ------------- | --------------------------- |
| **GoDaddy**        | Easy          | Very beginner-friendly      |
| **Namecheap**      | Good          | Affordable, clear interface |
| **Google Domains** | Excellent     | Simple, reliable            |
| **Route 53**       | Complex       | For AWS users               |
| **Cloudflare**     | Advanced      | Free DNS + CDN              |

### Where to Find DNS Settings

**GoDaddy:**

- Settings → Domains → Your Domain → DNS

**Namecheap:**

- Dashboard → Manage → Nameservers or DNS Records

**Google Domains:**

- DNS tab (left navigation)

**Cloudflare:**

- DNS tab (after adding site)

---

## DEPLOYMENT SUMMARY

```
┌─────────────────────────────────────────────┐
│  LOCAL DEVELOPMENT                          │
│  (Your Computer)                            │
└────────────┬────────────────────────────────┘
             │
             ├─> git add .
             ├─> git commit -m "message"
             └─> git push origin main
                          │
┌─────────────────────────▼────────────────────┐
│  GITHUB REPOSITORY                          │
│  (Source Code Storage)                      │
└────────────┬────────────────────────────────┘
             │
             ├─> Automatic Deployment (GitHub Pages/Netlify)
             │
┌─────────────▼────────────────────────────────┐
│  WEB SERVER / CDN                           │
│  (Hosts your website)                       │
└────────────┬────────────────────────────────┘
             │
             ├─> DNS Records Point Here
             │
┌─────────────▼────────────────────────────────┐
│  CUSTOM DOMAIN                              │
│  bastuku-investments.zm                     │
│  (User visits this URL)                     │
└─────────────────────────────────────────────┘
```

---

## FINAL CHECKLIST

- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled OR Netlify connected
- [ ] Domain purchased
- [ ] DNS records configured
- [ ] Domain accessible via HTTPS
- [ ] Mobile responsive tested
- [ ] All content displays correctly
- [ ] Contact/CTA buttons functional
- [ ] Analytics configured (optional)
- [ ] Team briefed on deployment

---

## SUPPORT & RESOURCES

- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **Netlify Docs**: https://docs.netlify.com
- **DNS Propagation Checker**: https://www.whatsmydns.net
- **SSL Certificate Test**: https://www.ssllabs.com/ssltest
- **Performance Testing**: https://pagespeed.web.dev

---

**Deployment Status**: Ready for Production ✅

For questions or issues, refer to the troubleshooting section or contact your web hosting provider's support team.
