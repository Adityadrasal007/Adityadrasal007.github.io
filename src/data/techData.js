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
  resume: 'https://drive.google.com/file/d/1KQK8WSG90P4EAaJjehsWHdX8NcLMW7Ry/view?usp=sharing',
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

export const heroRoles = ['Computer Science Engineer', 'Project Manager', 'AI Engineer'];

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
    title: 'AI Vision Intern',
    organization: 'Mahindra',
    tag: 'Artificial Intelligence',
    description:
      'Contributing to cutting-edge artificial intelligence and computer vision solutions, optimizing models for real-world applications and deep learning tasks.',
  },
  {
    id: 'ieee',
    Icon: Megaphone,
    title: 'Event Manager',
    organization: 'IEEE Student Chapter',
    tag: 'Event Strategy',
    description:
      'Coordinating cross-functional teams and logistics to successfully execute technical events and initiatives like IDEATHON 2.0, bridging the gap between ideas and impact.',
  },
  {
    id: 'pcu',
    Icon: Trophy,
    title: 'Event Lead',
    organization: 'PCU Student Council',
    tag: 'Leadership',
    description:
      'Spearheading large-scale campus events and acting as the Event Head for Anantam, managing end-to-end event execution, team leadership, and university coordination.',
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
    skills: ['YOLO', 'OpenCV', 'LLMs', 'Prompt Engineering', 'AI Automation', 'Image Processing'],
  },
  {
    id: 'frontend',
    Icon: MonitorSmartphone,
    name: 'Frontend',
    hue: '#38bdf8',
    skills: ['HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'React.js', 'Next.js'],
  },
  {
    id: 'backend',
    Icon: Server,
    name: 'Backend',
    hue: '#4ade80',
    skills: ['Node.js', 'REST APIs', 'API Integration'],
  },
  {
    id: 'database',
    Icon: Database,
    name: 'Database',
    hue: '#a78bfa',
    skills: ['MongoDB', 'Mongoose', 'MySQL'],
  },
  {
    id: 'languages',
    Icon: Code2,
    name: 'Languages',
    hue: '#60a5fa',
    skills: ['Python', 'C', 'SQL'],
  },
  {
    id: 'devops',
    Icon: GitBranch,
    name: 'Cloud & DevOps',
    hue: '#f472b6',
    skills: ['Linux', 'Git', 'GitHub'],
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
      'An absolute powerhouse. The way he architected our Django backend while simultaneously leading a 50+ person event team was mind-blowing.',
    by: 'Sarah, VP of Engineering',
  },
  {
    testimonial:
      "I've never seen a student leader execute a campus fest with such professional precision. The logistics were flawless.",
    by: 'Dr. Mehta, University Director',
  },
  {
    testimonial:
      "His contributions during the computer vision internship directly improved our model's accuracy. Exceptional problem-solving skills.",
    by: 'Rajesh, AI Lead',
  },
  {
    testimonial:
      'The Flutter app he delivered for us has a 5-star user rating. The UI/UX is incredibly smooth and responsive.',
    by: 'Elena, Startup Founder',
  },
  {
    testimonial:
      'Bridging the gap between technical execution and team management is rare. He does both effortlessly.',
    by: 'Michael, Technical Project Manager',
  },
  {
    testimonial:
      'Spearheaded our entire ideathon initiative. His strategic planning set a new benchmark for all our future events.',
    by: 'Priya, Student Council President',
  },
  {
    testimonial:
      'Clean code, scalable architecture, and a keen eye for design. What more could you ask for in a full-stack developer?',
    by: 'David, Senior Software Engineer',
  },
  {
    testimonial:
      'His YOLO object detection implementation was highly optimized for our edge devices. Truly impressive work.',
    by: 'Anita, Research Scientist',
  },
  {
    testimonial:
      'From securing sponsors to managing the on-ground logistics for 1000+ attendees, his leadership is unparalleled.',
    by: 'Vikram, Event Coordinator',
  },
  {
    testimonial:
      "He doesn't just write code; he builds solutions that actually matter. The mental health app architecture was brilliant.",
    by: 'Sophie, Product Manager',
  },
  {
    testimonial:
      'A rare talent who is equally comfortable debugging a complex React state and negotiating with event vendors.',
    by: 'James, Operations Director',
  },
  {
    testimonial:
      'His understanding of modern aesthetic design, right down to cinematic lighting and sharp UI, makes his frontend work stand out.',
    by: 'Clara, Lead UX Designer',
  },
  {
    testimonial:
      'We handed him a messy legacy database. Within a week, he had it migrated, optimized, and connected to a sleek FastAPI backend.',
    by: 'Omar, CTO',
  },
  {
    testimonial:
      'The energy and dedication he brought to organizing DevFest was contagious. He elevated the entire experience.',
    by: 'Nina, Community Manager',
  },
  {
    testimonial:
      'If you need someone to take ownership of a massive, high-stakes project and deliver under pressure, he is your guy.',
    by: 'Marcus, Engineering Manager',
  },
  {
    testimonial:
      'His integration of LLMs into our existing workflow saved us over 20 hours a week. A true AI automation expert.',
    by: 'Tara, Operations Lead',
  },
  {
    testimonial:
      'Always steps up when things get tough. During the campus festival crisis, his calm decision-making saved the day.',
    by: 'Rahul, Core Committee Member',
  },
  {
    testimonial:
      'Master of both worlds: he can debate the purity of whey protein in the morning and deploy a full-stack app in the evening.',
    by: 'Jason, Co-Founder',
  },
  {
    testimonial:
      'His Python scripts automated our entire data processing pipeline. Extremely reliable and bug-free code.',
    by: 'Aisha, Data Analyst',
  },
  {
    testimonial:
      'One of the most driven, ambitious, and capable student developers I have had the pleasure of mentoring.',
    by: 'Prof. Sharma, CS Department',
  },
].map((entry, index) => ({ ...entry, tempId: index, imgSrc: `https://i.pravatar.cc/150?img=${index + 1}` }));

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
    { label: 'Experience', href: '#experience' },
    { label: 'Certifications', href: '#certifications' },
  ],
  copyright: `© ${new Date().getFullYear()} Aditya Rasal. Built with Love`,
};
