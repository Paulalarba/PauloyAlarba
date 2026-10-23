import ContactForm from './ContactForm.jsx';

export default function PortfolioContent() {
  return (<section id="about" className="about-section">
    <div className="container">
        <div className="about-intro section-reveal">
            <div className="fp-header education-header section-reveal">
                    <div className="fp-divider"></div>
                    <h2 className="fp-title education-title">About Me</h2>
                    <div className="fp-divider"></div>
            </div>
            <h2>I'm a 3rd-year student at the University of Cebu.</h2>
            <p>
                Since I began my journey in tech, I’ve enjoyed transforming complex logic into simple, 
                beautiful, and intuitive systems. When I’m not writing code, you’ll find me cooking, 
                playing chess, working out, or relaxing on the beach at Bantayan Island.
            </p>
            <div className="about-social-actions" aria-label="About me links">
                <a href="/Public/PaulAlarba_resume.pdf" className="about-resume-link" download>
                    <i className="fa-solid fa-file-arrow-down"></i>
                    Download Resume
                </a>
                <a href="https://github.com/Paulalarba" className="about-social-link" aria-label="Open GitHub profile" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-github"></i>
                </a>
                <a href="https://www.linkedin.com/in/paul-alarba" className="about-social-link" aria-label="Open LinkedIn profile" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="mailto:paulnicoralarba@gmail.com" className="about-social-link" aria-label="Email Paul Alarba">
                    <i className="fa-solid fa-envelope"></i>
                </a>
            </div>
        </div>

        <div className="fp-header tech-stack-header section-reveal">
            <h2 className="fp-title tech-stack-title">Tech-stack</h2>
            <div className="fp-divider"></div>
        </div>
        <div className="about-columns section-reveal">
            <div className="about-col">
                <h3 className="about-col-title">Part Back-end</h3>
                <ul className="about-list">
                    <li><i className="fa-brands fa-dot-net icon-dotnet"></i> ASP.NET Core MVC</li>
                    <li><i className="fa-solid fa-layer-group icon-arch"></i> Entity Framework</li>
                    <li><i className="fa-solid fa-database icon-db"></i> PostgreSQL / SQL Server</li>
                    <li><i className="fa-solid fa-sitemap icon-arch"></i> Clean Architecture</li>
                    <li><i className="fa-solid fa-compass-drafting icon-design"></i> Design Systems</li>
                </ul>
            </div>
            <div className="about-col">
                <h3 className="about-col-title">Part Front-end</h3>
                <ul className="about-list">
                    <li><i className="fa-brands fa-html5 icon-html"></i> HTML / CSS</li>
                    <li><i className="fa-brands fa-react icon-react"></i> React</li>
                    <li><i className="fa-solid fa-wind icon-tailwind"></i> Tailwind CSS</li>
                    <li><i className="fa-brands fa-bootstrap icon-bootstrap"></i> Bootstrap</li>
                    <li><i className="fa-solid fa-code icon-razor"></i> Razor Views</li>
                    <li><i className="fa-brands fa-js icon-web3"></i> JavaScript / jQuery</li>
                </ul>
            </div>
            <div className="about-col">
                <h3 className="about-col-title">Part Blockchain</h3>
                <ul className="about-list">
                    <li><i className="fa-solid fa-file-code icon-solidity"></i> Solidity / Contracts</li>
                    <li><i className="fa-brands fa-ethereum icon-eth"></i> Web3.js / Ethers.js</li>
                    <li><i className="fa-solid fa-circle-nodes icon-polkadot"></i> Polkadot / Substrate</li>
                    <li><i className="fa-brands fa-ethereum icon-eth"></i> Ethereum Ecosystem</li>
                    <li><i className="fa-solid fa-hammer icon-hardhat"></i> Hardhat / Truffle</li>
                </ul>
            </div>
        </div>

        <div id="work" className="about-projects">
            <section className="featured-projects-section">
                <div className="fp-header section-reveal">
                    <h2 className="fp-title">Featured Works</h2>
                    <div className="fp-divider"></div>
                </div>

                
                <div className="fp-grid section-reveal">
                    <div className="fp-showcase" aria-label="SugboGo project screenshot">
                        <img src="/Public/image/ProjectSugboGo.png" alt="SugboGo travel platform interface" />
                    </div>
                    <div className="fp-info">
                        <h3 className="fp-project-title">The Ultimate Cebu Experience <span>SugboGo</span></h3>
                        <div className="fp-description-card">
                            <p>
                                SugboGo is a Cebu travel ecosystem for explorers, local partners, and administrators.
                                It supports <strong>vibe-based destination discovery</strong>, personalized booking,
                                partner assignment tracking, QR traveler verification, and a command center for
                                managing regional spots, bookings, and operations.
                            </p>
                        </div>
                        <div className="fp-tech-stack">
                            <span className="fp-badge"><i className="fa-brands fa-dot-net icon-csharp"></i> C# 13</span>
                            <span className="fp-badge"><i className="fa-brands fa-dot-net icon-aspnet"></i> ASP.NET Core 10</span>
                            <span className="fp-badge"><i className="fa-solid fa-database icon-postgres"></i> PostgreSQL</span>
                            <span className="fp-badge"><i className="fa-solid fa-cloud icon-supabase"></i> Supabase</span>
                            <span className="fp-badge"><i className="fa-solid fa-shield icon-rbac"></i> RBAC</span>
                        </div>
                        <div className="fp-actions">
                            <a href="https://github.com/Paulalarba/SugboGo.git" className="fp-action-icon" aria-label="Open SugboGo GitHub repository" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a>
                            <a href="https://github.com/Paulalarba/SugboGo.git" className="fp-action-icon" aria-label="Open SugboGo project link" target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                        </div>
                    </div>
                </div>

                
                <div className="fp-grid fp-grid-reverse section-reveal">
                    <div className="fp-showcase" aria-label="FitTrack project screenshot">
                        <img src="/Public/image/ProjectFitTrack.png" alt="FitTrack gym membership and wallet interface" />
                    </div>
                    <div className="fp-info">
                        <h3 className="fp-project-title">Gym Membership & Wallet <span>FitTrack</span></h3>
                        <div className="fp-description-card">
                            <p>
                                FitTrack streamlines gym operations with member portals, admin dashboards,
                                <strong>tamper-proof QR check-ins</strong>, and a secure wallet ledger.
                                Members can fund accounts, transfer balances, renew memberships, and manage
                                profiles while staff verify access in real time.
                            </p>
                        </div>
                        <div className="fp-tech-stack">
                            <span className="fp-badge"><i className="fa-brands fa-dot-net icon-aspnet"></i> ASP.NET Core 10</span>
                            <span className="fp-badge"><i className="fa-solid fa-qrcode icon-qr"></i> QR Security</span>
                            <span className="fp-badge"><i className="fa-solid fa-lock icon-dataprotection"></i> Data Protection API</span>
                            <span className="fp-badge"><i className="fa-solid fa-database icon-efcore"></i> EF Core 10</span>
                            <span className="fp-badge"><i className="fa-solid fa-user-lock icon-identity"></i> Identity</span>
                        </div>
                        <div className="fp-actions">
                            <a href="https://github.com/Paulalarba/FitTrack-.git" className="fp-action-icon" aria-label="Open FitTrack GitHub repository" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a>
                            <a href="https://github.com/Paulalarba/FitTrack-.git" className="fp-action-icon" aria-label="Open FitTrack project link" target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                        </div>
                    </div>
                </div>

                
                <div className="fp-grid section-reveal">
                    <div className="fp-showcase" aria-label="UC CCS Sit-In project screenshot">
                        <img src="/Public/image/ProjectSitInMonitoringSystem.png" alt="UC CCS sit-in monitoring system interface" />
                    </div>
                    <div className="fp-info">
                        <h3 className="fp-project-title">UC CCS Sit-in <span>Monitoring</span></h3>
                        <div className="fp-description-card">
                            <p>
                                A laboratory management system for student reservations, active sit-in sessions,
                                and <strong>real-time occupancy tracking</strong>. It gives students seat booking
                                tools while administrators manage approvals, lab PCs, announcements, reports,
                                and live session updates.
                            </p>
                        </div>
                        <div className="fp-tech-stack">
                            <span className="fp-badge"><i className="fa-solid fa-wifi icon-signalr"></i> SignalR</span>
                            <span className="fp-badge"><i className="fa-brands fa-dot-net icon-dotnet"></i> .NET 10</span>
                            <span className="fp-badge"><i className="fa-solid fa-database icon-postgres"></i> PostgreSQL</span>
                            <span className="fp-badge"><i className="fa-solid fa-chair icon-seating"></i> Seat Reservation</span>
                            <span className="fp-badge"><i className="fa-solid fa-user-lock icon-identity"></i> Identity</span>
                        </div>
                        <div className="fp-actions">
                            <a href="https://github.com/Paulalarba/UcCcsSitIn.git" className="fp-action-icon" aria-label="Open UC CCS Sit-In GitHub repository" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a>
                            <a href="https://github.com/Paulalarba/UcCcsSitIn.git" className="fp-action-icon" aria-label="Open UC CCS Sit-In project link" target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                        </div>
                    </div>
                </div>

                
                <div className="fp-grid fp-grid-reverse section-reveal">
                    <div className="fp-showcase" aria-label="SportsStore project screenshot">
                        <img src="/Public/image/ProjectAthletica.png" alt="SportsStore online retail prototype interface" />
                    </div>
                    <div className="fp-info">
                        <h3 className="fp-project-title">Online Retail Prototype <span>SportsStore</span></h3>
                        <div className="fp-description-card">
                            <p>
                                A complete e-commerce workflow demonstrating <strong>product browsing</strong>, 
                                <strong>cart management</strong>, and database-backed checkout. Focused on 
                                clean <strong>server-side session state</strong> and EF Core persistence.
                            </p>
                        </div>
                        <div className="fp-tech-stack">
                            <span className="fp-badge"><i className="fa-brands fa-dot-net icon-mvc"></i> ASP.NET Core MVC</span>
                            <span className="fp-badge"><i className="fa-solid fa-database icon-efcore"></i> EF Core</span>
                            <span className="fp-badge"><i className="fa-solid fa-database icon-sqlserver"></i> SQL Server</span>
                            <span className="fp-badge"><i className="fa-solid fa-layer-group icon-api"></i> Session State</span>
                            <span className="fp-badge"><i className="fa-solid fa-cubes icon-mvc"></i> Repository Pattern</span>
                        </div>
                        <div className="fp-actions">
                            <a href="https://github.com/Paulalarba/SportsStore.git" className="fp-action-icon" aria-label="Open SportsStore GitHub repository" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a>
                            <a href="https://github.com/Paulalarba/SportsStore.git" className="fp-action-icon" aria-label="Open SportsStore project link" target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                        </div>
                    </div>
                </div>
            </section>

            <section id="education" className="education-section">
                <div className="fp-header education-header section-reveal">
                    <h2 className="fp-title education-title">Educational Background</h2>
                    <div className="fp-divider"></div>
                </div>

                <div className="education-list section-reveal">
                    <article className="education-item">
                        <div className="education-meta">
                            <span className="education-level">College</span>
                            <span className="education-years">2023 - Present</span>
                        </div>
                        <h3>University of Cebu Main Campus</h3>
                    </article>

                    <article className="education-item">
                        <div className="education-meta">
                            <span className="education-level">Senior High</span>
                            <span className="education-years">2021 - 2023</span>
                        </div>
                        <h3>College of Technological Science Cebu</h3>
                        <p>With honor</p>
                    </article>

                    <article className="education-item">
                        <div className="education-meta">
                            <span className="education-level">High School</span>
                            <span className="education-years">2017 - 2021</span>
                        </div>
                        <h3>Bantayan National High School</h3>
                        <p>With honor</p>
                    </article>

                    <article className="education-item">
                        <div className="education-meta">
                            <span className="education-level">Elementary</span>
                        </div>
                        <h3>Tamiao Integrated School</h3>
                    </article>
                </div>
            </section>

            <section id="contact" className="contact-section">
                <div className="fp-header contact-header section-reveal">
                    <h2 className="fp-title contact-title">Contact</h2>
                    <div className="fp-divider"></div>
                </div>

                <div className="contact-grid">
                    <div className="contact-copy section-reveal">

                        <ContactForm />
                    </div>

                    <aside className="contact-aside section-reveal">
                        <div className="contact-panel">
                            <h3>Direct links</h3>
                            <ul className="contact-links">
                                <li><a href="mailto:paulnicoralarba@gmail.com">paulnicoralarba@gmail.com</a></li>
                                <li><a href="https://github.com/Paulalarba" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                                <li><a href="https://linkedin.com/in/paulalarba" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    </div>
</section>);
}
