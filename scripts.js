// ===== ArquiBlog JavaScript =====

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe post cards
document.querySelectorAll('.post-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(card);
});

// Add visible class handler
const style = document.createElement('style');
style.textContent = `
    .post-card.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Post body elements animation
document.querySelectorAll('.post-body h2, .post-body h3, .post-body .info-box, .post-body .diagram-box').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    el.style.transitionDelay = `${index * 0.05}s`;
    fadeInObserver.observe(el);
});

// Add visible animation for post body elements
const postStyle = document.createElement('style');
postStyle.textContent = `
    .post-body h2.visible,
    .post-body h3.visible,
    .post-body .info-box.visible,
    .post-body .diagram-box.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(postStyle);

// Reading progress indicator for post pages
if (document.querySelector('.post-page')) {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 64px;
        left: 0;
        width: 0%;
        height: 2px;
        background: linear-gradient(90deg, #ff0080, #7928ca);
        z-index: 1000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.scrollY;
        const progress = (scrollTop / documentHeight) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
}

// Copy code blocks functionality
document.querySelectorAll('.diagram-box pre').forEach(pre => {
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copiar';
    copyBtn.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 4px 12px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        color: #888;
        font-size: 12px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease, background 0.2s ease;
    `;

    pre.parentElement.style.position = 'relative';
    pre.parentElement.appendChild(copyBtn);

    pre.parentElement.addEventListener('mouseenter', () => {
        copyBtn.style.opacity = '1';
    });

    pre.parentElement.addEventListener('mouseleave', () => {
        copyBtn.style.opacity = '0';
    });

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(pre.textContent);
            copyBtn.textContent = 'Copiado!';
            copyBtn.style.background = 'rgba(80, 227, 194, 0.2)';
            copyBtn.style.color = '#50e3c2';
            setTimeout(() => {
                copyBtn.textContent = 'Copiar';
                copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                copyBtn.style.color = '#888';
            }, 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    });
});

// Table of contents for post pages (auto-generated)
if (document.querySelector('.post-body')) {
    const headings = document.querySelectorAll('.post-body h2');

    if (headings.length > 2) {
        const toc = document.createElement('nav');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h4>Contenido</h4>';

        const tocList = document.createElement('ul');

        headings.forEach((heading, index) => {
            const id = `section-${index}`;
            heading.id = id;

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${id}`;
            a.textContent = heading.textContent;
            li.appendChild(a);
            tocList.appendChild(li);
        });

        toc.appendChild(tocList);

        // Add TOC styles
        const tocStyle = document.createElement('style');
        tocStyle.textContent = `
            .table-of-contents {
                background: #111;
                border: 1px solid #222;
                border-radius: 12px;
                padding: 24px;
                margin: 32px 0;
            }
            .table-of-contents h4 {
                color: #ededed;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 16px;
            }
            .table-of-contents ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .table-of-contents li {
                margin: 8px 0;
            }
            .table-of-contents a {
                color: #888;
                font-size: 14px;
                transition: color 0.2s ease;
            }
            .table-of-contents a:hover {
                color: #ededed;
            }
        `;
        document.head.appendChild(tocStyle);

        // Insert TOC after first paragraph
        const firstH2 = document.querySelector('.post-body h2');
        if (firstH2) {
            firstH2.parentNode.insertBefore(toc, firstH2);
        }
    }
}

// Mobile menu toggle (for future enhancement)
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
    });
}

// Active navigation highlighting
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-link').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath.includes(linkPath) && linkPath !== 'index.html' && linkPath !== '../index.html') {
        link.classList.add('active');
    }
});

// Console welcome message
console.log(
    '%c ArquiBlog %c Blog de Arquitectura de Software ',
    'background: linear-gradient(90deg, #ff0080, #7928ca); color: white; padding: 5px 10px; border-radius: 4px 0 0 4px;',
    'background: #111; color: #ededed; padding: 5px 10px; border-radius: 0 4px 4px 0;'
);
