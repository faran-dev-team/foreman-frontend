/**
 * Foreman — GCC landing copy (single source of truth).
 *
 * English copy follows "Foreman Landing Page Copy: GCC Positioning".
 * Arabic lines are kept verbatim from that document and MUST be reviewed by a
 * native Gulf Arabic speaker before the Arabic page is indexed (see /ar).
 *
 * Numbers shown in product mock-ups (dashboard tiles, timestamps, booking
 * values) are illustrative UI data, not performance claims.
 */

/* ------------------------------------------------------------------ */
/*  0. Meta + navigation                                               */
/* ------------------------------------------------------------------ */
export const META = {
  title: "Foreman | AI Front Office for Gulf Maintenance Companies | Arabic, English & Urdu",
  description:
    "Foreman answers every call in Arabic, English, or Urdu, books the job, dispatches your technician in their language, and confirms appointments via WhatsApp. Pay only when a job is booked. Go live in the UAE within 24 hours.",
} as const;

export const NAV_LINKS = [
  { href: "#how", label: "How It Works" },
  { href: "#languages", label: "Languages" },
  { href: "#pricing", label: "Pricing" },
  { href: "#fm", label: "For FM Companies" },
] as const;

export const TOP_BAR = {
  lead: "Now Live in Dubai.",
  middle: "Pilot Programs Open for AC, Plumbing, and Electrical Companies.",
  tail: "No Monthly Fee During the Pilot.",
} as const;

/* ------------------------------------------------------------------ */
/*  1. Hero                                                            */
/* ------------------------------------------------------------------ */
export const HERO = {
  kicker: "The AI Front Office for Gulf Maintenance Companies",
  headlineLead: "Never Miss a Job",
  headlineAccent: "Again.",
  arabicSub: "ما تفوّت ولا طلب.",
  sub: "Foreman answers every call in Arabic, English, or Urdu, qualifies the job, provides pricing, books the appointment directly into your calendar, and briefs your technician in their own language. It operates 24/7, even throughout the summer. You only pay when it successfully books a job.",
  primaryCta: "Book Your Free Pilot",
  secondaryCta: "Hear a Sample Call",
  secondaryCtaMeta: "30 Sec",
  trust: ["No Monthly Fee During the Pilot", "Pay Per Booked Job", "Live Within 24 Hours", "Hosted in the UAE"],
} as const;

/** Language chips. `script` drives font + direction. */
export const LANGUAGE_CHIPS = [
  { label: "العربية", script: "ar" },
  { label: "English", script: "en" },
  { label: "اردو", script: "ur", suffix: "हिंदी" },
] as const;

