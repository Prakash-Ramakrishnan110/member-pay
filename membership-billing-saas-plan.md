# MemberPay — Subscription Billing SaaS for Local Businesses

A complete project plan: product, tech, revenue model, and go-to-market.

---

## 1. The Idea (One-liner)

A dashboard + WhatsApp-based tool that lets gyms, coaching centers, salons, and tuition classes manage memberships, auto-send payment reminders, and collect recurring payments via Razorpay — replacing notebooks and manual WhatsApp follow-ups.

**Target customer:** Owners of small local service businesses in India (gyms, yoga studios, tuition/coaching centers, salons, dance/music classes) with 30–500 members.

**Core value prop for them:** "Stop chasing members for money. We remind them and collect payment automatically."

---

## 2. Problem & Why Now

- Most small business owners track members in a notebook, Excel, or WhatsApp groups.
- Late payments are common because there's no reminder system — the owner has to manually message each member.
- UPI Autopay (via Razorpay Subscriptions) is now mature and widely trusted in India — recurring payments no longer require cards.
- WhatsApp Business APIs are cheap and reliable, making automated reminders low-cost to build.
- Competitors (Zoho, Vagaro, Mindbody) are either too expensive, too complex, or built for the US market — a real gap exists for a ₹500–1000/month tool built specifically for Indian small businesses.

---

## 3. Product Scope

### Phase 1 — MVP (Weeks 1–3)
| Feature | Detail |
|---|---|
| Owner signup/login | Phone OTP or email |
| Business profile | Name, type, logo, UPI/bank details |
| Member management | Add/edit member, plan, fee, start date, status |
| Payment collection | Razorpay Payment Links, auto-generated per cycle |
| Payment tracking | Webhook auto-marks "paid"; manual "mark as paid" for cash |
| Reminders | WhatsApp/SMS at T-3 days, due date, and overdue |
| Dashboard | Active / expiring / overdue member lists, monthly revenue view |

### Phase 2 — Growth (Month 2–4)
- Razorpay Subscriptions + UPI Autopay (true auto-charge, no manual link click)
- Member self-serve portal (view dues, payment history, download receipt)
- Multi-staff login (receptionist role vs owner role)
- Attendance/check-in (optional, high value for gyms)
- Analytics: churn rate, MRR, renewal rate

### Phase 3 — Scale (Month 5+)
- Multi-branch support (franchise gyms/coaching chains)
- WhatsApp broadcast/marketing tools (offers, batch announcements)
- Referral program built into member portal
- API/webhooks for accounting export (Tally/GST invoice generation)

---

## 4. Tech Architecture

```
Frontend (Owner Dashboard): Next.js + Tailwind, hosted on Vercel
Backend: Node.js (Express) or Django REST, hosted on Railway/Render
Database: PostgreSQL (Supabase recommended — bundles auth + DB + storage)
Payments: Razorpay Payment Links API (Phase 1) → Razorpay Subscriptions API (Phase 2)
Messaging: Gupshup or Interakt (WhatsApp Business API), Twilio as SMS fallback
Scheduler: Cron job (node-cron or Vercel Cron) for daily reminder sweep
Auth: Supabase Auth or Firebase Auth (phone OTP)
```

### Simplified Database Schema
```
businesses
  id, name, owner_phone, business_type, razorpay_account_id, created_at

members
  id, business_id (FK), name, phone, plan_name, fee_amount,
  billing_cycle, start_date, next_due_date, status (active/expired/overdue)

payments
  id, member_id (FK), amount, razorpay_payment_id, status,
  payment_link_url, created_at, paid_at

reminders_log
  id, member_id (FK), channel (whatsapp/sms), sent_at, type (T-3/due/overdue)
```

### Key Integration Flow
1. Cron runs daily → finds members with `next_due_date` in 3 days
2. Generates Razorpay Payment Link via API → stores link in `payments`
3. Sends WhatsApp message with link via Gupshup/Interakt
4. Razorpay webhook fires on payment success → updates `payments.status` and `members.next_due_date` (+1 cycle)
5. If unpaid past due date → status flips to "overdue" → escalated reminder sent

---

## 5. Revenue Model — How You Earn

### A. Primary: Flat SaaS subscription (recommended)
Charge the **business owner**, not their members.

| Plan | Price/month | Member limit | Target |
|---|---|---|---|
| Starter | ₹499 | Up to 100 members | Small studios/tuition |
| Growth | ₹999 | Up to 300 members | Gyms, coaching centers |
| Pro | ₹1,999 | Unlimited + multi-branch | Chains/franchises |

