/**
 * Portfolio Data for Prithvi Karagi
 * Strict single source of truth based solely on the provided resume.
 * No fabricated statistics, clients, accuracy metrics, or claims.
 */

export interface PersonalInfo {
  name: string;
  positioning: string;
  location: string;
  phone: string;
  email: string;
  linkedIn: string;
  linkedInUrl: string;
  github: string;
  githubUrl: string;
  summary: string;
  education: {
    institution: string;
    degree: string;
    location: string;
  };
  languages: {
    language: string;
    proficiency: string;
  }[];
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  isHero?: boolean;
  technologies: string[];
  description: string[];
  category: 'tourism' | 'healthcare' | 'machine-learning' | 'sustainability';
}

export interface ExperienceItem {
  id: string;
  company: string;
  parentOrg?: string;
  role: string;
  location?: string;
  date?: string;
  type: 'Internship' | 'Simulation' | 'Virtual Program';
  responsibilities: string[];
}

export interface ZoneConfig {
  id: 'hub' | 'code' | 'projects' | 'experience' | 'about' | 'contact';
  name: string;
  label: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  description: string;
}

export const PERSONAL_INFO: PersonalInfo = {
  name: 'PRITHVI KARAGI',
  positioning: 'B.Tech Computer Science Student & Founder',
  location: 'Bangalore, India',
  phone: '+91 7483629908',
  email: 'pkaragi5@gmail.com',
  linkedIn: 'linkedin.com/in/prithvi-karagi',
  linkedInUrl: 'https://linkedin.com/in/prithvi-karagi',
  github: 'github.com/pkaragi5',
  githubUrl: 'https://github.com/pkaragi5',
  summary:
    'Computer Science undergraduate at CMR University with experience in software engineering, backend development, AI, and machine learning. Built multiple real-world applications across healthcare, tourism, and sustainability using Python, Java, Spring Boot, Scikit-learn, and REST APIs. Passionate about designing scalable software systems and solving engineering problems through technology.',
  education: {
    institution: 'CMR University',
    degree: 'B.Tech Computer Science & Engineering',
    location: 'Bangalore, India',
  },
  languages: [
    { language: 'English', proficiency: 'Advanced' },
    { language: 'Hindi', proficiency: 'Proficient' },
    { language: 'Kannada', proficiency: 'Native' },
  ],
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Technical Skills',
    skills: [
      'Python',
      'Java',
      'HTML',
      'CSS',
      'JavaScript',
      'Machine Learning',
      'Data Analysis and Visualization',
      'REST APIs',
      'Git',
      'GitHub',
    ],
  },
  {
    category: 'Tools and Technologies',
    skills: [
      'Pandas',
      'NumPy',
      'Matplotlib',
      'Seaborn',
      'Power BI',
      'Scikit-learn',
    ],
  },
  {
    category: 'Soft Skills',
    skills: [
      'Leadership',
      'Communication',
      'Strategic Thinking',
      'Team Collaboration',
      'Entrepreneurship',
    ],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'tour-it',
    title: 'Tour It',
    subtitle: 'AI Tourism Platform',
    isHero: true,
    technologies: ['Python', 'AI', 'Firebase', 'REST APIs'],
    description: [
      'Designed an AI-powered tourism platform that generates personalized travel itineraries based on user preferences and budget.',
      'Developed intelligent recommendation workflows to automate travel planning and improve user experience.',
      'Built a scalable application architecture supporting future integrations with maps, hotels, and event recommendation systems.',
      'Focused on solving real-world tourism challenges through AI-driven personalization.',
    ],
    category: 'tourism',
  },
  {
    id: 'breast-cancer-prediction',
    title: 'Breast Cancer Prediction System',
    subtitle: 'Supervised ML Classifier',
    technologies: ['Python', 'Scikit-learn', 'Pandas'],
    description: [
      'Developed a supervised machine learning classifier for breast cancer prediction using Scikit-learn.',
      'Performed feature engineering, preprocessing, model training, and evaluation on medical datasets.',
      'Applied classification algorithms to improve prediction accuracy while following reproducible ML workflows.',
    ],
    category: 'healthcare',
  },
  {
    id: 'regression-pipeline',
    title: 'Regression Model Pipeline',
    subtitle: 'End-to-End Predictive Pipeline',
    technologies: ['Python', 'Machine Learning'],
    description: [
      'Designed an end-to-end regression pipeline including preprocessing, feature scaling, training, and prediction generation.',
      'Automated data preparation workflows, reducing manual analysis effort and improving reproducibility.',
      'Implemented regression models to generate predictive insights from structured datasets.',
    ],
    category: 'machine-learning',
  },
  {
    id: 'ecosort',
    title: 'EcoSort',
    subtitle: 'AI Waste Classification System',
    technologies: ['Python', 'YOLO', 'Streamlit'],
    description: [
      'Built an AI-powered waste classification system using computer vision for sustainable waste management.',
      'Trained and deployed YOLO models for real-time waste detection and classification.',
      'Developed an interactive Streamlit dashboard for model inference and visualization.',
    ],
    category: 'sustainability',
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'birla-pivot',
    company: 'Birla Pivot',
    parentOrg: 'Aditya Birla Group',
    role: 'Intern – Sales & Technology',
    location: 'Bangalore, India',
    type: 'Internship',
    responsibilities: [
      'Worked on real-time business projects involving lead enrichment, data management, and sales operations.',
      'Performed B2B research, lead qualification, and decision-maker identification using LinkedIn and business databases.',
      'Used Excel/CRM tools to validate, organize, and maintain business and customer data.',
      'Worked on programming and technical tasks, applying problem-solving and software development skills to real-world requirements.',
      'Conducted outbound business calls, qualified prospects, handled conversations, and scheduled sales calls for the sales team.',
    ],
  },
  {
    id: 'deloitte-simulation',
    company: 'Deloitte Australia',
    parentOrg: 'Forage Job Simulation',
    role: 'Data Analytics Job Simulation',
    date: 'August 13, 2026',
    type: 'Simulation',
    responsibilities: [
      'Completed a Deloitte job simulation involving data analysis and forensic technology.',
      'Created a data dashboard using Tableau.',
      'Used Excel to classify data and draw business conclusions.',
    ],
  },
  {
    id: 'jpmorgan-chase',
    company: 'JPMorgan Chase & Co.',
    parentOrg: 'Virtual Experience Program',
    role: 'Software Engineering Virtual Experience Program',
    type: 'Virtual Program',
    responsibilities: [
      'Developed REST API endpoints using Java and Spring Boot to simulate enterprise-scale financial services.',
      'Validated backend functionality through systematic testing and debugging, improving software reliability.',
      'Applied clean coding practices, debugging techniques, and enterprise software engineering workflows.',
      'Built production-style backend services following modular architecture and REST principles.',
    ],
  },
];

