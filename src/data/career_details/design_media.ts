import type { CareerRoleDetail } from "./types";

export const DESIGN_MEDIA_CAREER_DETAILS: Record<string, CareerRoleDetail> = {
  "architect": {
    listName: "Architect",
    title: "Architect in India: B.Arch, NATA, Council of Architecture (COA) & Design Path",
    metaDescription:
      "Complete guide to becoming an Architect in India: 5-year B.Arch, NATA exam, JEE Main Paper 2, Council of Architecture registration, and top colleges.",
    intro:
      "Architects plan, design, and supervise the construction of sustainable buildings, commercial towers, residential complexes, and urban public spaces. In India, the profession of architecture is legally protected and regulated by the Council of Architecture (COA) under the Architects Act, 1972. Architects blend aesthetic creativity, structural engineering physics, spatial ergonomics, building bye-laws, and green building environmental standards (GRIHA / LEED). Qualification requires completing a mandatory 5-year Bachelor of Architecture (B.Arch) program entered through the National Aptitude Test in Architecture (NATA) or JEE Main Paper 2, followed by obtaining a statutory COA Registration Number.",
    typicalSubjects: [
      "Architectural Design Studios & Spatial Theory",
      "Building Construction, Materials & Structural Systems",
      "History of Architecture, Climatology & Sustainable Green Design",
      "Computer-Aided Architectural Drafting (AutoCAD, Revit, BIM, Rhino)"
    ],
    keyExams: [
      "NATA (National Aptitude Test in Architecture conducted by Council of Architecture)",
      "JEE Main Paper 2A (for B.Arch admissions in SPAs and NITs)",
      "JEE Advanced Architecture Aptitude Test (AAT - for B.Arch in IIT Roorkee, IIT Kharagpur, IIT BHU)"
    ],
    colleges: [
      { name: "School of Planning and Architecture (SPA New Delhi / Bhopal / Vijayawada)", context: "Institutes of National Importance under Ministry of Education, acknowledged as the gold standard of architectural and urban planning education in India." },
      { name: "CEPT University (Ahmedabad - Faculty of Architecture)", context: "World-renowned institution founded by B.V. Doshi (Pritzker Prize Laureate), leading global architectural research and habitat design." },
      { name: "IIT Roorkee / IIT Kharagpur (Department of Architecture and Planning)", context: "Pioneering Indian technical architecture departments integrating structural engineering rigor with cutting-edge digital fabrication." },
      { name: "Sir J.J. College of Architecture (Mumbai)", context: "Asia's oldest architecture school (est. 1913) with legendary alumni shaping Mumbai's architectural skyline." }
    ],
    ncoCode: "2161.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Council of Architecture (COA)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2161 - Architects", url: "https://www.ncs.gov.in" },
      { name: "Council of Architecture (COA India)", url: "https://www.coa.gov.in" },
      { name: "National Aptitude Test in Architecture (NATA)", url: "https://www.nata.in" }
    ]
  },

  "interior-designer": {
    listName: "Interior Designer",
    title: "Interior Designer in India: Spatial Planning, 3D Rendering, B.Des & CAD Path",
    metaDescription:
      "How to become an Interior Designer in India: B.Des Interior Design, spatial planning, 3D visualization (3ds Max, SketchUp), materials, and top design colleges.",
    intro:
      "Interior Designers create functional, safe, and aesthetically sophisticated interior spaces for residential homes, corporate offices, luxury hotels, retail flagship stores, and healthcare facilities. They master spatial planning, lighting design, acoustics, building material selection, furniture detailing, and 3D photorealistic rendering. In India's expanding real estate and hospitality market, interior designers work in architectural firms, independent design studios, or run turnkey residential renovation enterprises. Educational pathways include 4-year B.Des in Interior Design or specialized diplomas from recognized design institutes.",
    typicalSubjects: [
      "Spatial Layout Planning, Anthropometrics & Ergonomics",
      "Building Services (HVAC, Lighting, Electrical & Plumbing Layouts)",
      "Furniture Design, Detailing & Joinery Technology",
      "3D Digital Modeling (SketchUp, 3ds Max, V-Ray, AutoCAD)"
    ],
    keyExams: [
      "NID DAT (National Institute of Design Entrance)",
      "UCEED (Undergraduate Common Entrance Examination for Design)",
      "SEED / State Design Aptitude Entrance Tests"
    ],
    colleges: [
      { name: "National Institute of Design (NID Ahmedabad / Gandhinagar - Furniture & Interior Design)", context: "Apex national statutory design institute with unmatched wood and metal prototyping workshops and craft heritage research." },
      { name: "CEPT University (Ahmedabad - Faculty of Design)", context: "Internationally acclaimed interior architecture and spatial design school with rigorous studio-based pedagogy." },
      { name: "Srishti Manipal Institute of Art, Design and Technology (Bengaluru)", context: "Top creative institute offering contemporary interior spatial design and environmental graphics programs." },
      { name: "Pearl Academy (Delhi NCR / Mumbai)", context: "Leading private design institute with strong industry partnerships across luxury residential and retail interiors." }
    ],
    ncoCode: "2163.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Institute of Indian Interior Designers (IIID) / AICTE",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2163 - Interior Designers", url: "https://www.ncs.gov.in" },
      { name: "Institute of Indian Interior Designers (IIID)", url: "https://www.iiid.in" }
    ]
  },

  "fashion-designer": {
    listName: "Fashion Designer",
    title: "Fashion Designer in India: NIFT Entrance, Apparel Design, Textiles & Luxury Brands",
    metaDescription:
      "Career guide to Fashion Design in India: NIFT B.Des, garment construction, fashion illustration, haute couture, retail export, and top fashion weeks.",
    intro:
      "Fashion Designers create original clothing, luxury haute couture, ready-to-wear apparel, and fashion accessories. In India's massive textile and apparel ecosystem (valued over $150B), fashion designers research global trend forecasts, sketch collection illustrations, select heritage and sustainable fabrics, engineer garment draping patterns, and direct runway shows. The premier educational gateway in India is the National Institute of Fashion Technology (NIFT) through its nationwide entrance exam, leading to a 4-year Bachelor of Design (B.Des) in Fashion Design, Textile Design, or Knitwear Design.",
    typicalSubjects: [
      "Fashion Illustration, Flat Pattern Drafting & Garment Draping",
      "Fabric Science, Textile Dyeing & Surface Ornamentation",
      "History of World & Indian Traditional Costume",
      "Fashion Merchandising, Brand Marketing & Digital CAD (CLO 3D, Illustrator)"
    ],
    keyExams: [
      "NIFT Entrance Exam (Creative Ability Test - CAT & General Ability Test - GAT + Situation Test)",
      "NID DAT (for Apparel Design)",
      "UCEED / Private Fashion Institute Entrances"
    ],
    colleges: [
      { name: "National Institute of Fashion Technology (NIFT New Delhi)", context: "India's #1 statutory fashion institution established under Ministry of Textiles, alma mater to top Indian couture designers." },
      { name: "NIFT Mumbai / NIFT Bengaluru", context: "Leading NIFT campuses situated in India's commercial and technological fashion retail hubs." },
      { name: "National Institute of Design (NID Gandhinagar - Apparel Design)", context: "Premier statutory design institute renowned for ergonomic textile engineering and sustainable craft fashion." },
      { name: "Pearl Academy (New Delhi - School of Fashion)", context: "Top private fashion school offering global design exchanges and direct London Fashion Week showcases." }
    ],
    ncoCode: "2163.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "National Institute of Fashion Technology (NIFT Act) / Ministry of Textiles",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2163 - Fashion and Apparel Designers", url: "https://www.ncs.gov.in" },
      { name: "National Institute of Fashion Technology (NIFT)", url: "https://nift.ac.in" }
    ]
  },

  "product-designer": {
    listName: "Product Designer",
    title: "Product Designer (Industrial Design) in India: Hardware Design, UCEED & NID",
    metaDescription:
      "How to become an Industrial Product Designer in India: Physical product design, 3D CAD, human ergonomics, prototyping, UCEED/NID DAT, and top studios.",
    intro:
      "Industrial Product Designers develop the physical form, usability ergonomics, aesthetic housing, and manufacturing specifications for consumer electronics, household appliances, automobiles, medical hardware, and industrial equipment. They conduct user context research, create physical clay and 3D printed prototypes, optimize design for injection molding manufacturing, and collaborate with mechanical engineers. In India, entry is achieved through a 4-year B.Des in Industrial Design or Product Design from premier statutory design institutions (NID, IIT IDC).",
    typicalSubjects: [
      "Industrial Design Form Studies & Visual Aesthetics",
      "Human Factors Engineering & Ergonomics",
      "Manufacturing Processes, Materials (Plastics, Metals) & 3D Prototyping",
      "SolidWorks, Rhino 3D & Advanced Surface Modeling"
    ],
    keyExams: [
      "UCEED (Conducted by IIT Bombay for B.Des in IIT Bombay, Delhi, Guwahati, Hyderabad, Jabalpur)",
      "NID DAT (for B.Des Product Design in NID Ahmedabad)",
      "CEED (for M.Des in IITs and IISc Bengaluru post-graduation)"
    ],
    colleges: [
      { name: "National Institute of Design (NID Ahmedabad - Product Design)", context: "India's premier statutory design faculty with world-class prototyping workshops, ergonomics laboratories, and industry consultancies." },
      { name: "IDC School of Design (IIT Bombay)", context: "Apex technical design school offering integrated design degrees with heavy focus on consumer electronics and healthcare hardware." },
      { name: "Department of Design (IIT Guwahati)", context: "Leading design department with extensive research in electronic product packaging and sustainable material design." },
      { name: "Center for Product Design and Manufacturing (CPDM, IISc Bengaluru)", context: "India's premier scientific product design lab specializing in advanced technological product innovation." }
    ],
    ncoCode: "2163.0300",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Ministry of Commerce & Industry / AICTE",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2163 - Industrial and Product Designers", url: "https://www.ncs.gov.in" },
      { name: "National Institute of Design (NID)", url: "https://www.nid.edu" }
    ]
  },

  "graphic-designer": {
    listName: "Graphic Designer",
    title: "Graphic Designer in India: Branding, Visual Identity, Adobe Creative Suite & NID",
    metaDescription:
      "Step-by-step path to Graphic Design in India: Typography, visual branding, Adobe Illustrator/Photoshop, motion graphics, and B.Des communication design.",
    intro:
      "Graphic Designers and Visual Communication Designers create visual identities, brand logos, packaging graphics, marketing collaterals, digital illustrations, and motion graphics for brands, media houses, and advertising agencies. In India's digital economy, graphic designers master typography, grid systems, colour psychology, visual storytelling, and vector illustration across print and digital screens. Educational pathways include a 4-year B.Des in Graphic Design / Communication Design or visual arts degrees (BFA), with hiring decisions determined entirely by the visual quality and originality of the candidate's Behance/Dribbble portfolio.",
    typicalSubjects: [
      "Typography, Grid Systems & Page Layout Architecture",
      "Brand Identity Design, Packaging & Logo Construction",
      "Vector Illustration & Digital Image Manipulation (Adobe Illustrator, Photoshop)",
      "Motion Graphics & Visual Storytelling (Adobe After Effects)"
    ],
    keyExams: [
      "NID DAT (for B.Des Graphic Design / Communication Design)",
      "UCEED (for B.Des in IITs)",
      "State Common Entrance Tests for Bachelor of Fine Arts (BFA Applied Art)"
    ],
    colleges: [
      { name: "National Institute of Design (NID Ahmedabad - Graphic Design)", context: "Pioneered graphic and communication design in India with world-class typography and visual semiotics archives." },
      { name: "Sir J.J. Institute of Applied Art (Mumbai)", context: "Historic government applied art college (est. 1935) producing India's most celebrated creative advertising directors." },
      { name: "Faculty of Visual Arts, Banaras Hindu University (BHU Varanasi - BFA)", context: "Renowned fine arts faculty providing rigorous classical drawing, printmaking, and visual design foundations." },
      { name: "Srishti Manipal Institute of Art, Design and Technology (Bengaluru)", context: "Leading contemporary design school with deep integration into India's digital branding and media agency ecosystem." }
    ],
    ncoCode: "2166.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2166 - Graphic and Multimedia Designers", url: "https://www.ncs.gov.in" },
      { name: "National Institute of Design (NID)", url: "https://www.nid.edu" }
    ]
  },

  "journalist-reporter": {
    listName: "Journalist / Reporter",
    title: "Journalist in India: Mass Communication, IIMC, Investigative Reporting & Broadcast",
    metaDescription:
      "Career roadmap for Journalists in India: Indian Institute of Mass Communication (IIMC), investigative news reporting, digital media, and press ethics.",
    intro:
      "Journalists and News Reporters investigate, verify, write, and broadcast news reports on political developments, economic trends, judicial rulings, investigative exposés, and global current affairs. In India's massive news media landscape (over 100,000 registered newspapers and 900+ TV news channels), journalists work in digital news portals (The Hindu, Indian Express), wire agencies (PTI, ANI), television broadcast networks, and independent multimedia podcasts. Academic preparation typically involves a Bachelor's in Journalism & Mass Communication (BJMC) or an undergraduate degree followed by the prestigious Indian Institute of Mass Communication (IIMC) post-graduate diploma.",
    typicalSubjects: [
      "Investigative Reporting, News Gathering & Fact-Checking Methodologies",
      "Media Laws, Constitution of India (Article 19(1)(a)) & Defamation Jurisprudence",
      "Broadcast Journalism, Camera Scripting & Video Production",
      "Digital Journalism, SEO News Editing & Data Journalism"
    ],
    keyExams: [
      "IIMC Entrance Examination (Indian Institute of Mass Communication via CUET-PG)",
      "CUET-UG (for BA Journalism Honours in Delhi University)",
      "Asian College of Journalism (ACJ Entrance Exam, Chennai)"
    ],
    colleges: [
      { name: "Indian Institute of Mass Communication (IIMC New Delhi)", context: "Autonomous apex national media institute under Ministry of Information & Broadcasting, acknowledged as India's premier journalism school." },
      { name: "Asian College of Journalism (ACJ Chennai)", context: "Top private post-graduate journalism academy renowned for rigorous investigative reporting and data journalism cohorts." },
      { name: "A.J.K. Mass Communication Research Centre (MCRC Jamia Millia Islamia, New Delhi)", context: "Renowned central university mass communication center producing top broadcast journalists and documentary filmmakers." },
      { name: "Delhi University (Delhi School of Journalism / Lady Shri Ram College)", context: "Top undergraduate journalism departments offering bilingual journalism and public policy reporting." }
    ],
    ncoCode: "2642.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Press Council of India (PCI) / Ministry of Information and Broadcasting",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2642 - Journalists and News Writers", url: "https://www.ncs.gov.in" },
      { name: "Indian Institute of Mass Communication (IIMC)", url: "https://iimc.gov.in" }
    ]
  },

  "content-strategist": {
    listName: "Content Strategist",
    title: "Content Strategist in India: Editorial Direction, B2B SaaS & Organic Growth",
    metaDescription:
      "How to become a Content Strategist in India: Editorial content planning, SEO research, B2B SaaS inbound marketing, and digital media careers.",
    intro:
      "Content Strategists plan, produce, and govern audience-focused editorial content across digital blogs, whitepapers, social media channels, and email newsletters to drive brand authority and customer acquisition. In India's booming B2B SaaS and consumer tech startup ecosystem, content strategists conduct audience persona research, manage editorial content calendars, optimize articles for search engine ranking (SEO), and track content conversion metrics. Standard backgrounds include degrees in English Literature, Journalism, Mass Communication, or Marketing, backed by published bylines and measurable organic traffic growth case studies.",
    typicalSubjects: [
      "Digital Editorial Writing & Long-Form Research Synthesis",
      "Search Engine Optimization (Keyword Intent Analysis, On-Page SEO)",
      "Audience Persona Mapping & Content Funnel Architecture",
      "Content Marketing Analytics (Google Analytics 4, Search Console, Ahrefs)"
    ],
    keyExams: [
      "CUET-UG (for English Literature / Mass Communication degrees)",
      "University Entrances for Masters in Communication / Media"
    ],
    colleges: [
      { name: "St. Xavier's College (Mumbai - Department of Mass Media)", context: "Pioneering media and communication department with top placement records in brand strategy and digital marketing agencies." },
      { name: "Symbiosis Institute of Media and Communication (SIMC Pune)", context: "Leading private media school specializing in brand communication, content strategy, and digital campaigns." },
      { name: "Mudra Institute of Communications (MICA Ahmedabad)", context: "India's premier business school dedicated to strategic marketing, communication, and digital content leadership." },
      { name: "Miranda House / St. Stephen's College (University of Delhi - B.A. English)", context: "Top humanities departments producing exceptional critical thinkers, editorial authors, and content directors." }
    ],
    ncoCode: "2641.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "UGC / Ministry of Information & Broadcasting",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2641 - Authors and Writers", url: "https://www.ncs.gov.in" },
      { name: "Digital News Publishers Association (DNPA India)", url: "https://dnpa.co.in" }
    ]
  },

  "3d-animator-vfx-artist": {
    listName: "3D Animator / VFX Artist",
    title: "3D Animator & Visual Effects (VFX) Artist in India: Animation Pipelines & CGI",
    metaDescription:
      "Career guide for 3D Animators and VFX Artists in India: 3ds Max, Maya, Blender, Unreal Engine, gaming studios, and Bollywood visual effects production.",
    intro:
      "3D Animators and Visual Effects (VFX) Artists create digital characters, dynamic motion graphics, and photorealistic CGI environments for cinematic motion pictures, gaming studios, OTT productions, and architectural simulations. In India's massive animation and visual effects (AVGC) sector—bolstered by national media hubs in Mumbai, Hyderabad, Bengaluru, and Pune—artists specialize in 3D modeling, character rigging, texture shading, lighting, and compositing using Maya, Blender, Houdini, and Unreal Engine. Pathways include a Bachelor of Design (B.Des) in Animation / Game Design or specialized visual arts diplomas backed by a high-impact showreel.",
    typicalSubjects: [
      "Character Modeling, Anatomy & Skeletal Rigging Principles",
      "Digital Texturing, Lighting Physics & Particle Simulation Dynamics",
      "Visual Effects Compositing (Nuke, After Effects, Houdini FX)",
      "3D Spatial Animation & Game Engine Real-Time Rendering (Unreal Engine 5)"
    ],
    keyExams: [
      "UCEED (Undergraduate Common Entrance Examination for Design for IIT Bombay / IDC)",
      "NID DAT (National Institute of Design Design Aptitude Test for Animation Film Design)",
      "FTII JET (Film and Television Institute of India Joint Entrance Test for Animation & VFX)"
    ],
    colleges: [
      { name: "National Institute of Design (NID Ahmedabad)", context: "India's apex design institute offering world-class Animation Film Design programs." },
      { name: "IDC School of Design (IIT Bombay)", context: "Premier institute for digital animation, interactive media design, and visual communication." },
      { name: "Film and Television Institute of India (FTII Pune)", context: "National film institute renowned for cinematic storytelling and specialized digital animation faculties." },
      { name: "Satyajit Ray Film & Television Institute (SRFTI Kolkata)", context: "Central autonomous film school with advanced CGI and visual effects labs." }
    ],
    ncoCode: "2166.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Ministry of Information & Broadcasting / AVGC Task Force (Govt of India)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2166 - Graphic and Multimedia Designers", url: "https://www.ncs.gov.in" },
      { name: "Animation, Visual Effects, Gaming & Comics (AVGC) Promotion Council", url: "https://mib.gov.in" }
    ]
  },

  "film-video-editor": {
    listName: "Film / Video Editor",
    title: "Film & Video Editor in India: Post-Production, Color Grading & Cinema Editing",
    metaDescription:
      "How to become a professional Film and Video Editor in India: Premiere Pro, DaVinci Resolve, narrative pacing, OTT web series, and cinema post-production.",
    intro:
      "Film and Video Editors assemble raw footage, sound design, visual effects, and musical scores into cohesive cinematic narratives for feature films, television shows, streaming web series, corporate advertisements, and documentary features. Operating out of major Indian film hubs (Mumbai, Chennai, Hyderabad, Kolkata, Kochi), video editors manipulate narrative tempo, emotional pacing, color correction, and sound sync using Adobe Premiere Pro, Final Cut Pro, and DaVinci Resolve. The profession requires an intuitive sense of cinematic timing and dramatic flow, typically cultivated through degrees in cinema studies from FTII, SRFTI, or extensive apprentice assistant editor internships.",
    typicalSubjects: [
      "Non-Linear Video Editing (NLE) Techniques & Rhythm Analysis",
      "Cinematic Continuity, Montage Theory & Visual Pacing",
      "Color Grading, LUT Calibration & HDR Post-Production Workflows",
      "Multi-Track Audio Mixing, Foley Synchronization & Dialogue Clean-up"
    ],
    keyExams: [
      "FTII JET (Joint Entrance Test for Film & Television Institute of India, Pune)",
      "SRFTI JET (Joint Entrance Test for Satyajit Ray Film & Television Institute, Kolkata)",
      "Jamia MCRC Entrance Examination (MA in Mass Communication / Film)"
    ],
    colleges: [
      { name: "Film and Television Institute of India (FTII Pune)", context: "The gold standard for Indian cinema editing, training National Film Award-winning chief editors." },
      { name: "Satyajit Ray Film and Television Institute (SRFTI Kolkata)", context: "Apex national film school with state-of-the-art non-linear editing suites and digital color suites." },
      { name: "Whistling Woods International (Mumbai)", context: "Asia's premier film and creative arts institute with direct industry placement in Bollywood and OTT productions." },
      { name: "A.J.K. MCRC (Jamia Millia Islamia, New Delhi)", context: "Leading media institution producing documentary editors and broadcast post-production specialists." }
    ],
    ncoCode: "2654.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Ministry of Information & Broadcasting / Film and Television Institute of India",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2654 - Film, Stage and Related Directors and Producers", url: "https://www.ncs.gov.in" },
      { name: "Film and Television Institute of India (FTII)", url: "https://ftii.ac.in" }
    ]
  },

  "digital-copywriter": {
    listName: "Digital Content Writer / Copywriter",
    title: "Digital Copywriter in India: Brand Advertising, Creative Copy & Digital Campaigns",
    metaDescription:
      "Career pathway for Copywriters and Advertising Creative Writers in India: Ad agency copy, social campaigns, brand tone, and performance copywriting.",
    intro:
      "Digital Copywriters craft persuasive, memorable written messaging for advertising campaigns, social media commercials, search engine ads, product landing pages, and television taglines that drive consumer action and brand loyalty. Working across top advertising agencies (Ogilvy, Dentsu, McCann) and in-house creative brand teams, copywriters distill complex product value propositions into snappy headlines, video scripts, and emotional marketing hooks. Successful copywriters possess an exceptional grasp of colloquial culture, consumer psychology, and concise linguistic framing, often backed by degrees in English Literature, Journalism, or Mass Media.",
    typicalSubjects: [
      "Persuasive Rhetoric, Creative Conceptualization & Brand Storytelling",
      "Consumer Behavioral Psychology & Purchasing Triggers",
      "Short-Form Ad Scriptwriting & Social Media Campaign Copy",
      "Conversion Rate Optimization (CRO) & Performance Ad Testing"
    ],
    keyExams: [
      "MICAT (MICA Admission Test for Strategic Marketing & Communication)",
      "CUET-UG (for BA in Journalism, English Literature, or Mass Media)",
      "Symbiosis Entrance Test (SET for Symbiosis Centre for Media & Communication)"
    ],
    colleges: [
      { name: "Mudra Institute of Communications (MICA Ahmedabad)", context: "Premier management institute for strategic marketing, brand management, and creative advertising communication." },
      { name: "Symbiosis Centre for Media & Communication (SCMC Pune)", context: "Leading undergraduate media college renowned for advertising copy and brand strategy tracks." },
      { name: "St. Xavier's College (Mumbai)", context: "Prestigious arts institution producing leading creative directors and ad agency copy leads." },
      { name: "Lady Shri Ram College for Women (LSR New Delhi)", context: "Top liberal arts college celebrated for producing eminent literary authors and brand communicators." }
    ],
    ncoCode: "2641.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Advertising Standards Council of India (ASCI) / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2641 - Authors and Writers", url: "https://www.ncs.gov.in" },
      { name: "Advertising Standards Council of India (ASCI)", url: "https://ascionline.in" }
    ]
  },

  "pr-corporate-comm-manager": {
    listName: "Public Relations (PR) Manager",
    title: "Public Relations (PR) & Corporate Communications Manager in India",
    metaDescription:
      "How to build a career in Public Relations and Corporate Communications in India: Media relations, crisis management, press briefings, and brand reputation.",
    intro:
      "Public Relations (PR) and Corporate Communications Managers build, protect, and enhance the public image and stakeholder trust of corporations, high-profile individuals, government agencies, and non-profit organizations. In India's dynamic corporate and media ecosystem, PR managers author official press releases, coordinate media interviews with leading business journalists, organize national press conferences, and navigate high-stakes crisis communications during regulatory inquiries or public controversies. Strong verbal eloquence, deep media networks, and strategic composure are essential, typically developed through degrees in Mass Communication, Public Relations, or Business Administration.",
    typicalSubjects: [
      "Corporate Reputation Architecture & Stakeholder Engagement Strategy",
      "Media Relations, Press Conference Staging & Editorial Pitching",
      "Crisis Communications Management & Brand Damage Mitigation",
      "Corporate Social Responsibility (CSR) Storytelling & ESG Reporting"
    ],
    keyExams: [
      "IIMC Entrance Examination (PG Diploma in Public Relations & Advertising)",
      "CAT / XAT (for MBA in Communications Management at MICA / Symbiosis)",
      "CUET-PG (for Master's in Mass Communication & Public Relations)"
    ],
    colleges: [
      { name: "Indian Institute of Mass Communication (IIMC New Delhi)", context: "Top government institute for Advertising and Public Relations training in India." },
      { name: "Mudra Institute of Communications (MICA Ahmedabad)", context: "Apex institute for corporate communications, public relations strategy, and media leadership." },
      { name: "Symbiosis Institute of Media & Communication (SIMC Pune)", context: "Premier private institution with strong corporate PR agency alumni networks." },
      { name: "Xavier Institute of Communications (XIC Mumbai)", context: "Renowned media training institute with strong corporate communications industry links in Mumbai." }
    ],
    ncoCode: "2432.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Public Relations Society of India (PRSI) / Ministry of Information & Broadcasting",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2432 - Public Relations Professionals", url: "https://www.ncs.gov.in" },
      { name: "Public Relations Society of India (PRSI)", url: "https://prsi.co.in" }
    ]
  },

  "screenwriter": {
    listName: "Screenwriter / Script Developer",
    title: "Screenwriter & Script Developer in India: Feature Films, OTT Series & Teleplays",
    metaDescription:
      "Career roadmap for Screenwriters in India: Script formatting, three-act structure, dialogue writing, OTT series bibles, and writers' room collaboration.",
    intro:
      "Screenwriters conceptualize, structure, and write complete original scripts, dialogue tracks, and episodic episode treatments for cinematic feature films, streaming web series, television dramas, and interactive gaming narratives. With the meteoric rise of OTT platforms in India (Netflix, Amazon Prime Video, Disney+ Hotstar, SonyLIV), screenwriters collaborate in writers' rooms, craft pilot bibles, develop multi-season character arcs, and pitch treatments to production studios. Entering the field requires deep mastery of dramatic premise, subtext, character motivations, and standard industry screenwriting software like Final Draft.",
    typicalSubjects: [
      "Dramatic Structure, Narrative Pacing & The Three-Act Paradigm",
      "Character Psychology, Arc Development & Subtextual Dialogue",
      "OTT Writers' Room Dynamics, Series Bibles & Scene Breakdown",
      "Copyright Law, Screenwriters Association (SWA) Registration & IP Rights"
    ],
    keyExams: [
      "FTII JET (Screenplay Writing & Direction Entrance Examination, Pune)",
      "SRFTI JET (Screenplay Writing & Direction Entrance Examination, Kolkata)",
      "Whistling Woods International Entrance Test"
    ],
    colleges: [
      { name: "Film and Television Institute of India (FTII Pune)", context: "India's premier film institute offering specialized diploma programs in Screenplay Writing." },
      { name: "Satyajit Ray Film & Television Institute (SRFTI Kolkata)", context: "Top national institute with specialized curriculum in cinematic storytelling and scriptwriting." },
      { name: "Whistling Woods International (Mumbai)", context: "Renowned private film academy with active industry screenwriters and studio pitch forums." },
      { name: "St. Xavier's College / University of Mumbai", context: "Offers strong comparative literature and dramatic arts programs nurturing creative writers." }
    ],
    ncoCode: "2641.0300",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Screenwriters Association (SWA India) / Ministry of Information & Broadcasting",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2641 - Authors and Writers", url: "https://www.ncs.gov.in" },
      { name: "Screenwriters Association (SWA India)", url: "https://swaindia.org" }
    ]
  }
};
