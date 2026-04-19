# Neuroscience Blog Website - UI/Design Document

## Project Overview
A modern blog platform for a high schooler interested in neuroscience, featuring:
- Professional portfolio landing page
- Blog posts with categories (Research, Tutorials, Insights)
- Research papers showcase
- GitHub projects highlight
- Multi-platform messaging integration for quick blog ideation (WhatsApp via Twilio, Telegram via Bot API)
- AI-powered blog generation (OpenAI)
- Admin workflow for review and publishing

---

## Page Architecture

### 1. Landing Page (`/`)
**Purpose:** First impression, navigation hub

**Layout:**
```
[Header: Logo + Navigation Menu]
  - Home | Blog | Research | Projects | About | Contact

[Hero Section]
  - Large heading: "Exploring the Brain" or similar
  - Subheading: Brief tagline about neuroscience interests
  - Call-to-action buttons: "Read Blog" | "Explore Research"
  - Hero image (placeholder: brain illustration/image)

[Featured Section - Last 3 Blog Posts]
  - Card layout with:
    - Featured image
    - Title
    - Date published
    - Category badge (Research/Tutorial/Insight)
    - Excerpt (first 150 chars)
    - "Read More" link

[Research Highlights]
  - Grid of research papers (3 columns)
  - Each with:
    - Title
    - Publication date
    - PDF download link
    - Short description

[GitHub Projects Grid]
  - Grid showing recent GitHub repos (2-3 columns)
  - Each card shows:
    - Project name
    - Description
    - Languages used (badges)
    - Stars count
    - Link to GitHub

[About Section - Brief]
  - Short bio (3-4 sentences)
  - Profile image
  - Key interests/stats

[Footer]
  - Links to social media
  - Contact info
  - Newsletter signup placeholder
```

**Design Elements:**
- Color scheme: Blue/purple tones (neuroscience themed)
- Typography: Modern sans-serif
- Responsive: Mobile-first design

---

### 2. Blog Page (`/blog`)
**Purpose:** Browse and read all blog posts

**Layout:**
```
[Header + Navigation]

[Page Title: "Blog"]

[Sidebar (Desktop) / Dropdown (Mobile)]
  - Category filter:
    - All Posts
    - Research
    - Tutorials
    - Insights
  - Search box
  - Recent posts (5 links)

[Main Content Area]
  - Grid/List of blog posts
  - Sort options: Latest | Oldest | Most Popular
  
  [Blog Card] (repeating)
    - Featured image
    - Title
    - Author: "By [Student Name]"
    - Date published
    - Read time estimate
    - Category badge
    - Excerpt (200 chars)
    - "Read Article" button

[Pagination]
  - Previous | 1 2 3 ... | Next
```

---

### 3. Blog Post Page (`/blog/[slug]`)
**Purpose:** Read full blog post with engagement

**Layout:**
```
[Header + Navigation]

[Breadcrumb: Blog > Category > Title]

[Article Header]
  - Large featured image
  - Title
  - Metadata row:
    - Author
    - Published date
    - Read time
    - Updated date (if applicable)
    - Category badge

[Article Content]
  - Full markdown rendered content
  - Formatted headings, code blocks, images
  - Table of contents (sticky sidebar on desktop)

[Article Metadata Section]
  - Tags
  - Related articles (3-4 cards)
  - Share buttons (Twitter, LinkedIn, Copy link)

[Publishing Status Indicator]
  - Shows "Published on [date]" or "Draft" badge
  - For admin: Edit/Delete buttons

[Footer: Navigation to Previous/Next article]
```

---

### 4. Research Papers Page (`/research`)
**Purpose:** Showcase research publications

**Layout:**
```
[Header + Navigation]

[Page Title: "Research & Publications"]

[Brief Intro]
  - A few sentences about research interests

[Research Papers Grid] (2-3 columns)
  [Paper Card]
    - Paper title
    - Co-authors (if applicable)
    - Publication date
    - Journal/Conference name
    - PDF preview or thumbnail
    - Download PDF button
    - External link to DOI/source
    - Abstract (expandable)
    - Tags/keywords

[Filter/Sort Options]
  - Filters by year
  - Filters by type (Journal, Conference, etc.)
  - Sort by date
```