/* ------------------------------------------------------------------ */
/*  Gulf sample call (hero console + dashboard)                        */
/* ------------------------------------------------------------------ */
export const SAMPLE_CALL = {
  caller: {
    ar: "المكيف ما يبرّد، الحين ممكن حد يجي؟",
    gloss: "The AC isn't cooling. Can someone come now?",
  },
  agent: {
    ar: "أكيد. حجزت لك فني بكرة الساعة ١٠ الصباح. بيوصلك تأكيد على الواتساب.",
    gloss: "Of course. I've booked a technician for tomorrow at 10 AM. You'll get a WhatsApp confirmation.",
  },
  system: [
    { key: "dispatch", label: "Dispatched to Tech Imran", meta: "Briefed in Urdu" },
    { key: "booked", label: "Booked", meta: "AED 250" },
    { key: "whatsapp", label: "WhatsApp Confirmation Sent", meta: "Customer · Arabic" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  2. The problem                                                     */
/* ------------------------------------------------------------------ */
export const PROBLEM = {
  kicker: "The Problem",
  cards: [
    {
      id: "languages",
      title: "Your Customers Speak Five Languages.",
      body: "Gulf Arabic, English, Urdu, Hindi, and Tagalog. Your receptionist may only speak two, and only during one shift.",
    },
    {
      id: "technicians",
      title: "Your Technicians Speak Another Language.",
      body: "Important job details often require a second call to communicate, and that call may never happen. Foreman automatically briefs your technicians in Urdu or Hindi.",
    },
    {
      id: "summer",
      title: "Summer Calls Don't Follow Business Hours.",
      body: "AC, plumbing, and electrical emergencies often peak around 9 PM in July. That's precisely when your phone may go unanswered and the customer moves on to your competitor.",
    },
  ],
  /** Greeting bubbles for the "five languages" card. */
  greetings: [
    { text: "مرحبا", lang: "ar", name: "Gulf Arabic" },
    { text: "Hello", lang: "en", name: "English" },
    { text: "السلام علیکم", lang: "ur", name: "Urdu" },
    { text: "नमस्ते", lang: "hi", name: "Hindi" },
    { text: "Kumusta", lang: "tl", name: "Tagalog" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  3. Owner dashboard                                                 */
/* ------------------------------------------------------------------ */
export const DASHBOARD = {
  kicker: "Owner Dashboard",
  headline: "Your Entire Business Performance, Live and in One Place.",
  copy: "Every call, booking, and dirham captured by Foreman appears here in real time. Listen to calls as they happen, take over whenever you need to, and receive a weekly performance report that you can easily share with your business partner.",
  tiles: [
    { key: "calls", label: "Total Calls", value: 1284, format: "number", delta: "+18% vs last week" },
    { key: "answer", label: "Answer Rate", value: 100, format: "percent", delta: "0 missed after hours" },
    { key: "booked", label: "Booked Value (AED)", value: 86450, format: "aed", delta: "312 jobs booked" },
  ],
  languageSplit: [
    { key: "ar", label: "Arabic", value: 46 },
    { key: "en", label: "English", value: 31 },
    { key: "ur", label: "Urdu", value: 23 },
  ],
  bookings: [
    { area: "Al Barsha", issue: "AC not cooling", tech: "Imran", techLang: "Urdu", value: 250, time: "Tomorrow · 10:00" },
    { area: "JLT", issue: "Water leak under sink", tech: "Rajesh", techLang: "Hindi", value: 180, time: "Today · 21:40" },
    { area: "Mirdif", issue: "DB keeps tripping", tech: "Bilal", techLang: "Urdu", value: 320, time: "Today · 22:15" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  4. How it works                                                    */
/* ------------------------------------------------------------------ */
export const HOW = {
  kicker: "From Missed Call to Dispatched Technician in Under Two Minutes",
  headline: ["Answers.", "Triages.", "Books.", "Dispatches.", "Confirms.", "Reports."],
  steps: [
    {
      n: "01",
      t: "00:00",
      title: "Answers in the Customer's Language.",
      body: "Responds in Arabic, English, or Urdu/Hindi, and seamlessly switches languages if the caller does.",
    },
    {
      n: "02",
      t: "00:06",
      title: "Prioritises Emergencies.",
      body: "For gas leaks, fire, smoke, and flooding, Foreman provides immediate safety instructions and the relevant local emergency numbers before proceeding. It also alerts you immediately.",
    },
    {
      n: "03",
      t: "00:41",
      title: "Qualifies and Prices the Job.",
      body: "Collects the fault details, customer address, and urgency, then provides pricing based on your own price book.",
    },
    {
      n: "04",
      t: "01:12",
      title: "Books the Appointment.",
      body: "Checks live calendar availability and schedules the appointment without double bookings.",
    },
    {
      n: "05",
      t: "01:30",
      title: "Briefs Your Technician in Their Language.",
      body: "Sends the technician all relevant details, including the address, reported fault, and appointment time, through voice or WhatsApp in Urdu or Hindi. Technician acceptance is also confirmed.",
    },
    {
      n: "06",
      t: "01:52",
      title: "Confirms and Follows Up.",
      body: "Sends booking confirmations and reminders to customers via WhatsApp or SMS in their preferred language. After the job, it can also request a customer review.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  5. Languages                                                       */
/* ------------------------------------------------------------------ */
export const LANGUAGES = {
  kicker: "Built for How the Gulf Actually Communicates",
  headlineLead: "One Call. Three Languages.",
  headlineAccent: "Zero Confusion.",
  mixed: {
    romanUrdu: "AC kaam nahi kar raha",
    gulfArabic: "الـ AC ما يشتغل",
    result: "Service request · AC not working",
  },
  cards: [
    {
      id: "ar",
      glyph: "ع",
      title: "Gulf Arabic",
      body: "Designed for Emirati and Saudi customers, using natural Gulf expressions rather than textbook Arabic.",
    },
    {
      id: "en",
      glyph: "En",
      title: "English",
      body: "Seamless communication for English-speaking customers across the region.",
    },
    {
      id: "ur",
      glyph: "اُ",
      title: "Urdu and Hindi",
      body: "Supports customers who prefer these languages and helps technicians receive instructions in a language they understand.",
    },
    {
      id: "mixed",
      glyph: "⇄",
      title: "Mixed-Language Conversations",
      body: "Understands natural combinations such as “AC kaam nahi kar raha” and “⁧الـ AC ما يشتغل⁩” and processes both as the same service request.",
    },
    {
      id: "rtl",
      glyph: "¶",
      title: "Multilingual Messaging",
      body: "Supports right-to-left formatting for Arabic and Urdu emails, with WhatsApp and SMS messages delivered in the caller's preferred script.",
    },
  ],
  smallPrint: "Each business can select its preferred languages and configure its default greeting.",
} as const;

/* ------------------------------------------------------------------ */
/*  6. Features                                                        */
/* ------------------------------------------------------------------ */
export const FEATURES = {
  kicker: "Features",
  headlineLead: "A Full Front Office.",
  headlineAccent: "Not a Voicemail Box.",
  items: [
    {
      id: "ppb",
      title: "Pay Per Booked Job.",
      body: "No seat licences and no per-minute charges. If Foreman doesn't book a job, you don't pay.",
    },
    {
      id: "dispatch",
      title: "Intelligent Technician Dispatch.",
      body: "Sends job briefs through voice or WhatsApp in the technician's preferred language, tracks acceptance, and automatically reassigns jobs if there is no response.",
    },
    {
      id: "amc",
      title: "AMC-Aware Operations.",
      body: "Recognises customers with Annual Maintenance Contracts (AMCs), applies the relevant contract terms, and accounts for included service call-outs.",
    },
    {
      id: "emergency",
      title: "Emergency Handling.",
      body: "Supports country-specific emergency numbers for the UAE and KSA, with immediate alerts to the business owner.",
    },
    {
      id: "whatsapp",
      title: "WhatsApp-First Communication.",
      body: "Handles booking confirmations, appointment reminders, and review requests through WhatsApp Business, with SMS available as a fallback.",
    },
    {
      id: "live",
      title: "Live Call Monitoring and Takeover.",
      body: "Listen to calls in real time and step in whenever necessary with a single tap.",
    },
    {
      id: "reports",
      title: "Owner Dashboard and Weekly PDF Reports.",
      body: "Monitor calls, bookings, revenue, languages, and recovered missed-call opportunities through a centralised dashboard and weekly reports.",
    },
    {
      id: "number",
      title: "Your Number. Your Calendar.",
      body: "Keep your existing mobile or landline number and forward calls to Foreman after hours or throughout the day. Supports Google Calendar and CSV synchronisation.",
    },
    {
      id: "hosting",
      title: "Hosted in the UAE.",
      body: "Call recordings and transcripts remain within the UAE. Saudi hosting is also available for businesses operating in KSA.",
    },
    {
      id: "hire",
      title: "Not a Regulated Hire.",
      body: "Foreman is a software solution, so it does not count as a reception-role hire under nationalisation quotas.",
      fine: "Please confirm applicability with your PRO.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  7. Pricing                                                         */
/* ------------------------------------------------------------------ */
export type PricingPlan = {
  id: string;
  name: string;
  region: string;
  currency: "AED" | "SAR";
  monthly: string;
  monthlyNote: string;
  perJob: string;
  perJobLabel: string;
  cap: string;
  languages: string;
  setup: string;
  featured?: boolean;
};

export const PRICING = {
  kicker: "Pay As You Go",
  headlineLead: "You Pay When a Job Is Booked.",
  headlineAccent: "Not Before.",
  rowLabels: {
    monthly: "Monthly Fee",
    perJob: "Each Additional Booked Job",
    cap: "Monthly Cap",
    languages: "Languages",
    setup: "Setup",
  },
  plans: [
    {
      id: "pilot",
      name: "Pilot",
      region: "Start here",
      currency: "AED",
      monthly: "0",
      monthlyNote: "No monthly fee",
      perJob: "129",
      perJobLabel: "per booked job",
      cap: "None",
      languages: "Arabic, English, Urdu/Hindi",
      setup: "Free, live within 24 hours",
      featured: true,
    },
    {
      id: "uae",
      name: "Launch",
      region: "UAE",
      currency: "AED",
      monthly: "299",
      monthlyNote: "Includes 5 booked jobs",
      perJob: "79",
      perJobLabel: "each additional booked job",
      cap: "AED 999",
      languages: "Arabic, English, Urdu/Hindi",
      setup: "Free",
    },
    {
      id: "ksa",
      name: "Launch",
      region: "KSA",
      currency: "SAR",
      monthly: "399",
      monthlyNote: "Includes 5 booked jobs",
      perJob: "99",
      perJobLabel: "each additional booked job",
      cap: "SAR 1,299",
      languages: "Arabic, English, Urdu/Hindi",
      setup: "Free",
    },
  ] as PricingPlan[],
  notes:
    "A booked job means a confirmed appointment added to your calendar. Cancellations made within 24 hours are not charged. VAT applies. Custom pricing is available for facility management companies and multi-branch operations.",
  comparison: {
    // NOTE: the source copy said "less than a quarter". AED 999 is ~29% of
    // AED 3,400, so "under a third" is the accurate claim.
    line: "A receptionist in Dubai costs AED 3,400+ per month, excluding visa expenses, covers only one shift, and typically speaks two languages. Foreman operates 24/7, supports three languages, and briefs your technicians, all for under a third of that cost at the monthly cap.",
    receptionist: { label: "Receptionist in Dubai", amount: 3400, display: "AED 3,400+", meta: ["1 shift", "2 languages", "Excl. visa"] },
    foreman: { label: "Foreman at the monthly cap", amount: 999, display: "AED 999", meta: ["24/7", "3 languages", "Briefs technicians"] },
  },
  cta: "Start Your Free Pilot",
} as const;

/* ------------------------------------------------------------------ */
/*  8. Facility management                                             */
/* ------------------------------------------------------------------ */
export const FM = {
  kicker: "For Facility Management and Community Management",
  headline: "After-Hours and Overflow Call Management in Every Resident's Language.",
  copy: [
    "Foreman handles overflow and after-hours calls, creates tickets directly in your system, dispatches the on-call team in their preferred language, and confirms appointments with residents through WhatsApp.",
    "Your contact centre can continue managing daytime operations while Foreman ensures that no call goes unanswered, even at 2 AM in August.",
  ],
  capabilities: [
    {
      title: "Integrations",
      body: "Integrates through API or webhook with your existing CAFM, ticketing, or CRM systems. Email and CSV integrations are available where APIs are not supported.",
    },
    {
      title: "Dedicated instance",
      body: "Dedicated instance, UAE-region hosting, and a complete audit log of every call and action.",
    },
    {
      title: "Per-ticket pricing",
      body: "Flexible per-ticket pricing with no seat-based charges.",
    },
  ],
  log: [
    { t: "02:07:12", label: "Resident call answered", meta: "Tower B · Unit 1804 · Arabic" },
    { t: "02:07:58", label: "Ticket FM-20931 created", meta: "CAFM · via webhook" },
    { t: "02:08:20", label: "On-call team dispatched", meta: "Briefed in Hindi · Accepted" },
    { t: "02:08:31", label: "Resident confirmed", meta: "WhatsApp · Arabic" },
  ],
  cta: "Talk to Us About a 14-Day Pilot",
} as const;

/* ------------------------------------------------------------------ */
/*  9. Trust                                                           */
/* ------------------------------------------------------------------ */
export const TRUST = {
  kicker: "Trust and Compliance",
  headline: "Built for the Gulf's Regulatory Requirements.",
  items: [
    { id: "disclosure", body: "AI disclosure and call-recording notification at the beginning of every call." },
    // U+2011 non-breaking hyphens keep the region name on one line.
    { id: "residency", body: "Data hosted in the UAE (AWS me‑central‑1 / Core42), with a Saudi hosting region available." },
    { id: "audit", body: "All transcripts, bookings, and system actions are logged and reversible." },
    { id: "outbound", body: "No outbound marketing calls. Foreman only contacts your technicians and confirms customer bookings." },
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  10. FAQ                                                            */
/* ------------------------------------------------------------------ */
export const FAQ = {
  kicker: "Straight Answers",
  headline: "Frequently Asked Questions",
  items: [
    {
      q: "Do I need a new phone number?",
      a: "No. You can keep your existing phone number and simply forward calls to Foreman after hours or throughout the day. We can also provide a local UAE number.",
    },
    {
      q: "What if my customer speaks Arabic but my technician speaks Urdu?",
      a: "That's exactly what Foreman is designed for. Your customer communicates in Arabic, while your technician automatically receives the job briefing in Urdu.",
    },
    {
      q: "What happens when there's an emergency?",
      a: "Foreman provides the relevant safety instructions and local emergency numbers first, then immediately alerts you through a phone call and WhatsApp.",
    },
    {
      q: "Can I listen to calls?",
      a: "Yes. You can monitor calls live, and every recording and transcript is accessible through your dashboard.",
    },
    {
      q: "Does Foreman support my AMC customers?",
      a: "Yes. Upload your existing contracts, and Foreman will apply the relevant included service call-outs and contract-specific pricing.",
    },
    {
      q: "Where is my data stored?",
      a: "Your data is hosted in the UAE. Saudi hosting is also available for businesses operating in Saudi Arabia.",
    },
    {
      q: "How quickly can I get started?",
      a: "Foreman can typically be live within 24 hours of your pilot call.",
    },
    {
      q: "What exactly qualifies as a booked job for billing purposes?",
      a: "A booked job is a confirmed appointment added to your calendar. Appointments cancelled within 24 hours are not charged.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  11. Final CTA                                                      */
/* ------------------------------------------------------------------ */
export const FINAL_CTA = {
  headlineLead: "Find Out How Many Calls You Missed",
  headlineAccent: "Last Week.",
  copy: "Book a 20-minute pilot call. We'll configure Foreman on your after-hours line at no cost and show you every job it books during your first 14 days.",
  primary: "Book Your Free Pilot",
  secondary: "Or Message Us on WhatsApp",
  missed: [
    { t: "21:14", label: "Missed call", meta: "+971 50 ••• 4412" },
    { t: "21:37", label: "Missed call", meta: "+971 55 ••• 0190" },
    { t: "22:03", label: "Missed call", meta: "+971 52 ••• 7765" },
    { t: "23:48", label: "Missed call", meta: "+971 56 ••• 3021" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  12. Footer                                                         */
/* ------------------------------------------------------------------ */
export const FOOTER = {
  tagline:
    "The AI front office for Gulf maintenance companies. We answer calls in your customers' languages, book their jobs, and brief your technicians in theirs.",
  trades: [
    "AC & HVAC",
    "Plumbing",
    "Electrical",
    "Pest Control",
    "Cleaning & Deep Cleaning",
    "Handyman & Maintenance",
    "Property & Community Management",
    "Facility Management",
    "Car Workshops",
    "Real Estate Brokerages",
  ],
  bottom: "Built for service businesses across the GCC.",
  legalEntity: "Foreman LLC.",
} as const;

/* ------------------------------------------------------------------ */
/*  14. Arabic landing — hero only (pending native review)             */
/* ------------------------------------------------------------------ */
export const AR_HERO = {
  headline: "ما تفوّت ولا طلب.",
  body: "فورمان يرد على كل مكالمة بالعربي أو الإنجليزي أو الأردو، يحدد المشكلة والسعر، يحجز الموعد، ويبلّغ الفني بلغته. يشتغل ٢٤ ساعة، طول الصيف. وما تدفع إلا لما يحجز لك شغل.",
  cta: "ابدأ التجربة المجانية",
  trust: [
    "بدون اشتراك شهري في التجربة",
    "الدفع عن كل طلب محجوز",
    "جاهز خلال ٢٤ ساعة",
    "البيانات محفوظة في الإمارات",
  ],
} as const;
