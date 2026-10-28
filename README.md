# 🧶 Knot & Thread Tales — Website Guide

Your website has two parts:

- **The store** — what customers see and shop from (`index.html`)
- **The admin panel** — where you manage products, orders, and everything else (`admin.html`)

This guide covers how to run the site day to day. It doesn't cover setup or code — just how to use what's already built.

---

## 🔐 Logging into the admin panel

Go to `admin.html` on your site (e.g. `yoursite.com/admin.html`). It's not linked from the store itself, so bookmark it.

Sign in with the email and password you were given. If you ever forget your password or need a second staff login, that's managed in the Supabase dashboard under **Authentication → Users** — ask your developer if you need a new one added.

---

## 📦 Managing products

**Products** tab → **+ Add** to create a new product, or **Edit** on any row to change one.

Fields you'll fill in:
- **Code** — your internal product code (e.g. `KTT-012`)
- **Name, Description**
- **Category**
- **Price** and an optional **Offer Price** (shows as a strikethrough discount when set)
- **Dimensions, Materials, Colors, Wash/Care, Delivery days** — shown on the product page
- **In stock** — untick to show "Out of Stock" and disable ordering
- **Bestseller** — shows the bestseller badge and includes it in the homepage trending row
- **Customizable** — shows the "Custom" badge

### Product photos

Click **Images** next to any product to open its photo manager. From there you can:
- **Upload a photo** directly from your phone or computer — this is the reliable option, use it going forward
- **Add a photo by URL** if you already have one hosted elsewhere
- **Set Primary** — the photo marked Primary is what shows on the product card and as the first photo in the gallery
- **Delete** any photo

Add as many photos as you like per product — 3–4 (front, close-up, in use, colour variant) tends to look best.

> **A note on Google Drive:** some older products may still use Google Drive photo links. Google doesn't officially support linking Drive photos into a website this way, and it can fail unpredictably even when sharing is set correctly. If you see a product photo not loading, the fix is to re-upload it through the **Images** button above instead of relying on the Drive link.

---

## 📣 Announcements (discounts & news)

**Announcements** tab — this controls the banner that appears at the top of the store.

Set a **message**, pick a **type** (Info / Discount / Feature), and optionally a **link**. You can schedule it with a start/end date, or leave those blank to run indefinitely. Untick **Active** to hide it without deleting it. Customers can dismiss a banner themselves for their visit, but it'll show again on their next visit if it's still active.

---

## 🧾 Orders

**Orders** tab — every order placed through the "Order via WhatsApp" button is logged here automatically, even if the customer closes WhatsApp before actually sending the message. Use this as your running order log.

Update the **status** dropdown on each order as it moves through **Pending → Confirmed → Shipped → Delivered** (or **Cancelled**). This is for your own tracking — it doesn't notify the customer; WhatsApp is still how you communicate with them directly.

---

## ⭐ Reviews

Customers can leave a review on any product page. New reviews **don't appear on the site automatically** — they sit in the **Reviews** tab marked *Pending* until you approve them.

- **Approve** — publishes it to the product page and the site-wide Reviews page
- **Unapprove** — pulls a published review back down without deleting it
- **Delete** — removes it permanently

This gives you a chance to catch spam or anything inappropriate before it goes live.

---

## 💳 Payment Settings

**Payment Settings** tab — your **UPI ID** and **merchant name**, shown to customers when they're paying for an order. You can optionally add a **QR image**; if you leave it blank, the site generates a scannable QR code automatically from your UPI ID.

---

## 🗂️ Everything else

**Categories**, **FAQs**, and **Testimonials** all work the same way — add, edit, delete, and reorder using **Sort Order** (lower numbers show first).

---

## 🔎 Searching, sorting & exporting

Every list in the admin panel has:
- A **search box** to filter by anything in that table (product name, customer name, phone number, etc.)
- **Sortable columns** — click a column header to sort by it, click again to reverse
- **CSV** and **Excel** export buttons — downloads exactly what's currently on screen (respects your search and sort), handy for sharing an order list or backing up your product list

---

## 🔄 If a change doesn't seem to show up

Every page loads `styles.css`, `app.js`, and `admin.js` with a `?v=20260721` tag on the end. That date only exists to force browsers to fetch the newest file instead of an old cached copy. **Ask your developer to bump that number whenever a code update is deployed** — otherwise some visitors' browsers (and GitHub Pages' own CDN) may keep showing the old version for a while after a change goes live. If something looks unchanged after an update, a hard refresh (or opening the page in a private/incognito tab) rules this out immediately.

---

## 📞 Support

Knot & Thread Tales, Hyderabad. For anything the admin panel can't do, or if something looks broken, reach out to your developer.

Crafted with 💛

---

## Hero Carousel

The home page opens with a 3-slide banner carousel (`carousel.js`, styles in `styles.css`).

**Images** live in `images/banners/` and the file names must stay exactly:

| Slide | Desktop / tablet (≥700px, 1536×1024) | Mobile (<700px, 1024×1536) | Links to |
|---|---|---|---|
| 1 | `hero-1-desktop.jpg` | `hero-1-mobile.jpg` | All products |
| 2 | `hero-2-desktop.jpg` | `hero-2-mobile.jpg` | Handmade gifts |
| 3 | `hero-3-desktop.jpg` | `hero-3-mobile.jpg` | Crochet |

- To replace a banner, upload a new file with the **same name**, then bump `CACHE_VERSION` in `sw.js` (otherwise returning visitors may see the old image once).
- Keep headline, products and button inside the central ~70% of the image height: the banner is cropped to about 2.1:1 (desktop), 16:9 (tablet) and 5:7 (mobile).
- Settings (folder, extension, autoplay speed, slide links, `hideTextHero`) are at the top of `carousel.js`.
- A slide whose image is missing is skipped; if all are missing the carousel hides itself.