---

### 5. GitHub Projects Page (`/projects`)
**Purpose:** Display coding projects

**Layout:**
```
[Header + Navigation]

[Page Title: "Projects & Code"]

[Intro Section]
  - GitHub profile link
  - Brief description

[Project Grid] (2-3 columns)
  [Project Card]
    - Repository name (linked to GitHub)
    - Description
    - Language badges (Python, JavaScript, etc.)
    - Stars count
    - Last updated date
    - Contributor stats (if applicable)
    - Link to repository
    - (Optional) Link to live demo if applicable

[Filter Options]
  - Filter by language
  - Filter by topic
  - Sort by: Stars | Last Updated | Name
```

---

### 6. About Page (`/about`)
**Purpose:** Personal story and background

**Layout:**
```
[Header + Navigation]

[Hero Section]
  - Profile image (large)
  - Name
  - Title/Role

[About Content] (2-3 column layout)
  - Personal story (300-500 words)
  - Why neuroscience?
  - Current projects/interests
  - Contact CTA

[Timeline - Achievements]
  - High school achievements
  - Competitions/awards participated
  - Milestones in neuroscience journey

[Skills & Interests]
  - Technical skills (list or badges)
  - Research interests (expandable cards)
  - Languages spoken

[Social Links]
  - Email
  - GitHub
  - LinkedIn
  - Twitter/X
```

---

### 7. Admin Dashboard (`/admin`)
**Purpose:** Manage blog posts, drafts, review WhatsApp submissions

**Authentication:** Login required

**Layout:**
```
[Admin Header]
  - Logo + Admin Panel title
  - Logout button

[Sidebar Navigation]
  - Dashboard (home)
  - Blog Posts
    - Drafts
    - Published
  - Messaging Ideas
  - Research Papers
  - Projects
  - Settings

[Dashboard Main]
  [Quick Stats Cards]
    - Total blog posts
    - Draft count
    - Pending messaging ideas (WhatsApp + Telegram)
    - Total research papers

  [Recent Activities]
    - List of recent posts/submissions

  [Pending Messaging Ideas Section]
    - NEW ideas from WhatsApp & Telegram
    - Filter by platform (All | WhatsApp | Telegram)
    - Card for each idea:
      - Platform badge (WhatsApp | Telegram)
      - Timestamp
      - Sender name/ID
      - Original message
      - AI-generated blog preview
      - Buttons: Edit | Generate | Reject | Publish
      - Edit form (inline or modal)

  [Quick Actions]
    - New blog post button
    - New research paper button
    - View published posts button
```

**Sub-pages:**
- `/admin/posts` - List all posts with edit/delete
- `/admin/drafts` - Manage drafts
- `/admin/messaging-ideas` - Review WhatsApp & Telegram submissions (with platform filter)
- `/admin/research` - Manage research papers
- `/admin/settings` - Site settings, API keys (masked), platform configuration

---

## Multi-Platform Messaging Integration (WhatsApp & Telegram)

### Platform Setup

**WhatsApp:**
- Service: Twilio WhatsApp API
- Webhook endpoint: `/api/webhooks/whatsapp`
- Setup: Twilio phone number + webhook verification

**Telegram:**
- Service: Telegram Bot API
- Webhook endpoint: `/api/webhooks/telegram`
- Setup: BotFather setup + webhook registration

### User Journey: Blog Ideation via Messaging Platforms

#### WhatsApp Flow:
```
1. User sends WhatsApp message to bot number
   Message: "Write about synaptic plasticity and memory formation"

2. Twilio webhook receives message at /api/webhooks/whatsapp
   - Extracts text and sender phone
   - Creates database entry with platform: "whatsapp"
   - Sets status: "pending_ai_generation"
   - Sends immediate reply: "📝 Thanks! Your idea is being processed..."

3. Backend triggers OpenAI API
   - Sends the idea text
   - Receives AI-generated blog post draft
   - Updates database record with generated content
   - Sets status: "pending_review"
```

