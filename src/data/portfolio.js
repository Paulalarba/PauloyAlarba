export const asset = name => import.meta.env.BASE_URL + 'Public/image/' + name;
export const resume = import.meta.env.BASE_URL + 'Public/PaulAlarba_resume.pdf';
export const email = 'paulnicoralarba@gmail.com';
export const social = { github: 'https://github.com/Paulalarba', linkedin: 'https://www.linkedin.com/in/paul-alarba', x: 'https://x.com/paulalarba' };
export const pages = [
  { id: 'home', label: 'Home', icon: 'home' }, { id: 'projects', label: 'Projects', icon: 'work' }, { id: 'services', label: 'Services', icon: 'spark' },
  { id: 'expertise', label: 'Expertise', icon: 'layers' }, { id: 'about', label: 'About', icon: 'user' }, { id: 'contact', label: 'Contact', icon: 'mail' },
];
export const tools = [
  { name: 'React', mark: '⚛', color: '#1683a5' }, { name: 'ASP.NET Core', mark: '.NET', color: '#6a4fba' },
  { name: 'JavaScript', mark: 'JS', color: '#967000' }, { name: 'PostgreSQL', mark: 'PG', color: '#336791' },
  { name: 'Tailwind CSS', mark: '≈', color: '#168b9f' }, { name: 'Solidity', mark: '◇', color: '#586078' },
  { name: 'Ethereum', mark: 'Ξ', color: '#6276b6' }, { name: 'GitHub', mark: 'GH', color: '#192438' },
];
export const projects = [
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
    { title: 'Front end', items: ['React', 'HTML / CSS', 'Tailwind CSS', 'Bootstrap', 'Razor Views', 'JavaScript / jQuery'] },
    { title: 'Back end & architecture', items: ['ASP.NET Core MVC', 'Entity Framework', 'PostgreSQL / SQL Server', 'Clean Architecture', 'Design Systems'] },
  ] },
  { number: '02', icon: 'cube', title: 'Blockchain development', subtitle: 'Exploring the decentralized web.', description: 'Smart contracts and Web3 development are part of my technical focus, alongside the tools that connect applications to blockchain networks.', groups: [
    { title: 'Contracts & ecosystems', items: ['Solidity / Contracts', 'Ethereum Ecosystem', 'Polkadot / Substrate'] },
    { title: 'Development tools', items: ['Web3.js / Ethers.js', 'Hardhat / Truffle'] },
  ] },
  { number: '03', icon: 'spark', title: 'AI automation', subtitle: 'Make room for the work that matters.', description: 'An area I’m actively exploring: connecting AI with useful workflows and finding opportunities to reduce repetitive work.', groups: [
    { title: 'Current focus', items: ['AI-assisted development', 'Workflow exploration', 'Practical automation'] },
  ] },
];
export const education = [
  { level: 'College', years: '2023 — Present', school: 'University of Cebu Main Campus' },
  { level: 'Senior High', years: '2021 — 2023', school: 'College of Technological Science Cebu', note: 'With honor' },
  { level: 'High School', years: '2017 — 2021', school: 'Bantayan National High School', note: 'With honor' },
  { level: 'Elementary', school: 'Tamiao Integrated School' },
];
