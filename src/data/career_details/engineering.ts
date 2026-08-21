import type { CareerRoleDetail } from "./types";

export const ENGINEERING_CAREER_DETAILS: Record<string, CareerRoleDetail> = {
  "mechanical-engineer": {
    listName: "Mechanical Engineer",
    title: "Mechanical Engineer in India: Core Engineering, CAD & Gate/PSU Career",
    metaDescription:
      "Complete guide to Mechanical Engineering in India: Thermodynamics, CAD/CAM, JEE Main/Advanced, GATE for PSU recruitment, and top colleges.",
    intro:
      "Mechanical Engineering is one of the broadest foundational engineering disciplines in India, encompassing thermodynamics, machine design, fluid mechanics, and automated manufacturing. Mechanical engineers design heavy machinery, HVAC systems, power generation turbines, automotive engines, and precision robotics. The academic path requires a 4-year B.Tech or B.E. in Mechanical Engineering entered via national or state engineering entrances. Graduates pursue core private sector roles (Tata Motors, L&T, Mahindra), PSU careers through GATE (BHEL, IOCL, ONGC), or cross-disciplinary mechatronics and computational fluid dynamics (CFD).",
    typicalSubjects: [
      "Thermodynamics & Heat Transfer",
      "Fluid Mechanics & Hydraulic Machinery",
      "Strength of Materials & Machine Design",
      "CAD/CAM (SolidWorks, AutoCAD, ANSYS)"
    ],
    keyExams: [
      "JEE Main & JEE Advanced (for IITs, NITs, IIITs)",
      "GATE Mechanical Engineering (for M.Tech and PSU recruitment like IOCL, NTPC, ONGC)",
      "State Engineering CETs (MHT-CET, WBJEE, KCET, TANCET)",
      "BITSAT / VITEEE / SRMJEEE"
    ],
    colleges: [
      { name: "IIT Madras / IIT Roorkee / IIT Kharagpur", context: "Historic engineering powerhouses with cutting-edge manufacturing workshops, wind tunnels, and heavy machinery research." },
      { name: "NIT Trichy / NIT Surathkal", context: "Premier National Institutes of Technology with outstanding core engineering placement records in manufacturing and energy." },
      { name: "College of Engineering, Pune (COEP Technological University)", context: "Top Maharashtra state institute with extensive industrial partnerships across Pune's manufacturing and automotive hub." },
      { name: "Delhi Technological University (DTU)", context: "Renowned mechanical engineering department with famous student formula racing teams and heavy industry research." }
    ],
    ncoCode: "2144.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2144 - Mechanical Engineers", url: "https://www.ncs.gov.in" },
      { name: "All India Council for Technical Education (AICTE)", url: "https://www.aicte-india.org" }
    ]
  },

  "civil-engineer": {
    listName: "Civil Engineer",
    title: "Civil Engineer in India: Infrastructure, Structural Design & ESE/PSU Path",
    metaDescription:
      "How to become a Civil Engineer in India: Structural analysis, surveying, B.Tech Civil, UPSC ESE (IES), GATE PSU routes, and top institutions.",
    intro:
      "Civil Engineers plan, design, construct, and maintain the nation's physical infrastructure including highways, metro rail networks, bridges, high-rise buildings, and water resource systems. In India's massive infrastructure boom (Bharatmala, dedicated freight corridors, smart cities), civil engineers work in structural design, geotechnical engineering, construction management, and urban transport. Entry is through a 4-year B.Tech in Civil Engineering. Career avenues include private EPC contractors (L&T, Shapoorji Pallonji), government engineering services through UPSC ESE (Indian Engineering Services), and public sector units via GATE.",
    typicalSubjects: [
      "Structural Analysis & Reinforced Concrete Design (RCC)",
      "Geotechnical & Foundation Engineering",
      "Surveying, Geomatics & GIS Mapping",
      "Hydrology & Environmental Water Resources"
    ],
    keyExams: [
      "JEE Main & JEE Advanced (B.Tech Civil)",
      "UPSC Engineering Services Examination (ESE / IES)",
      "GATE Civil Engineering (for NBCC, NHAI, DMRC, IOCL recruitments)",
      "State PSC Assistant Engineer (AE / JE) Exams"
    ],
    colleges: [
      { name: "IIT Roorkee", context: "Asia's oldest civil engineering college (est. 1847) with legendary earthquake engineering, hydraulic, and structural laboratories." },
      { name: "IIT Delhi / IIT Bombay", context: "Apex research in smart infrastructure, transportation engineering, and geotechnical simulation." },
      { name: "National Institute of Construction Management and Research (NICMAR Pune)", context: "India's leading post-graduate institute dedicated to advanced construction project management." },
      { name: "Jadavpur University (Kolkata)", context: "Top-tier state engineering department with low tuition fees and stellar structural engineering research." }
    ],
    ncoCode: "2142.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2142 - Civil Engineers", url: "https://www.ncs.gov.in" },
      { name: "Union Public Service Commission (UPSC ESE)", url: "https://upsc.gov.in" }
    ]
  },

  "electrical-engineer": {
    listName: "Electrical Engineer",
    title: "Electrical Engineer in India: Power Systems, Renewable Energy & EV Grid",
    metaDescription:
      "Career pathway for Electrical Engineering in India: Power grids, renewable energy, electric vehicle power electronics, GATE, and degree roadmap.",
    intro:
      "Electrical Engineers design, develop, and supervise electrical power generation, transmission grids, control systems, and high-voltage industrial equipment. With India's rapid transition toward renewable solar/wind energy and Electric Vehicles (EV), electrical engineers lead power electronics design, battery management systems (BMS), smart grid integration, and substation automation. The standard path is a 4-year B.Tech in Electrical Engineering. Key career trajectories span power PSUs (PGCIL, NTPC, BHEL), renewable energy developers, EV manufacturing, and industrial automation firms (Siemens, ABB).",
    typicalSubjects: [
      "Power Systems Engineering & High Voltage Transmission",
      "Power Electronics & Drives (Inverters, Converters, EV motor control)",
      "Control Systems & Signal Processing",
      "Electrical Machines (Transformers, Induction & Synchronous Motors)"
    ],
    keyExams: [
      "JEE Main & JEE Advanced (B.Tech Electrical)",
      "GATE Electrical Engineering (for Power Grid, NTPC, BHEL, POSOCO)",
      "UPSC ESE (Electrical Engineering discipline)",
      "State Electricity Board Assistant Engineer (AE) Exams"
    ],
    colleges: [
      { name: "IIT Kharagpur / IIT Kanpur", context: "Historic electrical engineering schools with premier research in smart grids, microgrids, and high-voltage testing." },
      { name: "IIT Madras (Center for Battery Engineering and Electric Vehicles)", context: "India's leading research centre for electric vehicle battery systems and power electronics." },
      { name: "NIT Trichy", context: "Consistently top-ranked NIT with exceptional core electrical placement records across global power engineering firms." },
      { name: "VJTI Mumbai", context: "Historic institute with deep ties to Western India's power utility grid and electrical infrastructure industries." }
    ],
    ncoCode: "2151.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2151 - Electrical Engineers", url: "https://www.ncs.gov.in" },
      { name: "Central Electricity Authority (CEA India)", url: "https://cea.nic.in" }
    ]
  },

  "electronics-engineer": {
    listName: "Electronics Engineer",
    title: "Electronics Engineer (ECE) in India: VLSI, Embedded Systems & 5G Telecom",
    metaDescription:
      "Guide to Electronics & Communication Engineering (ECE) in India: Semiconductor chip design, VLSI, embedded firmware, 5G, and B.Tech roadmap.",
    intro:
      "Electronics and Communication Engineers (ECE) design semiconductor chips, integrated circuits (ICs), embedded hardware, and wireless telecommunications equipment. Driven by the India Semiconductor Mission (ISM) and domestic electronics manufacturing, VLSI (Very Large Scale Integration) chip design and embedded firmware engineering are experiencing unprecedented demand. Educational entry is through a 4-year B.Tech in Electronics and Communication Engineering. Career options include global semiconductor design centres (Qualcomm, Intel, Texas Instruments), telecom equipment providers, and consumer electronics hardware firms.",
    typicalSubjects: [
      "Digital Electronics & Microprocessors (ARM, RISC-V)",
      "Analog Circuit Design & Signal Processing",
      "VLSI Design (Verilog / VHDL, CMOS Technology)",
      "Wireless & Optical Communication (5G, RF Systems)"
    ],
    keyExams: [
      "JEE Main & JEE Advanced (for B.Tech ECE in IITs/NITs)",
      "GATE Electronics and Communication Engineering (EC)",
      "State Engineering CETs (MHT-CET, WBJEE, KCET)",
      "BITSAT / VITEEE"
    ],
    colleges: [
      { name: "IIT Kharagpur / IIT Bombay", context: "Pioneering microelectronics and VLSI design labs with direct fabrication and tape-out partnerships." },
      { name: "IIIT Bangalore / IIIT Hyderabad (VLSI & Embedded Systems)", context: "Top computing and hardware institutes with world-class chip design and electronic design automation (EDA) tools." },
      { name: "NIT Surathkal / NIT Warangal", context: "Leading National Institutes of Technology with dedicated semiconductor recruitment from top global fabless companies." },
      { name: "Netaji Subhas University of Technology (NSUT Delhi)", context: "Top Delhi university with legendary electronics and communications placement track records." }
    ],
    ncoCode: "2152.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / MeitY",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2152 - Electronics Engineers", url: "https://www.ncs.gov.in" },
      { name: "India Semiconductor Mission (ISM)", url: "https://ism.gov.in" }
    ]
  },

  "aeronautical-engineer": {
    listName: "Aeronautical Engineer",
    title: "Aeronautical Engineer in India: Aircraft Design, ISRO/DRDO & Propulsion",
    metaDescription:
      "How to become an Aeronautical/Aerospace Engineer in India: Aerodynamics, jet propulsion, ISRO/DRDO careers, and B.Tech Aerospace colleges.",
    intro:
      "Aeronautical and Aerospace Engineers research, design, manufacture, and test commercial aircraft, military fighter jets, unmanned aerial vehicles (UAVs / drones), and space launch vehicles. In India, aerospace engineers contribute to national defense aviation (HAL, DRDO), space exploration missions (ISRO), and commercial airline maintenance, repair, and overhaul (MRO) facilities. Educational entry is via a 4-year B.Tech in Aerospace or Aeronautical Engineering. Key career paths include defense research scientists via DRDO SET/GATE, ISRO Scientist/Engineer 'SC' posts through ICRB exams, and aerospace simulation roles.",
    typicalSubjects: [
      "Aerodynamics & Compressible Flow",
      "Aircraft Structures & Composite Materials",
      "Flight Mechanics & Aircraft Stability/Control",
      "Rocket & Jet Propulsion Systems"
    ],
    keyExams: [
      "JEE Advanced (for B.Tech Aerospace in IITs & IIST Thiruvananthapuram)",
      "JEE Main & State Engineering CETs",
      "GATE Aerospace Engineering (AE)",
      "ISRO Centralised Recruitment Board (ICRB) Exam"
    ],
    colleges: [
      { name: "Indian Institute of Space Science and Technology (IIST Thiruvananthapuram)", context: "Asia's first space university with direct absorption channels into ISRO centers for top-merit graduates." },
      { name: "IIT Kanpur / IIT Madras / IIT Bombay", context: "World-class aerospace departments equipped with national wind tunnels, flight testing aircraft, and propulsion test beds." },
      { name: "Madras Institute of Technology (MIT Anna University, Chennai)", context: "Historic aeronautical engineering institution where Dr. APJ Abdul Kalam studied aeronautics." },
      { name: "Punjab Engineering College (PEC Chandigarh)", context: "Renowned aerospace engineering department with historic defense and civil aviation alumni networks." }
    ],
    ncoCode: "2144.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / DGCA",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2144 - Aeronautical Engineers", url: "https://www.ncs.gov.in" },
      { name: "Indian Space Research Organisation (ISRO)", url: "https://www.isro.gov.in" }
    ]
  },

  "chemical-engineer": {
    listName: "Chemical Engineer",
    title: "Chemical Engineer in India: Petrochemicals, Pharmaceuticals & Process Design",
    metaDescription:
      "Career guide for Chemical Engineering in India: Mass transfer, process simulation (Aspen Plus), petrochemicals, pharmaceuticals, and GATE PSU path.",
    intro:
      "Chemical Engineers transform raw materials into valuable industrial products through chemical, physical, and biological processes. In India, chemical engineers work in petrochemical refineries (Reliance, IOCL), pharmaceutical bulk drug manufacturing, specialty chemicals, fertilizers, and green hydrogen production. Standard preparation involves a 4-year B.Tech in Chemical Engineering. Career avenues span process engineering, plant operations, environmental sustainability, and PSU recruitments through GATE.",
    typicalSubjects: [
      "Chemical Reaction Engineering & Kinetics",
      "Mass Transfer & Separation Processes",
      "Heat Transfer & Thermodynamics",
      "Process Dynamics, Control & Plant Safety"
    ],
    keyExams: [
      "JEE Main & JEE Advanced (for IITs/NITs)",
      "MHT-CET (for premier Institute of Chemical Technology - ICT Mumbai)",
      "GATE Chemical Engineering (CH) for PSUs (IOCL, BPCL, HPCL, GAIL, ONGC)",
      "State Engineering CETs"
    ],
    colleges: [
      { name: "Institute of Chemical Technology (ICT Mumbai)", context: "India's supreme chemical technology university with unmatched global research, patent outputs, and industry royalty revenues." },
      { name: "IIT Bombay / IIT Roorkee / IIT Delhi", context: "Premier chemical engineering departments with state-of-the-art process synthesis and energy storage laboratories." },
      { name: "NIT Rourkela / NIT Tiruchirappalli", context: "Top National Institutes of Technology located near India's major industrial and steel belts with high placement records." },
      { name: "Laxminarayan Institute of Technology (LIT Nagpur)", context: "Renowned century-old public chemical engineering and technology university in Central India." }
    ],
    ncoCode: "2145.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2145 - Chemical Engineers", url: "https://www.ncs.gov.in" },
      { name: "Indian Institute of Chemical Engineers (IIChE)", url: "https://www.iiche.org.in" }
    ]
  },

  "automobile-engineer": {
    listName: "Automobile Engineer",
    title: "Automobile Engineer in India: Vehicle Dynamics, EV Powertrain & Testing",
    metaDescription:
      "Path to becoming an Automobile Engineer in India: Chassis design, EV battery powertrains, ARAI testing, and top automotive engineering colleges.",
    intro:
      "Automobile Engineers design, test, manufacture, and service motor vehicles, subsystems, and electric mobility platforms. With India becoming the world's 3rd largest automotive market, engineers develop internal combustion engines, electric vehicle (EV) battery packs, regenerative braking, collision safety systems, and autonomous driver-assistance features (ADAS). Entry requires a 4-year B.Tech in Automobile or Mechanical Engineering. Career opportunities exist in major automotive OEMs (Tata Motors, Mahindra, Maruti Suzuki, Hyundai), EV startups, and testing agencies like ARAI.",
    typicalSubjects: [
      "Automotive Chassis, Body & Suspension Design",
      "Internal Combustion Engines & EV Electric Powertrains",
      "Vehicle Dynamics, NVH (Noise, Vibration & Harshness)",
      "Automotive Safety, Crash Testing & Emission Regulations"
    ],
    keyExams: [
      "JEE Main & State Engineering CETs (MHT-CET, KCET, TANCET)",
      "GATE Mechanical Engineering (for automotive R&D master's programmes)",
      "University Engineering Entrances (SRMJEEE, VITEEE, MET)"
    ],
    colleges: [
      { name: "Madras Institute of Technology (Anna University, Chennai)", context: "Pioneer in automotive engineering education in India located in the heart of South Asia's Detroit (Chennai)." },
      { name: "ARAI Academy (Automotive Research Association of India, Pune)", context: "Apex national automotive testing body offering specialized industry-integrated master's and bachelor's tracks." },
      { name: "COEP Technological University (Pune)", context: "Top government institute with historic ties to Western India's automotive OEM ecosystem (Tata, Bajaj, Bharat Forge)." },
      { name: "PSG College of Technology (Coimbatore)", context: "Distinguished automotive department with dedicated engine testing cells and advanced simulation facilities." }
    ],
    ncoCode: "2144.0300",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / Ministry of Heavy Industries",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2144 - Automotive Engineers", url: "https://www.ncs.gov.in" },
      { name: "Automotive Research Association of India (ARAI)", url: "https://www.araiindia.com" }
    ]
  },

  "petroleum-engineer": {
    listName: "Petroleum Engineer",
    title: "Petroleum Engineer in India: Oil & Gas Exploration, Drilling & ONGC Path",
    metaDescription:
      "Complete roadmap to Petroleum Engineering in India: Reservoir engineering, offshore drilling, GATE for ONGC/OIL, and RGIPT/IIT ISM Dhanbad.",
    intro:
      "Petroleum Engineers locate, extract, and produce crude oil, natural gas, and geothermal energy from subsurface reservoirs. In India, petroleum engineers handle offshore drilling (Bombay High, KG Basin), reservoir simulation, well completion, and enhanced oil recovery. The educational foundation is a 4-year B.Tech in Petroleum Engineering. The sector offers high starting compensations, with major recruitments by national oil companies (ONGC, Oil India Limited) via GATE, and international energy conglomerates (Schlumberger, Baker Hughes, Halliburton, Shell).",
    typicalSubjects: [
      "Reservoir Engineering & Subsurface Fluid Flow",
      "Drilling Engineering & Well Completion Technology",
      "Petroleum Production Operations & Surface Facilities",
      "Geology, Geophysics & Well Logging Analysis"
    ],
    keyExams: [
      "JEE Advanced (for IIT ISM Dhanbad & RGIPT)",
      "JEE Main & State CETs (for specialized petroleum universities)",
      "GATE Petroleum Engineering (PE) for ONGC, OIL, and IOCL PSU selections"
    ],
    colleges: [
      { name: "IIT (ISM) Dhanbad (Indian School of Mines)", context: "India's historic premier institution for mineral and petroleum engineering with direct ONGC and multinational oilfield placements." },
      { name: "Rajiv Gandhi Institute of Petroleum Technology (RGIPT Amethi)", context: "Institute of National Importance established by the Ministry of Petroleum & Natural Gas, co-promoted by public energy PSUs." },
      { name: "Pandit Deendayal Energy University (PDEU Gandhinagar)", context: "Premier energy university in Gujarat with advanced offshore drilling simulators and petroleum research centres." },
      { name: "University of Petroleum and Energy Studies (UPES Dehradun)", context: "Established private energy institution offering specialized upstream, midstream, and downstream petroleum programs." }
    ],
    ncoCode: "2146.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / Ministry of Petroleum & Natural Gas",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2146 - Mining and Petroleum Engineers", url: "https://www.ncs.gov.in" },
      { name: "Directorate General of Hydrocarbons (DGH India)", url: "https://dghindia.gov.in" }
    ]
  },

  "robotics-engineer": {
    listName: "Robotics Engineer",
    title: "Robotics Engineer in India: Mechatronics, ROS, Kinematics & Automation",
    metaDescription:
      "Step-by-step path to Robotics Engineering in India: ROS, kinematics, microcontroller hardware, AI vision, and B.Tech Mechatronics/Robotics colleges.",
    intro:
      "Robotics Engineers design, construct, program, and maintain autonomous robots, industrial robotic arms, automated guided vehicles (AGVs), and humanoid systems. In India, robotics professionals work across automotive manufacturing automation, warehouse logistics (e-commerce fulfilment), defense drones, and surgical medical robotics. Educational pathways begin with B.Tech in Robotics, Mechatronics, Mechanical, or Electronics Engineering. Success requires cross-disciplinary mastery of kinematics, Robot Operating System (ROS), computer vision (OpenCV), embedded microcontrollers, and motion planning algorithms.",
    typicalSubjects: [
      "Robotic Kinematics, Dynamics & Motion Planning",
      "Mechatronics, Actuators & Sensor Interfacing",
      "Robot Operating System (ROS / ROS2) & C++/Python",
      "Computer Vision & SLAM (Simultaneous Localisation and Mapping)"
    ],
    keyExams: [
      "JEE Main & JEE Advanced (for IIT/NIT B.Tech Robotics & Mechanical)",
      "GATE Mechanical / Electronics / Computer Science",
      "State Engineering CETs (MHT-CET, KCET, WBJEE)"
    ],
    colleges: [
      { name: "IIT Kanpur (Center for Robotics & Automation)", context: "Leading national robotics research group working on planetary exploration rovers, legged robots, and aerial drones." },
      { name: "IIT Madras (Robotics and Machine Intelligence Lab)", context: "World-class robotics engineering labs with active deep-tech startup incubation (The IITM Research Park)." },
      { name: "IIIT Hyderabad (Robotics Research Center - RRC)", context: "Top Indian research centre specialising in mobile robotics, aerial robotics, and multi-agent coordination." },
      { name: "Manipal Institute of Technology (B.Tech Mechatronics)", context: "One of India's earliest and most established mechatronics engineering departments with modern automation labs." }
    ],
    ncoCode: "2144.0400",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2144 - Robotics and Mechatronics Engineers", url: "https://www.ncs.gov.in" },
      { name: "Robotics Society of India (RSI)", url: "https://rs-india.org" }
    ]
  },

  "marine-engineer": {
    listName: "Marine Engineer",
    title: "Marine Engineer in India: Merchant Navy, DG Shipping, MEO Exams & IMU CET",
    metaDescription:
      "How to become a Marine Engineer in India: Merchant Navy, IMU CET, B.Tech Marine Engineering, DG Shipping approval, and MEO class examinations.",
    intro:
      "Marine Engineers operate, service, and repair the propulsion machinery, electrical power plants, boilers, and auxiliary systems on board ocean-going merchant vessels (cargo ships, container carriers, oil tankers). In India, marine engineering is strictly regulated by the Directorate General of Shipping (DG Shipping). Candidates must complete a 4-year DG Shipping-approved B.Tech in Marine Engineering entered via the IMU CET. The career offers tax-free NRI foreign currency earnings during sailing, worldwide travel, and progression through official Ministry of Ports, Shipping and Waterways competency examinations (MEO Class IV to Class I Chief Engineer).",
    typicalSubjects: [
      "Marine Diesel Engines & Steam Turbines",
      "Marine Auxiliary Machinery & Refrigeration Plants",
      "Naval Architecture & Ship Construction/Stability",
      "Marine Electrical Technology, Automation & Safety (SOLAS/MARPOL)"
    ],
    keyExams: [
      "IMU CET (Indian Maritime University Common Entrance Test)",
      "DG Shipping Mandatory Medical Fitness Examination (strict eyesight norms)",
      "MEO Competency Examinations (conducted post-sea time for rank promotions)"
    ],
    colleges: [
      { name: "Marine Engineering and Research Institute (MERI Kolkata / IMU Kolkata)", context: "India's oldest and most prestigious marine engineering academy (est. 1949 DMET) with legendary global alumni admirals." },
      { name: "Tolani Maritime Institute (TMI Pune)", context: "Top private marine training academy with dedicated ship-in-campus facilities and high international shipping placement." },
      { name: "Indian Maritime University (IMU Chennai / Mumbai Campuses)", context: "Central Maritime University under the Ministry of Ports, Shipping and Waterways." },
      { name: "Coimbatore Marine College (CMC Coimbatore)", context: "DG Shipping-approved maritime training institution with full ship engine simulation labs." }
    ],
    ncoCode: "2144.0500",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Directorate General of Shipping (DG Shipping) / Ministry of Ports, Shipping and Waterways",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2144 - Marine Engineers", url: "https://www.ncs.gov.in" },
      { name: "Directorate General of Shipping, Govt. of India", url: "https://www.dgshipping.gov.in" }
    ]
  },

  "textile-engineer": {
    listName: "Textile Engineer",
    title: "Textile Engineer in India: Technical Textiles, Yarn Processing & Apparel Tech",
    metaDescription:
      "Career roadmap to Textile Technology in India: Fiber science, technical textiles, weaving, smart fabrics, and premier B.Tech Textile colleges.",
    intro:
      "Textile Engineers apply chemical and physical engineering principles to design, manufacture, and improve natural and synthetic fibers, yarns, technical textiles, and advanced apparel. India is the world's second-largest textile and apparel exporter, with modern growth concentrated in technical textiles (medical geotextiles, bulletproof composites, aerospace fabrics). Entry requires a 4-year B.Tech in Textile Technology or Fiber Science. Careers span textile manufacturing conglomerates (Reliance Textiles, Arvind Mills, Vardhman), export houses, and research laboratories (TRAs).",
    typicalSubjects: [
      "Fiber Science, Polymer Chemistry & Synthetic Fiber Production",
      "Yarn Manufacture & Spinning Technology",
      "Fabric Manufacture (Weaving, Knitting, Nonwovens)",
      "Textile Chemical Processing, Dyeing & Finishing"
    ],
    keyExams: [
      "JEE Main & JEE Advanced (for IIT Delhi Textile Department)",
      "GATE Textile Engineering and Fiber Science (TF)",
      "State Engineering CETs (MHT-CET, WBJEE, TANCET)"
    ],
    colleges: [
      { name: "IIT Delhi (Department of Textile and Fibre Engineering)", context: "India's premier academic research department dedicated to polymer chemistry, technical textiles, and smart clothing." },
      { name: "Institute of Chemical Technology (ICT Mumbai - Fibres and Textile Processing)", context: "Renowned globally for chemical processing of textiles, sustainable dyeing technology, and polymer coatings." },
      { name: "Veermata Jijabai Technological Institute (VJTI Mumbai - Textile Department)", context: "Historic Mumbai textile department (est. 1887) with deep industry roots across India's textile capital." },
      { name: "PSG College of Technology (Coimbatore)", context: "Leading Southern Indian textile engineering faculty situated in the Manchester of South India." }
    ],
    ncoCode: "2141.0300",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / Ministry of Textiles",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2141 - Textile Technology Engineers", url: "https://www.ncs.gov.in" },
      { name: "Ministry of Textiles, Government of India", url: "https://texmin.nic.in" }
    ]
  },

  "mining-engineer": {
    listName: "Mining Engineer",
    title: "Mining Engineer in India: Mineral Extraction, Blasting, Coal India & GATE",
    metaDescription:
      "Guide to Mining Engineering in India: Mineral exploration, surface/underground mining, Coal India PSU jobs, DGMS First Class Manager certification.",
    intro:
      "Mining Engineers plan, supervise, and execute the safe, sustainable extraction of metallic ores, non-metallic minerals, and coal from open-cast and underground mines. In India's mineral-rich states (Jharkhand, Odisha, Chhattisgarh, Rajasthan), mining engineers handle rock mechanics, explosive blasting design, mine ventilation, and environmental rehabilitation. The path requires a 4-year B.Tech in Mining Engineering. The sector provides direct public sector employment through Coal India Limited (CIL), NMDC, and Hindustan Zinc via GATE, with statutory career progression regulated by the Directorate General of Mines Safety (DGMS).",
    typicalSubjects: [
      "Surface & Underground Mining Methods",
      "Rock Mechanics, Ground Control & Strata Monitoring",
      "Mine Environmental Engineering, Ventilation & Safety",
      "Drilling, Blasting & Mineral Dressing Technology"
    ],
    keyExams: [
      "JEE Advanced (for IIT ISM Dhanbad, IIT Kharagpur, IIT BHU Mining)",
      "JEE Main (for NIT Rourkela, NIT Raipur, VNIT Nagpur)",
      "GATE Mining Engineering (MN) for Coal India, NMDC, NLC recruitments",
      "DGMS Statutory Competency Exams (Second Class & First Class Mine Manager)"
    ],
    colleges: [
      { name: "IIT (ISM) Dhanbad", context: "India's premier mining school (est. 1926) with extensive underground mine models, rock mechanics labs, and CIL recruitment dominance." },
      { name: "IIT Kharagpur (Department of Mining Engineering)", context: "India's oldest IIT mining department leading research in surface mining, mine safety automation, and geostatistics." },
      { name: "IIT (BHU) Varanasi", context: "Distinguished mining engineering department with deep research in rock fragmentation and blasting optimization." },
      { name: "NIT Rourkela / NIT Raipur", context: "Top National Institutes of Technology located adjacent to major mining belts with strong industry placements." }
    ],
    ncoCode: "2146.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Directorate General of Mines Safety (DGMS) / Ministry of Coal & Mines",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2146 - Mining Engineers", url: "https://www.ncs.gov.in" },
      { name: "Directorate General of Mines Safety (DGMS)", url: "https://www.dgms.gov.in" }
    ]
  },

  "industrial-engineer": {
    listName: "Industrial Engineer",
    title: "Industrial Engineer in India: Operations Research, Six Sigma & Supply Chain",
    metaDescription:
      "Path to becoming an Industrial Engineer in India: Operations research, supply chain optimization, Lean Six Sigma, and B.Tech Industrial colleges.",
    intro:
      "Industrial and Production Engineers optimize complex manufacturing processes, logistics networks, supply chain systems, and workplace ergonomics to eliminate waste (Lean), reduce costs, and maximize productivity. In India's manufacturing hubs and e-commerce supply chains (Amazon, Flipkart), industrial engineers design warehouse layouts, simulate factory line throughput, manage quality control (Six Sigma), and model operations research algorithms. Entry is via a 4-year B.Tech in Industrial Engineering or Production Engineering, followed by high-demand roles in supply chain planning and management consulting.",
    typicalSubjects: [
      "Operations Research & Mathematical Optimization",
      "Supply Chain Management & Logistics Logistics",
      "Work Study, Ergonomics & Quality Control (Six Sigma / TQM)",
      "Facilities Layout Design & Production Planning & Control (PPC)"
    ],
    keyExams: [
      "JEE Main & JEE Advanced (for IITs/NITs Industrial & Production Engineering)",
      "GATE Production and Industrial Engineering (PI)",
      "CAT (for premier post-graduate supply chain MBA / PGDIM at IIM Mumbai / NITIE)"
    ],
    colleges: [
      { name: "IIM Mumbai (formerly NITIE Mumbai)", context: "India's supreme national institute for industrial engineering and supply chain management with top tier-1 corporate leadership." },
      { name: "IIT Kharagpur (Department of Industrial & Systems Engineering)", context: "Pioneering Indian department dedicated to advanced operations research, quality engineering, and supply chain analytics." },
      { name: "PSG College of Technology (Coimbatore)", context: "Top autonomous engineering college with specialized industrial engineering production lines and lean simulation centers." },
      { name: "Delhi Technological University (DTU - Production & Industrial)", context: "Leading production engineering department with high campus recruitment in supply chain and operations consulting." }
    ],
    ncoCode: "2141.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2141 - Industrial and Production Engineers", url: "https://www.ncs.gov.in" },
      { name: "Indian Institution of Industrial Engineering (IIIE)", url: "https://www.iiie-india.com" }
    ]
  },

  "environmental-engineer": {
    listName: "Environmental Engineer",
    title: "Environmental Engineer in India: Water Treatment, ESG, Pollution Control & CPCB",
    metaDescription:
      "How to become an Environmental Engineer in India: Wastewater treatment, air pollution control, ESG consulting, CPCB jobs, and B.Tech Environmental.",
    intro:
      "Environmental Engineers apply engineering and biological principles to protect the environment, manage municipal waste, design effluent treatment plants (ETP), remediate contaminated sites, and assess corporate environmental impact (ESG compliance). Driven by strict National Green Tribunal (NGT) directives and corporate net-zero commitments, environmental engineers in India work for pollution control boards (CPCB, SPCB), environmental consulting firms, and green hydrogen projects. Entry begins with a 4-year B.Tech in Environmental Engineering or Civil/Chemical Engineering with environmental specializations.",
    typicalSubjects: [
      "Water Supply & Wastewater Treatment Engineering",
      "Air Pollution Monitoring, Control & Dispersion Modeling",
      "Solid & Hazardous Waste Management",
      "Environmental Impact Assessment (EIA) & Environmental Law"
    ],
    keyExams: [
      "JEE Main & JEE Advanced (for B.Tech Environmental Engineering)",
      "GATE Environmental Science & Engineering (ES)",
      "State Pollution Control Board (SPCB) Scientist / Assistant Environmental Engineer Exams"
    ],
    colleges: [
      { name: "IIT Bombay (Centre for Environmental Science and Engineering - CESE)", context: "Premier national environmental research center advising the Government of India on air quality and river rejuvenation." },
      { name: "IIT Roorkee / IIT Delhi", context: "Leading environmental engineering labs specializing in water purification, sewage treatment design, and circular economy." },
      { name: "National Environmental Engineering Research Institute (CSIR-NEERI Nagpur)", context: "Apex national laboratory providing specialized post-graduate and doctoral research in environmental pollution control." },
      { name: "Delhi Technological University (DTU - Department of Environmental Engineering)", context: "Pioneering undergraduate department with active field stations monitoring urban air and Yamuna river ecology." }
    ],
    ncoCode: "2143.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / Central Pollution Control Board (CPCB)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2143 - Environmental Engineers", url: "https://www.ncs.gov.in" },
      { name: "Central Pollution Control Board (CPCB India)", url: "https://cpcb.nic.in" }
    ]
  },

  "sound-engineer": {
    listName: "Sound Engineer",
    title: "Sound Engineer in India: Audio Mixing, Mastering, Film Acoustics & FTII",
    metaDescription:
      "Career pathway for Sound & Audio Engineers in India: Pro Tools, acoustic design, live sound, Bollywood/OTT audio post-production, and FTII/SRFTI.",
    intro:
      "Sound Engineers record, manipulate, mix, and master audio for cinema, OTT streaming platforms, music albums, television broadcasts, video games, and live concert venues. In India's massive film and music production industries (Bollywood, South Indian cinema, indie music), sound engineers manage recording studio acoustics, Foley sound design, multichannel Dolby Atmos mixing, and live festival sound reinforcement. Educational pathways include 3-year degrees or diplomas in Sound Recording & Design from apex national film institutes (FTII, SRFTI) or B.Sc in Sound Engineering.",
    typicalSubjects: [
      "Acoustics, Psychoacoustics & Studio Architectural Design",
      "Digital Audio Workstations (Pro Tools, Logic Pro) & Signal Processing",
      "Microphone Techniques, Preamp Electronics & Multi-track Recording",
      "Surround Sound, Dolby Atmos & Audio Post-Production for Film"
    ],
    keyExams: [
      "JET (Joint Entrance Test for FTII Pune & SRFTI Kolkata)",
      "Film and Television Institute Entrances (Whistling Woods, KRNNIVSA)",
      "University Sound Engineering Aptitude Interviews"
    ],
    colleges: [
      { name: "Film and Television Institute of India (FTII Pune)", context: "India's premier statutory film institute whose sound design alumni hold multiple National Film Awards and Oscar recognitions." },
      { name: "Satyajit Ray Film and Television Institute (SRFTI Kolkata)", context: "National institute offering world-class post-graduate diplomas in sound recording and audio design." },
      { name: "Whistling Woods International (Mumbai)", context: "Top private media and audio arts institute situated in Film City Mumbai with certified Dolby Atmos mixing studios." },
      { name: "A.R. Rahman's KM Music Conservatory (Chennai)", context: "Specialised music and audio technology conservatory offering contemporary audio engineering and sound design diplomas." }
    ],
    ncoCode: "3521.0300",
    skillLevel: "Level 3/4 (Diploma / Degree)",
    regulatoryBody: "Ministry of Information & Broadcasting / AICTE",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 3521 - Broadcasting and Audio-Visual Technicians", url: "https://www.ncs.gov.in" },
      { name: "Film and Television Institute of India (FTII)", url: "https://www.ftii.ac.in" }
    ]
  }
};