#### Telegram Flow:
```
1. User sends message to bot on Telegram
   Message: "Write about synaptic plasticity and memory formation"

2. Telegram webhook receives message at /api/webhooks/telegram
   - Extracts text and sender user_id
   - Creates database entry with platform: "telegram"
   - Sets status: "pending_ai_generation"
   - Sends immediate reply: "📝 Thanks! Your idea is being processed..."

3. Backend triggers OpenAI API
   - Same as WhatsApp flow
   - Updates database record
```

#### Admin Dashboard (Common for Both):
```
4. Admin Dashboard shows new idea
   - Card displays:
     - Platform badge: [WhatsApp] or [Telegram]
     - Sender info (phone for WhatsApp, name for Telegram)
     - Timestamp
     - Original message
     - AI-generated title
     - AI-generated preview (first 300 chars)
     - Full content in expandable section
     - Admin can:
       a) Edit content inline
       b) Preview formatted version
       c) Approve & publish directly
       d) Schedule publish date
       e) Reject (send reply via same platform)

5. Admin clicks "Publish"
   - Blog post created and published
   - Reply sent via detected platform:
     - WhatsApp: "✓ Blog published! Read it: [link]"
     - Telegram: "✓ Blog published! Read it: [link]"
   - Post appears on blog page

6. Admin clicks "Edit & Publish"
   - Opens full editor
   - Can modify title, content, add images, etc.
   - Publish when ready

7. Admin clicks "Reject"
   - Sends reply via same platform with reason (optional)
   - Deletes from pending items
```

### Platform Reply Messages

**Initial Submission (Both Platforms):**
- "📝 Thanks! Your idea is being processed..."

**Published (Both Platforms):**
- "🎉 Your blog is live! Read it: [Blog Link]"

**Rejected (Both Platforms):**
- "❌ This idea couldn't be published. [Optional reason]"

### Advantages of Multi-Platform Support
- **WhatsApp:** Wider reach, more personal messaging
- **Telegram:** Better for tech-savvy users, supports inline keyboards for quick actions
- **Flexibility:** Users choose their preferred platform
- **Unified Admin Interface:** All ideas in one dashboard, regardless of platform

---

## Database Schema (SQLite)

### Tables:

**1. blog_posts**
```
- id (primary key)
- title (string)
- slug (string, unique)
- content (text, markdown)
- excerpt (string)
- featured_image_url (string)
- category (enum: research, tutorial, insight)
- status (enum: draft, published, archived)
- author (string)
- created_at (timestamp)
- published_at (timestamp, nullable)
- updated_at (timestamp)
- read_time (integer, in minutes)
- tags (JSON array)
```

**2. messaging_ideas** (renamed from whatsapp_ideas to support multiple platforms)
```
- id (primary key)
- platform (enum: whatsapp, telegram)
- platform_message_id (string, unique per platform)
- sender_id (string) // phone for WhatsApp, user_id for Telegram
- sender_name (string, nullable)
- original_message (text)
- status (enum: pending_ai_generation, pending_review, published, rejected)
- ai_generated_title (string, nullable)
- ai_generated_content (text, nullable)
- admin_notes (text, nullable)
- related_blog_post_id (foreign key, nullable)
- created_at (timestamp)
- processed_at (timestamp, nullable)
- published_at (timestamp, nullable)
```

**3. research_papers**
```
- id (primary key)
- title (string)
- authors (string)
- publication_date (date)
- publication_url (string)
- pdf_url (string)
- abstract (text)
- journal_or_conference (string)
- tags (JSON array)
- created_at (timestamp)
```

**4. github_projects**
```
- id (primary key)
- repo_name (string)
- repo_url (string)
- description (text)
- languages (JSON array)
- topics (JSON array)
- stars (integer)
- last_updated (timestamp)
- featured (boolean)
- created_at (timestamp)
```

**5. admin_users**
```
- id (primary key)
- username (string, unique)
- password_hash (string)
- email (string)
- role (enum: admin, owner)
- created_at (timestamp)
- last_login (timestamp, nullable)
```

---

## Component Structure

