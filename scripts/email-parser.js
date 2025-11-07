// Get email data from Gmail trigger - FIXED: using capitalized field names
const subject = $input.item.json.Subject || '';
const snippet = $input.item.json.snippet || '';
const from = $input.item.json.From || '';
const internalDate = $input.item.json.internalDate;

// Convert internalDate to MM-DD-YYYY format
let emailDate = new Date().toISOString(); // default to today
if (internalDate) {
  const date = new Date(parseInt(internalDate));
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  emailDate = `${month}-${day}-${year}`;
} else {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  emailDate = `${month}-${day}-${year}`;
}

// Extract ATS System - check BOTH sender domain AND email content
let atsSystem = 'Unknown';

// First, check sender domain (FIXED: workday pattern)
const atsDomains = {
  'greenhouse.io': 'Greenhouse',
  'lever.co': 'Lever',
  'jobs.lever.co': 'Lever',
  'workablemail.com': 'Workable',
  'workday': 'Workday',  // FIXED: catches myworkday.com and others
  'ashbyhq.com': 'Ashby',
  'ats.rippling.com': 'Rippling',
  'rippling.com': 'Rippling',
  'smartrecruiters.com': 'SmartRecruiters',
  'talent.icims.com': 'iCIMS',
  'icims.com': 'iCIMS'
};

for (const [domain, name] of Object.entries(atsDomains)) {
  if (from.toLowerCase().includes(domain)) {
    atsSystem = name;
    break;
  }
}

// If not found in domain, check email snippet/subject for ATS mentions
if (atsSystem === 'Unknown') {
  const fullText = (subject + ' ' + snippet).toLowerCase();
  
  const atsPatterns = {
    'Greenhouse': ['greenhouse'],
    'Lever': ['lever'],
    'Workable': ['workable'],
    'Workday': ['workday'],
    'Ashby': ['ashby'],
    'Rippling': ['rippling', 'ripplehire', 'powered by rippling'],
    'SmartRecruiters': ['smartrecruiters'],
    'iCIMS': ['icims'],
    'Oracle': ['oracle taleo', 'oracle cloud', 'taleo'],
    'Paylocity': ['paylocity'],
    'Jobvite': ['jobvite'],
    'UltiPro': ['ultipro', 'ukg'],
    'BambooHR': ['bamboohr'],
    'Jazz': ['jazz hr', 'jazzhr'],
    'Breezy': ['breezy hr', 'breezyhr'],
    'Recruiterbox': ['recruiterbox'],
    'Apply4U': ['apply4u'],
    'Fountain': ['fountain'],
    'Namely': ['namely']
  };
  
  for (const [ats, patterns] of Object.entries(atsPatterns)) {
    if (patterns.some(pattern => fullText.includes(pattern))) {
      atsSystem = ats;
      break;
    }
  }
}

// Detect email type
const rejectionKeywords = ['unfortunately', 'not moving forward', 'decided to pursue', 'filled the position', 'will not be moving forward', 'not be moving forward', 'have decided', 'other candidates', 'position you applied for has been'];
const interviewKeywords = ['schedule', 'interview', 'next steps', 'available for a call', 'like to speak', 'coordinate a time', 'set up a time'];

const fullText = (subject + ' ' + snippet).toLowerCase();
const isRejection = rejectionKeywords.some(keyword => fullText.includes(keyword));
const isInterview = interviewKeywords.some(keyword => fullText.includes(keyword));

// Extract company name - improved patterns
let companyName = 'Unknown';
const companyPatterns = [
  /application to ([A-Z][A-Za-z0-9\s&.,]+?) for/i,  // "application to [Company] for"
  /(?:at|from|with|to)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s+(?:team|regarding|for|about|application)|$)/i,
  /^([A-Z][A-Za-z0-9\s&]+?)(?:\s+[-–—]|\s+application|\s+job)/i  // Company at start of subject
];

for (const pattern of companyPatterns) {
  const match = subject.match(pattern) || snippet.match(pattern);
  if (match && match[1]) {
    companyName = match[1].trim();
    // Clean up common trailing words
    companyName = companyName.replace(/\s+(team|application|job|position|role)$/i, '');
    break;
  }
}

// Extract job title - improved patterns
let jobTitle = 'Unknown';
const titlePatterns = [
  /for the ([A-Z][A-Za-z0-9\s\-\/&]+?) position/i,  // "for the [Title] position"
  /(?:for|as)\s+(?:the\s+)?([A-Z][A-Za-z0-9\s\-\/&]+?)(?:\s+position|\s+role|$)/i,
  /application.*?(?:for|as|to)\s+([A-Z][A-Za-z0-9\s\-\/]+)/i
];

for (const pattern of titlePatterns) {
  const match = subject.match(pattern) || snippet.match(pattern);
  if (match && match[1]) {
    jobTitle = match[1].trim();
    // Clean up common trailing words
    jobTitle = jobTitle.replace(/\s+(position|role|at|with)$/i, '');
    break;
  }
}

// Return structured data
return {
  json: {
    atsSystem: atsSystem,
    companyName: companyName,
    jobTitle: jobTitle,
    isRejection: isRejection,
    isInterview: isInterview,
    emailDate: emailDate,
    rawSubject: subject,
    rawSnippet: snippet.substring(0, 500),
    rawFrom: from
  }
};
