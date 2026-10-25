export const asset = name => import.meta.env.BASE_URL + 'Public/image/' + name;
export const resume = import.meta.env.BASE_URL + 'Public/PaulAlarba_resume.pdf';
export const email = 'paulnicoralarba@gmail.com';
export const social = { github: 'https://github.com/Paulalarba', linkedin: 'https://www.linkedin.com/in/paul-alarba', x: 'https://x.com/paulalarba' };
export const pages = [
  { id: 'home', label: 'Home', icon: 'home' }, { id: 'projects', label: 'Projects', icon: 'work' }, { id: 'services', label: 'Services', icon: 'spark' },
  { id: 'expertise', label: 'Expertise', icon: 'layers' }, { id: 'about', label: 'About', icon: 'user' }, { id: 'contact', label: 'Contact', icon: 'mail' },
];
export const logo = name => import.meta.env.BASE_URL + 'logos/' + name + '.svg';
export const tools = [
  { name: 'React', logo: logo('react') }, { name: 'HTML5', logo: logo('html5') },
  { name: 'CSS', logo: logo('css') }, { name: 'JavaScript', logo: logo('javascript') },
  { name: 'Tailwind CSS', logo: logo('tailwindcss') }, { name: 'ASP.NET Core', logo: logo('dotnet') },
  { name: 'PostgreSQL', logo: logo('postgresql') }, { name: 'Solidity', logo: logo('solidity') },
  { name: 'Ethereum', logo: logo('ethereum') }, { name: 'GitHub', logo: logo('github') },
  { name: 'Codex', logo: logo('codex') },
];
export const skillLogos = {
  React: 'react', HTML5: 'html5', CSS: 'css', JavaScript: 'javascript',
  'Tailwind CSS': 'tailwindcss', Bootstrap: 'bootstrap',
  'ASP.NET Core': 'dotnet', 'Entity Framework Core': 'dotnet',
  PostgreSQL: 'postgresql', Solidity: 'solidity', Ethereum: 'ethereum',
  Polkadot: 'polkadot', 'Web3.js': 'web3dotjs', 'Ethers.js': 'ethers',
  Codex: 'codex', GitHub: 'github', n8n: 'n8n', Ollama: 'ollama',
  'DeepSeek-R1': 'deepseek', Baserow: 'baserow', 'Robot Framework': 'robotframework',
};
export const projects = [
  {
    id: 'kamayaral', name: 'KamayAral', category: 'FSL learning & accessibility', image: 'ProjectKamayAral.png',
    imageAlt: 'KamayAral course dashboard design',
    summary: 'A Filipino Sign Language learning platform.',
    description: 'An FSL learning and access platform with structured courses, a searchable sign dictionary, and tools for Deaf-led education. It brings learners, teachers, and organizations into one accessible experience.',
    problem: 'Learners need a clear way to study FSL, while Deaf educators need a trusted path to share knowledge and connect with organizations.',
    features: ['Structured courses, lessons, quizzes, and progress tracking', 'Sign dictionary and accessible learning materials', 'Teacher tools and workshop request workflows'],
    tech: ['ASP.NET Core 10', 'C#', 'Razor Views', 'EF Core', 'PostgreSQL'], github: 'https://github.com/Paulalarba/KamayAral',
  },
  {
    id: 'kamayaral-ai', name: 'KamayAral AI', category: 'Computer vision research', image: 'ProjectKamayAralAI.svg',
    imageAlt: 'Abstract FSL hand landmark and six-sign baseline illustration',
    summary: 'An offline research pilot for FSL sign recognition.',
    description: 'A separate Python research workspace that extracts hand and pose landmarks from FSL video clips and trains a small isolated-sign baseline. It records dataset splits and evaluation results before any learner-facing use.',
    problem: 'Automated practice feedback requires careful data handling and evaluation, especially across different signers and signs.',
    features: ['MediaPipe landmark extraction from video samples', 'Six-sign temporal classification baseline and evaluation', 'ONNX export path for future reviewed browser experiments'],
    tech: ['Python', 'MediaPipe', 'PyTorch', 'scikit-learn', 'ONNX'], github: 'https://github.com/Paulalarba/KamayAral-AI',
  },
  {
    id: 'educredit', name: 'EduCredit', category: 'Campus payments & credit', image: 'ProjectEduCredit.png',
    imageAlt: 'EduCredit brand mark',
    summary: 'Campus credit and QR payments in one system.',
    description: 'A campus platform connecting students, vendors, and administrators. Students can manage credit and repayments, vendors handle their product catalog and QR payments, and administrators oversee accreditation and limits.',
    problem: 'Campus spending and short-term credit need a coordinated process for identity checks, transactions, repayments, and vendor operations.',
    features: ['Student KYC and credit limit management', 'Session-based QR payment and vendor confirmation', 'Repayment tracking, health scoring, and spending analytics'],
    tech: ['ASP.NET Core 10', 'C#', 'EF Core', 'PostgreSQL', 'Razor Views'], github: 'https://github.com/Paulalarba/EduCredit',
  },
  {
    id: 'sugbogo', name: 'SugboGo', category: 'Travel & discovery', image: 'ProjectSugboGo.png',
    summary: 'A connected travel experience for Cebu.',
    description: 'A Cebu travel ecosystem connecting explorers, local partners, and administrators. Vibe-based destination discovery brings the right places closer, while booking and operational tools keep the journey organized.',
    problem: 'Travelers need a simpler way to discover destinations, while local partners and administrators need a coordinated way to manage bookings and operations.',
    features: ['Vibe-based destination discovery and personalized booking', 'Partner assignment tracking and QR traveler verification', 'An administration command center for spots, bookings, and operations'],
    tech: ['C# 13', 'ASP.NET Core 10', 'PostgreSQL', 'Supabase', 'RBAC'], github: 'https://github.com/Paulalarba/SugboGo',
  },
  {
    id: 'fittrack', name: 'FitTrack', category: 'Membership & operations', image: 'ProjectFitTrack.png',
    summary: 'Gym memberships, check-ins, and wallets. Connected.',
    description: 'A gym operations system with member portals, administrator dashboards, tamper-proof QR check-ins, and a wallet ledger. Members can manage their accounts while staff verify access in real time.',
    problem: 'Gym memberships, entry verification, and account balances need to work together without fragmented manual tracking.',
    features: ['Tamper-proof QR check-ins and real-time access verification', 'Wallet funding, balance transfers, and membership renewal', 'Member profiles and administrative dashboards'],
    tech: ['ASP.NET Core 10', 'EF Core 10', 'Identity', 'Data Protection API', 'QR Security'], github: 'https://github.com/Paulalarba/FitTrack-',
  },
  {
    id: 'sitin', name: 'UC CCS Sit-In', category: 'Education & real-time systems', image: 'ProjectSitInMonitoringSystem.png',
    summary: 'A clearer view of every laboratory session.',
    description: 'A laboratory management system for student reservations, active sit-in sessions, and real-time occupancy tracking. Students can book seats while administrators manage laboratory activity from one place.',
    problem: 'Students need visibility into laboratory access, and administrators need current information about reservations, computers, and active sessions.',
    features: ['Student seat reservations and approval management', 'Real-time occupancy tracking and live session updates', 'Laboratory PC management, announcements, and reports'],
    tech: ['.NET 10', 'SignalR', 'PostgreSQL', 'Identity', 'Seat Reservation'], github: 'https://github.com/Paulalarba/UcCcsSitIn',
  },
  {
    id: 'sportsstore', name: 'SportsStore', category: 'E-commerce', remoteImage: 'https://images4.imgbox.com/23/20/jLHpHVs4_o.png',
    summary: 'From product discovery to database-backed checkout.',
    description: 'An online retail prototype demonstrating a complete product browsing, cart, and checkout workflow, with server-side session state and Entity Framework persistence.',
    problem: 'An online store needs a consistent shopping flow that keeps cart state and persists orders reliably.',
    features: ['Product browsing and cart management', 'Database-backed checkout with Entity Framework', 'Server-side session state and repository-based organization'],
    tech: ['ASP.NET Core MVC', 'EF Core', 'SQL Server', 'Session State', 'Repository Pattern'], github: 'https://github.com/Paulalarba/SportsStore',
  },
];
export const expertise = [
  { number: '01', icon: 'code', title: 'Web development', subtitle: 'From the interface to the database.', description: 'Responsive interfaces and structured back ends, with an emphasis on clear architecture and practical functionality.', groups: [
    { title: 'Front end', items: ['React', 'HTML5', 'CSS', 'JavaScript', 'Tailwind CSS', 'Bootstrap'] },
    { title: 'Back end', items: ['ASP.NET Core', 'Entity Framework Core', 'PostgreSQL'] },
  ], practices: ['Razor Views', 'SQL Server', 'Clean Architecture', 'Design Systems'] },
  { number: '02', icon: 'cube', title: 'Blockchain development', subtitle: 'Exploring the decentralized web.', description: 'Smart contracts and Web3 development are part of my technical focus, alongside the tools that connect applications to blockchain networks.', groups: [
    { title: 'Contracts & ecosystems', items: ['Solidity', 'Ethereum', 'Polkadot'] },
    { title: 'Development tools', items: ['Web3.js', 'Ethers.js'] },
  ], practices: ['Substrate', 'Hardhat', 'Truffle'] },
  { number: '03', icon: 'spark', title: 'AI automation', subtitle: 'Make room for the work that matters.', description: 'I’m exploring connected workflows, local AI models, and useful automation with human review.', groups: [
    { title: 'Automation & data', items: ['n8n', 'Baserow', 'Robot Framework'] },
    { title: 'Local AI & development', items: ['Ollama', 'DeepSeek-R1', 'Codex', 'GitHub'] },
  ], practices: ['Workflow exploration', 'Practical automation', 'Human review'] },
];
export const education = [
  { level: 'College', years: '2023 — Present', school: 'University of Cebu Main Campus' },
  { level: 'Senior High', years: '2021 — 2023', school: 'College of Technological Science Cebu', note: 'With honor' },
  { level: 'High School', years: '2017 — 2021', school: 'Bantayan National High School', note: 'With honor' },
  { level: 'Elementary', school: 'Tamiao Integrated School' },
];
