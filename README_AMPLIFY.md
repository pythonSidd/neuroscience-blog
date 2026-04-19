# AWS Amplify Deployment Guide

## Prerequisites
- AWS Account with Amplify enabled
- GitHub account with repository containing this code
- Claude API key (Anthropic)
- Twilio account (for WhatsApp)
- Telegram bot token (optional)

## Deployment Steps

### 1. Create GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit: Neuroscience blog with WhatsApp integration"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sid_site_blog.git
git push -u origin main
```

### 2. Connect to AWS Amplify
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click **New app** → **Host web app**
3. Select **GitHub** as deployment source
4. Authorize GitHub and select your repository
5. Click **Next**

### 3. Build Settings
The build settings should be auto-detected. If not, ensure:
- **Build command**: `npm run build`
- **Base directory**: (Leave blank or `.`)
- **Output directory**: `.next`
- **Install command**: `npm install`

### 4. Environment Variables
In the Amplify Console, add the following environment variables:

**Required for Production:**
```
CLAUDE_API_KEY=sk-ant-... (from Anthropic)
TWILIO_ACCOUNT_SID=... (from Twilio Console)
TWILIO_AUTH_TOKEN=... (from Twilio Console)
TWILIO_WHATSAPP_NUMBER=whatsapp:+1... (Your Twilio WhatsApp number)
TWILIO_PHONE_NUMBER=+1... (Your Twilio phone number)
TWILIO_WEBHOOK_TOKEN=any_random_token_for_verification
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_123
JWT_SECRET=generate_a_random_string_here
TELEGRAM_BOT_TOKEN= (optional, if using Telegram)
TELEGRAM_WEBHOOK_SECRET= (optional, if using Telegram)
```

**Optional:**
```
CLAUDE_MODEL=claude-3-5-sonnet-20241022
NEXT_PUBLIC_APP_NAME=Neuroscience Blog
```

### 5. Configure Custom Domain (Optional)
1. In Amplify Console → **Domain management**
2. Add your custom domain
3. Update DNS records with the values provided

### 6. Deploy
1. Click **Deploy**
2. Monitor the build progress in Amplify Console
3. Once deployed, you'll receive a public URL (e.g., `https://yourapp.amplifyapp.com`)

### 7. Configure Twilio Webhooks
1. Go to [Twilio Console](https://console.twilio.com)
2. Navigate to WhatsApp Sandbox settings
3. Update webhook URL to: `https://yourapp.amplifyapp.com/api/webhooks/whatsapp`
4. Ensure POST method is selected
5. Test webhook connectivity

### 8. Configure Telegram Webhooks (Optional)
1. Send this command to BotFather:
```
/setwebhook https://yourapp.amplifyapp.com/api/webhooks/telegram your_webhook_secret_token
```

## File Structure
```
.
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (webhooks, auth, blog)
│   ├── admin/                    # Admin dashboard
│   ├── blog/                     # Blog pages
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── lib/
│   ├── db.ts                     # JSON database
│   ├── ai.ts                     # Claude AI integration
│   ├── auth.ts                   # JWT authentication
│   └── ...
├── data/
│   └── db.json                   # Database file (auto-created by migration)
├── scripts/
│   └── migrate.js                # Database initialization
├── amplify.yml                   # Amplify build configuration
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
└── package.json
```

## Database
The application uses a JSON-based database stored in `/data/db.json`. On Amplify:
- Initial migration runs automatically on first deploy
- Database persists in Amplify's file system between deployments
- For production, consider migrating to **DynamoDB** for better scalability

### Migrating to DynamoDB (Advanced)
If traffic grows significantly, update `lib/db.ts` to use AWS SDK:
```bash
npm install @aws-sdk/client-dynamodb
```

## Monitoring & Logs
1. In Amplify Console → **Monitoring**
2. View real-time logs of API calls and errors
3. Set up CloudWatch alarms for errors

## Cost Monitoring
1. Go to [AWS Billing Dashboard](https://console.aws.amazon.com/billing)
2. Set up billing alerts
3. Monitor:
   - Amplify hosting (includes bandwidth)
   - Laurent API calls
   - Data transfers

## Troubleshooting

### Build Failed
- Check build logs in Amplify Console
- Ensure `npm run migrate` succeeds locally: `npm run migrate`
- Verify all environment variables are set

### WhatsApp Webhook Not Working
- Confirm webhook URL in Twilio Console
- Check API logs in Amplify Console (`Monitoring` tab)
- Verify JWT_SECRET matches in code and environment

### Database Errors
- Check `/data/db.json` exists (created by migration script)
- Verify migration ran successfully (should see log in build output)
- For production, ensure file system has write permissions

### High Costs
- Optimize Claude API calls (batch requests when possible)
- Monitor Twilio message volume
- Use Amplify's free tier for builds

## Updating the Application
Simply push to GitHub main branch:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Amplify automatically redeploys!

## Support
- Amplify Docs: https://docs.amplify.aws/
- Next.js Docs: https://nextjs.org/docs
- Twilio Docs: https://www.twilio.com/docs
- Anthropic Docs: https://docs.anthropic.com/