```
/components
  /layout
    - Header.tsx (navigation, logo)
    - Footer.tsx (social links, contact)
    - Sidebar.tsx (admin sidebar)
  
  /common
    - Card.tsx (reusable card component)
    - Badge.tsx (category/tag badges)
    - Button.tsx (primary, secondary, danger variants)
    - Modal.tsx (for confirmations/dialogs)
    - SearchBar.tsx
  
  /blog
    - BlogCard.tsx (in grid)
    - BlogPost.tsx (full post view)
    - BlogFilter.tsx (category filter)
    - RelatedPosts.tsx
  
  /admin
    - DashboardStats.tsx (stats cards)
    - WhatsAppIdea.tsx (card for WhatsApp submission)
    - WhatsAppList.tsx (list of ideas)
    - BlogPostEditor.tsx (edit/create blog)
    - AdminNavigation.tsx
  
  /pages or /app
    - layout.tsx
    - page.tsx (home)
    - blog/page.tsx
    - blog/[slug]/page.tsx
    - research/page.tsx
    - projects/page.tsx
    - about/page.tsx
    - admin/layout.tsx
    - admin/page.tsx
    - admin/messaging-ideas/page.tsx
```

---

## API Routes (Backend)

```
POST   /api/webhooks/whatsapp
       - Receives WhatsApp messages from Twilio
       - Verifies Twilio signature
       - Triggers AI generation
       - Sends immediate acknowledgment
       - Updates database with platform: "whatsapp"

POST   /api/webhooks/telegram
       - Receives Telegram messages from Telegram Bot API
       - Triggers AI generation
       - Sends immediate acknowledgment
       - Updates database with platform: "telegram"

GET    /api/blog/posts
       - Fetch all published blog posts
       - Query params: category, sort, limit, offset

GET    /api/blog/posts/[slug]
       - Fetch single blog post

POST   /api/admin/blog/posts
       - Create new blog post (admin only)

PATCH  /api/admin/blog/posts/[id]
       - Update blog post

DELETE /api/admin/blog/posts/[id]
       - Delete blog post

GET    /api/admin/messaging-ideas
       - Get pending ideas from all platforms (admin only)
       - Query params: platform (all|whatsapp|telegram), status, limit

PATCH  /api/admin/messaging-ideas/[id]
       - Update messaging idea status
       - Automatically sends reply via correct platform
       - Parameters: status, admin_notes

POST   /api/admin/auth/login
       - Admin authentication

GET    /api/research
       - Fetch research papers

GET    /api/projects
       - Fetch GitHub projects

POST   /api/ai/generate
       - Generate blog from WhatsApp idea (internal only)
```

---

## Design System

### Colors
- **Primary:** #5B21B6 (Deep Purple)
- **Secondary:** #0369A1 (Sky Blue)
- **Accent:** #EA580C (Orange, for CTAs)
- **Success:** #10B981 (Green)
- **Warning:** #F59E0B (Yellow)
- **Error:** #EF4444 (Red)
- **Dark:** #1F2937 (Dark Gray)
- **Light:** #F3F4F6 (Light Gray)

### Typography
- **Headings:** Inter Bold/SemiBold
- **Body:** Inter Regular
- **Code:** Fira Code Monospace

### Spacing
- Base unit: 4px
- Standard gaps: 8px, 12px, 16px, 24px, 32px

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## Feature Priorities

### Phase 1 (MVP)
- ✅ Landing page with featured blog posts
- ✅ Blog listing and reading
- ✅ Admin dashboard
- ✅ WhatsApp webhook integration
- ✅ AI blog generation (basic)
- ✅ Manual blog creation in admin

### Phase 2
- ✅ Research papers showcase
- ✅ GitHub projects integration
- ✅ About page
- ✅ Search functionality
- ✅ Tags and categorization

### Phase 3
- Analytics dashboard
- Comments/engagement (with moderation)
- Email newsletter signup
- Social sharing metrics
- SEO optimization dashboard

---

## Security Considerations

- ✅ Admin authentication required for all admin routes
- ✅ WhatsApp webhook signature verification (Twilio)
- ✅ Rate limiting on API endpoints
- ✅ Secure storage of API keys (environment variables)
- ✅ SQL injection prevention (use parameterized queries)
- ✅ CSRF protection on forms
- ✅ Only allow verified WhatsApp numbers (configurable)
- ✅ Telegram bot token stored securely in environment variables
- ✅ Platform-specific webhook signatures verified
- ✅ Prevent spam/abuse via rate limiting per sender per platform

