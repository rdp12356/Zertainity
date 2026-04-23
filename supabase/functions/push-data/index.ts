import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CAREERS_DATA = [
  { name: "Software Engineer", category: "Technology", demand: "Very High", education: "B.Tech/B.E. Computer Science" },
  { name: "Data Scientist", category: "Technology", demand: "Very High", education: "B.Tech + Analytics/Statistics" },
  { name: "Data Engineer", category: "Technology", demand: "Very High", education: "B.Tech/MCA + Big Data" },
  { name: "UI/UX Designer", category: "Technology", demand: "High", education: "Design Degree/Portfolio" },
  { name: "Cybersecurity Analyst", category: "Technology", demand: "Very High", education: "B.Tech CS + Security Certifications" },
  { name: "Cloud Architect", category: "Technology", demand: "Very High", education: "B.Tech + AWS/Azure Certifications" },
  { name: "AI/ML Engineer", category: "Technology", demand: "Very High", education: "B.Tech/M.Tech AI/ML" },
  { name: "DevOps Engineer", category: "Technology", demand: "High", education: "B.Tech CS + DevOps Tools" },
  { name: "Mobile App Developer", category: "Technology", demand: "High", education: "B.Tech CS/BCA" },
  { name: "Game Developer", category: "Technology", demand: "Medium", education: "B.Tech CS + Game Design" },
  { name: "Blockchain Developer", category: "Technology", demand: "High", education: "B.Tech CS + Blockchain Auth" },
  { name: "Full Stack Developer", category: "Technology", demand: "Very High", education: "B.Tech/MCA/Bootcamp" },
  { name: "Network Administrator", category: "Technology", demand: "Medium", education: "B.Sc/B.Tech + CCNA" },
  { name: "Site Reliability Eng (SRE)", category: "Technology", demand: "High", education: "B.Tech + Server Tools" },
  { name: "Database Administrator", category: "Technology", demand: "High", education: "B.Tech/BCA/MCA" },
  { name: "Mechanical Engineer", category: "Engineering", demand: "High", education: "B.Tech Mechanical" },
  { name: "Civil Engineer", category: "Engineering", demand: "High", education: "B.Tech Civil" },
  { name: "Electrical Engineer", category: "Engineering", demand: "High", education: "B.Tech Electrical" },
  { name: "Electronics Engineer", category: "Engineering", demand: "High", education: "B.Tech Electronics (ECE)" },
  { name: "Aeronautical Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Aeronautical" },
  { name: "Chemical Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Chemical" },
  { name: "Automobile Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Automobile" },
  { name: "Petroleum Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Petroleum" },
  { name: "Robotics Engineer", category: "Engineering", demand: "High", education: "B.Tech Robotics/Mechatronics" },
  { name: "Marine Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Marine Engineering" },
  { name: "Industrial Engineer", category: "Engineering", demand: "High", education: "B.Tech Industrial" },
  { name: "Environmental Engineer", category: "Engineering", demand: "High", education: "B.Tech Environmental Eng" },
  { name: "Doctor (MBBS)", category: "Medical", demand: "Very High", education: "MBBS + MD/MS" },
  { name: "Dentist", category: "Medical", demand: "High", education: "BDS/MDS" },
  { name: "Ayurvedic Doctor (BAMS)", category: "Medical", demand: "High", education: "BAMS + MD Ayurveda" },
  { name: "Homeopathic Doctor (BHMS)", category: "Medical", demand: "High", education: "BHMS" },
  { name: "Pharmacist", category: "Medical", demand: "Medium", education: "B.Pharm/M.Pharm/D.Pharm" },
  { name: "Nurse", category: "Medical", demand: "High", education: "B.Sc Nursing / GNM" },
  { name: "Psychologist / Therapist", category: "Healthcare", demand: "High", education: "M.A./M.Sc Psychology + RCI" },
  { name: "Healthcare Administrator", category: "Healthcare", demand: "High", education: "MBA Hospital Management" },
  { name: "Chartered Accountant (CA)", category: "Finance", demand: "High", education: "CA Course (ICAI)" },
  { name: "Investment Banker", category: "Finance", demand: "High", education: "MBA Finance/CA/CFA" },
  { name: "Financial Analyst", category: "Finance", demand: "High", education: "BBA/MBA Finance/CFA" },
  { name: "Bank PO / Clerk", category: "Banking", demand: "Very High", education: "Any Degree + IBPS/SBI PO" },
  { name: "Business Analyst", category: "Business", demand: "High", education: "BBA/MBA/B.Tech" },
  { name: "Product Manager", category: "Business", demand: "Very High", education: "B.Tech + MBA / Certification" },
  { name: "Management Consultant", category: "Business", demand: "High", education: "MBA Top Tier" },
  { name: "Civil Services (IAS/IPS/IFS)", category: "Government", demand: "Very High", education: "Any Degree + UPSC CSE" },
  { name: "Defense Services (Army/Navy/AF)", category: "Government", demand: "High", education: "12th/Degree + NDA/CDS/AFCAT" },
  { name: "Staff Selection Commission (SSC)", category: "Government", demand: "Very High", education: "12th/Degree + SSC CGL/CHSL" },
  { name: "Litigation Lawyer", category: "Legal", demand: "High", education: "BA LLB/LLB" },
  { name: "Corporate Lawyer", category: "Legal", demand: "High", education: "BA LLB + Corp Law Specialization" },
  { name: "Judge / Magistrate", category: "Legal", demand: "High", education: "LLB + State Judicial Services Exam" },
  { name: "School Teacher (PGT/TGT)", category: "Education", demand: "Very High", education: "B.A/B.Sc + B.Ed + TET/CTET" },
  { name: "University Professor / Lecturer", category: "Education", demand: "High", education: "Masters + NET / PhD" },
  { name: "Research Scientist (DRDO/ISRO/CSIR)", category: "Science", demand: "High", education: "M.Sc/M.Tech/PhD" },
  { name: "Architect", category: "Design", demand: "High", education: "B.Arch + COA Registration" },
  { name: "Interior Designer", category: "Design", demand: "High", education: "B.Des Interior Design" },
  { name: "Fashion Designer", category: "Design", demand: "High", education: "B.Des Fashion (NIFT)" },
  { name: "Graphic Designer", category: "Design", demand: "High", education: "B.Des / Portfolio" },
  { name: "3D Animator / VFX Artist", category: "Design", demand: "High", education: "Animation Degree/Arena/MAAC" },
  { name: "Digital Marketing Manager", category: "Marketing", demand: "Very High", education: "BBA/MBA + Digital Certs" },
  { name: "SEO Specialist / Growth Hacker", category: "Marketing", demand: "High", education: "Any Degree + SEO Experience" },
  { name: "Brand Manager", category: "Marketing", demand: "High", education: "MBA Marketing" },
  { name: "B2B Sales Manager", category: "Marketing", demand: "Very High", education: "BBA/MBA/B.Tech" },
  { name: "Hotel Manager", category: "Hospitality", demand: "High", education: "BHM (Hotel Management)" },
  { name: "Chef / Culinary Artist", category: "Hospitality", demand: "High", education: "Diploma Culinary Arts / BHM" },
  { name: "Commercial Pilot", category: "Aviation", demand: "High", education: "12th PCM + CPL License" },
  { name: "Air Traffic Controller (ATC)", category: "Aviation", demand: "Medium", education: "B.Tech + AAI Training" },
  { name: "Aircraft Maintenance Engineer (AME)", category: "Aviation", demand: "Medium", education: "AME License (DGCA)" },
  { name: "Merchant Navy Officer (Deck/Engine)", category: "Maritime", demand: "High", education: "B.Sc Nautical Science / Marine Eng (IMU)" },
  { name: "Agricultural Officer", category: "Agriculture", demand: "High", education: "B.Sc Agriculture + IBPS AFO" },
  { name: "Sports Coach / PE Teacher", category: "Sports", demand: "High", education: "B.P.Ed / NIS Diploma" },
  { name: "Fitness Trainer / Yoga Instructor", category: "Sports", demand: "High", education: "Fitness Cert/Yoga Certification (QCI)" },
  { name: "Social Worker / NGO Admin", category: "Social Sciences", demand: "Medium", education: "BSW / MSW" },
  { name: "Policy Analyst", category: "Social Sciences", demand: "Medium", education: "Public Policy Degree" },
  { name: "Journalist / Reporter", category: "Media", demand: "Medium", education: "BJMC / Mass Communication" },
  { name: "Digital Content Writer / Copywriter", category: "Media", demand: "High", education: "Any Degree + Portfolio" },
  { name: "Film/Video Editor", category: "Media", demand: "High", education: "Editing Course / BFA" },
  { name: "Public Relations (PR) Manager", category: "Media", demand: "Medium", education: "MBA / Mass Comm" },
  { name: "Startup Founder / Entrepreneur", category: "Business", demand: "High", education: "Any Degree + Skill" },
  { name: "Supply Chain Manager", category: "Business", demand: "High", education: "MBA Operations/Logistics" },
  { name: "HR Manager", category: "Business", demand: "Medium", education: "MBA HR" },
  { name: "Operations Manager", category: "Business", demand: "High", education: "MBA Operations" },
];