**Why flat fee over commission:** Owners distrust % cuts on their revenue and it's harder for them to budget. A flat fee is predictable for you (MRR) and them.

### B. Secondary revenue levers (add later)
- **WhatsApp message overage** — bundle 500 reminders/month in plan, charge ₹0.50–1/message beyond that (covers your Gupshup cost + margin)
- **Setup/onboarding fee** — ₹999 one-time for hands-on data migration from Excel/notebook (useful early, less scalable)
- **Add-on modules** — attendance tracking, GST invoicing, multi-branch — priced as add-ons for Pro-tier upsell
- **Annual plan discount** — 2 months free for annual prepay → improves your cash flow and reduces churn

### Illustrative Revenue Math
- 50 customers × ₹799 avg/month = **₹39,950 MRR** (~₹4.8L/year)
- 200 customers × ₹799 avg/month = **₹1,59,800 MRR** (~₹19L/year)
- Your costs at that scale: hosting (~₹3–5k/mo), WhatsApp API (~₹5–15k/mo depending on volume), Razorpay is paid by the *member* at each transaction (owner absorbs or passes on), so your margin stays high (70–85%) since this is a lean SaaS, not a marketplace.

### Where Razorpay fits for you specifically
- You are **not** the one paying Razorpay's transaction fees — the business owner's Razorpay account absorbs the ~2% payment gateway fee on each member payment (standard practice).
- You only need **Razorpay Route or Connected Accounts** if you want to take a cut of each transaction automatically. For a flat-fee SaaS model, each business owner uses their *own* Razorpay account (via Razorpay's Partner/OAuth integration) — simpler, faster to launch, no RBI-regulated aggregator complexity for you.

---

## 6. Go-to-Market Plan

### Weeks 1–3: Build MVP
Use the scope above. Build the reminder + payment link + dashboard loop only. Skip UPI Autopay, member portal, multi-staff for now.

### Weeks 4–6: First 10 customers (manual, high-touch)
- Visit 15–20 local gyms/tuition centers in person or via WhatsApp
- Offer free 1-month trial in exchange for feedback
- Personally help them import their member list (Excel/notebook → your system)
- Goal: 10 paying customers by end of week 6

### Month 2–3: Refine + get to 30–50 customers
- Ask early customers for referrals (owners know other owners — gym owners talk to other gym owners)
- Create a simple landing page + WhatsApp demo video
- Local business Facebook/WhatsApp groups, gym owner associations

### Month 4+: Scale channel
- Partner with gym equipment suppliers / coaching center franchises for referral commissions
- Content: "How to reduce membership dropouts" type posts targeting owners
- Consider a reseller/agent model — local computer/mobile shop owners often onboard small businesses to SaaS tools for a commission

---

## 7. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Owners resist switching from notebook/Excel | Do manual onboarding for first 20 customers; make data import painless |
| WhatsApp API costs scale with reminders | Bundle a cap in pricing tiers; batch reminders efficiently |
| Churn if members don't pay via link | Combine with manual "mark as paid" so owner still gets value even without full automation |
| Razorpay account setup friction for owners | Guide them through Razorpay signup as part of onboarding; many already have accounts |
| Competing with free tools (Excel, WhatsApp) | Lead with time-saved messaging, not "digital transformation" — show hours saved per week |

---

## 8. Suggested First 30-Day Build Checklist

- [ ] Set up Supabase project (DB + Auth)
- [ ] Build owner signup/login (phone OTP)
- [ ] Build member CRUD (add/edit/list members)
- [ ] Integrate Razorpay Payment Links API + webhook listener
- [ ] Set up Gupshup/Interakt WhatsApp API sandbox
- [ ] Build daily cron job for reminder sweep (T-3, due, overdue)
- [ ] Build owner dashboard UI (active/expiring/overdue view)
- [ ] Manually onboard 3 pilot businesses (friends/family network if possible)
- [ ] Collect feedback, fix critical bugs
- [ ] Start outreach to next 10 businesses

---

## 9. Legal/Compliance Notes (India-specific, not legal advice)

- You are a **software provider**, not a payment aggregator, as long as each business uses its own Razorpay account — this avoids RBI Payment Aggregator licensing requirements that apply if you pool funds.
- Have a simple Terms of Service + Privacy Policy (member phone numbers/payment data involved — treat as sensitive).
- GST registration needed once your revenue crosses ₹20L/year (services) threshold — track this as you scale.
- Consider a basic Data Processing clause in your ToS since you'll store member personal data (phone numbers, payment status) on behalf of business owners.
