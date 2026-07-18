# MemberPay — Page-by-Page Specification (MVP)

Detailed spec for every screen: fields, actions, states, and flow. Use this directly as your build checklist.

---

## Screen Flow Overview

```
Landing/Login → OTP Verify → (New user) Onboarding → Dashboard
                                                          ├── Members List
                                                          │     ├── Add Member
                                                          │     └── Member Detail
                                                          ├── Payments/Billing
                                                          ├── Reminders Log
                                                          └── Settings
```

---

## 1. Login / Signup Page

**Route:** `/login`

**Purpose:** Single flow for both new and returning owners (phone-based, no separate signup form).

**Fields:**
- Phone number input (10-digit, India +91 prefix locked)

**Actions:**
- "Send OTP" button → triggers OTP screen
- Validation: must be valid 10-digit number, show inline error if not

**States:**
- Default
- Loading (sending OTP)
- Error (invalid number / SMS failed to send — show retry)

**Notes:**
- No password — phone OTP only, reduces friction for non-technical owners
- Logo + one-line tagline above the form: e.g. "Manage memberships. Get paid on time."

---

## 2. OTP Verification Page

**Route:** `/verify-otp`

**Fields:**
- 6-digit OTP input (auto-focus, auto-advance boxes)

**Actions:**
- Auto-submit when 6 digits entered
- "Resend OTP" (disabled for 30s countdown, then active)
- "Change number" link → back to login

**Logic:**
- On success: check if phone number exists in `businesses` table
  - Exists → go to Dashboard
  - New → go to Onboarding

**States:**
- Loading (verifying)
- Error (wrong OTP — shake animation, clear input, allow retry)
- Expired OTP (after 5 min — prompt resend)

---

## 3. Onboarding (New Owner Setup)

**Route:** `/onboarding` — multi-step, 3 steps, progress bar at top

### Step 1: Business Info
- Business name (text, required)
- Business type (dropdown: Gym, Yoga Studio, Tuition/Coaching, Salon, Dance/Music Class, Other)
- City (text or dropdown of major cities + "Other")
- Logo upload (optional, skip-able) — shows placeholder avatar with business initial if skipped

### Step 2: Payment Setup
- "Connect Razorpay" button → OAuth flow to link their Razorpay account
  - If they don't have one: inline link "Don't have Razorpay? Create one free →" (opens Razorpay signup in new tab)
- Skip option: "I'll do this later" → business marked `payment_setup: pending`, banner shown on Dashboard until completed (payment collection features locked until connected)

### Step 3: Add First Members (optional, bulk)
- Option A: "Add manually" → mini form (name, phone, plan, fee) — add multiple rows
- Option B: "Import from Excel/CSV" → upload template (downloadable template link provided)
- Option C: "Skip for now, I'll add members later"

**Completion:**
- "Finish Setup" → redirect to Dashboard with a welcome tooltip tour (3-step highlight: Members tab, Add Member button, Reminder settings)

---

## 4. Dashboard (Home)

**Route:** `/dashboard`

**Top summary cards (4-across, responsive to 2x2 on mobile):**
1. Active Members (count)
2. Overdue Payments (count, red highlight if >0)
3. This Month's Collections (₹ amount)
4. Expiring in 7 Days (count)

**Main content — Tabs or filter chips:**
- All Members | Active | Expiring Soon | Overdue

**Member row (table on desktop, card on mobile):**
- Name, phone, plan, fee, next due date, status badge (Active/green, Expiring/yellow, Overdue/red)
- Quick actions per row: "Send Reminder Now" icon, "Mark Paid" icon, "..." menu (Edit/Delete)

**Top-right actions:**
- "+ Add Member" button (primary, always visible)
- Search bar (by name/phone)
- Notification bell (payment confirmations, failed reminders)

**Empty state (no members yet):**
- Illustration + "Add your first member to get started" + Add Member CTA

**Banner (conditional):**
- If Razorpay not connected: persistent top banner "Connect Razorpay to start collecting payments →"

---

## 5. Add / Edit Member Page (Modal or full page)

**Route:** `/members/new` or modal overlay

**Fields:**
- Full name (required)
- Phone number (required, used for WhatsApp/SMS reminders)
- Plan name (dropdown of saved plans, or "+ Create new plan")
- Fee amount (₹, required)
- Billing cycle (Monthly / Quarterly / Yearly — dropdown)
- Start date (date picker, defaults to today)
- Next due date (auto-calculated from start date + cycle, editable override)
- Notes (optional text field — e.g. "prefers evening batch")

