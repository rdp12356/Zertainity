import type { CareerRoleDetail } from "./types";

export const MEDICAL_CAREER_DETAILS: Record<string, CareerRoleDetail> = {
  "doctor-mbbs": {
    listName: "Doctor (MBBS)",
    title: "Doctor (MBBS) in India: NEET-UG, Medical College, Internship & PG Roadmap",
    metaDescription:
      "Complete guide to MBBS in India: NEET-UG scoring, 5.5-year curriculum, compulsory rotating medical internship, NMC regulations, and NEXT/NEET-PG.",
    intro:
      "Becoming a registered allopathic medical practitioner in India requires clearing the National Eligibility cum Entrance Test (NEET-UG), followed by a 4.5-year academic Bachelor of Medicine and Bachelor of Surgery (MBBS) degree and 1 year of compulsory rotating medical internship (CRMI). Regulated by the National Medical Commission (NMC), doctors diagnose illnesses, prescribe evidence-based medical treatments, conduct clinical interventions, and perform surgeries. The career demands intense academic stamina through preclinical (Anatomy, Physiology, Biochemistry), paraclinical (Pathology, Pharmacology, Microbiology), and clinical (Medicine, Surgery, OBGYN, Paediatrics) disciplines, followed by post-graduate super-specialization (MD/MS via INI-CET/NEET-PG).",
    typicalSubjects: [
      "Human Anatomy, Histology & Embryology",
      "Physiology & Biochemistry",
      "Pathology, Microbiology & Pharmacology",
      "General Medicine, Surgery, Obstetrics & Gynaecology, Paediatrics"
    ],
    keyExams: [
      "NEET-UG (National Eligibility cum Entrance Test for all MBBS/BDS seats)",
      "INI-CET (Institute of National Importance Combined Entrance Test for AIIMS, JIPMER, PGIMER, NIMHANS)",
      "NEET-PG / NExT (National Exit Test for Medical Post-Graduation & Licensing)"
    ],
    colleges: [
      { name: "All India Institute of Medical Sciences (AIIMS New Delhi & INIs)", context: "Apex statutory medical institution in India with subsidized education, supreme clinical research, and unmatched hospital case volume." },
      { name: "Christian Medical College (CMC Vellore)", context: "Centenary mission hospital and medical college renowned globally for ethical clinical training, community health, and haematology." },
      { name: "King George's Medical University (KGMU Lucknow) / MAMC New Delhi", context: "Historic government medical colleges with massive bed capacities providing intense bedside clinical exposure." },
      { name: "Armed Forces Medical College (AFMC Pune)", context: "Premier military medical institute commissioning medical graduates directly into the Indian Armed Forces Medical Services (AFMS)." }
    ],
    ncoCode: "2211.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "National Medical Commission (NMC)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2211 - General Medical Practitioners", url: "https://www.ncs.gov.in" },
      { name: "National Medical Commission (NMC India)", url: "https://www.nmc.org.in" },
      { name: "National Testing Agency (NEET-UG)", url: "https://neet.nta.nic.in" }
    ]
  },

  "dentist": {
    listName: "Dentist",
    title: "Dentist (BDS/MDS) in India: Dental Surgery, Orthodontics & DCI Roadmap",
    metaDescription:
      "How to become a Dental Surgeon in India: NEET-UG for BDS, clinical prosthodontics, oral surgery, Dental Council of India norms, and MDS specialisation.",
    intro:
      "Dentists (Bachelor of Dental Surgery - BDS) diagnose, treat, and prevent diseases, injuries, and malformations of the teeth, jaws, gums, and oral cavity. Regulated by the Dental Council of India (DCI), dental surgeons perform tooth extractions, root canal treatments (RCT), orthodontic teeth alignment, periodontal flap surgeries, dental implants, and cosmetic smile design. Entry is through NEET-UG into a 5-year program (4 years academic + 1 year rotating clinical internship). Many dentists establish private dental practices or pursue MDS (Master of Dental Surgery) in specializations like Orthodontics, Oral & Maxillofacial Surgery, and Conservative Dentistry.",
    typicalSubjects: [
      "Dental Anatomy, Embryology & Oral Histology",
      "Oral & Maxillofacial Pathology & Microbiology",
      "Prosthodontics, Crown & Bridge",
      "Orthodontics, Oral Surgery & Conservative Dentistry"
    ],
    keyExams: [
      "NEET-UG (for admission to government & private BDS colleges)",
      "NEET-MDS (for Master of Dental Surgery post-graduate specialties)",
      "State Dental Council Permanent Registration Examination"
    ],
    colleges: [
      { name: "Maulana Azad Institute of Dental Sciences (MAIDS New Delhi)", context: "India's consistently #1 ranked government dental institute with state-of-the-art specialized dental OPD clinics." },
      { name: "Manipal College of Dental Sciences (MCODS Manipal / Mangalore)", context: "Pioneering private dental college with international accreditations and advanced digital dentistry implantology labs." },
      { name: "Government Dental College and Hospital (GDC Mumbai / GDC Chennai)", context: "Historic public dental institutions providing enormous clinical patient flow for surgical extractions and prosthetics." },
      { name: "Faculty of Dental Sciences, King George's Medical University (KGMU Lucknow)", context: "Top government dental university known for maxillofacial surgery and trauma reconstructions." }
    ],
    ncoCode: "2261.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Dental Council of India (DCI)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2261 - Dentists", url: "https://www.ncs.gov.in" },
      { name: "Dental Council of India (DCI)", url: "https://dciindia.gov.in" }
    ]
  },

  "ayurvedic-doctor-bams": {
    listName: "Ayurvedic Doctor (BAMS)",
    title: "Ayurvedic Doctor (BAMS) in India: Traditional Medicine, NCISM & NEET-UG Path",
    metaDescription:
      "Complete guide to BAMS in India: Ayurvedic medicine, Panchakarma therapies, pharmacology (Dravyaguna), NCISM regulations, and NEET-UG entry.",
    intro:
      "Ayurvedic Doctors (Bachelor of Ayurvedic Medicine and Surgery - BAMS) practice traditional Indian holistic medicine, focusing on balancing the Tridoshas (Vata, Pitta, Kapha) through herbal pharmacology, dietary regulation, and therapeutic Panchakarma detoxification. Regulated by the National Commission for Indian System of Medicine (NCISM) under the Ministry of AYUSH, the 5.5-year BAMS curriculum integrates classical Sanskrit Ayurvedic texts (Charaka & Sushruta Samhita) with modern clinical diagnosis, anatomy, physiology, and minor surgery (Shalya Tantra). Career options include private Ayurvedic clinical practice, government AYUSH medical officer posts, wellness resorts, and pharmaceutical research.",
    typicalSubjects: [
      "Kriya Sharir (Ayurvedic Physiology) & Rachana Sharir (Anatomy)",
      "Dravyaguna Vigyan (Ayurvedic Herbal Pharmacology & Materia Medica)",
      "Kayachikitsa (Internal Medicine) & Panchakarma Procedures",
      "Shalya Tantra (Surgical Techniques) & Shalakya Tantra (ENT/Ophthalmology)"
    ],
    keyExams: [
      "NEET-UG (National Eligibility cum Entrance Test for all AYUSH/BAMS seats)",
      "AIAPGET (All India AYUSH Post Graduate Entrance Test for MD/MS Ayurveda)"
    ],
    colleges: [
      { name: "Institute of Teaching and Research in Ayurveda (ITRA Jamnagar)", context: "Institute of National Importance under Ministry of AYUSH, renowned for global clinical trials and authentic botanical drug research." },
      { name: "All India Institute of Ayurveda (AIIA New Delhi)", context: "Apex national tertiary care Ayurveda hospital integrating traditional therapies with modern diagnostic pathology." },
      { name: "Faculty of Ayurveda, Banaras Hindu University (BHU Varanasi)", context: "Historic university combining deep Sanskrit textual scholarship with extensive modern hospital clinical training." },
      { name: "Government Ayurvedic Medical College (Bengaluru / Thiruvananthapuram)", context: "Leading Southern Indian state colleges renowned for classical Kerala Panchakarma and Ayurvedic clinical protocols." }
    ],
    ncoCode: "2230.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "National Commission for Indian System of Medicine (NCISM) / Ministry of AYUSH",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2230 - Traditional and Complementary Medicine Professionals", url: "https://www.ncs.gov.in" },
      { name: "Ministry of AYUSH, Govt. of India", url: "https://ayush.gov.in" }
    ]
  },

  "homeopathic-doctor-bhms": {
    listName: "Homeopathic Doctor (BHMS)",
    title: "Homeopathic Doctor (BHMS) in India: Homeopathy, Organon, NCH & NEET Path",
    metaDescription:
      "How to become a Homeopathic Doctor in India: BHMS curriculum, Materia Medica, Organon of Medicine, NCH registration, and clinical practice.",
    intro:
      "Homeopathic Doctors (Bachelor of Homeopathic Medicine and Surgery - BHMS) practice individualized homeopathic medicine based on the principle of 'like cures like' (Similia Similibus Curentur) using ultra-diluted natural remedies. Regulated by the National Commission for Homeopathy (NCH) under the Ministry of AYUSH, the 5.5-year course covers homeopathic philosophy (Organon of Medicine), Homeopathic Materia Medica, and Repertory, alongside modern medical sciences (Pathology, Community Medicine, Forensic Medicine, Surgery). Practitioners establish private homeopathic clinics, work in AYUSH dispensaries, or join homeopathic pharmaceutical manufacturing companies.",
    typicalSubjects: [
      "Organon of Medicine & Homeopathic Philosophy",
      "Homeopathic Materia Medica & Pharmacodynamics",
      "Repertory & Case Taking Methodology",
      "Practice of Medicine, Obstetrics & Gynaecology, Surgery"
    ],
    keyExams: [
      "NEET-UG (All-India entrance for BHMS medical seats)",
      "AIAPGET (All India AYUSH Post Graduate Entrance Test for MD Homeopathy)"
    ],
    colleges: [
      { name: "National Institute of Homoeopathy (NIH Kolkata)", context: "Apex autonomous central institute under Ministry of AYUSH with the largest homeopathic indoor and outdoor hospital in Asia." },
      { name: "Nehru Homoeopathic Medical College and Hospital (New Delhi)", context: "Premier government homeopathic institution affiliated with University of Delhi providing heavy OPD clinical exposure." },
      { name: "Government Homoeopathic Medical College (Thiruvananthapuram / Kozhikode)", context: "Leading public homeopathic institutions with highly structured clinical repertorisation departments." },
      { name: "Dr. D.Y. Patil Homoeopathic Medical College (Pune)", context: "Top private institution with modern diagnostic facilities and extensive community outreach programs." }
    ],
    ncoCode: "2230.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "National Commission for Homoeopathy (NCH) / Ministry of AYUSH",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2230 - Traditional & Alternative Medicine Professionals", url: "https://www.ncs.gov.in" },
      { name: "National Commission for Homoeopathy (NCH)", url: "https://nch.org.in" }
    ]
  },

  "pharmacist": {
    listName: "Pharmacist",
    title: "Pharmacist in India: B.Pharm, Pharm.D, Drug Regulatory Affairs & PCI Path",
    metaDescription:
      "Guide to Pharmacy careers in India: B.Pharm, Pharm.D, GPAT exam for M.Pharm, clinical trials, and pharmaceutical manufacturing roles.",
    intro:
      "Pharmacists are medication experts responsible for the compounding, dispensing, clinical monitoring, and industrial manufacturing of therapeutic pharmaceuticals. In India's massive pharmaceutical sector (known as the 'Pharmacy of the World'), pharmacists work in drug formulation, quality assurance (QA/QC), clinical trials research, drug regulatory affairs (USFDA compliance), and hospital pharmacy management. Regulated by the Pharmacy Council of India (PCI), academic paths include the 4-year Bachelor of Pharmacy (B.Pharm) or the 6-year clinical Doctor of Pharmacy (Pharm.D), with advanced research avenues opened via GPAT (Graduate Pharmacy Aptitude Test).",
    typicalSubjects: [
      "Pharmaceutics & Industrial Drug Delivery Systems",
      "Pharmaceutical Chemistry, Medicinal Chemistry & Drug Design",
      "Pharmacology, Toxicology & Clinical Pharmacokinetics",
      "Pharmacognosy & Phytochemistry"
    ],
    keyExams: [
      "State Pharmacy CETs (MHT-CET, KCET, WBJEE, GUJCET)",
      "BITSAT (for B.Pharm at BITS Pilani & Hyderabad)",
      "GPAT (Graduate Pharmacy Aptitude Test by NBE for M.Pharm scholarships)",
      "NIPER JEE (National Institute of Pharmaceutical Education and Research Entrance)"
    ],
    colleges: [
      { name: "National Institute of Pharmaceutical Education and Research (NIPER Mohali / Hyderabad)", context: "Institutes of National Importance dedicated exclusively to advanced pharmaceutical research, bulk drugs, and regulatory science." },
      { name: "Institute of Chemical Technology (ICT Mumbai - Department of Pharmaceutical Sciences)", context: "Top pharmaceutical chemistry and drug delivery faculty with unmatched industrial patent transfers." },
      { name: "BITS Pilani (Department of Pharmacy)", context: "Premier private pharmacy institute with state-of-the-art analytical instrumentation and formulation laboratories." },
      { name: "Manipal College of Pharmaceutical Sciences (MCOPS Manipal)", context: "Consistently top-ranked NIRF pharmacy college with extensive global multinational pharmaceutical collaborations." }
    ],
    ncoCode: "2262.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Pharmacy Council of India (PCI)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2262 - Pharmacists", url: "https://www.ncs.gov.in" },
      { name: "Pharmacy Council of India (PCI)", url: "https://www.pci.nic.in" }
    ]
  },

  "nurse": {
    listName: "Nurse",
    title: "Nursing in India: B.Sc Nursing, AIIMS NORCET, INC Norms & Global Opportunities",
    metaDescription:
      "How to become a Registered Nurse in India: B.Sc Nursing, NEET/AIIMS Nursing entrances, clinical ICU care, and AIIMS NORCET officer exams.",
    intro:
      "Professional Nurses deliver critical patient care, administer IV therapies and medications, assist in complex surgical operations, monitor ICU vital telemetry, and manage emergency triage. Regulated by the Indian Nursing Council (INC) and State Nursing Registration Councils, the primary professional degree is the 4-year Bachelor of Science in Nursing (B.Sc Nursing). Nursing graduates enjoy immense domestic demand in tertiary hospitals and government medical institutes (via AIIMS NORCET recruitment), as well as unparalleled international emigration pathways (NCLEX for USA/Canada, OET/IELTS for UK, Ireland, Australia, and Gulf countries).",
    typicalSubjects: [
      "Anatomy, Physiology & Microbiology for Nursing",
      "Medical-Surgical Nursing & Intensive Critical Care",
      "Child Health (Paediatric) & Maternal Nursing (Midwifery & OBGYN)",
      "Mental Health Nursing & Community Health Nursing"
    ],
    keyExams: [
      "AIIMS B.Sc Nursing Entrance Examination",
      "NEET-UG (Mandatory for select central nursing colleges like JIPMER, MNS)",
      "State B.Sc Nursing Common Entrance Tests",
      "AIIMS NORCET (Nursing Officer Recruitment Common Eligibility Test for central government posts)"
    ],
    colleges: [
      { name: "College of Nursing, AIIMS New Delhi & INIs", context: "Apex government nursing colleges with rigorous high-dependency unit clinical training and direct central government recruitment." },
      { name: "College of Nursing, CMC Vellore", context: "India's pioneer in clinical nursing education with world-standard nurse-patient ratios and holistic compassionate care protocols." },
      { name: "College of Nursing, Armed Forces Medical College (AFMC Pune / MNS)", context: "Trains Commissioned Nursing Officers serving directly across military hospitals throughout India." },
      { name: "Manipal College of Nursing (MCON Manipal)", context: "Top-ranked private nursing institute with advanced patient simulation mannequins and global hospital affiliations." }
    ],
    ncoCode: "2221.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Indian Nursing Council (INC)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2221 - Nursing Professionals", url: "https://www.ncs.gov.in" },
      { name: "Indian Nursing Council (INC)", url: "https://www.indiannursingcouncil.org" }
    ]
  },

  "physiotherapist": {
    listName: "Physiotherapist",
    title: "Physiotherapist (BPT/MPT) in India: Sports Rehab, Orthopaedics & Neurological Care",
    metaDescription:
      "Step-by-step path to Physiotherapy in India: BPT degree, sports rehabilitation, manual therapy, clinical internship, and MPT specialization.",
    intro:
      "Physiotherapists (Bachelor of Physiotherapy - BPT) assess, diagnose, and rehabilitate patients suffering from physical movement dysfunctions resulting from sports injuries, neurological strokes, orthopaedic joint surgeries, and cardiopulmonary conditions. Using manual therapy techniques, therapeutic exercise regimens, electrotherapy modalities, and biomechanical posture retraining, physiotherapists restore functional independence without drugs or invasive surgery. The educational requirement is a 4.5-year BPT program (4 years academic + 6 months compulsory clinical internship), followed by MPT specializations in Sports Physiotherapy, Orthopaedics, or Neurology.",
    typicalSubjects: [
      "Human Anatomy, Biomechanics & Kinesiology",
      "Exercise Therapy & Manual Mobilisation Techniques",
      "Electrotherapy Modalities (Ultrasound, Laser, TENS, IFT)",
      "Orthopaedic, Neurological & Sports Physical Rehabilitation"
    ],
    keyExams: [
      "State Paramedical & Physiotherapy Common Entrance Tests (e.g. MH-CET, KCET)",
      "IPU CET (Guru Gobind Singh Indraprastha University New Delhi)",
      "NEET-UG (used by select state medical universities for BPT counselling)"
    ],
    colleges: [
      { name: "Pt. Deendayal Upadhyaya National Institute for Persons with Physical Disabilities (PDUNIPPD New Delhi)", context: "Apex central statutory institute specialising in physical rehabilitation, prosthetics, and advanced clinical physiotherapy." },
      { name: "Seth GS Medical College & KEM Hospital (Mumbai - School of Physiotherapy)", context: "India's oldest school of physiotherapy with enormous clinical trauma and post-operative ward exposure." },
      { name: "Manipal College of Health Professions (MCHP Manipal)", context: "State-of-the-art sports science rehabilitation laboratories, gait analysis clinics, and Olympic sports tie-ups." },
      { name: "Nizam's Institute of Medical Sciences (NIMS Hyderabad)", context: "Autonomous super-specialty hospital providing intensive stroke, spinal injury, and neuro-rehabilitation training." }
    ],
    ncoCode: "2264.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "National Commission for Allied and Healthcare Professions (NCAHP)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2264 - Physiotherapists", url: "https://www.ncs.gov.in" },
      { name: "Ministry of Health and Family Welfare (NCAHP Act)", url: "https://main.mohfw.gov.in" }
    ]
  },

  "medical-lab-technician": {
    listName: "Medical Lab Technician",
    title: "Medical Lab Technician (B.Sc MLT) in India: Clinical Diagnostics & Pathology",
    metaDescription:
      "Career roadmap for Medical Laboratory Technology in India: B.Sc MLT, automated biochemistry, haematology, microbiology, and diagnostic hospital labs.",
    intro:
      "Medical Laboratory Technicians (MLT / Clinical Laboratory Scientists) perform complex clinical laboratory tests on blood, tissue samples, and bodily fluids to assist physicians in the accurate diagnosis, monitoring, and prevention of diseases. In hospital diagnostic laboratories and pathology chains (Dr. Lal PathLabs, SRL, Metropolis), MLTs operate sophisticated automated analysers for haematology, clinical biochemistry, histopathology, molecular PCR testing, and blood bank cross-matching. The standard qualification is a 3 to 4-year B.Sc in Medical Laboratory Technology (B.Sc MLT).",
    typicalSubjects: [
      "Clinical Biochemistry & Automated Spectrophotometry",
      "Haematology, Coagulation & Blood Banking (Immunohematology)",
      "Microbiology, Parasitology & Virology",
      "Histopathology, Cytology & Molecular Diagnostics"
    ],
    keyExams: [
      "State Paramedical Board Entrance Examinations",
      "University B.Sc Allied Health Sciences Entrances",
      "CUET-UG (for central universities offering allied health sciences)"
    ],
    colleges: [
      { name: "Christian Medical College (CMC Vellore - Allied Health Sciences)", context: "Internationally accredited clinical pathology laboratories providing intensive practical diagnostic rotations." },
      { name: "All India Institute of Medical Sciences (AIIMS New Delhi - B.Sc MLT)", context: "Pioneering clinical diagnostic education in automated flow cytometry, molecular assays, and quality control." },
      { name: "PGIMER Chandigarh (School of Paramedical Sciences)", context: "Leading post-graduate medical research institute offering premier laboratory technology curricula." },
      { name: "Jamia Hamdard (School of Interdisciplinary Sciences, New Delhi)", context: "Well-established university with modern automated pathology and bioanalytical clinical labs." }
    ],
    ncoCode: "3212.0100",
    skillLevel: "Level 3/4 (Diploma / Degree)",
    regulatoryBody: "National Commission for Allied and Healthcare Professions (NCAHP)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 3212 - Medical and Pathology Laboratory Technicians", url: "https://www.ncs.gov.in" },
      { name: "National Accreditation Board for Testing and Calibration Laboratories (NABL)", url: "https://nabl-india.org" }
    ]
  },

  "radiologist": {
    listName: "Radiologist",
    title: "Radiologist in India: MBBS, MD Radio-Diagnosis, MRI/CT & Interventional Radiology",
    metaDescription:
      "Complete guide to becoming a Radiologist in India: MBBS, NEET-PG/INI-CET for MD Radio-Diagnosis, MRI/CT reporting, and interventional procedures.",
    intro:
      "Radiologists are specialist medical doctors (MBBS followed by MD/DNB in Radio-Diagnosis) who interpret medical imaging technologies—including X-rays, Ultrasound, Computed Tomography (CT), Magnetic Resonance Imaging (MRI), and PET scans—to diagnose complex pathologies. Interventional radiologists additionally perform minimally invasive image-guided surgical procedures (angioplasties, stent placements, biopsies). Radio-Diagnosis consistently ranks among the single most competitive and sought-after post-graduate branches in NEET-PG and INI-CET in India, requiring top percentile ranks post-MBBS.",
    typicalSubjects: [
      "Radio-Physics, Radiation Protection & Imaging Instrumentation",
      "Diagnostic Neuroradiology, Chest & Abdominal Imaging",
      "Musculoskeletal & Paediatric Radiology",
      "Vascular & Interventional Radiology"
    ],
    keyExams: [
      "NEET-UG (for foundational 5.5-year MBBS degree)",
      "INI-CET (Top percentile ranks required for MD Radio-Diagnosis in AIIMS/PGI)",
      "NEET-PG (Top rank cutoffs across national government medical colleges)"
    ],
    colleges: [
      { name: "Postgraduate Institute of Medical Education and Research (PGIMER Chandigarh)", context: "Asia's leading radio-diagnosis department equipped with advanced 3T MRI, dual-energy CT, and spectral imaging." },
      { name: "AIIMS New Delhi (Department of Radiodiagnosis and Interventional Radiology)", context: "Apex government department pioneering cutting-edge interventional oncology and diagnostic neuro-imaging." },
      { name: "Tata Memorial Hospital (TMH Mumbai - Radiology Department)", context: "India's premier cancer treatment centre offering world-class training in oncological imaging and PET-CT." },
      { name: "King George's Medical University (KGMU Lucknow)", context: "Massive trauma and tertiary diagnostic hospital with dedicated emergency radiology units." }
    ],
    ncoCode: "2212.0600",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "National Medical Commission (NMC)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2212 - Specialist Medical Practitioners", url: "https://www.ncs.gov.in" },
      { name: "Indian Radiological & Imaging Association (IRIA)", url: "https://iria.org.in" }
    ]
  },

  "veterinarian": {
    listName: "Veterinarian",
    title: "Veterinarian (B.V.Sc & AH) in India: Animal Health, Surgery & VCI Roadmap",
    metaDescription:
      "How to become a Veterinary Doctor in India: NEET-UG for B.V.Sc & AH, animal surgery, livestock healthcare, VCI registration, and IVRI institutes.",
    intro:
      "Veterinarians (Bachelor of Veterinary Science & Animal Husbandry - B.V.Sc & AH) diagnose, treat, and operate on domestic pets, livestock animals (cattle, poultry, swine), and wild animals. Regulated by the Veterinary Council of India (VCI), veterinary doctors conduct veterinary surgeries, manage animal disease outbreaks (zoonotic diseases like rabies, bird flu), ensure dairy livestock genetics, and oversee animal biosecurity. The degree requires a 5.5-year B.V.Sc & AH program entered via NEET-UG or state veterinary common entrance exams. Careers span companion pet clinics, government veterinary hospitals, dairy cooperatives (Amul), and wildlife conservation sanctuaries.",
    typicalSubjects: [
      "Veterinary Anatomy, Physiology & Biochemistry",
      "Veterinary Pathology, Microbiology & Parasitology",
      "Veterinary Pharmacology & Toxicology",
      "Veterinary Clinical Medicine, Surgery & Radiology, Animal Reproduction (Gynaecology)"
    ],
    keyExams: [
      "NEET-UG (Used for 15% All-India Quota seats filled by Veterinary Council of India - VCI)",
      "State Veterinary Entrance Examinations (e.g. KEAM, KCET, MHT-CET, RPVT)",
      "ICAR AIEEA-PG (for post-graduate M.V.Sc research admissions)"
    ],
    colleges: [
      { name: "Indian Veterinary Research Institute (ICAR-IVRI Bareilly)", context: "India's premier deemed veterinary university with world-renowned animal disease diagnostic laboratories and vaccines." },
      { name: "Guru Angad Dev Veterinary and Animal Sciences University (GADVASU Ludhiana)", context: "Leading Northern Indian veterinary university with super-specialty veterinary referral hospitals." },
      { name: "Tamil Nadu Veterinary and Animal Sciences University (TANUVAS Chennai)", context: "India's first autonomous veterinary university with top-tier small animal and wildlife medical centers." },
      { name: "Bombay Veterinary College (MAFSU Mumbai)", context: "Historic veterinary college (est. 1886) providing intense clinical exposure to companion pet medicine and equine surgery." }
    ],
    ncoCode: "2250.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Veterinary Council of India (VCI) / Ministry of Fisheries, Animal Husbandry & Dairying",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2250 - Veterinarians", url: "https://www.ncs.gov.in" },
      { name: "Veterinary Council of India (VCI)", url: "https://vci.dadf.gov.in" }
    ]
  },

  "psychologist-therapist": {
    listName: "Psychologist / Therapist",
    title: "Clinical Psychologist in India: B.A./B.Sc, M.Sc, M.Phil/Psy.D & RCI License",
    metaDescription:
      "Complete guide to becoming a Clinical Psychologist in India: B.A./B.Sc Psychology, M.Phil/Psy.D in Clinical Psychology, RCI licensing, and therapy.",
    intro:
      "Clinical Psychologists and Psychotherapists evaluate, diagnose, and treat mental health disorders, cognitive impairments, emotional distress, and behavioural dysfunctions using evidence-based psychotherapeutic modalities (CBT, DBT, psychodynamic therapy). In India, independent clinical practice and clinical psychodiagnostic assessment are strictly regulated by the Rehabilitation Council of India (RCI). The academic roadmap requires a Bachelor's in Psychology (B.A./B.Sc), followed by an M.A./M.Sc in Clinical/Applied Psychology, and an RCI-recognized M.Phil or Psy.D in Clinical Psychology to obtain a valid license number.",
    typicalSubjects: [
      "Psychopathology & Clinical Diagnostic Criteria (DSM-5 / ICD-11)",
      "Psychological Assessment & Psychometric Testing Tools",
      "Psychotherapeutic Interventions (Cognitive Behavioural Therapy, Humanistic)",
      "Neuropsychology, Biological Bases of Behaviour & Research Statistics"
    ],
    keyExams: [
      "CUET-UG (for B.A./B.Sc Psychology Honours in central universities)",
      "CUET-PG (for M.A./M.Sc Psychology in Delhi University, BHU, TISS)",
      "NIMHANS / CIP Entrance Examination (for RCI-recognized M.Phil / Psy.D Clinical Psychology)"
    ],
    colleges: [
      { name: "National Institute of Mental Health and Neurosciences (NIMHANS Bengaluru)", context: "Institute of National Importance and India's apex psychiatric and clinical psychological research center." },
      { name: "Central Institute of Psychiatry (CIP Ranchi)", context: "Historic national mental health institute with legendary clinical psychology and psychodiagnostic training." },
      { name: "Tata Institute of Social Sciences (TISS Mumbai)", context: "Leading social sciences university offering prestigious clinical and counselling psychology master's programs." },
      { name: "Delhi University (Lady Shri Ram College / Daulat Ram College - Psychology)", context: "India's top undergraduate psychology departments with rigorous academic foundations." }
    ],
    ncoCode: "2634.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Rehabilitation Council of India (RCI) / Ministry of Social Justice and Empowerment",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2634 - Psychologists", url: "https://www.ncs.gov.in" },
      { name: "Rehabilitation Council of India (RCI)", url: "https://rehabcouncil.nic.in" }
    ]
  },

  "nutritionist-dietitian": {
    listName: "Nutritionist / Dietitian",
    title: "Nutritionist & Dietitian in India: B.Sc/M.Sc Nutrition, Clinical Dietetics & IDA",
    metaDescription:
      "Career pathway for Clinical Dietitians & Nutritionists in India: B.Sc Clinical Nutrition, hospital dietetics internship, Registered Dietitian (RD) exam.",
    intro:
      "Dietitians and Nutritionists design evidence-based dietary regimens, medical nutrition therapies (MNT), and wellness plans to treat chronic metabolic diseases (diabetes, renal failure, cardiovascular disorders, obesity) and promote optimal nutritional health. In India, clinical dietitians manage inpatient hospital enteral/parenteral nutrition, sports athletes' macro-nutrient loading, and community maternal health programs. The standard path begins with a 3-year B.Sc in Food Science, Nutrition & Dietetics, followed by an M.Sc in Clinical Nutrition, a 6-month hospital internship, and clearing the Registered Dietitian (RD) examination conducted by the Indian Dietetic Association (IDA).",
    typicalSubjects: [
      "Human Nutritional Biochemistry & Macronutrient/Micronutrient Metabolism",
      "Medical Nutrition Therapy (Diet in Disease & Clinical Care)",
      "Food Microbiology, Preservation & Quality Assurance",
      "Community Nutrition, Public Health & Sports Nutrition"
    ],
    keyExams: [
      "CUET-UG / University Entrances (for B.Sc Nutrition & Dietetics)",
      "CUET-PG (for M.Sc Foods & Nutrition)",
      "Registered Dietitian (RD) Examination (Indian Dietetic Association - IDA)"
    ],
    colleges: [
      { name: "National Institute of Nutrition (ICMR-NIN Hyderabad)", context: "Apex national nutrition research laboratory conducting national nutritional surveys and post-graduate clinical training." },
      { name: "SNDT Women's University (Mumbai - Department of Food Science and Nutrition)", context: "Pioneering Indian nutrition faculty with deep ties to Mumbai's premier hospital clinical dietetics departments." },
      { name: "Lady Irwin College (University of Delhi - Department of Food and Nutrition)", context: "India's most prestigious home science and nutrition college with top research publications." },
      { name: "Mount Carmel College (Bengaluru - B.Sc/M.Sc Nutrition)", context: "Renowned institution offering advanced sports nutrition, food processing, and hospital internship pipelines." }
    ],
    ncoCode: "2265.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "National Commission for Allied and Healthcare Professions (NCAHP) / Indian Dietetic Association (IDA)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2265 - Dietitians and Nutritionists", url: "https://www.ncs.gov.in" },
      { name: "Indian Dietetic Association (IDA)", url: "https://idaindia.com" }
    ]
  },

  "optometrist": {
    listName: "Optometrist",
    title: "Optometrist (B.Optom) in India: Vision Care, Refraction & LVPEI Roadmap",
    metaDescription:
      "Step-by-step path to Optometry in India: B.Optom degree, refraction, contact lenses, low vision aids, and premier eye care institutes like LVPEI.",
    intro:
      "Optometrists (Bachelor of Optometry - B.Optom) are independent primary eye care practitioners who examine visual acuity, prescribe corrective eyeglasses and contact lenses, diagnose refractive errors, detect ocular diseases (cataracts, glaucoma, diabetic retinopathy), and manage binocular vision vision therapies. In India, optometrists work in eye hospitals, tertiary specialty clinics, contact lens manufacturing firms, and retail optical chains. The educational standard is a 4-year B.Optom program (3 years academic + 1 year comprehensive clinical internship at recognized eye institutes).",
    typicalSubjects: [
      "Ocular Anatomy, Physiology & Biochemistry of Vision",
      "Geometrical & Physical Optics, Ophthalmic Lenses",
      "Clinical Refraction, Contact Lens Fitting & Low Vision Aids",
      "Ocular Disease Diagnosis & Binocular Vision Disorders"
    ],
    keyExams: [
      "AIIMS Paramedical Entrance Examination (B.Sc Optometry)",
      "State Allied Health Science Common Entrance Tests",
      "LVPEI Optometry Entrance Test (for Brien Holden Institute of Optometry)"
    ],
    colleges: [
      { name: "Brien Holden Institute of Optometry and Vision Sciences (LV Prasad Eye Institute - LVPEI Hyderabad)", context: "World-renowned tertiary eye care institute providing supreme clinical optometry and surgical observation rotations." },
      { name: "Dr. Rajendra Prasad Centre for Ophthalmic Sciences (AIIMS New Delhi)", context: "Apex national eye care center offering top tier research and clinical refraction training." },
      { name: "Elite School of Optometry (Sankara Nethralaya Chennai)", context: "India's first professional school of optometry (est. 1985) in partnership with the legendary Sankara Nethralaya." },
      { name: "Manipal College of Health Professions (MCHP Manipal - B.Optom)", context: "Comprehensive optometry department with advanced corneal topography and ocular diagnostic equipment." }
    ],
    ncoCode: "2267.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "National Commission for Allied and Healthcare Professions (NCAHP)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2267 - Optometrists and Ophthalmic Opticians", url: "https://www.ncs.gov.in" },
      { name: "Optometry Council of India (OCI)", url: "https://optometrycouncilofindia.org" }
    ]
  },

  "speech-therapist": {
    listName: "Speech Therapist",
    title: "Audiologist & Speech Language Pathologist (BASLP) in India: AIISH & RCI Path",
    metaDescription:
      "Guide to Audiology & Speech Therapy in India: BASLP degree, speech pathology, hearing aids, cochlear implants, and AIISH Mysore.",
    intro:
      "Speech-Language Pathologists and Audiologists (Bachelor of Audiology and Speech-Language Pathology - BASLP) identify, assess, and treat communication disorders, speech dysfluencies (stuttering, articulation defects, cleft palate speech), voice pathologies, and hearing impairments across children and adults. In India, speech therapists fit hearing aids, map cochlear implants, and provide neuro-rehabilitation for stroke patients suffering from aphasia. Regulated by the Rehabilitation Council of India (RCI), the educational requirement is a 4-year BASLP program (3 years academic + 1 year clinical internship).",
    typicalSubjects: [
      "Anatomy & Physiology of Speech and Hearing Mechanisms",
      "Acoustics, Audiological Evaluation & Hearing Instrumentation",
      "Childhood Communication Disorders & Articulation Pathologies",
      "Adult Neurogenic Language Disorders & Dysphagia (Swallowing)"
    ],
    keyExams: [
      "AIISH All India Entrance Examination (conducted by AIISH Mysore)",
      "NEET-UG (Used by select state medical universities for BASLP admissions)",
      "IPU CET / State Paramedical Entrance Tests"
    ],
    colleges: [
      { name: "All India Institute of Speech and Hearing (AIISH Mysore)", context: "Apex autonomous national institute under Ministry of Health & Family Welfare, pioneering speech and audiology in South Asia." },
      { name: "Ali Yavar Jung National Institute of Speech and Hearing Disabilities (AYJNISHD Mumbai)", context: "Central statutory institute specialising in hearing impairment rehabilitation and speech pathology." },
      { name: "Postgraduate Institute of Medical Education and Research (PGIMER Chandigarh - BASLP)", context: "Premier medical research institute providing advanced clinical rotations in cochlear implant mapping and voice clinics." },
      { name: "Manipal College of Health Professions (MCHP Manipal - Department of Speech & Hearing)", context: "State-of-the-art audiology soundproof suites, speech analysis acoustic software, and multidisciplinary child clinics." }
    ],
    ncoCode: "2266.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Rehabilitation Council of India (RCI)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2266 - Audiologists and Speech Therapists", url: "https://www.ncs.gov.in" },
      { name: "All India Institute of Speech and Hearing (AIISH)", url: "https://aiishmysore.in" }
    ]
  },

  "healthcare-administrator": {
    listName: "Healthcare Administrator",
    title: "Healthcare Administrator in India: Hospital Management, NABH, MBA & Operations",
    metaDescription:
      "Career guide for Hospital Administration in India: MBA Hospital Management, NABH accreditation, patient flow, supply chain, and top healthcare institutes.",
    intro:
      "Healthcare Administrators and Hospital Managers oversee the operational, financial, legal, and clinical quality workflows of hospitals, diagnostic centers, and healthcare networks. In India's expanding corporate hospital sector (Apollo, Fortis, Max, Manipal Hospitals), administrators manage hospital bed occupancy, supply chain logistics (medical devices, oxygen plants), NABH/JCI hospital accreditation compliance, health insurance TPA billing, and clinical emergency staffing. Educational paths typically combine an undergraduate degree (MBBS, BDS, B.Pharm, B.Sc) with a specialized 2-year Master of Hospital Administration (MHA) or MBA in Hospital & Healthcare Management.",
    typicalSubjects: [
      "Hospital Operations, Layout Design & Clinical Engineering",
      "Healthcare Quality Management & NABH/JCI Accreditation Standards",
      "Health Economics, Medical Billing & Health Insurance / Ayushman Bharat",
      "Medico-Legal Aspects, Patient Rights & Hospital Bio-Medical Waste Norms"
    ],
    keyExams: [
      "CAT / XAT / CMAT (for MBA Healthcare Management in top B-schools)",
      "TISS NET / CUET-PG (for Master of Hospital Administration at TISS Mumbai)",
      "AIIMS MHA Post-Graduate Entrance Examination"
    ],
    colleges: [
      { name: "Tata Institute of Social Sciences (TISS Mumbai - School of Health Systems Studies)", context: "India's premier institution for Master of Hospital Administration (MHA) with unmatched corporate hospital placements." },
      { name: "All India Institute of Medical Sciences (AIIMS New Delhi - Department of Hospital Administration)", context: "Apex hospital administration residency training candidates inside India's largest public hospital complex." },
      { name: "Administrative Staff College of India (ASCI Hyderabad - Center for Healthcare Management)", context: "Renowned institution training senior hospital CEOs, government health secretaries, and international health consultants." },
      { name: "K.J. Somaiya Institute of Management (Mumbai - MBA Healthcare Management)", context: "Top business school offering specialized corporate hospital management and health-tech operations tracks." }
    ],
    ncoCode: "1342.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "NABH / Ministry of Health and Family Welfare",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 1342 - Health Services Managers", url: "https://www.ncs.gov.in" },
      { name: "National Accreditation Board for Hospitals & Healthcare Providers (NABH)", url: "https://nabh.co" }
    ]
  }
};