export const ZONES: ZoneConfig[] = [
  {
    id: 'hub',
    name: 'CENTRAL HUB',
    label: 'Overview',
    position: [0, 0, 0],
    cameraTarget: [0, 0, 0],
    cameraPosition: [0, 6, 12],
    description: 'Core nexus of engineering, AI systems, and venture building.',
  },
  {
    id: 'code',
    name: 'ZONE 01: CODE',
    label: 'Code',
    position: [-6.8, 0, -2.2],
    cameraTarget: [-6.8, 1.2, -2.2],
    cameraPosition: [-6.8, 2.6, 4.5],
    description: 'Technical competencies, programming languages, and tool suites.',
  },
  {
    id: 'projects',
    name: 'ZONE 02: PROJECTS',
    label: 'Projects',
    position: [0, 0, -7.5],
    cameraTarget: [0, 1.2, -7.5],
    cameraPosition: [0, 2.8, -1.0],
    description: 'Shipped platforms, AI diagnostic models, and automated engineering pipelines.',
  },
  {
    id: 'experience',
    name: 'ZONE 03: EXPERIENCE',
    label: 'Experience',
    position: [6.8, 0, -2.2],
    cameraTarget: [6.8, 1.2, -2.2],
    cameraPosition: [6.8, 2.6, 4.5],
    description: 'Professional timeline across Aditya Birla Group, Deloitte, and JPMorgan Chase.',
  },
  {
    id: 'about',
    name: 'ZONE 04: ABOUT',
    label: 'About',
    position: [-4.2, 0, 5.5],
    cameraTarget: [-4.2, 1.0, 5.5],
    cameraPosition: [-4.2, 2.4, 11.5],
    description: 'Foundational profile, CMR University B.Tech, and linguistics.',
  },
  {
    id: 'contact',
    name: 'ZONE 05: CONTACT',
    label: 'Contact',
    position: [4.2, 0, 5.5],
    cameraTarget: [4.2, 1.0, 5.5],
    cameraPosition: [4.2, 2.4, 11.5],
    description: 'Direct communication terminal and authenticated coordinates.',
  },
];
