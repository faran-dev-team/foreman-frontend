export type TradeId = 'hvac' | 'plumbing' | 'electrical' | 'restoration' | 'property-management' | 'roofing' | 'pest' | 'garage' | 'law-firm';

export const INDUSTRY_CONTENT: Record<TradeId, any> = {
  hvac: {
    heroBadge: "FOR HVAC CONTRACTORS",
    heroHeadline: "Never lose an install to a missed call.",
    heroSub: "In a heat wave, a missed call means losing a $10,000 install. Foreman answers instantly, qualifies the job, and books it while your hands are full.",
    mathHeadline: "One saved install pays for months.",
    mathBody: "The average HVAC job runs from a few hundred to several thousand dollars. Foreman costs a fraction of that when it books you one. Miss a handful of calls a week and you could be losing thousands every month. Foreman turns those calls into booked jobs, and shows you every dollar it saved.",
    statBar: ['Up to 30% of calls missed in peak season', '$300 to $15,000+ per job', '24/7 bilingual coverage', 'You only pay when it books you work'],

    demoMessages: [
      { sender: "customer", text: "Hi, my AC stopped blowing cold air." },
      { sender: "ai", text: "I can help with that. Is the system blowing warm air, or is there no air coming out at all?" },
      { sender: "customer", text: "It's blowing warm air." },
      { sender: "ai", text: "Got it. Our diagnostic fee is $89. I can send a technician tomorrow between 2 PM and 4 PM. Does that work?" },
      { sender: "customer", text: "Yes, tomorrow afternoon is great." },
      { sender: "ai", text: "Perfect! You're booked for tomorrow. I just sent a confirmation text to this number. See you then!" }
    ],
    features: [
      { title: "24/7 AI Answering", desc: "Instantly handles calls during heat waves or after-hours." },
      { title: "Emergency Triage", desc: "Detects 'no cooling' and routes emergency calls instantly." },
      { title: "Calendar Booking", desc: "Books the right tech based on skill and availability." },
      { title: "Bilingual Support", desc: "Answers and books jobs in flawless English and Spanish." },
      { title: "Missed Call Recovery", desc: "Instantly texts back if a customer hangs up before answering." },
      { title: "Smart Pricing", desc: "Provides safe price ranges without over-committing." }
    ]
  },
  plumbing: {
    heroBadge: "FOR PLUMBING CONTRACTORS",
    heroHeadline: "First to answer wins the 2 AM burst pipe.",
    heroSub: "Plumbing emergencies don't wait for business hours. Foreman answers instantly, triages the leak, and books the dispatch.",
    mathHeadline: "One saved emergency pays for months.",
    mathBody: "Plumbing jobs range from routine repairs to major installs worth thousands. Foreman costs a fraction of a single job when it books you one. Miss a few after-hours calls a week and you're handing real money to competitors. Foreman captures those jobs, and shows you every dollar it saved.",
    statBar: ['Most calls come as emergencies', '$150 to $10,000+ per job', '24/7 bilingual coverage', 'You only pay when it books you work'],

    demoMessages: [
      { sender: "customer", text: "Hi, a pipe just burst in my basement!" },
      { sender: "ai", text: "I can help. First, please locate your main water shut-off valve and turn it clockwise to stop the flooding. Can you do that safely?" },
      { sender: "customer", text: "Yes, I just turned it off. But there's water everywhere." },
      { sender: "ai", text: "Good. Since this is an emergency, I can dispatch our on-call plumber immediately. The emergency dispatch fee is $150. Shall I send them now?" },
      { sender: "customer", text: "Yes, please send them right away." },
      { sender: "ai", text: "They are on the way. You'll receive a text with their ETA shortly. Hang tight!" }
    ],
    features: [
      { title: "24/7 AI Answering", desc: "Ready for any 2 AM emergency call." },
      { title: "Flood Triage", desc: "Guides homeowners to shut off water while dispatching." },
      { title: "Calendar Booking", desc: "Schedules non-emergency quotes automatically." },
      { title: "Bilingual Support", desc: "Answers and books jobs in flawless English and Spanish." },
      { title: "Missed Call Recovery", desc: "Recovers dropped calls with instant SMS." },
      { title: "Lead Routing", desc: "Sends high-value jobs straight to the top tech." }
    ]
  },
  electrical: {
    heroBadge: "FOR ELECTRICAL CONTRACTORS",
    heroHeadline: "The AI front office for electricians.",
    heroSub: "Foreman answers every call, qualifies panel upgrades from basic outages, and books the job directly on your calendar.",
    mathHeadline: "One saved upgrade pays for months.",
    mathBody: "Electrical jobs range from quick troubleshooting to complete rewires worth thousands. Foreman costs a fraction of a single job when it books you one. Miss a few outage calls a week and you're handing real money to competitors. Foreman captures those jobs, and shows you every dollar it saved.",
    statBar: ['Outages cause call spikes', '$250 to $10,000+ per job', '24/7 bilingual coverage', 'You only pay when it books you work'],

    demoMessages: [
      { sender: "customer", text: "Hi, half the power in my house just went out." },
      { sender: "ai", text: "I can assist with that. Are you seeing any sparks or smelling anything burning near your electrical panel?" },
      { sender: "customer", text: "No sparks or burning smell, just no power." },
      { sender: "ai", text: "Understood. We can send an electrician to troubleshoot the panel. The diagnostic fee is $95. I have an opening tomorrow at 10 AM. Does that work?" },
      { sender: "customer", text: "Yes, 10 AM is perfect." },
      { sender: "ai", text: "Great. You're booked for tomorrow morning. A confirmation text has been sent to your number. Talk to you soon!" }
    ],
    features: [
      { title: "24/7 AI Answering", desc: "Captures every storm-related outage call." },
      { title: "Hazard Detection", desc: "Flags sparking panels or exposed wires immediately." },
      { title: "Calendar Booking", desc: "Fills empty schedule slots automatically." },
      { title: "Bilingual Support", desc: "Expands your customer base instantly." },
      { title: "Missed Call Recovery", desc: "Ensures no lead goes to the competition." },
      { title: "Job Qualification", desc: "Separates $50 fixes from $5000 rewires." }
    ]
  },
  restoration: {
    heroBadge: "FOR RESTORATION CONTRACTORS",
    heroHeadline: "A missed call is a five-figure loss.",
    heroSub: "Water and fire jobs go to whoever picks up first. Foreman answers 24/7, captures insurance details, and books the dispatch.",
    mathHeadline: "One captured job pays for the year.",
    mathBody: "Restoration jobs range from thousands to tens of thousands of dollars. Foreman costs a small fraction of a single one when it books you the assessment. A single missed emergency call can be a five-figure job handed to a competitor. Foreman makes sure you're the one who answers.",
    statBar: ['Speed decides the job', '$3,000 to $30,000+ per job', '24/7/365 coverage', 'You only pay when it books you work'],

    demoMessages: [
      { sender: "customer", text: "Hi, my kitchen flooded and there's water damage everywhere." },
      { sender: "ai", text: "I'm so sorry to hear that. Have you already stopped the source of the water?" },
      { sender: "customer", text: "Yes, a plumber fixed the pipe, but the drywall and floors are soaked." },
      { sender: "ai", text: "Understood. Our mitigation team can be there in 45 minutes to start extracting the water and prevent mold. Shall I dispatch them now?" },
      { sender: "customer", text: "Yes, please hurry." },
      { sender: "ai", text: "They are dispatched. I'm sending a text now to collect your insurance information so we can bill them directly. See you shortly." }
    ],
    features: [
      { title: "24/7 AI Answering", desc: "Never sleep on a massive mitigation lead." },
      { title: "Insurance Intake", desc: "Captures policy numbers and adjuster info instantly." },
      { title: "Emergency Dispatch", desc: "Alerts the on-call team immediately for water/fire." },
      { title: "Bilingual Support", desc: "Assists distressed homeowners in English and Spanish." },
      { title: "Missed Call Recovery", desc: "Crucial for capturing panicked callers." },
      { title: "CRM Syncing", desc: "Pushes all claim details directly to your dashboard." }
    ]
  },
  'property-management': {
    heroBadge: "FOR PROPERTY MANAGEMENT",
    heroHeadline: "Every tenant call, answered and handled.",
    heroSub: "Hundreds of units mean endless maintenance calls. Foreman answers them all, triages emergencies, and books the work order.",
    mathHeadline: "A full call center, without the headcount.",
    mathBody: "Staffing round-the-clock tenant coverage across a portfolio costs a fortune and still misses calls. Foreman covers every unit around the clock, triages intelligently, and logs everything, for a fraction of the cost of a call center, fully branded as you.",
    statBar: ['Hundreds of calls a month', 'Every unit covered', '24/7 bilingual coverage', 'Custom to your portfolio'],

    demoMessages: [
      { sender: "customer", text: "Hi, I'm locked out of my apartment." },
      { sender: "ai", text: "I can help with that. Are you at the Broadstone complex or the River Walk apartments?" },
      { sender: "customer", text: "I'm at Broadstone, unit 304." },
      { sender: "ai", text: "Got it. For after-hours lockouts, there is a $50 fee that will be added to your ledger. Shall I dispatch maintenance to let you in?" },
      { sender: "customer", text: "Yes, please." },
      { sender: "ai", text: "Maintenance has been dispatched to unit 304. They will arrive in approximately 20 minutes. Please have your ID ready." }
    ],
    features: [
      { title: "24/7 AI Answering", desc: "White-labeled with your building's name." },
      { title: "Smart Triage", desc: "Follows your exact escalation rules for emergencies." },
      { title: "Work Order Creation", desc: "Logs issues directly into your maintenance software." },
      { title: "Bilingual Support", desc: "Communicates clearly with all tenants." },
      { title: "After-Hours Rules", desc: "Deflects non-emergencies until the morning." },
      { title: "Portfolio Dashboard", desc: "See all building issues in one clean view." }
    ]
  },
  roofing: {
    heroBadge: "FOR ROOFING CONTRACTORS",
    heroHeadline: "Turn every storm surge into booked inspections.",
    heroSub: "After a storm, your phone rings off the hook. Foreman captures every lead, qualifies insurance, and books the inspection.",
    mathHeadline: "One captured inspection pays for the season.",
    mathBody: "Roofing replacements run into the tens of thousands of dollars. Foreman costs a tiny fraction of a single roof when it books you the inspection. Miss a handful of storm calls and you're losing massive revenue. Foreman turns those panic calls into booked inspections, and shows you every dollar it saved.",
    statBar: ['Storm surges overwhelm dispatch', '$500 to $50,000+ per job', '24/7 bilingual coverage', 'You only pay when it books you work'],

    demoMessages: [
      { sender: "customer", text: "Hi, my roof started leaking after the storm yesterday." },
      { sender: "ai", text: "I'm sorry to hear that. I can definitely help. Do you have a bucket under the leak, or is it an active emergency?" },
      { sender: "customer", text: "It's dripping into a bucket, but I need someone to look at it." },
      { sender: "ai", text: "Got it. Our inspection fee is $99. I can have a technician out there tomorrow between 9 AM and 11 AM. Does that work?" },
      { sender: "customer", text: "Yes, tomorrow morning works perfectly." },
      { sender: "ai", text: "Great! You're all booked for tomorrow. I just sent a confirmation text to this number. See you then!" }
    ],
    features: [
      { title: "Surge Handling", desc: "Answers 100 calls simultaneously after a storm." },
      { title: "Insurance Qualification", desc: "Determines if it's out-of-pocket or an insurance claim." },
      { title: "Inspection Booking", desc: "Optimizes routes and schedules inspections." },
      { title: "Bilingual Support", desc: "Captures leads across diverse neighborhoods." },
      { title: "Missed Call Recovery", desc: "Texts callers back the second they hang up." },
      { title: "Lead Routing", desc: "Assigns the best closers to full replacement leads." }
    ]
  },
  pest: {
    heroBadge: "FOR PEST CONTROL",
    heroHeadline: "Pests don't wait, and neither do callers.",
    heroSub: "When a homeowner sees a termite, they want help immediately. Foreman answers instantly and schedules the treatment.",
    mathHeadline: "One captured treatment pays for months.",
    mathBody: "Pest control jobs range from one-off treatments to lucrative recurring contracts. Foreman costs a fraction of a single contract when it books you one. Miss a few panicked calls a week and you're handing easy money to competitors. Foreman captures those leads instantly, and shows you every dollar it saved.",
    statBar: ['Fast response wins the job', 'One-off and recurring contracts', '24/7 bilingual coverage', 'You only pay when it books you work'],

    demoMessages: [
      { sender: "customer", text: "Hi, I just found a bunch of ants in my kitchen." },
      { sender: "ai", text: "I can help. Are they mostly around the sink and counters, or are they coming from the baseboards?" },
      { sender: "customer", text: "They are all over the counters and pantry." },
      { sender: "ai", text: "Understood. Our interior ant treatment starts at $125 and includes a 30-day guarantee. I can schedule a technician for Wednesday afternoon. Does that work?" },
      { sender: "customer", text: "Yes, Wednesday works for me." },
      { sender: "ai", text: "Perfect. You're booked for Wednesday. I just sent a confirmation text. Have a great day!" }
    ],
    features: [
      { title: "24/7 AI Answering", desc: "Captures the late-night bed bug panic calls." },
      { title: "Treatment Quoting", desc: "Prices standard sprays and termite inspections." },
      { title: "Calendar Booking", desc: "Books initial assessments and recurring visits." },
      { title: "Bilingual Support", desc: "Serves your entire community effectively." },
      { title: "Missed Call Recovery", desc: "Locks in leads who abandon the call." },
      { title: "CRM Sync", desc: "Pushes new leads directly into PestPac or GorillaDesk." }
    ]
  },
  garage: {
    heroBadge: "FOR GARAGE DOOR SERVICES",
    heroHeadline: "A trapped car is an emergency. Answer it.",
    heroSub: "When a spring breaks, the customer needs it fixed now. Foreman catches every panic call and dispatches your tech.",
    mathHeadline: "One emergency repair pays for months.",
    mathBody: "Garage door repairs, especially spring replacements, are high-margin emergencies. Foreman costs a fraction of a single repair when it books you one. Miss a caller with a trapped car and they immediately dial the next company. Foreman captures those emergency jobs instantly.",
    statBar: ['Trapped cars equal high urgency', '$250 to $3,000+ per job', '24/7 bilingual coverage', 'You only pay when it books you work'],

    demoMessages: [
      { sender: "customer", text: "Hi, my garage door won't open and I can't get my car out." },
      { sender: "ai", text: "I can help. Did you hear a loud pop recently, or does the motor just run without the door moving?" },
      { sender: "customer", text: "Yes, there was a loud bang earlier today." },
      { sender: "ai", text: "That sounds like a broken spring. Since your car is trapped, I can dispatch a technician for an emergency spring replacement. The dispatch fee is $89. Shall I send them?" },
      { sender: "customer", text: "Yes, please send them as soon as possible." },
      { sender: "ai", text: "They are on their way and will be there within the hour. You'll receive an ETA text shortly." }
    ],
    features: [
      { title: "24/7 AI Answering", desc: "Always awake for the 6 AM broken spring call." },
      { title: "Emergency Triage", desc: "Prioritizes trapped cars and broken cables." },
      { title: "Calendar Booking", desc: "Schedules new door estimates automatically." },
      { title: "Bilingual Support", desc: "Answers and books jobs in flawless English and Spanish." },
      { title: "Missed Call Recovery", desc: "Texts back instantly to save the lead." },
      { title: "Smart Pricing", desc: "Gives estimates for standard spring replacements." }
    ]
  },
  'law-firm': {
    heroBadge: "FOR LAW FIRMS",
    heroHeadline: "Never lose a high-value case to a missed call.",
    heroSub: "A missed intake call often means the client dials the next firm on Google. Foreman answers instantly, qualifies the lead, and books the consultation.",
    mathHeadline: "One captured intake can be worth a five-figure case.",
    mathBody: "Firms spend hundreds of dollars per lead on advertising, then lose a share of intake calls to a busy front desk or after-hours gaps. A single missed intake can mean a significant lost case. Foreman answers 24/7, qualifies the matter against your criteria, and books the consultation instantly.",
    statBar: ['Around a third of intake calls missed', 'High-value cases at stake', '24/7 bilingual intake', 'You only pay for qualified intakes'],

    demoMessages: [
      { sender: "customer", text: "Hi, I was involved in a car accident yesterday and need to speak with a lawyer." },
      { sender: "ai", text: "I can help you with that. Were there any injuries involved, and do you have a police report?" },
      { sender: "customer", text: "Yes, I went to the hospital, and a police report was filed." },
      { sender: "ai", text: "Got it. Based on that, we should schedule a free consultation with one of our attorneys. I have an opening tomorrow at 10 AM. Does that work?" },
      { sender: "customer", text: "Yes, 10 AM works." },
      { sender: "ai", text: "Perfect. You're booked for tomorrow at 10 AM. I've sent a confirmation text with details." }
    ],
    features: [
      { title: "24/7 Intake Answering", desc: "Captures every after-hours lead." },
      { title: "Case Qualification", desc: "Screens callers against your firm's criteria." },
      { title: "Consultation Booking", desc: "Schedules qualified leads directly onto your calendar." },
      { title: "Bilingual Intake", desc: "Serves your community in flawless English and Spanish." },
      { title: "Missed Call Recovery", desc: "Recovers leads who hang up before answering." },
      { title: "CRM Sync", desc: "Pushes intake details to your case management system." }
    ]
  }
};
