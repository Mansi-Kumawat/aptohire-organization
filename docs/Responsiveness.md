  
You are a senior frontend developer specializing in responsive design.  
Your job is to audit this entire codebase for mobile responsiveness   
issues and fix every single one of them.

Do not ask questions. Scan first, fix second, report third.

\---

\#\# STEP 1 — DETECT THE STACK

Read the codebase and identify:  
\- CSS framework in use: Tailwind / Bootstrap / plain CSS / CSS Modules /   
  Styled Components / Emotion / SCSS / other  
\- Component framework: React / Next.js / Vue / HTML+JS / other  
\- Existing breakpoint system (if any)  
\- Where global CSS lives (globals.css / index.css / \_app.tsx / App.vue etc.)

State what you found before proceeding.

\---

\#\# STEP 2 — FULL AUDIT (Check Every Item Below)

Scan every page and component. For each item below, state   
PASS or FAIL with the specific file and line where the issue is.

\#\#\# 2A — Viewport Meta Tag  
Check if \<meta name="viewport" content="width=device-width, initial-scale=1"\>   
exists in the HTML head.  
\- If missing: add it immediately to the correct location  
\- For Next.js: goes in \_document.tsx or layout.tsx  
\- For React: goes in public/index.html  
\- For HTML: goes in every HTML file's \<head\>

\#\#\# 2B — Navigation / Header  
Check the main navigation component.

HAMBURGER MENU CHECK:  
\- Does a hamburger / mobile menu already exist?  
\- To confirm: look for: hamburger, menu-toggle, mobile-nav,   
  HamburgerIcon, MenuIcon, isMenuOpen state, or similar  
\- If YES → do not touch it. Leave it as is.  
\- If NO → build a hamburger menu:  
  \* 3-line icon (☰) visible only on screens below 768px  
  \* Desktop nav links hidden on mobile (hidden below md breakpoint)  
  \* Clicking hamburger toggles a full-width dropdown showing all nav links  
  \* Clicking any nav link closes the menu  
  \* Clicking outside the menu closes it  
  \* Menu has smooth open/close transition  
  \* Close (✕) icon replaces hamburger when menu is open  
  \* Implement in the existing nav component — do not create a new file

\#\#\# 2C — Typography and Font Sizes  
Scan all font-size declarations across all files.  
Fix every instance where:  
\- Body text is below 16px on mobile (minimum: 16px)  
\- Headings are oversized on mobile and cause overflow  
\- Line-height is below 1.4 (makes text hard to read on small screens)  
\- Text is using fixed px values for headings instead of responsive units

Use this scale as the standard:  
\- H1: clamp(28px, 5vw, 56px)  
\- H2: clamp(24px, 4vw, 40px)    
\- H3: clamp(20px, 3vw, 32px)  
\- Body: 16px minimum, 18px preferred  
\- Small/caption: 14px minimum

If using Tailwind: use responsive prefixes (text-base md:text-lg lg:text-xl)  
If using plain CSS: use clamp() or media queries

\#\#\# 2D — Images  
Check every \<img\> and background-image usage:  
\- Every \<img\> must have max-width: 100% and height: auto  
\- No image should cause horizontal scroll  
\- If using Next.js Image component: verify width and height props are set  
  and layout is responsive or fill where needed  
\- Large hero images must have mobile-specific sizing

\#\#\# 2E — Layout and Grid  
Check all grid and flex containers:  
\- Multi-column grids must collapse to single column on mobile (below 768px)  
\- Flex rows must wrap on mobile or stack vertically  
\- No fixed-width containers that exceed the viewport (common culprit:   
  fixed px widths on cards, sections, wrappers)  
\- Padding and margins must shrink on mobile (no 80px padding on a 375px screen)

\#\#\# 2F — Buttons and Touch Targets  
Every clickable element must be at minimum 44x44px on mobile.  
Check:  
\- All \<button\> and \<a\> elements used as buttons  
\- Icon-only buttons (these are the most common failure)  
\- Form submit buttons  
\- Any element with onClick handler  
Fix: add padding or min-height/min-width to any element below 44px touch target

\#\#\# 2G — Forms and Inputs  
Check all form inputs:  
\- Input fields must be 100% width on mobile  
\- Font-size on inputs must be minimum 16px (below 16px triggers iOS auto-zoom)  
\- Labels must be above inputs on mobile (not side-by-side)  
\- Buttons in forms must be full width on mobile

\#\#\# 2H — Tables  
Check all \<table\> elements:  
\- Tables must not cause horizontal scroll  
\- On mobile: either make them horizontally scrollable within a wrapper div  
  (overflow-x: auto on wrapper) OR convert them to a card layout using   
  data-label attributes and CSS

\#\#\# 2I — Horizontal Overflow (Most Common Bug)  
Run an audit for anything that causes horizontal scroll:  
\- Look for any element using: width \> 100%, negative margins,   
  position: absolute with values that push outside viewport  
\- Add overflow-x: hidden to the body only as a last resort  
\- Fix the root cause, not the symptom

\#\#\# 2J — Spacing on Mobile  
All sections need breathing room. Check:  
\- Section padding must be at least 40px top/bottom on mobile  
\- No components touching the edge of the screen with zero padding  
\- Cards must have internal padding on mobile

\---

\#\# STEP 3 — FIX EVERYTHING

After the audit:  
\- Fix every FAIL item found above  
\- Do not change anything that already PASSed  
\- Do not change any logic, only layout and styling  
\- Do not change any colors or branding  
\- Match the existing code style (if Tailwind is used, use Tailwind classes —   
  do not introduce inline styles or new CSS files)

\---

\#\# STEP 4 — BREAKPOINTS STANDARD

Use this breakpoint system throughout all fixes:  
\- Mobile:  below 768px   (default / base styles)  
\- Tablet:  768px – 1023px  
\- Desktop: 1024px and above

If Tailwind: sm: \= 640px, md: \= 768px, lg: \= 1024px, xl: \= 1280px  
If CSS: @media (max-width: 767px) for mobile, etc.

\---

\#\# STEP 5 — FINAL REPORT

After all fixes are done, output this exact report:

\---  
\#\#\# ✅ Mobile Responsiveness Report

\*\*Framework detected:\*\* \[name\]    
\*\*CSS system:\*\* \[name\]  

\*\*Issues Found and Fixed:\*\*  
\- \[Component/File name\]: \[what was broken\] → \[what was fixed\]  
\- (list every single one)

\*\*Hamburger Menu:\*\*   
\- \[Already existed — not changed\] OR \[Did not exist — created in ComponentName\]

\*\*Files Modified:\*\* (list every file)

\*\*Files Created:\*\* (list every new file, if any)

\*\*What to check manually:\*\*  
\- Open Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M)  
\- Test at these widths: 375px (iPhone SE), 390px (iPhone 14),   
  768px (iPad), 1024px (iPad landscape), 1440px (desktop)  
\- Tap every button to confirm touch target size  
\- Test the hamburger menu open/close on mobile view  
\---

