import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const wrapperRef = useRef(null);
  const leftPanelRef = useRef(null);
  const [hintVisible, setHintVisible] = useState(true);
  const mobileSide = useRef(false);

  function handleTap(event) {
    if (window.innerWidth > 768 || event.target.closest('a, button')) return;
    mobileSide.current = !mobileSide.current;
    if (leftPanelRef.current) leftPanelRef.current.style.width = mobileSide.current ? '100vw' : '0';
    setHintVisible(false);
  }

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const panel = leftPanelRef.current;
    const images = wrapper.querySelectorAll('.image-container');
    let frame;
    let currentX = window.innerWidth / 2;
    let targetX = currentX;
    let currentParallaxX = 0;
    let currentParallaxY = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let isMobile = window.innerWidth <= 768;

    function onResize() {
      isMobile = window.innerWidth <= 768;
      panel.style.transition = isMobile ? 'width 0.4s ease-out' : 'none';
      if (!isMobile) { currentX = targetX = window.innerWidth / 2; panel.style.width = '50vw'; }
      else panel.style.width = mobileSide.current ? '100vw' : '0';
    }
    function onMouseMove(event) {
      if (isMobile) return;
      targetX = event.clientX;
      targetParallaxX = (event.clientX - window.innerWidth / 2) * 0.03;
      targetParallaxY = (event.clientY - window.innerHeight / 2) * 0.03;
    }
    function animate() {
      if (!isMobile) {
        currentX += (targetX - currentX) * 0.1;
        panel.style.width = `${currentX}px`;
        currentParallaxX += (targetParallaxX - currentParallaxX) * 0.08;
        currentParallaxY += (targetParallaxY - currentParallaxY) * 0.08;
        images.forEach((image) => { image.style.transform = `translate(${currentParallaxX}px, ${currentParallaxY}px)`; });
      }
      frame = requestAnimationFrame(animate);
    }
    wrapper.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    animate();
    return () => {
      cancelAnimationFrame(frame);
      wrapper.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (<div className="split-wrapper" id="top" ref={wrapperRef} onClick={handleTap}>
    <div className="mobile-hint" id="mobileHint" style={{ display: hintVisible ? undefined : "none" }}>Tap screen to swap roles</div>

    
    <div className="panel panel-right">
        <div className="panel-content">
            <div className="text-container">
                <div className="icon-container">
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/01/svg"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        
                        <rect x="8" y="16" width="36" height="24" rx="2" stroke="currentColor"/>
                        <path d="M16 40 v 6" stroke="currentColor"/>
                        <path d="M36 40 v 6" stroke="currentColor"/>
                        <path d="M12 46 h 28" stroke="currentColor"/>
                        
                        <path d="M16 28 l -4 4 l 4 4" stroke="currentColor"/>
                        <path d="M26 28 l 4 4 l -4 4" stroke="currentColor"/>
                        <path d="M24 24 l -6 14" stroke="currentColor"/>
                        
                        <ellipse cx="48" cy="34" rx="10" ry="4" stroke="currentColor" fill="#1b2a38"/>
                        <path d="M38 34 v 12 c 0 2.2 4.5 4 10 4 s 10 -1.8 10 -4 v -12"
                              stroke="currentColor" fill="#1b2a38"/>
                        <path d="M38 40 c 0 2.2 4.5 4 10 4 s 10 -1.8 10 -4"
                              stroke="currentColor"/>
                        <path d="M38 46 c 0 2.2 4.5 4 10 4 s 10 -1.8 10 -4"
                              stroke="currentColor"/>
                    </svg>
                </div>
                <h1 className="main-title">WEB<br />DEVELOPER</h1>
                <p className="sub-text">
                    Delivering interactive experiences with<br />MVC, Razor, and responsive design
                </p>
            </div>

            
            <div className="image-container">
                <img src="/Public/image/ProfileRobotic.png" alt="Developer Paul"
                     className="profile-img" />
            </div>

            
            <div className="shape circle c2"></div>
            <div className="shape triangle-outline t3">
                <svg viewBox="0 0 24 24"><polygon points="12,2 22,20 2,20"/></svg>
            </div>
            <div className="shape squiggle s1">
                <svg viewBox="0 0 40 40">
                    <path d="M4 36 Q 10 20, 20 28 T 36 12"/>
                </svg>
            </div>
        </div>
    </div>

    
    <div className="panel panel-left" id="leftPanel" ref={leftPanelRef}>
        <div className="split-line"></div>
        <div className="panel-content">
            <div className="text-container">
                <div className="icon-container">
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/01/svg"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        
                        <path d="M12 28 l -8 -4 l 8 -4 l 8 4 z" stroke="currentColor"/>
                        <path d="M4 24 v 8 l 8 4 v -8" stroke="currentColor"/>
                        <path d="M20 24 v 8 l -8 4" stroke="currentColor"/>
                        
                        <path d="M28 16 l -8 -4 l 8 -4 l 8 4 z" stroke="currentColor"/>
                        <path d="M20 12 v 8 l 8 4 v -8" stroke="currentColor"/>
                        <path d="M36 12 v 8 l -8 4" stroke="currentColor"/>
                        
                        <path d="M44 28 l -8 -4 l 8 -4 l 8 4 z" stroke="currentColor"/>
                        <path d="M36 24 v 12 l 8 4 v -12" stroke="currentColor"/>
                        <path d="M52 24 v 12 l -8 4" stroke="currentColor"/>
                        
                        <path d="M16 22 l 8 -6" stroke="currentColor"/>
                        <path d="M32 22 l 8 -6" stroke="currentColor"/>
                        <path d="M12 36 v 12" stroke="currentColor"/>
                        
                        <path d="M12 56 l -8 -4 l 8 -4 l 8 4 z" stroke="currentColor"/>
                        <path d="M4 52 v 8 l 8 4 v -8" stroke="currentColor"/>
                        <path d="M20 52 v 8 l -8 4" stroke="currentColor"/>
                        
                        <rect x="40" y="32" width="8" height="6" rx="1"
                              fill="white" stroke="currentColor"/>
                        <path d="M42 32 v -2 a 2 2 0 0 1 4 0 v 2"
                              stroke="currentColor"/>
                        <circle cx="44" cy="35" r="1"
                                fill="currentColor" stroke="none"/>
                    </svg>
                </div>
                <h1 className="main-title">BLOCKCHAIN<br />INNOVATOR</h1>
                <p className="sub-text">
                    Building secure, decentralized solutions<br />
                    with smart contracts and Web3
                </p>
            </div>

            
            <div className="image-container">
                <img src="/Public/image/Profile.png" alt="Designer Paul"
                     className="profile-img" />
            </div>

            
            <div className="shape circle c1"></div>
            <div className="shape triangle-outline t1">
                <svg viewBox="0 0 24 24"><polygon points="12,2 22,20 2,20"/></svg>
            </div>
            <div className="shape line l1"></div>
            <div className="shape triangle-outline t2">
                <svg viewBox="0 0 24 24"><polygon points="12,2 22,20 2,20"/></svg>
            </div>
        </div>
    </div>
</div>);
}
