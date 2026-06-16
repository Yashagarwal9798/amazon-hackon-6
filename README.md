# Amazon Sidekick — AI-Powered Shopping Assistant

> **Amazon HackOn Season 6** submission — An intelligent shopping assistant embedded in Amazon Now that builds smart grocery carts through natural language, image uploads, recipes, occasions, emergency kits, and healthcare templates.

**Live Demo:** [amazon-hackon-6.vercel.app](https://amazon-hackon-6.vercel.app/)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Tech Stack](#tech-stack)
4. [Database Schema](#database-schema)
5. [Component Architecture](#component-architecture)
6. [User Flows & Sequence Diagrams](#user-flows--sequence-diagrams)
7. [Three-Tier Cart System](#three-tier-cart-system)
8. [Features](#features)
9. [Project Structure](#project-structure)
10. [Setup & Installation](#setup--installation)
11. [Environment Variables](#environment-variables)
12. [API Reference](#api-reference)
13. [Deployment](#deployment)

---

## Project Overview

**Amazon Sidekick** is a conversational AI assistant built directly into the Amazon Now shopping experience. Instead of browsing products manually, users describe what they need — a recipe, a party plan, an emergency kit, or a health requirement — and Sidekick intelligently builds a shopping cart from Amazon's product catalog.

### Core Innovation: Three-Tier Cart Pipeline

```
User Request → AI Analysis → Mini Cart → User Review → Sidekick Cart → Checkout → Amazon Cart
```

Each tier gives users transparency and control before committing to a purchase.

### Sidekick Workspace

![Amazon Sidekick Workspace](public/sidekick/workspace-screenshot.png)

---

## System Architecture

### High-Level System Architecture

```mermaid
graph TB
    subgraph Client["Client — Browser (React 19 + TypeScript)"]
        UI[Amazon Now UI]
        SW[SidekickWorkspace]
        CS[sidekickChatService]
        SC[Supabase Client]
    end

    subgraph Supabase["Supabase Cloud"]
        EF[Edge Function\nsidekick-chat]
        DB[(PostgreSQL\nDatabase)]
        AUTH[Auth / RLS]
    end

    subgraph AI["AI Layer"]
        LLM[LLM — Claude / GPT\nIntent + Product Matching]
        OCR[Image Recognition\nGrocery List OCR]
    end

    UI --> SW
    SW --> CS
    CS --> SC
    SC -->|REST API| DB
    SC -->|Invoke| EF
    EF --> LLM
    EF --> OCR
    EF --> DB
    DB --> AUTH
```

### Deployment Architecture

```mermaid
graph LR
    subgraph Vercel["Vercel (SPA Host)"]
        VITE[Vite Build\nStatic Assets]
        SPA[React SPA\nSPA Routing via vercel.json]
    end

    subgraph Supabase["Supabase Cloud"]
        PG[(PostgreSQL)]
        EF[Deno Edge\nFunctions]
        STOR[File Storage\nUser Images]
    end

    Browser -->|HTTPS| Vercel
    Vercel --> VITE
    Browser -->|Supabase SDK| Supabase
    EF -->|SQL| PG
    EF -->|Read/Write| STOR
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 19.0.0 |
| Language | TypeScript | 5.7.2 |
| Build Tool | Vite | 6.0.5 |
| Routing | React Router DOM | 7.1.1 |
| Icons | Lucide React | 0.468.0 |
| Backend / DB | Supabase (PostgreSQL) | 2.108.2 |
| Serverless Functions | Supabase Edge Functions (Deno) | — |
| Hosting | Vercel | — |
| AI/LLM | Claude / GPT (via Edge Function) | — |

---

## Database Schema

### Entity-Relationship Diagram

```mermaid
erDiagram
    USERS {
        uuid id PK
    }

    PRODUCT_CATALOG {
        uuid id PK
        text title
        text brand
        text category
        text[] aliases
        text pack_size
        text unit
        numeric price
        numeric rating
        boolean available
        integer delivery_eta_minutes
        text image_url
    }

    SIDEKICK_CHAT_SESSIONS {
        uuid id PK
        uuid user_id FK
        text title
        text active_mode
        uuid latest_cart_draft_id FK
        timestamptz created_at
        timestamptz updated_at
    }

    SIDEKICK_CHAT_MESSAGES {
        uuid id PK
        uuid session_id FK
        text role
        text content
        jsonb metadata
        timestamptz created_at
    }

    SIDEKICK_CART_DRAFTS {
        uuid id PK
        uuid session_id FK
        uuid user_id FK
        text title
        text mode
        text status
        numeric subtotal
        jsonb missing_slots
        jsonb evidence
        timestamptz created_at
    }

    SIDEKICK_CART_ITEMS {
        uuid id PK
        uuid cart_draft_id FK
        text requirement_name
        uuid product_id FK
        text product_title
        text brand
        integer quantity
        text unit
        text pack_size
        numeric price
        numeric rating
        boolean available
        integer delivery_eta_minutes
        text reason
        jsonb alternatives
    }

    SIDEKICK_SESSION_CART_ITEMS {
        uuid id PK
        uuid session_id FK
        uuid user_id FK
        uuid[] source_cart_draft_ids
        uuid[] source_cart_item_ids
        text product_title
        text brand
        integer quantity
        numeric price
        jsonb alternatives
    }

    AMAZON_CART_ITEMS {
        uuid id PK
        uuid user_id FK
        uuid source_cart_draft_id FK
        text product_title
        text brand
        integer quantity
        numeric price
    }

    RECIPE_DOCUMENTS {
        uuid id PK
        text name
        text[] aliases
        text cuisine
        integer base_servings
        jsonb ingredients
        text instructions
        text source
    }

    OCCASION_TEMPLATES {
        uuid id PK
        text name
        text[] aliases
        jsonb required_slots
        jsonb item_requirements
    }

    EMERGENCY_TEMPLATES {
        uuid id PK
        text name
        text[] aliases
        jsonb item_requirements
    }

    HEALTHCARE_TEMPLATES {
        uuid id PK
        text name
        text[] aliases
        text safety_message
        jsonb item_requirements
    }

    SIDEKICK_SCHEDULES {
        uuid id PK
        uuid user_id FK
        uuid session_id FK
        text request_text
        text schedule_type
        timestamptz run_at
        text[] recurrence_days
        time recurrence_time
        text timezone
        timestamptz next_run_at
        text reminder_email
        text email_status
        text status
    }

    USER_PREFERENCE_PROFILES {
        uuid id PK
        uuid user_id FK
        jsonb preferred_brands_by_category
    }

    USER_PURCHASE_HISTORY {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
        text product_title
        text brand
        text category
        integer quantity
        timestamptz purchased_at
    }

    USERS ||--o{ SIDEKICK_CHAT_SESSIONS : "has"
    USERS ||--o{ AMAZON_CART_ITEMS : "has"
    USERS ||--o{ USER_PREFERENCE_PROFILES : "has"
    USERS ||--o{ USER_PURCHASE_HISTORY : "has"
    USERS ||--o{ SIDEKICK_SCHEDULES : "has"

    SIDEKICK_CHAT_SESSIONS ||--o{ SIDEKICK_CHAT_MESSAGES : "contains"
    SIDEKICK_CHAT_SESSIONS ||--o{ SIDEKICK_CART_DRAFTS : "produces"
    SIDEKICK_CHAT_SESSIONS ||--o{ SIDEKICK_SESSION_CART_ITEMS : "has"
    SIDEKICK_CHAT_SESSIONS ||--o{ SIDEKICK_SCHEDULES : "schedules"

    SIDEKICK_CART_DRAFTS ||--o{ SIDEKICK_CART_ITEMS : "contains"
    SIDEKICK_CART_ITEMS }o--|| PRODUCT_CATALOG : "references"
    USER_PURCHASE_HISTORY }o--|| PRODUCT_CATALOG : "references"
```

### Cart Status State Machine

```mermaid
stateDiagram-v2
    [*] --> needs_clarification : AI needs more info
    needs_clarification --> ready_for_review : User provides details
    [*] --> ready_for_review : AI has enough info
    ready_for_review --> committed : User commits cart
    committed --> [*]

    state needs_clarification {
        [*] --> Prompting_User
        Prompting_User --> [*]
    }

    state ready_for_review {
        [*] --> Displaying_Mini_Cart
        Displaying_Mini_Cart --> User_Modifies
        User_Modifies --> Displaying_Mini_Cart
        Displaying_Mini_Cart --> [*]
    }

    state committed {
        [*] --> Moved_to_Sidekick_Cart
        Moved_to_Sidekick_Cart --> [*]
    }
```

---

## Component Architecture

### React Component Tree (UML Class-Style)

```mermaid
graph TD
    APP[App.tsx\nRouter Setup]

    APP --> HOME[AmazonHomePage\n/]
    APP --> NOW[AmazonNowPage\n/now]
    APP --> CART[AmazonNowCartPage\n/now/cart]

    HOME --> AH1[AmazonHeader]
    HOME --> HPS[HomeProductSection\nproduct grid]

    NOW --> AH2[AmazonHeader]
    NOW --> NH[NowHeader\ndelivery address + search]
    NOW --> NCS[NowCategoryStrip\nhorizontal scroll categories]
    NOW --> NPR[NowProductRail\nfeatured products]
    NOW --> SL[SidekickLauncher\nfloating AI button]
    NOW --> SWS[SidekickWorkspace\nAI chat modal]

    SWS --> PMC[ProductRecommendationCard\nper mini-cart item]
    SWS --> NPC[NowProductCard\nstandard product display]

    CART --> AH3[AmazonHeader]

    style SWS fill:#FF9900,color:#000
    style SL fill:#FF9900,color:#000
    style PMC fill:#FF9900,color:#000
```

### SidekickWorkspace State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> SessionHistory : Opens session list
    SessionHistory --> Idle : Closes

    Idle --> ActiveChat : Creates or loads session
    ActiveChat --> Typing : User types message
    Typing --> Loading : Sends message
    Loading --> ActiveChat : AI responds with cart

    ActiveChat --> MiniCartView : Expands mini cart
    MiniCartView --> Modifying : Adjusts item/qty/replacement
    Modifying --> MiniCartView : Confirms change

    MiniCartView --> SidekickCartView : "Add to Sidekick Cart"
    SidekickCartView --> AmazonCartView : "Commit to Amazon Cart"

    ActiveChat --> ScheduleForm : Opens scheduler
    ScheduleForm --> ActiveChat : Saves schedule

    ActiveChat --> ImageUpload : Attaches grocery image
    ImageUpload --> Loading : Submits image
```

---

## User Flows & Sequence Diagrams

### Flow 1: Recipe-Based Shopping

```mermaid
sequenceDiagram
    actor User
    participant UI as React UI
    participant SVC as sidekickChatService
    participant EF as Edge Function (Deno)
    participant LLM as AI / LLM
    participant DB as PostgreSQL

    User->>UI: "Make paneer butter masala for 4"
    UI->>SVC: sendSidekickMessage(sessionId, message, "recipe")
    SVC->>EF: POST /sidekick-chat {userId, sessionId, message, mode}

    EF->>DB: INSERT message (role=user)
    EF->>DB: SELECT * FROM recipe_documents WHERE name ILIKE '%paneer%'
    DB-->>EF: Recipe with ingredients [{qty: 200g, item: paneer}, ...]

    EF->>LLM: Prompt: match ingredients to catalog, scale for 4 servings
    LLM-->>EF: [{product_id, reason, alternatives[]}, ...]

    EF->>DB: SELECT * FROM product_catalog WHERE id IN (...)
    DB-->>EF: Product details with prices
    EF->>DB: INSERT sidekick_cart_drafts (status=ready_for_review)
    EF->>DB: INSERT sidekick_cart_items (one per ingredient)
    EF->>DB: INSERT message (role=assistant)

    EF-->>SVC: {session, messages, cartDraft, items}
    SVC-->>UI: Updated state
    UI-->>User: Shows Mini Cart with matched products
```

### Flow 2: Image-Based Grocery List

```mermaid
sequenceDiagram
    actor User
    participant UI as React UI
    participant SVC as sidekickChatService
    participant EF as Edge Function (Deno)
    participant OCR as Image Recognition
    participant DB as PostgreSQL

    User->>UI: Uploads photo of handwritten grocery list
    UI->>SVC: sendSidekickMessage(sessionId, "", "general", imageFile)
    SVC->>EF: POST /sidekick-chat {userId, sessionId, image: base64}

    EF->>OCR: Extract text from image
    OCR-->>EF: ["milk 2L", "bread", "eggs dozen", "onions 1kg"]

    EF->>DB: SELECT FROM product_catalog WHERE title ILIKE ANY(parsed_items)
    DB-->>EF: Matched products

    EF->>DB: INSERT sidekick_cart_drafts
    EF->>DB: INSERT sidekick_cart_items
    EF-->>SVC: {cartDraft, items}
    SVC-->>UI: Mini Cart rendered
    UI-->>User: Review and edit cart
```

### Flow 3: Three-Tier Cart Commit Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as React UI
    participant SVC as sidekickChatService
    participant DB as PostgreSQL

    Note over User,DB: Step 1 — AI generates Mini Cart
    UI-->>User: Mini Cart shown (sidekick_cart_drafts)

    Note over User,DB: Step 2 — User adds to Sidekick Cart
    User->>UI: "Add to Sidekick Cart"
    UI->>SVC: addMiniCartToSidekickCart(cartDraft)
    SVC->>DB: INSERT sidekick_session_cart_items\n(source_cart_draft_ids tracked)
    DB-->>SVC: Inserted rows
    SVC-->>UI: Sidekick Cart updated

    Note over User,DB: Step 3 — User modifies Sidekick Cart
    User->>UI: Changes qty / swaps product
    UI->>SVC: updateSidekickCartItemQuantity / replaceSidekickCartItemProduct
    SVC->>DB: UPDATE sidekick_session_cart_items
    DB-->>SVC: OK

    Note over User,DB: Step 4 — Commit to Amazon Cart
    User->>UI: "Commit to Amazon Cart"
    UI->>SVC: commitSidekickCart(sessionId)
    SVC->>DB: SELECT sidekick_session_cart_items WHERE session_id = ?
    DB-->>SVC: All sidekick cart items
    SVC->>DB: INSERT amazon_cart_items (batch)
    SVC->>DB: DELETE sidekick_session_cart_items WHERE session_id = ?
    DB-->>SVC: OK
    SVC-->>UI: Amazon Cart ready
    UI-->>User: Redirects to /now/cart checkout page
```

### Flow 4: Scheduled Orders

```mermaid
sequenceDiagram
    actor User
    participant UI as React UI
    participant SVC as sidekickChatService
    participant DB as PostgreSQL
    participant CRON as Background Scheduler

    User->>UI: Opens Schedule tab in Sidekick
    User->>UI: Fills form: "Milk + bread every Monday 8am"
    UI->>SVC: createSidekickSchedule({schedule_type: recurring, recurrence_days: [Monday], recurrence_time: 08:00})
    SVC->>DB: INSERT sidekick_schedules\n(next_run_at calculated)
    DB-->>SVC: Schedule created
    SVC-->>UI: Confirmation shown

    Note over CRON,DB: Background (server-side)
    CRON->>DB: SELECT * FROM sidekick_schedules WHERE next_run_at <= NOW()
    DB-->>CRON: Due schedules
    CRON->>CRON: Re-run cart creation for each schedule
    CRON->>DB: UPDATE next_run_at for recurring
    CRON->>DB: Send reminder_email if configured
```

---

## Three-Tier Cart System

This is the core innovation of Amazon Sidekick. Each tier serves a distinct purpose:

```mermaid
graph LR
    subgraph T1["Tier 1 — Mini Cart"]
        MC[sidekick_cart_drafts\n+ sidekick_cart_items]
        MC_ST[Status:\nneeds_clarification\nready_for_review\ncommitted]
    end

    subgraph T2["Tier 2 — Sidekick Cart"]
        SC[sidekick_session_cart_items\nUser-curated items\nMultiple mini carts merged]
    end

    subgraph T3["Tier 3 — Amazon Cart"]
        AC[amazon_cart_items\nCheckout-ready\nFinal quantities]
    end

    User -->|"Describe need"| T1
    T1 -->|"Add to Sidekick Cart\n(addMiniCartToSidekickCart)"| T2
    T2 -->|"Commit\n(commitSidekickCart)"| T3
    T3 -->|"Proceed to Checkout"| CHECKOUT["/now/cart"]

    style T1 fill:#FFF3CD
    style T2 fill:#D4EDDA
    style T3 fill:#FF9900
```

| Tier | Table | User Can Modify | Purpose |
|------|-------|-----------------|---------|
| Mini Cart | `sidekick_cart_drafts` + `sidekick_cart_items` | Qty, swap product | AI-generated first draft |
| Sidekick Cart | `sidekick_session_cart_items` | Qty, swap, remove | User-curated across multiple requests |
| Amazon Cart | `amazon_cart_items` | Read-only (checkout) | Final committed cart |

---

## Features

### Sidekick Modes

```mermaid
mindmap
  root((Amazon\nSidekick))
    Recipes
      Natural language recipe requests
      Auto ingredient-to-product matching
      Serving size scaling
      60+ products in catalog
    Occasions
      Birthday parties
      Festival celebrations
      Custom guest count scaling
      Decoration + food bundling
    Emergency Kits
      Power cut kit
      Water shortage kit
      Heavy rain preparedness
      Fast cart generation
    Healthcare
      Cold & flu kit
      Safety messages shown
      ORS, thermometer, vitamins
      Medical disclaimer
    Grocery Image Upload
      Photo of handwritten list
      OCR text extraction
      Auto product matching
    Scheduled Orders
      One-time future orders
      Recurring weekly/daily
      Email reminders
      next_run_at tracking
```

### Input Methods

| Method | Description |
|--------|-------------|
| Text Chat | Natural language message to Sidekick |
| Voice Input | Browser speech recognition API |
| Image Upload | Photo of grocery list parsed via OCR |
| Mode Buttons | Quick-launch Recipes / Occasions / Emergency / Healthcare |
| Schedule Form | Date/time/recurrence picker for future orders |

---

## Project Structure

```
amazon-hackon-6/
├── src/
│   ├── pages/
│   │   ├── AmazonHomePage.tsx       # Landing page (route: /)
│   │   ├── AmazonNowPage.tsx        # Shopping page (route: /now)
│   │   └── AmazonNowCartPage.tsx    # Checkout page (route: /now/cart)
│   ├── components/
│   │   ├── AmazonHeader.tsx         # Top navigation bar
│   │   ├── HomeProductSection.tsx   # Home page product grid
│   │   ├── NowCategoryStrip.tsx     # Horizontal category nav
│   │   ├── NowHeader.tsx            # Amazon Now header
│   │   ├── NowProductCard.tsx       # Individual product card
│   │   ├── NowProductRail.tsx       # Horizontal product scroll
│   │   ├── ProductRecommendationCard.tsx  # AI-recommended item card
│   │   ├── SearchBar.tsx            # Search input
│   │   ├── SidekickLauncher.tsx     # Floating Sidekick button
│   │   └── SidekickWorkspace.tsx    # Main AI chat modal (~1834 lines)
│   ├── services/
│   │   └── sidekickChatService.ts   # All Supabase operations
│   ├── data/
│   │   ├── amazonHomeData.ts        # Home page static data
│   │   ├── amazonNowData.ts         # Categories and featured products
│   │   └── sidekickUiData.ts        # Sidekick modes config
│   ├── lib/
│   │   └── supabaseClient.ts        # Supabase client init
│   ├── styles/
│   │   ├── global.css
│   │   ├── amazon-home.css
│   │   ├── amazon-now.css
│   │   └── sidekick.css
│   ├── App.tsx                      # Router configuration
│   └── main.tsx                     # React entry point
├── supabase/
│   ├── functions/
│   │   └── sidekick-chat/           # Deno Edge Function (AI backend)
│   ├── schema.sql                   # Full database schema
│   ├── schedule_schema.sql          # Scheduling table schema
│   ├── seed_recipe_mvp.sql          # 60+ products + templates
│   └── migrations/                  # Database migrations
├── scripts/
│   └── seedRecipeMvp.mjs            # Node.js seed script
├── public/
│   └── sidekick/                    # UI assets
├── .env.example                     # Environment variable template
├── index.html                       # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json                      # SPA routing rewrites
```

---

## Setup & Installation

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account and project
- (Optional) Vercel account for deployment

### 1. Clone and install

```bash
git clone <repo-url>
cd amazon-hackon-6
npm install
```

### 2. Configure Supabase

Create a Supabase project, then copy your project URL and anon key:

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Set up the database

Run the SQL files in order in the Supabase SQL editor:

```sql
-- 1. Main schema
-- Run: supabase/schema.sql

-- 2. Scheduling schema
-- Run: supabase/schedule_schema.sql

-- 3. Seed data (products, recipes, templates)
-- Run: supabase/seed_recipe_mvp.sql
```

Or use the seed script:

```bash
npm run seed:recipe
```

### 4. Deploy the Edge Function

```bash
npx supabase functions deploy sidekick-chat
```

### 5. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file at the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project REST URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous public key | Yes |

---

## API Reference

All data operations go through `src/services/sidekickChatService.ts` which wraps the Supabase JS client.

### Sessions

| Function | Description |
|----------|-------------|
| `listSidekickSessions(userId)` | List all sessions for a user |
| `createSidekickSession(userId)` | Create a new chat session |
| `loadSidekickSession(sessionId)` | Load session with messages and latest cart |
| `deleteSidekickSession(sessionId)` | Delete a session |

### Messaging

| Function | Description |
|----------|-------------|
| `sendSidekickMessage(params)` | Send message to AI (calls Edge Function) |

### Mini Cart (Tier 1)

| Function | Description |
|----------|-------------|
| `loadCartDraft(cartDraftId)` | Load a mini cart with all items |
| `updateCartItemQuantity(itemId, qty)` | Change item quantity |
| `removeCartItem(itemId)` | Remove item from mini cart |
| `replaceCartItemProduct(itemId, product)` | Swap to alternative product |

### Sidekick Cart (Tier 2)

| Function | Description |
|----------|-------------|
| `loadSidekickSessionCart(sessionId)` | Get all items in Sidekick Cart |
| `addMiniCartToSidekickCart(cartDraft)` | Promote mini cart to Sidekick Cart |
| `updateSidekickCartItemQuantity(itemId, qty)` | Update quantity |
| `removeSidekickCartItem(itemId)` | Remove item |
| `replaceSidekickCartItemProduct(itemId, product)` | Swap product |
| `emptySidekickCart(sessionId)` | Clear entire Sidekick Cart |

### Amazon Cart (Tier 3)

| Function | Description |
|----------|-------------|
| `listAmazonCartItems(userId)` | Get final Amazon Cart |
| `commitSidekickCart(sessionId)` | Move Sidekick Cart → Amazon Cart |

### Scheduling

| Function | Description |
|----------|-------------|
| `createSidekickSchedule(params)` | Create one-time or recurring order |

### Edge Function: `POST /sidekick-chat`

```json
{
  "userId": "uuid",
  "sessionId": "uuid",
  "message": "Make paneer butter masala for 4 people",
  "selectedMode": "recipe",
  "image": "base64string (optional)"
}
```

**Response:**
```json
{
  "session": { "id": "...", "title": "..." },
  "messages": [...],
  "cartDraft": { "id": "...", "status": "ready_for_review", "subtotal": 245.50 },
  "sidekickCartItems": [...]
}
```

---

## Deployment

### Vercel (Frontend)

The `vercel.json` configures SPA routing so all paths resolve to `index.html`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**Deployed at:** [https://amazon-hackon-6.vercel.app/](https://amazon-hackon-6.vercel.app/)

Deploy with:

```bash
npm run build
vercel --prod
```

### Supabase (Backend)

- Database: Managed PostgreSQL, always-on
- Edge Functions: Deployed to Supabase's global Deno runtime
- RLS: Disabled for MVP; enable per-table policies before production

---

## Hackathon Context

This project was built for **Amazon HackOn Season 6**. The core thesis is that AI can dramatically reduce the friction of online grocery shopping by:

1. Understanding **intent** (recipe, emergency, occasion) not just product names
2. **Building a complete cart** from a single natural language request
3. Keeping the user **in control** via the three-tier review pipeline
4. Supporting **multiple input modalities** (text, voice, image)
5. Enabling **repeat ordering** via intelligent scheduling

---

*Built with React 19, TypeScript, Supabase, and Vite. Deployed on Vercel.*
