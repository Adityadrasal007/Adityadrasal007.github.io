/**
 * Tech Universe — single source of content truth.
 * Every section reads from here; copy comes from tech.txt.
 */
import {
  Boxes,
  BrainCircuit,
  Workflow,
  Users,
  Rocket,
  ScanEye,
  Megaphone,
  Trophy,
  MonitorSmartphone,
  Server,
  Database,
  Code2,
  GitBranch,
  Globe,
  Tag,
  Crop,
} from 'lucide-react';
import { RiOpenaiFill } from 'react-icons/ri';
import { VscVscode } from 'react-icons/vsc';
import { BsMicrosoftTeams } from 'react-icons/bs';
import {
  SiAnthropic,
  SiGooglegemini,
  SiOllama,
  SiLmstudio,
  SiOpenrouter,
  SiKaggle,
  SiRoboflow,
  SiCursor,
  SiIntellijidea,
  SiEclipseide,
  SiPycharm,
  SiJupyter,
  SiGooglecolab,
  SiNotion,
  SiJira,
  SiGoogle,
} from 'react-icons/si';
import { FaEnvelope, FaWhatsapp, FaLinkedinIn, FaGithub, FaInstagram } from 'react-icons/fa6';

import techPhoto from '../assets/tech.jpg';
import resumePdf from '../assets/Resume-Aditya.pdf';

import certMachineLearning from '../assets/Machine Learning Engineering.png';
import certSoftwareEngineering from '../assets/Software Engineering.png';
import certFoundationsPM from '../assets/Foundations of Project Management.png';
import certProjectPlanning from '../assets/Project Planning Putting It All Together.png';
import certProjectInitiation from '../assets/Project Initiation Starting a Successful Project.png';
import certAgileJira from '../assets/Agile with Atlassian Jira.png';
import certAgilePM from '../assets/Agile Project Management.png';
import certDjango from '../assets/Advanced Django Web Framework.png';
import certPython from '../assets/Python 3 Programming Specialization.png';

/* ------------------------------------------------------------------ */
/* Personal                                                            */
/* ------------------------------------------------------------------ */

export const profile = {
  name: 'Aditya Rasal',
  email: 'adityadrasal007@gmail.com',
  whatsapp: 'https://wa.me/919673736448',
  linkedin: 'https://linkedin.com/in/adityarasal007',
  github: 'https://github.com/Adityadrasal007',
  instagram: 'https://instagram.com/aditya_rasal007',
  photo: techPhoto,
  resume: resumePdf,
};

export const socialLinks = [
  { label: 'Email', href: `mailto:${profile.email}`, Icon: FaEnvelope },
  { label: 'WhatsApp', href: profile.whatsapp, Icon: FaWhatsapp },
  { label: 'LinkedIn', href: profile.linkedin, Icon: FaLinkedinIn },
  { label: 'GitHub', href: profile.github, Icon: FaGithub },
  { label: 'Instagram', href: profile.instagram, Icon: FaInstagram },
];

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const heroRoles = ['Computer Science Engineer', 'AI Project Manager', 'AI Engineer'];

/* ------------------------------------------------------------------ */
/* About — "Who am I?"                                                 */
/* ------------------------------------------------------------------ */

export const aboutSection = {
  title: 'Who am I?',
  subtitle: 'Solving business problems through technology one meaningful product at a time.',
  quote: 'Building meaningful software where engineering rigor meets real-world impact.',
};

export const aboutCards = {
  scalable: {
    Icon: Boxes,
    title: 'Scalable Applications',
    description:
      'I build robust, scalable applications engineered to grow — clean architecture, maintainable code, production-ready.',
  },
  ai: {
    Icon: BrainCircuit,
    title: 'Working with AI',
    description:
      'From computer vision to LLM-powered systems, I work at the frontier of applied artificial intelligence.',
  },
  automation: {
    Icon: Workflow,
    title: 'Automation',
    description:
      'I automate the repetitive so teams can focus on what matters — pipelines, workflows, and intelligent agents.',
  },
  teams: {
    Icon: Users,
    title: 'Managing Large Teams',
    description:
      'Leading 200+ person teams across technical events and projects, aligning people around a shared outcome.',
  },
  execution: {
    Icon: Rocket,
    title: 'Project Execution',
    description:
      'End-to-end ownership: planning, coordination, and delivery under pressure — ideas shipped, not shelved.',
  },
};

/* ------------------------------------------------------------------ */
/* Experience — "Where I've Made an Impact"                            */
/* ------------------------------------------------------------------ */