const EXAMS_DATA = [
  { name: "JEE Main", authority: "National Testing Agency (NTA)", category: "Engineering" },
  { name: "JEE Advanced", authority: "IITs", category: "Engineering" },
  { name: "BITSAT", authority: "BITS Pilani", category: "Engineering" },
  { name: "VITEEE", authority: "VIT University", category: "Engineering" },
  { name: "SRMJEEE", authority: "SRM Institute", category: "Engineering" },
  { name: "COMEDK UGET", authority: "COMEDK", category: "Engineering" },
  { name: "MHT CET", authority: "Maharashtra State CET", category: "Engineering" },
  { name: "WBJEE", authority: "West Bengal Board", category: "Engineering" },
  { name: "KCET", authority: "Karnataka Examination Authority", category: "Engineering" },
  { name: "NEET UG", authority: "NTA", category: "Medical" },
  { name: "NEET PG", authority: "NBE", category: "Medical" },
  { name: "AIIMS MBBS", authority: "AIIMS", category: "Medical" },
  { name: "JIPMER", authority: "JIPMER", category: "Medical" },
  { name: "CAT", authority: "IIM", category: "Management" },
  { name: "XAT", authority: "XLRI", category: "Management" },
  { name: "MAT", authority: "AIMA", category: "Management" },
  { name: "SNAP", authority: "Symbiosis International University", category: "Management" },
  { name: "CMAT", authority: "AICTE", category: "Management" },
  { name: "CLAT", authority: "Consortium of NLUs", category: "Law" },
  { name: "AILET", authority: "NLU Delhi", category: "Law" },
  { name: "SLAT", authority: "Symbiosis International University", category: "Law" },
  { name: "NATA", authority: "Council of Architecture", category: "Design" },
  { name: "NID DAT", authority: "National Institute of Design", category: "Design" },
  { name: "UCEED", authority: "IIT Bombay", category: "Design" },
  { name: "GATE", authority: "IIT", category: "Engineering" },
  { name: "UPSC CSE", authority: "Union Public Service Commission", category: "Government" },
  { name: "SSC CGL", authority: "Staff Selection Commission", category: "Government" },
  { name: "SSC CHSL", authority: "Staff Selection Commission", category: "Government" },
  { name: "RRB NTPC", authority: "Railway Recruitment Board", category: "Government" },
  { name: "IBPS PO", authority: "Institute of Banking Personnel Selection", category: "Banking" },
  { name: "SBI PO", authority: "State Bank of India", category: "Banking" },
  { name: "NDA", authority: "UPSC", category: "Government" },
  { name: "CDS", authority: "UPSC", category: "Government" },
  { name: "CTET", authority: "Central Board of Secondary Education", category: "Education" },
  { name: "NET", authority: "NTA", category: "Education" },
  { name: "GRE", authority: "ETS", category: "Education" },
  { name: "GMAT", authority: "GMAC", category: "Management" },
  { name: "TOEFL", authority: "ETS", category: "Education" },
  { name: "IELTS", authority: "British Council/IDP", category: "Education" },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const results: Record<string, { success: number; failed: number }> = {};

    // Insert careers
    const { error: careersError } = await supabaseAdmin.from('careers').upsert(
      CAREERS_DATA.map(c => ({
        ...c,
        demand: c.demand as 'Very High' | 'High' | 'Medium' | 'Low',
      })),
      { onConflict: 'name' }
    ).select();
    
    results['careers'] = {
      success: careersError ? 0 : CAREERS_DATA.length,
      failed: careersError ? CAREERS_DATA.length : 0,
    };
    if (careersError) console.error('Careers error:', careersError);

    // Insert exams (only id, name, authority, category fields as per current schema)
    const examRecords = EXAMS_DATA.map(e => ({
      name: e.name,
      authority: e.authority,
      category: e.category,
    }));
    
    const { error: examsError } = await supabaseAdmin.from('exams').upsert(
      examRecords,
      { onConflict: 'name' }
    ).select();
    
    results['exams'] = {
      success: examsError ? 0 : EXAMS_DATA.length,
      failed: examsError ? EXAMS_DATA.length : 0,
    };
    if (examsError) console.error('Exams error:', examsError);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data pushed successfully',
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to push data';
    console.error('Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});