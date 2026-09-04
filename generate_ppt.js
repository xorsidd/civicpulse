const pptxgen = require('./frontend/node_modules/pptxgenjs');
const fs = require('fs');
const path = require('path');

async function createPresentation() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.title = 'CivicPulse - Build With Bharat 2.0 - Cosmic Developers';
  pres.author = 'Cosmic Developers';
  pres.subject = 'Build With Bharat 2.0 Hackathon Presentation';

  // Palette definition
  const PRIMARY = '0F172A'; // Dark Navy Slate
  const SECONDARY = '1E293B'; // Slate Card
  const ACCENT_ORANGE = 'EA580C'; // Saffron Orange
  const ACCENT_GREEN = '10B981'; // Bharat Green
  const ACCENT_BLUE = '2563EB'; // Vibrant Blue
  const TEXT_MAIN = 'F8FAFC'; // Off white
  const TEXT_MUTED = '94A3B8'; // Light gray

  // Helper for Header on Content Slides
  function addHeader(slide, title, category = 'BUILD WITH BHARAT 2.0') {
    slide.addShape(pres.ShapeType.rect, {
      x: 0.6, y: 0.4, w: 0.15, h: 0.55,
      fill: { color: ACCENT_ORANGE },
      line: { color: ACCENT_ORANGE }
    });

    slide.addText(category.toUpperCase(), {
      x: 0.85, y: 0.38, w: 10, h: 0.25,
      fontSize: 10, fontFace: 'Arial', color: ACCENT_GREEN, bold: true, charSpacing: 2
    });

    slide.addText(title, {
      x: 0.85, y: 0.58, w: 11, h: 0.45,
      fontSize: 22, fontFace: 'Arial', color: TEXT_MAIN, bold: true
    });

    slide.addShape(pres.ShapeType.line, {
      x: 0.6, y: 1.1, w: 12.13, h: 0,
      line: { color: '334155', width: 1.5 }
    });

    slide.addText('BUILD WITH BHARAT 2.0  |  TEAM COSMIC DEVELOPERS', {
      x: 0.6, y: 7.1, w: 7, h: 0.3,
      fontSize: 9, fontFace: 'Arial', color: TEXT_MUTED, bold: true
    });
    slide.addText('CIVICPULSE PLATFORM', {
      x: 9.7, y: 7.1, w: 3.0, h: 0.3,
      fontSize: 9, fontFace: 'Arial', color: ACCENT_ORANGE, bold: true, align: 'right'
    });
  }

  // ==========================================
  // SLIDE 1: COVER PAGE
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: PRIMARY };

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6, y: 0.6, w: 12.13, h: 6.3,
      rectRadius: 0.2,
      fill: { color: '131E35' },
      line: { color: '1E293B', width: 2 }
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 4.3, y: 0.9, w: 4.7, h: 0.45,
      rectRadius: 0.1,
      fill: { color: '1E293B' },
      line: { color: ACCENT_ORANGE, width: 1 }
    });
    slide.addText('NATIONAL LEVEL HACKATHON', {
      x: 4.3, y: 0.95, w: 4.7, h: 0.35,
      fontSize: 11, fontFace: 'Arial', color: ACCENT_ORANGE, bold: true, align: 'center', charSpacing: 3
    });

    slide.addText('BUILD WITH BHARAT 2.0', {
      x: 1.0, y: 1.45, w: 11.3, h: 0.8,
      fontSize: 34, fontFace: 'Arial', color: TEXT_MAIN, bold: true, align: 'center'
    });

    slide.addText('CivicPulse', {
      x: 1.0, y: 2.25, w: 11.3, h: 0.7,
      fontSize: 30, fontFace: 'Arial', color: ACCENT_GREEN, bold: true, align: 'center'
    });
    slide.addText('Next-Gen AI-Powered Civic Issue Intelligence & Automated Resolution Platform', {
      x: 1.5, y: 2.9, w: 10.3, h: 0.4,
      fontSize: 14, fontFace: 'Arial', color: TEXT_MUTED, italic: true, align: 'center'
    });

    // Left Box: Problem Statement
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.2, y: 3.5, w: 5.2, h: 2.9,
      rectRadius: 0.15,
      fill: { color: SECONDARY },
      line: { color: '334155', width: 1 }
    });
    slide.addText('PROBLEM STATEMENT', {
      x: 1.4, y: 3.7, w: 4.8, h: 0.3,
      fontSize: 12, fontFace: 'Arial', color: ACCENT_ORANGE, bold: true
    });
    slide.addText('Smart Municipal Governance & Infrastructure Management:\nTransforming fragmented, duplicated citizen complaints into structured, AI-validated, clustered & auto-prioritized municipal intelligence with closed-loop verification.', {
      x: 1.4, y: 4.05, w: 4.8, h: 2.2,
      fontSize: 12, fontFace: 'Arial', color: TEXT_MAIN, lineSpacing: 18
    });

    // Right Box: Team & College Info
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8, y: 3.5, w: 5.3, h: 2.9,
      rectRadius: 0.15,
      fill: { color: SECONDARY },
      line: { color: '334155', width: 1 }
    });
    slide.addText('TEAM INFORMATION', {
      x: 7.0, y: 3.7, w: 4.9, h: 0.3,
      fontSize: 12, fontFace: 'Arial', color: ACCENT_GREEN, bold: true
    });

    slide.addText([
      { text: 'Team Name: ', options: { bold: true, color: TEXT_MUTED, fontSize: 13 } },
      { text: 'Cosmic Developers\n\n', options: { bold: true, color: TEXT_MAIN, fontSize: 14 } },
      { text: 'Team Members (2): \n', options: { bold: true, color: TEXT_MUTED, fontSize: 13 } },
      { text: '• Siddharth (Lead Full-Stack & System Architect)\n• Co-Developer (AI & Backend Engineer)\n\n', options: { color: TEXT_MAIN, fontSize: 12 } },
      { text: 'College / Institute: ', options: { bold: true, color: TEXT_MUTED, fontSize: 13 } },
      { text: 'Engineering & Technology Institute', options: { bold: true, color: TEXT_MAIN, fontSize: 13 } }
    ], {
      x: 7.0, y: 4.05, w: 4.9, h: 2.2
    });
  }

  // ==========================================
  // SLIDE 2: PROBLEM STATEMENT
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: PRIMARY };
    addHeader(slide, 'Problem Statement: Civic Grievance Bottlenecks');

    const cards = [
      {
        title: '1. Duplicate Complaint Overload',
        desc: 'Over 70% of municipal reports are redundant duplicates for the same issue (e.g. pothole on main road), choking department queues and exhausting manual review teams.',
        accent: ACCENT_ORANGE
      },
      {
        title: '2. Zero Automated Prioritization',
        desc: 'Traditional portals treat minor cosmetic issues identically to high-risk hazards (e.g. exposed live wires or deep open drains near schools/hospitals), causing fatal response delays.',
        accent: ACCENT_BLUE
      },
      {
        title: '3. Slow & Manual Department Routing',
        desc: 'Complaints sit in general inboxes for days before being manually reviewed, categorized, and redirected to Roads, Water, Electricity, or Sanitation departments.',
        accent: ACCENT_GREEN
      },
      {
        title: '4. "Ghost Fixes" & No Citizen Audit Loop',
        desc: 'Contractors mark tickets "Resolved" without verifiable photo evidence or citizen sign-off, leading to citizen frustration, zero accountability, and public distrust.',
        accent: 'E11D48'
      }
    ];

    cards.forEach((c, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.6 + col * 6.2;
      const y = 1.35 + row * 2.65;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: y, w: 5.9, h: 2.45,
        rectRadius: 0.12,
        fill: { color: SECONDARY },
        line: { color: '334155', width: 1 }
      });

      slide.addShape(pres.ShapeType.rect, {
        x: x, y: y, w: 0.15, h: 2.45,
        fill: { color: c.accent },
        line: { color: c.accent }
      });

      slide.addText(c.title, {
        x: x + 0.35, y: y + 0.2, w: 5.3, h: 0.35,
        fontSize: 14, fontFace: 'Arial', color: TEXT_MAIN, bold: true
      });

      slide.addText(c.desc, {
        x: x + 0.35, y: y + 0.6, w: 5.3, h: 1.65,
        fontSize: 12, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 18
      });
    });
  }

  // ==========================================
  // SLIDE 3: PROPOSED SOLUTION
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: PRIMARY };
    addHeader(slide, 'Proposed Solution: CivicPulse AI Intelligence Platform');

    const pillars = [
      {
        title: 'AI Vision & Validation',
        badge: 'STAGE 1 & 2',
        color: ACCENT_ORANGE,
        points: [
          'Instant computer vision scan on image upload',
          'Automatic category & subcategory classification',
          'Hazard & emergency severity detection (High/Critical)',
          'Filters fake/irrelevant non-civic photos instantly'
        ]
      },
      {
        title: 'Spatial Clustering & Prioritization',
        badge: 'STAGE 3 & 4',
        color: ACCENT_BLUE,
        points: [
          'Haversine GPS geospatial deduplication (<= 50m)',
          'Multi-signal clustering (Visual + Text + Location)',
          '1-Click "Support Existing Issue" community upvoting',
          'Multi-factor dynamic Priority Engine (0-100 score)'
        ]
      },
      {
        title: 'Auto-Routing & Closed-Loop Fixes',
        badge: 'STAGE 5',
        color: ACCENT_GREEN,
        points: [
          'Automatic routing to specific municipal department',
          'Live authority SLA countdowns & status dashboards',
          'Mandatory contractor repair photo proof upload',
          'Citizen verification loop: "YES, FIXED" vs "REOPEN"'
        ]
      }
    ];

    pillars.forEach((p, idx) => {
      const x = 0.6 + idx * 4.15;
      const y = 1.35;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: y, w: 3.9, h: 5.4,
        rectRadius: 0.15,
        fill: { color: SECONDARY },
        line: { color: p.color, width: 1.5 }
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.3, y: y + 0.3, w: 1.5, h: 0.3,
        rectRadius: 0.05,
        fill: { color: '0F172A' },
        line: { color: p.color, width: 1 }
      });
      slide.addText(p.badge, {
        x: x + 0.3, y: y + 0.32, w: 1.5, h: 0.25,
        fontSize: 9, fontFace: 'Arial', color: p.color, bold: true, align: 'center'
      });

      slide.addText(p.title, {
        x: x + 0.3, y: y + 0.75, w: 3.3, h: 0.65,
        fontSize: 16, fontFace: 'Arial', color: TEXT_MAIN, bold: true
      });

      const bullets = p.points.map(pt => `•  ${pt}`).join('\n\n');
      slide.addText(bullets, {
        x: x + 0.3, y: y + 1.5, w: 3.3, h: 3.6,
        fontSize: 12, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 18
      });
    });
  }

  // ==========================================
  // SLIDE 4: SOLUTION ARCHITECTURE / WORKFLOW DIAGRAM
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: PRIMARY };
    addHeader(slide, 'Solution Architecture & End-to-End Workflow');

    const steps = [
      { step: '01', title: 'Citizen Report', sub: 'Photo + GPS Tag + Description via Web/Mobile' },
      { step: '02', title: 'AI Vision Engine', sub: 'Classification + Hazard & Severity Scoring' },
      { step: '03', title: 'Spatial Clustering', sub: 'Haversine 50m Geo-fencing & Deduplication' },
      { step: '04', title: 'Priority & Dispatch', sub: 'Weighted 0-100 Score & Dept Queue Routing' },
      { step: '05', title: 'Verified Resolution', sub: 'Repair Proof Upload & Citizen Sign-Off / Escalation' }
    ];

    steps.forEach((s, idx) => {
      const x = 0.6 + idx * 2.5;
      const y = 1.4;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: y, w: 2.2, h: 2.2,
        rectRadius: 0.12,
        fill: { color: SECONDARY },
        line: { color: ACCENT_ORANGE, width: 1.5 }
      });

      slide.addText(s.step, {
        x: x + 0.15, y: y + 0.15, w: 1.9, h: 0.35,
        fontSize: 14, fontFace: 'Arial', color: ACCENT_ORANGE, bold: true
      });

      slide.addText(s.title, {
        x: x + 0.15, y: y + 0.55, w: 1.9, h: 0.45,
        fontSize: 12, fontFace: 'Arial', color: TEXT_MAIN, bold: true
      });

      slide.addText(s.sub, {
        x: x + 0.15, y: y + 1.05, w: 1.9, h: 1.0,
        fontSize: 10, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 14
      });

      if (idx < 4) {
        slide.addText('➔', {
          x: x + 2.15, y: y + 0.85, w: 0.4, h: 0.4,
          fontSize: 16, fontFace: 'Arial', color: ACCENT_GREEN, align: 'center', bold: true
        });
      }
    });

    const layers = [
      {
        layer: 'Client & Ingestion Layer',
        tech: 'React 18, Vite, Tailwind CSS, Leaflet OpenStreetMap, Camera/Geolocation API, Responsive PWA',
        color: ACCENT_BLUE
      },
      {
        layer: 'Business Logic & AI Processing Layer',
        tech: 'Java 21 Spring Boot 3.2, Spring Security (JWT), Vision AI Engine, Haversine Spatial Deduplicator, Priority Matrix',
        color: ACCENT_GREEN
      },
      {
        layer: 'Data & Persistence Layer',
        tech: 'MySQL 8.0 with Spatial Geo-indexing, Hibernate ORM, Evidence Storage, Audit Logs & Fraud Flag DB',
        color: ACCENT_ORANGE
      }
    ];

    layers.forEach((l, idx) => {
      const y = 3.9 + idx * 0.95;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.6, y: y, w: 12.13, h: 0.82,
        rectRadius: 0.08,
        fill: { color: SECONDARY },
        line: { color: '334155', width: 1 }
      });

      slide.addShape(pres.ShapeType.rect, {
        x: 0.6, y: y, w: 0.15, h: 0.82,
        fill: { color: l.color },
        line: { color: l.color }
      });

      slide.addText(l.layer, {
        x: 0.9, y: y + 0.1, w: 3.5, h: 0.3,
        fontSize: 12, fontFace: 'Arial', color: l.color, bold: true
      });

      slide.addText(l.tech, {
        x: 4.5, y: y + 0.1, w: 8.0, h: 0.6,
        fontSize: 11, fontFace: 'Arial', color: TEXT_MAIN
      });
    });
  }

  // ==========================================
  // SLIDE 5: TECHNOLOGY STACK & IMPLEMENTATION APPROACH
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: PRIMARY };
    addHeader(slide, 'Technology Stack & Implementation Approach');

    const stack = [
      {
        title: 'Frontend Tier',
        items: [
          'React 18 + Vite (High-speed SPA)',
          'Tailwind CSS (Glassmorphic UI)',
          'Leaflet & React-Leaflet (GIS Maps)',
          'Recharts (Real-time analytics)',
          'Axios with JWT auto-interceptors'
        ]
      },
      {
        title: 'Backend Tier',
        items: [
          'Java 21 & Spring Boot 3.2.x',
          'Spring Security + JWT Stateless Auth',
          'Spring Data JPA / Hibernate ORM',
          'SpringDoc OpenAPI 3 (Swagger Docs)',
          'RESTful Micro-service ready design'
        ]
      },
      {
        title: 'AI & Intelligence Tier',
        items: [
          'Vision AI Analysis Engine',
          'Haversine Proximity Geodesic Engine',
          'Multi-Signal Similarity Matcher',
          'Dynamic Mathematical Priority Scorer',
          'EXIF & Image Hash Fraud Detection'
        ]
      },
      {
        title: 'Data & DevOps Tier',
        items: [
          'MySQL 8.0 Relational Database',
          'Spatial indexing on Coordinates',
          'Docker & Multi-stage Compose setup',
          'Nginx reverse proxy for production',
          'Cloud-native modular scalability'
        ]
      }
    ];

    stack.forEach((s, idx) => {
      const x = 0.6 + idx * 3.1;
      const y = 1.35;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: y, w: 2.9, h: 5.4,
        rectRadius: 0.12,
        fill: { color: SECONDARY },
        line: { color: '334155', width: 1 }
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: y, w: 2.9, h: 0.7,
        rectRadius: 0.12,
        fill: { color: '131E35' },
        line: { color: '334155', width: 1 }
      });

      slide.addText(s.title, {
        x: x + 0.15, y: y + 0.18, w: 2.6, h: 0.35,
        fontSize: 14, fontFace: 'Arial', color: ACCENT_GREEN, bold: true, align: 'center'
      });

      const bullets = s.items.map(item => `✔  ${item}`).join('\n\n');
      slide.addText(bullets, {
        x: x + 0.2, y: y + 0.95, w: 2.5, h: 4.2,
        fontSize: 11, fontFace: 'Arial', color: TEXT_MAIN, lineSpacing: 16
      });
    });
  }

  // ==========================================
  // SLIDE 6: KEY FEATURES & INNOVATION (USP)
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: PRIMARY };
    addHeader(slide, 'Key Features & Unique Selling Propositions (USP)');

    const usps = [
      {
        num: '01',
        title: 'Multi-Signal Spatial Deduplication',
        desc: 'Automatically merges duplicate reports within a 50m radius using Haversine GPS distance, text, and visual matching into single master Issue Clusters. Converts spam into quantified public demand.',
        accent: ACCENT_ORANGE
      },
      {
        num: '02',
        title: 'Dynamic Risk-Aware Priority Algorithm',
        desc: 'Calculates Priority (0-100) using: (Severity × 0.35) + (Citizen Impact × 0.25) + (Location Risk × 0.20) + (Duration × 0.10) + (Evidence × 0.10). Automatically prioritizes schools, hospitals & transit hubs.',
        accent: ACCENT_BLUE
      },
      {
        num: '03',
        title: 'Closed-Loop Citizen Verification',
        desc: 'Eliminates fake ticket closures. Authorities must upload photo proof; citizens receive instant notifications and must vote "YES, FIXED" or "STILL A PROBLEM" (triggers auto-escalation).',
        accent: ACCENT_GREEN
      },
      {
        num: '04',
        title: 'Interactive Geospatial Authority Dashboard',
        desc: 'Real-time color-coded map pins (Critical/High/Medium), auto-filtered by municipal department jurisdiction, live SLA countdown timers, and zone hazard analytics.',
        accent: 'F59E0B'
      }
    ];

    usps.forEach((u, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.6 + col * 6.2;
      const y = 1.35 + row * 2.65;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: y, w: 5.9, h: 2.45,
        rectRadius: 0.12,
        fill: { color: SECONDARY },
        line: { color: '334155', width: 1 }
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.3, y: y + 0.2, w: 0.6, h: 0.35,
        rectRadius: 0.05,
        fill: { color: u.accent },
        line: { color: u.accent }
      });
      slide.addText(u.num, {
        x: x + 0.3, y: y + 0.22, w: 0.6, h: 0.3,
        fontSize: 11, fontFace: 'Arial', color: TEXT_MAIN, bold: true, align: 'center'
      });

      slide.addText(u.title, {
        x: x + 1.05, y: y + 0.2, w: 4.6, h: 0.35,
        fontSize: 14, fontFace: 'Arial', color: TEXT_MAIN, bold: true
      });

      slide.addText(u.desc, {
        x: x + 0.3, y: y + 0.7, w: 5.3, h: 1.6,
        fontSize: 11, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 16
      });
    });
  }

  // ==========================================
  // SLIDE 7: FEASIBILITY, CHALLENGES & COMPETITOR ANALYSIS
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: PRIMARY };
    addHeader(slide, 'Feasibility, Challenges & Competitor Analysis');

    // Left Column: Feasibility & Challenges
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6, y: 1.35, w: 5.8, h: 5.4,
      rectRadius: 0.12,
      fill: { color: SECONDARY },
      line: { color: '334155', width: 1 }
    });

    slide.addText('FEASIBILITY & MITIGATION', {
      x: 0.9, y: 1.55, w: 5.2, h: 0.3,
      fontSize: 13, fontFace: 'Arial', color: ACCENT_ORANGE, bold: true
    });

    const feasibilities = [
      { t: 'Technical Feasibility', d: 'Production-ready Spring Boot + React stack, Dockerized deployment, standard REST APIs for seamless Smart City integration.' },
      { t: 'Operational Feasibility', d: 'Minimal training required for municipal staff; auto-routes issues straight to field officers by department and zone.' },
      { t: 'Challenge: Offline/Low Connectivity', d: 'Mitigation: Client-side local queueing and compressed image sync when connectivity resumes.' },
      { t: 'Challenge: Spam & Fake Submissions', d: 'Mitigation: AI image validity pre-check, coordinate geo-fencing, and user trust score weighting.' }
    ];

    let fy = 1.95;
    feasibilities.forEach(f => {
      slide.addText(`✔ ${f.t}:`, {
        x: 0.9, y: fy, w: 5.2, h: 0.25,
        fontSize: 11, fontFace: 'Arial', color: ACCENT_GREEN, bold: true
      });
      slide.addText(f.d, {
        x: 1.1, y: fy + 0.22, w: 5.0, h: 0.55,
        fontSize: 10, fontFace: 'Arial', color: TEXT_MUTED
      });
      fy += 0.82;
    });

    // Right Column: Competitor Comparison Table
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.7, y: 1.35, w: 6.0, h: 5.4,
      rectRadius: 0.12,
      fill: { color: SECONDARY },
      line: { color: '334155', width: 1 }
    });

    slide.addText('COMPETITIVE BENCHMARKING', {
      x: 7.0, y: 1.55, w: 5.4, h: 0.3,
      fontSize: 13, fontFace: 'Arial', color: ACCENT_BLUE, bold: true
    });

    // Table
    const tableData = [
      [
        { text: 'Feature Matrix', options: { bold: true, color: TEXT_MAIN, fill: '131E35' } },
        { text: 'Traditional Apps', options: { bold: true, color: 'EF4444', fill: '131E35' } },
        { text: 'CivicPulse AI', options: { bold: true, color: ACCENT_GREEN, fill: '131E35' } }
      ],
      [
        { text: 'AI Image Validation & Severity', options: { color: TEXT_MAIN } },
        { text: '❌ No (Manual)', options: { color: TEXT_MUTED } },
        { text: '✔ Real-Time AI Scan', options: { bold: true, color: ACCENT_GREEN } }
      ],
      [
        { text: 'Spatial Duplicate Clustering', options: { color: TEXT_MAIN } },
        { text: '❌ Redundant Tickets', options: { color: TEXT_MUTED } },
        { text: '✔ Auto 50m Geo-Cluster', options: { bold: true, color: ACCENT_GREEN } }
      ],
      [
        { text: 'Dynamic Risk-Based Priority', options: { color: TEXT_MAIN } },
        { text: '❌ FIFO / Manual', options: { color: TEXT_MUTED } },
        { text: '✔ 5-Factor 0-100 Score', options: { bold: true, color: ACCENT_GREEN } }
      ],
      [
        { text: 'Automated Dept Routing', options: { color: TEXT_MAIN } },
        { text: '❌ Manual Sorting', options: { color: TEXT_MUTED } },
        { text: '✔ Instant AI Routing', options: { bold: true, color: ACCENT_GREEN } }
      ],
      [
        { text: 'Citizen Verification Loop', options: { color: TEXT_MAIN } },
        { text: '❌ Ghost Closures', options: { color: TEXT_MUTED } },
        { text: '✔ Dual Sign-Off Loop', options: { bold: true, color: ACCENT_GREEN } }
      ]
    ];

    slide.addTable(tableData, {
      x: 7.0, y: 2.0, w: 5.4, h: 4.4,
      fontSize: 10,
      fontFace: 'Arial',
      border: { pt: 1, color: '334155' },
      align: 'left',
      valign: 'middle'
    });
  }

  // ==========================================
  // SLIDE 8: REFERENCES, GITHUB REPOSITORY & DEMO LINK
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: PRIMARY };
    addHeader(slide, 'Project Links, Repository & References');

    const links = [
      {
        title: 'GitHub Repository',
        tag: 'OPEN SOURCE CODEBASE',
        url: 'https://github.com/cosmic-developers/civicpulse',
        desc: 'Complete full-stack source code, Docker configs, Spring Boot API, React Vite frontend & seeder data.',
        color: ACCENT_ORANGE
      },
      {
        title: 'Live Demo & Swagger Docs',
        tag: 'INTERACTIVE PROTOTYPE',
        url: 'http://localhost:3000 (App)  |  http://localhost:8080/swagger-ui.html (API)',
        desc: 'Role-based live access for Citizens, Roads/Sanitation Authorities, and Municipal Administrators.',
        color: ACCENT_GREEN
      },
      {
        title: 'Standards & Research References',
        tag: 'SMART GOVERNANCE FRAMEWORKS',
        url: 'Smart Cities Mission Guidelines (MoHUA) & GIS Spatial Standards',
        desc: '• Ministry of Housing and Urban Affairs (MoHUA) Smart City Guidelines\n• Haversine Spherical Distance Metrics for Micro-Spatial Clustering\n• Computer Vision & Image Classification in Urban Infrastructure Management',
        color: ACCENT_BLUE
      }
    ];

    links.forEach((lk, idx) => {
      const y = 1.35 + idx * 1.8;

      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.6, y: y, w: 12.13, h: 1.6,
        rectRadius: 0.12,
        fill: { color: SECONDARY },
        line: { color: '334155', width: 1 }
      });

      slide.addShape(pres.ShapeType.rect, {
        x: 0.6, y: y, w: 0.15, h: 1.6,
        fill: { color: lk.color },
        line: { color: lk.color }
      });

      slide.addText(lk.title, {
        x: 0.95, y: y + 0.15, w: 4.5, h: 0.3,
        fontSize: 14, fontFace: 'Arial', color: TEXT_MAIN, bold: true
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: 5.5, y: y + 0.15, w: 3.5, h: 0.25,
        rectRadius: 0.05,
        fill: { color: '0F172A' },
        line: { color: lk.color, width: 1 }
      });
      slide.addText(lk.tag, {
        x: 5.5, y: y + 0.17, w: 3.5, h: 0.22,
        fontSize: 8.5, fontFace: 'Arial', color: lk.color, bold: true, align: 'center'
      });

      slide.addText(lk.url, {
        x: 0.95, y: y + 0.5, w: 11.4, h: 0.3,
        fontSize: 11, fontFace: 'Arial', color: ACCENT_GREEN, bold: true
      });

      slide.addText(lk.desc, {
        x: 0.95, y: y + 0.85, w: 11.4, h: 0.65,
        fontSize: 10, fontFace: 'Arial', color: TEXT_MUTED
      });
    });
  }

  // ==========================================
  // SLIDE 9: THANK YOU & Q&A
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: PRIMARY };

    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.5, y: 1.2, w: 10.33, h: 5.0,
      rectRadius: 0.2,
      fill: { color: SECONDARY },
      line: { color: ACCENT_ORANGE, width: 2 }
    });

    slide.addText('THANK YOU', {
      x: 2.0, y: 1.8, w: 9.33, h: 0.8,
      fontSize: 38, fontFace: 'Arial', color: TEXT_MAIN, bold: true, align: 'center'
    });

    slide.addText('Team Cosmic Developers — CivicPulse', {
      x: 2.0, y: 2.7, w: 9.33, h: 0.4,
      fontSize: 18, fontFace: 'Arial', color: ACCENT_GREEN, bold: true, align: 'center'
    });

    slide.addText('Empowering Citizens • Streamlining Governance • Transforming Bharat', {
      x: 2.0, y: 3.2, w: 9.33, h: 0.35,
      fontSize: 13, fontFace: 'Arial', color: TEXT_MUTED, italic: true, align: 'center'
    });

    slide.addShape(pres.ShapeType.line, {
      x: 4.5, y: 3.8, w: 4.33, h: 0,
      line: { color: '334155', width: 1.5 }
    });

    slide.addText('Ready for Questions & Live Demonstration', {
      x: 2.0, y: 4.2, w: 9.33, h: 0.45,
      fontSize: 16, fontFace: 'Arial', color: ACCENT_ORANGE, bold: true, align: 'center'
    });

    slide.addText('Build With Bharat 2.0 National Level Hackathon', {
      x: 2.0, y: 4.8, w: 9.33, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: TEXT_MUTED, align: 'center'
    });
  }

  const outputPath = path.join(__dirname, 'BuildWithBharat2.0_CosmicDevelopers.pptx');
  await pres.writeFile({ fileName: outputPath });
  console.log(`Presentation generated successfully at: ${outputPath}`);
}

createPresentation().catch(err => {
  console.error('Error generating presentation:', err);
});