export const experiences = [
  {
    id: 'mahindra',
    Icon: ScanEye,
    title: 'Computer Vision Project Intern',
    organization: 'Mahindra & Mahindra',
    tag: 'Computer Vision & Edge AI',
    description:
      'Delivered a production-deployed YOLO crack-detection pipeline in under 3 months with live PLC integration (85% accuracy at 25 FPS). Automated shop-floor hooter alerting cutting response time by 70%, built Master Launcher managing 30 concurrent video pipelines, and architected an internal AutoML platform.',
  },
  {
    id: 'cultural-president',
    Icon: Trophy,
    title: 'Cultural President — Student Council',
    organization: 'Pimpri Chinchwad University',
    tag: 'Executive Leadership',
    description:
      'Directing a 150+ member student volunteer workforce across premier campus flagship initiatives including IDEATHON 2.0 and Pitch Fest, owning budgets, stakeholder relationships, and cross-functional team execution consistently delivering under budget.',
  },
  {
    id: 'pcu-anantam',
    Icon: Megaphone,
    title: 'Event Lead — Anantam Cultural Festival',
    organization: 'Pimpri Chinchwad University',
    tag: 'Scale & Operations',
    description:
      'Led a 2-day university festival across 3 consecutive editions, managing 200+ team members and coordinating budget, timelines, and vendor/stakeholder relationships for 6,000+ attendees with 100% on-time delivery.',
  },
  {
    id: 'ieee',
    Icon: Users,
    title: 'Event Manager & Technical Organizer',
    organization: 'IEEE Student Chapter',
    tag: 'Technical Strategy',
    description:
      'Coordinating cross-functional engineering teams and logistics to execute hackathons, technical paper meets, and innovation forums, bridging student engineering with real-world industry impact.',
  },
];

/* ------------------------------------------------------------------ */
/* Skills — "Technical Arsenal"                                        */
/* ------------------------------------------------------------------ */