**Actions:**
- "Save & Add Another" (for quick bulk entry)
- "Save & Close"
- Cancel

**Validation:**
- Phone number format check
- Fee must be > 0
- Duplicate phone number warning (soft warning, not blocking — a member might have multiple memberships)

---

## 6. Member Detail Page

**Route:** `/members/:id`

**Sections:**

**Header:** Name, phone, status badge, plan, "Edit" and "Delete" buttons

**Payment History table:**
- Date, amount, method (link/manual/autopay), status (Paid/Pending/Failed), receipt download icon

**Actions:**
- "Send Payment Link Now" (manual trigger, bypasses schedule)
- "Mark as Paid" (manual, for cash payments — prompts for amount + date)
- "Pause Membership" (temporarily stops reminders — e.g. member on vacation)
- "Cancel Membership" (soft delete, moves to Inactive list, keeps history)

**Reminder Log (mini table):**
- Date sent, channel (WhatsApp/SMS), type (T-3/Due/Overdue), delivery status

---

## 7. Payments / Billing Page

**Route:** `/payments`

**Purpose:** Owner's view of all money in/out across all members.

**Filters:** Date range, status (Paid/Pending/Failed), plan type

**Table columns:**
- Member name, amount, date, method, status, receipt link

**Summary stats top bar:**
- Total collected this month
- Pending amount (sum of overdue)
- Success rate of auto-payment links (%)

**Export:** "Download CSV" button (for owner's own accounting/Tally import)

---

## 8. Reminders Settings Page

**Route:** `/settings/reminders`

**Configurable options:**
- Toggle: T-3 days reminder (on/off)
- Toggle: Due date reminder (on/off)
- Toggle: Overdue reminder (on/off) + frequency (once / every 3 days until paid)
- Channel preference: WhatsApp primary, SMS fallback (toggle)
- Message template editor (with variable tags: `{member_name}`, `{amount}`, `{due_date}`, `{payment_link}`) — preview pane shown live

**Default templates provided** so owner doesn't have to write from scratch, just edit tone.

---

## 9. Settings / Profile Page

**Route:** `/settings`

**Sub-sections (tabs or accordion):**
- **Business Profile:** name, logo, type, city — editable
- **Payment Settings:** Razorpay connection status, reconnect/disconnect button
- **Plans:** manage saved membership plans (name, default fee, cycle) — CRUD list
- **Staff Access** (Phase 2): invite receptionist/staff with limited permissions
- **Subscription/Billing (your SaaS billing):** current plan (Starter/Growth/Pro), usage (members count vs limit), upgrade button, invoice history
- **Notifications:** email/SMS preferences for owner's own alerts

---

## 10. Member Self-Serve Portal (Phase 2 — no login, OTP-based)

**Route:** `/m/:business-slug` (public, member enters own phone to view)

**Flow:**
- Member enters phone number → OTP → sees their own membership status

**View:**
- Current plan, next due date, payment status
- "Pay Now" button (if due/overdue)
- Payment history + downloadable receipts

---

## 11. Error / Edge-Case States (apply globally)

| Scenario | Handling |
|---|---|
| Razorpay webhook fails/delayed | Show "Payment Pending Confirmation" status, auto-retry check every few mins |
| WhatsApp API down | Fallback to SMS automatically, log failure in reminders_log |
| Owner exceeds plan member limit | Block "Add Member" with upgrade prompt modal |
| Duplicate member add | Warn but allow (multi-membership case) |
| Network/API failure anywhere | Toast notification "Something went wrong, please retry" — never silent fail |

---

## 12. Mobile Responsiveness Notes

- Dashboard table → converts to stacked cards below 768px width
- Bottom nav bar on mobile: Dashboard | Members | Payments | Settings (4 icons)
- Add Member as full-screen modal on mobile, not a small popup
- WhatsApp is the primary channel — most owners will manage this from their phone, so mobile-first design matters more than desktop polish

---

## 13. Suggested Build Order (maps to pages above)

1. Login + OTP (auth foundation)
2. Onboarding Step 1 & 2 (business + Razorpay connect)
3. Dashboard shell + Add Member page
4. Member Detail page + manual "mark as paid"
5. Payment Links integration + webhook → Payments page
6. Reminders cron + Reminders Settings page
7. Settings/Profile + Plans management
8. Onboarding Step 3 (bulk import) — polish last, manual add works for MVP
9. Member self-serve portal — defer to Phase 2
