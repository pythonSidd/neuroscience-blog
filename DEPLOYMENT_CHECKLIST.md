# AWS Amplify Deployment Checklist

## Pre-Deployment (Local Testing)
- [ ] All npm packages installed: `npm install`
- [ ] Database migration successful: `npm run migrate`
- [ ] Dev server runs: `npm run dev`
- [ ] Test admin login at `http://localhost:3000/admin` (user: admin, pwd: password123)
- [ ] No TypeScript errors: `npm run build` succeeds
- [ ] Code committed to GitHub main branch

## AWS Account Setup
- [ ] AWS Account created and verified
- [ ] GitHub account created with repository pushed
- [ ] Twilio account created
- [ ] Claude (Anthropic) account with API key generated

## GitHub Repository Setup
```bash
git init
git add .
git commit -m "Initial: Neuroscience blog with WhatsApp integration"
git remote add origin https://github.com/YOUR_USERNAME/sid_site_blog.git
git push -u origin main
```
- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] Public repository (or give GitHub OAuth access to Amplify)

## AWS Amplify Connection
- [ ] Logged into [AWS Amplify Console](https://console.aws.amazon.com/amplify)
- [ ] Selected **New app** → **Host web app**
- [ ] Connected GitHub account
- [ ] Selected `sid_site_blog` repository
- [ ] Selected main branch
- [ ] Confirmed build settings are correct

## Environment Variables Configuration
In Amplify Console → **Environment variables**, add all these:

### Required
- [ ] `CLAUDE_API_KEY` = `sk-ant-...` (from Anthropic)
- [ ] `TWILIO_ACCOUNT_SID` = (from Twilio Console)
- [ ] `TWILIO_AUTH_TOKEN` = (from Twilio Console)
- [ ] `TWILIO_WHATSAPP_NUMBER` = `whatsapp:+1234567890`
- [ ] `TWILIO_PHONE_NUMBER` = `+1234567890`
- [ ] `TWILIO_WEBHOOK_TOKEN` = (any random string)
- [ ] `ADMIN_USERNAME` = `admin`
- [ ] `ADMIN_PASSWORD` = (secure password)
- [ ] `JWT_SECRET` = (random 32+ char string)

### Optional
- [ ] `TELEGRAM_BOT_TOKEN` = (if using Telegram)
- [ ] `TELEGRAM_WEBHOOK_SECRET` = (if using Telegram)
- [ ] `CLAUDE_MODEL` = `claude-3-5-sonnet-20241022`

## Deployment
- [ ] All environment variables added in Amplify
- [ ] Clicked **Deploy**
- [ ] Build completed successfully (check logs)
- [ ] Application accessible at public URL

## Twilio Configuration
1. [ ] Go to [Twilio Console](https://console.twilio.com)
2. [ ] Navigate to **Messaging** → **Try it Out** → **Send a WhatsApp Message**
3. [ ] Get your Twilio WhatsApp Number
4. [ ] Go to **Sandbox Settings**
5. [ ] Set Webhook URL to: `https://YOUR_AMPLIFY_URL/api/webhooks/whatsapp`
6. [ ] Ensure POST method is selected
7. [ ] Keep **Primary Request URL** for receiving messages

## Post-Deployment Verification
- [ ] Public URL is accessible
- [ ] Blog page loads: `https://yourapp.amplifyapp.com/`
- [ ] Admin login works: `https://yourapp.amplifyapp.com/admin`
- [ ] Send test WhatsApp message to Twilio sandbox
- [ ] Check Amplify logs for message processing
- [ ] Verify blog post created in admin dashboard

## Monitoring & Maintenance
- [ ] Set up AWS billing alerts in [AWS Billing](https://console.aws.amazon.com/billing)
- [ ] Monitor costs weekly
- [ ] Check Amplify logging regularly
- [ ] Back up database: `data/db.json` (or migrate to DynamoDB for production)

## Troubleshooting
- [ ] Build failed? Check logs in Amplify Console
- [ ] WhatsApp not working? Verify webhook URL in Twilio
- [ ] Database error? Ensure migration completed successfully
- [ ] High costs? Reduce Claude API calls or message frequency

---

**Estimated Timeline:** 30-45 minutes
**Estimated Cost:** $2-5/month (starter), scales with usage

Once complete, your blog is live and ready to receive WhatsApp ideas!