export const skillCategories = [
  {
    id: 'ai-cv',
    Icon: ScanEye,
    name: 'AI & Computer Vision',
    hue: '#ffb224',
    skills: [
      'PyTorch (CUDA)',
      'YOLO (v8/v11/v26)',
      'OpenCV',
      'SAM-assisted Segmentation',
      'Real-Time Video Analytics',
      'Generative AI & LLMs',
      'LangChain & LangGraph',
      'Hugging Face',
    ],
  },
  {
    id: 'frontend',
    Icon: MonitorSmartphone,
    name: 'Frontend Engineering',
    hue: '#38bdf8',
    skills: [
      'React',
      'Vue.js',
      'JavaScript',
      'Tailwind CSS',
      'HTML5 & CSS3',
      'Responsive Design',
      'PyWebView',
    ],
  },
  {
    id: 'backend',
    Icon: Server,
    name: 'Backend & Edge Systems',
    hue: '#4ade80',
    skills: [
      'FastAPI',
      'Django',
      'Flask',
      'Node.js',
      'REST APIs',
      'PostgreSQL',
      'SQLite (WAL)',
      'SSE & Streaming',
    ],
  },
  {
    id: 'languages',
    Icon: Code2,
    name: 'Languages & ML Science',
    hue: '#60a5fa',
    skills: ['Python', 'JavaScript', 'SQL', 'scikit-learn', 'NumPy & Pandas'],
  },
  {
    id: 'pm',
    Icon: Users,
    name: 'AI Project Management',
    hue: '#eab308',
    skills: [
      'Agile & Scrum',
      'Atlassian Jira',
      'Stakeholder Management',
      'Risk Mitigation',
      'Cross-Functional Leadership (150+)',
    ],
  },
  {
    id: 'devops',
    Icon: GitBranch,
    name: 'Edge AI, Cloud & Tools',
    hue: '#f472b6',
    skills: [
      'Git & GitHub',
      'Linux',
      'OpenVINO',
      'TorchScript',
      'PLC Integration',
      'RTSP / Multi-Camera',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Tools — "Tools & Workflow I Use"                                    */
/* ------------------------------------------------------------------ */

export const toolsSection = {
  badge: 'My Arsenal',
  title: 'Tools & Workflow I Use',
  description:
    'An extensive ecosystem of AI models, development environments, and productivity platforms that power my daily workflow and drive innovation.',
};

// Row 1 — AI, ML and vision tools
export const toolsRow1 = [
  { name: 'ChatGPT', Icon: RiOpenaiFill, color: '#10a37f' },
  { name: 'Claude', Icon: SiAnthropic, color: '#d97757' },
  { name: 'Gemini', Icon: SiGooglegemini, color: '#4285f4' },
  { name: 'Ollama', Icon: SiOllama, color: '#ffffff' },
  { name: 'Open WebUI', Icon: Globe, color: '#3b82f6' },
  { name: 'LM Studio', Icon: SiLmstudio, color: '#8b5cf6' },
  { name: 'OpenRouter', Icon: SiOpenrouter, color: '#eab308' },
  { name: 'Kaggle', Icon: SiKaggle, color: '#20beff' },
  { name: 'Roboflow', Icon: SiRoboflow, color: '#e116a4' },
  { name: 'Label Studio', Icon: Tag, color: '#ff7b00' },
  { name: 'CVAT', Icon: Crop, color: '#007bff' },
];

// Row 2 — IDEs, notebooks and productivity
export const toolsRow2 = [
  { name: 'VS Code', Icon: VscVscode, color: '#007acc' },
  { name: 'Cursor', Icon: SiCursor, color: '#ffffff' },
  { name: 'IntelliJ IDEA', Icon: SiIntellijidea, color: '#ff318c' },
  { name: 'Eclipse', Icon: SiEclipseide, color: '#e5e2e1' },
  { name: 'PyCharm', Icon: SiPycharm, color: '#e5e2e1' },
  { name: 'Jupyter', Icon: SiJupyter, color: '#f37626' },
  { name: 'Google Colab', Icon: SiGooglecolab, color: '#f9ab00' },
  { name: 'Notion', Icon: SiNotion, color: '#ffffff' },
  { name: 'Jira', Icon: SiJira, color: '#2684ff' },
  { name: 'Microsoft Teams', Icon: BsMicrosoftTeams, color: '#7b83eb' },
  { name: 'Google Workspace', Icon: SiGoogle, color: '#4285f4' },
];

/* ------------------------------------------------------------------ */
/* Certifications — "Proof of Work"                                    */
/* ------------------------------------------------------------------ */

export const certifications = [
  {
    title: 'IBM Machine Learning',
    issuer: 'Coursera',
    image: certMachineLearning,
    url: 'https://coursera.org/share/7b43520f1463ce7ca54112642e89beba',
  },
  {
    title: 'Software Engineering',
    issuer: 'Coursera',
    image: certSoftwareEngineering,
    url: 'https://coursera.org/share/dbde08ed5f5f8d49e6a5423d02c3c409',
  },
  {
    title: 'Foundations of Project Management',
    issuer: 'Coursera',
    image: certFoundationsPM,
    url: 'https://coursera.org/share/ce8f64070935c48fc3ccedfc821693cd',
  },
  {
    title: 'Project Planning: Putting It All Together',
    issuer: 'Coursera',
    image: certProjectPlanning,
    url: 'https://coursera.org/share/a7f15a71f866e57260b87ee33712ebd6',
  },
  {
    title: 'Project Initiation: Starting a Successful Project',
    issuer: 'Coursera',
    image: certProjectInitiation,
    url: 'https://coursera.org/share/d256de4405258d2874ba3b869ec33272',
  },
  {
    title: 'Agile with Atlassian Jira',
    issuer: 'Coursera',
    image: certAgileJira,
    url: 'https://coursera.org/share/be9f1eb5dca128ff078999158a725fc1',
  },
  {
    title: 'Agile Project Management',
    issuer: 'Coursera',
    image: certAgilePM,
    url: 'https://coursera.org/share/5d89105c522cfb91aaf949552f3296f1',
  },
  {
    title: 'Django Web Framework',
    issuer: 'Coursera',
    image: certDjango,
    url: 'https://coursera.org/share/58a477a175a7225adda7c4b30eab54d0',
  },
  {
    title: 'Programming for Everybody (Getting Started with Python)',
    issuer: 'Coursera',
    image: certPython,
    url: 'https://coursera.org/share/f5954f1ce27fcb08131f819790bc0154',
  },
];

/* ------------------------------------------------------------------ */
/* Recommendations — "What People Say"                                 */
/* ------------------------------------------------------------------ */

export const recommendations = [
  {
    testimonial:
      "Aditya's ability to bridge deep learning models with live shop-floor PLC automation is exceptional. Delivering the YOLO crack-detection pipeline in under three months with 85% accuracy at 25 FPS revolutionized our automated inspection capability.",
    by: 'Rahul Mahajan, General Manager — Mahindra & Mahindra',
  },
  {
    testimonial:
      "His engineering of the 'Master Launcher' dashboard orchestrating 30 concurrent video analytics pipelines solved plant-wide GPU and resource bottlenecks. Aditya brings the maturity and rigor of a seasoned AI engineer.",
    by: 'Koushik Pandey, Senior Manager — Mahindra & Mahindra',
  },
  {
    testimonial:
      "Aditya's command over PyTorch, YOLO architectures, and active-learning edge pipelines is top-tier. His Vision Studio and Vision Flow platforms demonstrate complete mastery from dataset annotation to sub-50ms inference.",
    by: 'Kshitij Kulkarni, Senior Data Scientist — DataEaze Systems',
  },
  {
    testimonial:
      "An outstanding intern who exceeded every benchmark. Aditya demonstrated remarkable leadership and communication, seamlessly uniting plant operators, maintenance engineers, and leadership around high-impact AI deliverables.",
    by: 'Kunal Gharpure, HR — Mahindra & Mahindra',
  },
  {
    testimonial:
      "The automated crack detection and hardware hooter integration slashed our press shop inspection response time by 70%. Furthermore, his internal AutoML platform empowered our shop-floor staff to annotate and train models independently.",
    by: 'Rajesh Jain, DGM Press Shop — Mahindra & Mahindra',
  },
  {
    testimonial:
      "Aditya tackled challenging real-world computer vision constraints on an active manufacturing line without flinching. His defect detection pipeline integrated flawlessly with our shop-floor infrastructure.",
    by: 'Sachin Varade, Senior Manager — Mahindra & Mahindra',
  },
  {
    testimonial:
      "Connecting AI vision models directly into factory PLC relays and real-time monitoring web apps without disrupting our plant schedule was brilliant. Aditya's attention to industrial reliability is second to none.",
    by: 'Ramesh Yadav, Senior Maintenance Manager — Mahindra & Mahindra',
  },
  {
    testimonial:
      "As Cultural President of our Student Council, Aditya's executive leadership across IDEATHON 2.0 and university flagship initiatives has been exemplary. He leads a 150+ member volunteer workforce with vision, discipline, and fiscal prudence.",
    by: 'Dr. Anju Bala, Director SDW — Pimpri Chinchwad University',
  },
  {
    testimonial:
      "Balancing a 9.1 CGPA in Computer Science with production AI deployments at Mahindra and campus-wide governance is proof of Aditya's exceptional intellect, work ethic, and dedication.",
    by: 'Dr. Vijay Patil, Dean PhD — Pimpri Chinchwad University',
  },
  {
    testimonial:
      "Aditya's technical depth in Computer Vision and applied machine learning is remarkable. In the classroom and the lab, he stands out for his ability to convert complex algorithms into working, impactful software.",
    by: 'Pujitha Venna, Assistant Professor — Pimpri Chinchwad University',
  },
  {
    testimonial:
      "Deploying computer vision models on ruggedized edge hardware with zero cloud dependency demanded strong systems engineering. Aditya delivered ahead of schedule with flawless documentation.",
    by: 'Sandeep Joshi, Plant Engineering Head — Mahindra & Mahindra',
  },
  {
    testimonial:
      "Aditya sets the benchmark for student innovation at PCU. His ability to synthesize AI research with real-world manufacturing solutions is something we are extremely proud of.",
    by: 'Dr. Nilesh Gaikwad, Head of Computer Science Dept — PCU',
  },
  {
    testimonial:
      "I mentored Aditya on edge model quantization and SAM segmentation. His natural intuition for tuning models down to ~45ms latency and building active-learning feedback loops is outstanding.",
    by: 'Neha Deshmukh, Senior ML Engineer & Technical Mentor',
  },
  {
    testimonial:
      "Interfacing software models with production PLC lines is notoriously tricky, but Aditya's communication protocols were rock-solid, robust, and production-grade from day one.",
    by: 'Amitabh Sharma, Lead Automation & PLC Architect',
  },
  {
    testimonial:
      "Working alongside Aditya on the Student Council has been a masterclass in leadership. Leading 200+ team members and orchestrating Anantam for 6,000+ attendees with zero hitches was phenomenal.",
    by: 'Pooja Kulkarni, Student Council Vice President — PCU',
  },
  {
    testimonial:
      "The real-time defect alerts and live camera monitoring saved our operators hours of manual checking every shift. Aditya delivered practical tools that genuinely made our shop floor more efficient.",
    by: 'Vikas Shinde, Production Line Operations Manager — Mahindra & Mahindra',
  },
].map((entry, index) => {
  const nameOnly = entry.by.split(',')[0].replace(/^(Dr\.|Prof\.)\s*/i, '').trim();
  return {
    ...entry,
    tempId: index,
    imgSrc: `https://ui-avatars.com/api/?name=${encodeURIComponent(nameOnly)}&background=1c1c1e&color=ffb224&bold=true&size=150`,
  };
});

/* ------------------------------------------------------------------ */
/* Contact / Footer                                                    */
/* ------------------------------------------------------------------ */

export const contactSection = {
  title: 'CONTACT ME',
  backgroundText: 'ADITYA RASAL',
  description:
    "Architecting scalable Vision Models and engineering unforgettable events. Let's build something extraordinary together.",
  navLinks: [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Certifications', href: '#certifications' },
  ],
  copyright: `© ${new Date().getFullYear()} Aditya Rasal. Built with Love`,
};
