/**
 * Portfolio Renderer
 * Handles rendering content from JSON to HTML
 */

/**
 * Main rendering function
 * @param {Object} content - Portfolio content from JSON
 */
function renderPortfolio(content) {
    const app = document.getElementById('app');
    if (!app) return;
    
    // Set metadata
    document.title = content.meta.title;
    document.querySelector('meta[name="description"]').content = content.meta.description;
    
    // Start with empty content
    app.innerHTML = '';
    
    // Render sections in order (contact section removed)
    app.innerHTML = `
        ${renderNavbar(content.navbar, content.profile)}
        ${renderHero(content.hero, content.profile)}
        ${content.about?.enabled !== false ? renderAbout(content.about, content.profile) : ''}
        ${content.experience?.enabled !== false ? renderExperience(content.experience) : ''}
        ${content.projects?.enabled !== false ? renderProjects(content.projects) : ''}
        ${content.skills?.enabled !== false ? renderSkills(content.skills) : ''}
        ${content.education?.enabled !== false ? renderEducation(content.education) : ''}
        ${content.contact?.enabled !== false ? renderContact(content.contact) : ''}
        ${renderFooter(content.footer, content.profile)}
        <a href="#" id="back-to-top" class="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors" aria-label="Back to top" style="display: none;">
            <i class="fas fa-arrow-up"></i>
        </a>
    `;
}

/**
 * Render the navigation bar
 */
function renderNavbar(navbar, profile) {
    // Default values if not provided
    const logo = navbar?.logo || `&lt;${getInitials(profile.name)}/&gt;`;
    
    // Default nav links if not provided - Removed contact link
    const links = navbar?.links || [
        {text: "About", url: "#about"},
        {text: "Experience", url: "#experience"},
        {text: "Projects", url: "#projects"},
        {text: "Skills", url: "#skills"}
    ];
    
    // Generate nav links HTML
    const navLinks = links.map(link => 
        `<a href="${link.url}" class="px-3 py-2 rounded-md hover:text-primary transition-colors" 
            aria-label="${link.ariaLabel || link.text}">
            ${link.text}
        </a>`
    ).join('');
    
    // Generate mobile nav links HTML
    const mobileNavLinks = links.map(link => 
        `<a href="${link.url}" class="block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
            ${link.text}
        </a>`
    ).join('');
    
    return `
        <nav class="fixed w-full bg-white/80 backdrop-blur-md z-50 transition-colors duration-300" aria-label="Main navigation">
            <div class="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
                <a href="#home" class="text-xl md:text-2xl font-bold text-primary font-display" aria-label="Go to homepage">
                    ${logo}
                </a>
                
                <div class="flex items-center gap-6">
                    <div class="hidden md:flex gap-1">
                        ${navLinks}
                    </div>
                    
                    <button id="mobile-menu-button" class="md:hidden w-10 h-10 flex items-center justify-center" aria-label="Open mobile menu" aria-expanded="false" aria-controls="mobile-menu">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
            
            <!-- Mobile menu (hidden by default) -->
            <div id="mobile-menu" class="hidden md:hidden bg-white shadow-lg absolute w-full">
                <div class="container mx-auto px-4 py-3 space-y-1">
                    ${mobileNavLinks}
                </div>
            </div>
        </nav>
    `;
}

/**
 * Render hero section with terminal only
 */
function renderHero(hero, profile) {
    // Use hero content if provided, otherwise fall back to profile data
    const name = profile.name;
    const title = profile.title;
    const greeting = hero?.greeting || "Hello, I'm";
    const description = hero?.description || profile.bio || `Specializing in ${title}`;
    
    // Terminal feature (default to enabled)
    const terminalEnabled = hero?.terminal?.enabled !== false;
    const terminalLines = hero?.terminal?.lines || [
        "Hello World!",
        `I'm a ${title.toLowerCase()}`,
        "Welcome to my portfolio"
    ];
    
    // Social links (can be sourced from profile or hero)
    const socialLinks = (hero?.socialLinks || profile.socialLinks || []).map(link => 
        `<a href="${link.url}" class="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-primary" aria-label="${link.ariaLabel || `${link.name} profile`}">
            <i class="fab fa-${link.icon || link.name} text-xl"></i>
        </a>`
    ).join('');
    
    // CTA buttons
    const primaryCta = hero?.cta?.primary || { text: "View Projects", url: "#projects" };
    const secondaryCta = hero?.cta?.secondary || { text: "View Skills", url: "#skills" };
    
    return `
        <section id="home" class="pt-32 pb-20 md:pt-40 md:pb-32 px-4 relative overflow-hidden" aria-labelledby="hero-title">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 animate-gradient bg-[length:400%_400%] -z-10"></div>
            <div class="container mx-auto max-w-5xl relative">
                <div class="grid md:grid-cols-2 gap-8 items-center">
                    <div data-animation="animate__fadeInUp">
                        <p class="text-primary font-medium mb-2">${greeting}</p>
                        <h1 id="hero-title" class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display">${name}</h1>
                        <h2 class="text-xl md:text-2xl text-gray-600 mb-6">${title}</h2>
                        <p class="text-gray-700 mb-8 text-lg">${description}</p>
                        
                        <div class="flex flex-wrap gap-3">
                            <a href="${primaryCta.url}" class="px-6 py-3 bg-primary hover:bg-secondary text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center group" aria-label="${primaryCta.ariaLabel || primaryCta.text}">
                                <span>${primaryCta.text}</span>
                                <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                            </a>
                            <a href="${secondaryCta.url}" class="px-6 py-3 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all" aria-label="${secondaryCta.ariaLabel || secondaryCta.text}">
                                ${secondaryCta.text}
                            </a>
                        </div>
                    </div>
                    
                    ${terminalEnabled ? renderTerminal(terminalLines) : renderAvatarPlaceholder(profile)}
                </div>
                
                ${socialLinks ? `
                <div class="mt-16 md:mt-24 flex justify-center">
                    <div class="flex space-x-4">
                        ${socialLinks}
                    </div>
                </div>
                ` : ''}
            </div>
        </section>
    `;
}


/**
 * Render terminal visualization
 */
function renderTerminal(lines) {
    const terminalLines = lines.map(line => 
        `<p class="mb-2"><span class="prompt">➜</span> <span class="directory">~</span> ${line}</p>`
    ).join('');
    
    return `
        <div class="relative" data-animation="animate__fadeIn">
            <div class="w-full h-full aspect-square bg-gradient-to-br from-primary to-secondary rounded-full opacity-10 absolute -right-10 -top-10 animate-pulse"></div>
            <div class="terminal-window relative z-10">
                <div class="terminal-header">
                    <div class="terminal-dot red"></div>
                    <div class="terminal-dot yellow"></div>
                    <div class="terminal-dot green"></div>
                    <div class="terminal-title">terminal</div>
                </div>
                <div class="terminal-body">
                    ${terminalLines}
                    <p class="flex items-center">
                        <span class="prompt">➜</span> 
                        <span class="directory">~</span> 
                        <span class="cursor"></span>
                    </p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render avatar placeholder (if terminal is disabled)
 */
function renderAvatarPlaceholder(profile) {
    // Use profile avatar if provided
    if (profile.avatar) {
        return `
            <div class="relative" data-animation="animate__fadeIn">
                <div class="w-full h-full aspect-square bg-gradient-to-br from-primary to-secondary rounded-full opacity-10 absolute -right-10 -top-10 animate-pulse"></div>
                <div class="relative z-10 p-2 bg-white rounded-xl shadow-xl overflow-hidden">
                    <img src="${profile.avatar}" alt="${profile.name}" class="w-full h-auto rounded-lg" />
                </div>
            </div>
        `;
    }
    
    // Otherwise, create a gradient placeholder with initials
    const initials = getInitials(profile.name);
    
    return `
        <div class="relative" data-animation="animate__fadeIn">
            <div class="w-full h-full aspect-square bg-gradient-to-br from-primary to-secondary rounded-full opacity-10 absolute -right-10 -top-10 animate-pulse"></div>
            <div class="relative z-10 aspect-square bg-gradient-to-br from-primary to-secondary rounded-xl shadow-xl flex items-center justify-center">
                <span class="text-white text-6xl font-bold">${initials}</span>
            </div>
        </div>
    `;
}

/**
 * Render About section with integrated profile photo
 */
function renderAbout(about, profile) {
    // Default title if not provided
    const title = about?.title || "About Me";
    const description = about?.description || "";
    
    // Check if profile has an avatar
    const hasAvatar = profile && profile.avatar && profile.avatar.trim() !== '';
    
    // Feature cards
    const cards = (about?.cards || []).map((card, index) => 
        `<div class="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover-card" data-animation="animate__fadeInUp" data-animation-delay="${index * 200}ms">
            <div class="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                <i class="fas fa-${card.icon || 'star'} text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">${card.title}</h3>
            <p class="text-gray-700">
                ${card.description}
            </p>
        </div>`
    ).join('');
    
    // Additional passion statement
    const passion = about?.passion ? 
        `<div class="mt-16 text-center" data-animation="animate__fadeIn">
            <p class="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
                ${about.passion}
            </p>
            <a href="#experience" class="inline-flex items-center text-primary hover:text-secondary font-medium group">
                View my experience <i class="fas fa-arrow-down ml-2 group-hover:translate-y-1 transition-transform"></i>
            </a>
        </div>` : '';
    
    return `
        <section id="about" class="py-20 px-4 bg-white transition-colors duration-300" aria-labelledby="about-title">
            <div class="container mx-auto max-w-5xl">
                <div class="flex flex-col items-center text-center mb-16" data-animation="animate__fadeIn">
                    <h2 id="about-title" class="text-3xl md:text-4xl font-bold mb-4 font-display">${title}</h2>
                    <div class="w-20 h-1 bg-primary mb-6"></div>
                </div>
                
                ${hasAvatar ? `
                <!-- About content with photo -->
                <div class="grid md:grid-cols-12 gap-10 mb-16 items-center">
                    <!-- Photo column -->
                    <div class="md:col-span-4 flex justify-center" data-animation="animate__fadeInLeft">
                        <div class="about-photo-container">
                            <div class="about-photo-bg"></div>
                            <div class="about-photo">
                                <img src="${profile.avatar}" alt="${profile.name}" class="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                    
                    <!-- Description column -->
                    <div class="md:col-span-8" data-animation="animate__fadeInRight">
                        <p class="text-lg text-gray-700 mb-6">
                            ${description}
                        </p>
                    </div>
                </div>
                ` : `
                <!-- About content without photo -->
                <div class="mb-16" data-animation="animate__fadeIn">
                    <p class="max-w-2xl text-lg text-gray-700 mx-auto text-center">
                        ${description}
                    </p>
                </div>
                `}
                
                ${cards ? `
                <div class="grid md:grid-cols-${Math.min(about.cards.length, 3)} gap-8">
                    ${cards}
                </div>
                ` : ''}
                
                ${passion}
            </div>
        </section>
    `;
}

/**
 * Render Experience section
 */
function renderExperience(experience) {
    // Default values
    const title = experience?.title || "Work Experience";
    const description = experience?.description || "";
    const layout = experience?.layout || "timeline";
    
    // Generate job items based on layout
    let jobsContent = '';
    
    if (layout === "timeline") {
        jobsContent = renderExperienceTimeline(experience.jobs || []);
    } else if (layout === "cards") {
        jobsContent = renderExperienceCards(experience.jobs || []);
    } else {
        jobsContent = renderExperienceList(experience.jobs || []);
    }
    
    return `
        <section id="experience" class="py-20 px-4 bg-gray-50 transition-colors duration-300" aria-labelledby="experience-title">
            <div class="container mx-auto max-w-5xl">
                <div class="flex flex-col items-center text-center mb-16" data-animation="animate__fadeIn">
                    <h2 id="experience-title" class="text-3xl md:text-4xl font-bold mb-4 font-display">${title}</h2>
                    <div class="w-20 h-1 bg-primary mb-6"></div>
                    <p class="max-w-2xl text-lg text-gray-700">
                        ${description}
                    </p>
                </div>
                
                ${jobsContent}
            </div>
        </section>
    `;
}

/**
 * Render Experience section with timeline layout
 */
function renderExperienceTimeline(jobs) {
    if (!jobs || jobs.length === 0) {
        return '<p class="text-center text-gray-500">No work experience listed.</p>';
    }
    
    const jobItems = jobs.map((job, index) => {
        const achievements = (job.achievements || []).map(achievement => 
            `<li class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>${achievement}</span>
            </li>`
        ).join('');
        
        const skills = (job.skills || []).map(skill => 
            `<span class="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">${skill}</span>`
        ).join('');
        
        return `
            <div class="md:flex items-center mb-24 relative" data-animation="animate__fadeIn">
                <div class="timeline-dot"></div>
                
                <div class="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                    <span class="text-gray-500">${job.period}</span>
                    <h3 class="text-xl font-semibold text-primary mb-1">${job.company}</h3>
                    <p class="text-gray-600 italic mb-2">${job.location || ''}</p>
                    <p class="font-medium text-lg mb-4">${job.position}</p>
                </div>
                
                <div class="md:w-1/2 md:pl-12">
                    <div class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover-card">
                        ${achievements ? `
                        <ul class="space-y-3 text-gray-700 mb-4">
                            ${achievements}
                        </ul>
                        ` : ''}
                        
                        ${skills ? `
                        <div class="flex flex-wrap gap-2">
                            ${skills}
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="relative">
            <div class="timeline-line"></div>
            ${jobItems}
        </div>
    `;
}

/**
 * Render Experience section with cards layout
 */
function renderExperienceCards(jobs) {
    if (!jobs || jobs.length === 0) {
        return '<p class="text-center text-gray-500">No work experience listed.</p>';
    }
    
    const jobCards = jobs.map((job, index) => {
        const achievements = (job.achievements || []).map(achievement => 
            `<li class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>${achievement}</span>
            </li>`
        ).join('');
        
        const skills = (job.skills || []).map(skill => 
            `<span class="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">${skill}</span>`
        ).join('');
        
        return `
            <div class="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 hover-card" data-animation="animate__fadeInUp" data-animation-delay="${index * 100}ms">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-semibold text-primary">${job.company}</h3>
                            <p class="text-gray-600 italic">${job.location || ''}</p>
                        </div>
                        <span class="text-gray-500 text-sm">${job.period}</span>
                    </div>
                    
                    <p class="font-medium text-lg mb-4">${job.position}</p>
                    
                    ${achievements ? `
                    <ul class="space-y-3 text-gray-700 mb-4">
                        ${achievements}
                    </ul>
                    ` : ''}
                    
                    ${skills ? `
                    <div class="flex flex-wrap gap-2 mt-4">
                        ${skills}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="grid md:grid-cols-2 gap-6">
            ${jobCards}
        </div>
    `;
}

/**
 * Render Experience section with list layout
 */
function renderExperienceList(jobs) {
    if (!jobs || jobs.length === 0) {
        return '<p class="text-center text-gray-500">No work experience listed.</p>';
    }
    
    const jobItems = jobs.map((job, index) => {
        const achievements = (job.achievements || []).map(achievement => 
            `<li class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>${achievement}</span>
            </li>`
        ).join('');
        
        const skills = (job.skills || []).map(skill => 
            `<span class="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">${skill}</span>`
        ).join('');
        
        return `
            <div class="mb-10 last:mb-0" data-animation="animate__fadeInUp" data-animation-delay="${index * 100}ms">
                <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <h3 class="text-xl font-semibold text-primary mb-1 md:mb-0">${job.company}</h3>
                    <span class="text-gray-500">${job.period}</span>
                </div>
                
                <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <p class="font-medium">${job.position}</p>
                    <p class="text-gray-600 italic">${job.location || ''}</p>
                </div>
                
                ${achievements ? `
                <ul class="space-y-3 text-gray-700 mb-4">
                    ${achievements}
                </ul>
                ` : ''}
                
                ${skills ? `
                <div class="flex flex-wrap gap-2">
                    ${skills}
                </div>
                ` : ''}
                
                <div class="w-full h-px bg-gray-200 mt-10"></div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="bg-white rounded-lg p-6 md:p-8 shadow-lg">
            ${jobItems}
        </div>
    `;
}

/**
 * Render Projects section
 */
function renderProjects(projects) {
    // Default values
    const title = projects?.title || "Key Projects";
    const description = projects?.description || "";
    const layout = projects?.layout || "featured";
    
    // Get project list with fallback
    const projectList = projects?.list || [];
    
    if (projectList.length === 0) {
        return `
            <section id="projects" class="py-20 px-4 bg-white transition-colors duration-300" aria-labelledby="projects-title">
                <div class="container mx-auto max-w-5xl">
                    <div class="flex flex-col items-center text-center mb-6" data-animation="animate__fadeIn">
                        <h2 id="projects-title" class="text-3xl md:text-4xl font-bold mb-4 font-display">${title}</h2>
                        <div class="w-20 h-1 bg-primary mb-6"></div>
                        <p class="max-w-2xl text-lg text-gray-700">
                            ${description}
                        </p>
                    </div>
                    <p class="text-center text-gray-500">No projects listed.</p>
                </div>
            </section>
        `;
    }
    
    // Generate project content based on layout
    let projectsContent = '';
    
    if (layout === "featured") {
        projectsContent = renderProjectsFeatured(projectList);
    } else if (layout === "grid") {
        projectsContent = renderProjectsGrid(projectList);
    } else {
        projectsContent = renderProjectsList(projectList);
    }
    
    return `
        <section id="projects" class="py-20 px-4 bg-white transition-colors duration-300" aria-labelledby="projects-title">
            <div class="container mx-auto max-w-5xl">
                <div class="flex flex-col items-center text-center mb-16" data-animation="animate__fadeIn">
                    <h2 id="projects-title" class="text-3xl md:text-4xl font-bold mb-4 font-display">${title}</h2>
                    <div class="w-20 h-1 bg-primary mb-6"></div>
                    <p class="max-w-2xl text-lg text-gray-700">
                        ${description}
                    </p>
                </div>
                
                ${projectsContent}
            </div>
        </section>
    `;
}

/**
 * Render Projects section with featured layout (first project highlighted)
 */
function renderProjectsFeatured(projects) {
    if (!projects || projects.length === 0) return '';
    
    // Get the first project as the featured one
    const featuredProject = projects.find(p => p.featured) || projects[0];
    const otherProjects = projects.filter(p => p !== featuredProject);
    
    // Featured project metrics
    const featuredMetrics = (featuredProject.metrics || []).map(metric => 
        `<div class="relative pt-1">
            <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-medium text-gray-700">${metric.name}</span>
                <span class="text-xs font-medium text-gray-700">${metric.value}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="skill-bar bg-green-500 h-2 rounded-full" data-level="${metric.value}"></div>
            </div>
        </div>`
    ).join('');
    
    // Featured project tags
    const featuredTags = (featuredProject.tags || []).map(tag => 
        `<span class="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">${tag}</span>`
    ).join('');
    
    // Other projects HTML
    const otherProjectsHtml = otherProjects.map((project, index) => {
        const tags = (project.tags || []).map(tag => 
            `<span class="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">${tag}</span>`
        ).join('');
        
        const metrics = (project.metrics || []).map(metric => 
            `<div class="relative pt-1">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-medium text-gray-700">${metric.name}</span>
                    <span class="text-xs font-medium text-gray-700">${metric.value}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="skill-bar bg-green-500 h-2 rounded-full" data-level="${metric.value}"></div>
                </div>
            </div>`
        ).join('');
        
        const links = [];
        if (project.projectUrl) {
            links.push(`<a href="${project.projectUrl}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary transition-colors" aria-label="View project">
                <i class="fas fa-external-link-alt"></i>
            </a>`);
        }
        if (project.repoUrl) {
            links.push(`<a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary transition-colors" aria-label="View code repository">
                <i class="fab fa-github"></i>
            </a>`);
        }
        const linksHtml = links.length > 0 ? 
            `<div class="absolute top-4 right-4 flex space-x-3">${links.join('')}</div>` : '';
        
        return `
            <div class="md:col-span-6 group" data-animation="animate__fadeInUp" data-animation-delay="${index * 200}ms">
                <div class="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 h-full hover-card relative">
                    <div class="p-6">
                        ${linksHtml}
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                            <i class="fas fa-${project.icon || 'code'} text-xl"></i>
                        </div>
                        <h3 class="text-lg font-bold mb-2">${project.title}</h3>
                        ${tags ? `
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${tags}
                        </div>
                        ` : ''}
                        <p class="text-gray-700 mb-4">
                            ${project.description}
                        </p>
                        ${metrics ? `<div class="space-y-3">${metrics}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Featured project links
    const featuredLinks = [];
    if (featuredProject.projectUrl) {
        featuredLinks.push(`<a href="${featuredProject.projectUrl}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary transition-colors" aria-label="View project">
            <i class="fas fa-external-link-alt mr-1"></i> Live Demo
        </a>`);
    }
    if (featuredProject.repoUrl) {
        featuredLinks.push(`<a href="${featuredProject.repoUrl}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary transition-colors" aria-label="View code repository">
            <i class="fab fa-github mr-1"></i> Source Code
        </a>`);
    }
    const featuredLinksHtml = featuredLinks.length > 0 ? 
        `<div class="mt-4 flex space-x-4">${featuredLinks.join('')}</div>` : '';
    
    return `
        <div class="grid md:grid-cols-12 gap-8">
            <!-- Featured Project -->
            <div class="md:col-span-12 group" data-animation="animate__fadeInUp">
                <div class="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 h-full hover-card">
                    <div class="p-6 md:p-8">
                        <div class="flex flex-col md:flex-row md:items-center gap-6">
                            <div class="md:w-1/3">
                                <div class="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                                    <i class="fas fa-${featuredProject.icon || 'star'} text-2xl"></i>
                                </div>
                                <h3 class="text-xl font-bold mb-2">${featuredProject.title}</h3>
                                ${featuredTags ? `
                                <div class="flex flex-wrap gap-2 mb-4">
                                    ${featuredTags}
                                </div>
                                ` : ''}
                                ${featuredLinksHtml}
                            </div>
                            <div class="md:w-2/3">
                                <p class="text-gray-700 mb-4">
                                    ${featuredProject.description}
                                </p>
                                ${featuredMetrics ? `
                                <div class="space-y-3">
                                    ${featuredMetrics}
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Other Projects -->
            ${otherProjectsHtml}
        </div>
    `;
}

/**
 * Render Projects section with grid layout
 */
function renderProjectsGrid(projects) {
    if (!projects || projects.length === 0) return '';
    
    const projectCards = projects.map((project, index) => {
        const tags = (project.tags || []).map(tag => 
            `<span class="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">${tag}</span>`
        ).join('');
        
        const links = [];
        if (project.projectUrl) {
            links.push(`<a href="${project.projectUrl}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary transition-colors" aria-label="View project">
                <i class="fas fa-external-link-alt"></i>
            </a>`);
        }
        if (project.repoUrl) {
            links.push(`<a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary transition-colors" aria-label="View code repository">
                <i class="fab fa-github"></i>
            </a>`);
        }
        const linksHtml = links.length > 0 ? 
            `<div class="absolute top-4 right-4 flex space-x-3">${links.join('')}</div>` : '';
        
        return `
            <div class="group" data-animation="animate__fadeInUp" data-animation-delay="${index * 100}ms">
                <div class="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 h-full hover-card relative">
                    ${project.imageUrl ? `
                    <div class="h-48 overflow-hidden">
                        <img src="${project.imageUrl}" alt="${project.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    ` : ''}
                    <div class="p-6">
                        ${linksHtml}
                        <div class="flex items-center mb-3">
                            <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3 text-primary">
                                <i class="fas fa-${project.icon || 'code'} text-lg"></i>
                            </div>
                            <h3 class="text-lg font-bold">${project.title}</h3>
                        </div>
                        <p class="text-gray-700 mb-4">
                            ${project.description}
                        </p>
                        ${tags ? `
                        <div class="flex flex-wrap gap-2 mt-4">
                            ${tags}
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Determine grid columns based on number of projects
    const gridCols = Math.min(3, projects.length);
    
    return `
        <div class="grid md:grid-cols-${gridCols} gap-6">
            ${projectCards}
        </div>
    `;
}

/**
 * Render Projects section with list layout
 */
function renderProjectsList(projects) {
    if (!projects || projects.length === 0) return '';
    
    const projectItems = projects.map((project, index) => {
        const tags = (project.tags || []).map(tag => 
            `<span class="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">${tag}</span>`
        ).join('');
        
        const links = [];
        if (project.projectUrl) {
            links.push(`<a href="${project.projectUrl}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary transition-colors" aria-label="View project">
                <i class="fas fa-external-link-alt mr-1"></i> Live Demo
            </a>`);
        }
        if (project.repoUrl) {
            links.push(`<a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary transition-colors" aria-label="View code repository">
                <i class="fab fa-github mr-1"></i> Source Code
            </a>`);
        }
        const linksHtml = links.length > 0 ? 
            `<div class="flex space-x-4 mt-3">${links.join('')}</div>` : '';
        
        return `
            <div class="mb-8 last:mb-0" data-animation="animate__fadeInUp" data-animation-delay="${index * 100}ms">
                <div class="bg-gray-50 rounded-xl p-6 shadow-lg border border-gray-100 hover-card">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 text-primary">
                            <i class="fas fa-${project.icon || 'code'} text-xl"></i>
                        </div>
                        <h3 class="text-xl font-bold">${project.title}</h3>
                    </div>
                    
                    <p class="text-gray-700 mb-4">
                        ${project.description}
                    </p>
                    
                    ${tags ? `
                    <div class="flex flex-wrap gap-2 mb-3">
                        ${tags}
                    </div>
                    ` : ''}
                    
                    ${linksHtml}
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="space-y-6">
            ${projectItems}
        </div>
    `;
}

/**
 * Render Skills section
 */
function renderSkills(skills) {
    // Default values
    const title = skills?.title || "Skills & Expertise";
    const description = skills?.description || "";
    
    // Skill categories
    const categories = skills?.categories || [];
    
    if (categories.length === 0) {
        return `
            <section id="skills" class="py-20 px-4 bg-gray-50 transition-colors duration-300" aria-labelledby="skills-title">
                <div class="container mx-auto max-w-5xl">
                    <div class="flex flex-col items-center text-center mb-6" data-animation="animate__fadeIn">
                        <h2 id="skills-title" class="text-3xl md:text-4xl font-bold mb-4 font-display">${title}</h2>
                        <div class="w-20 h-1 bg-blue-600 mb-6"></div>
                        <p class="max-w-2xl text-lg text-gray-700">
                            ${description}
                        </p>
                    </div>
                    <p class="text-center text-gray-500">No skills listed.</p>
                </div>
            </section>
        `;
    }
    
    // Generate skill categories
    const categoriesContent = categories.map((category, index) => {
        const isEven = index % 2 === 0;
        const animClass = isEven ? 'animate__fadeInLeft' : 'animate__fadeInRight';
        
        let skillsContent = '';
        
        // Choose rendering based on layout preference
        const layout = category.layout || 'bars';
        
        if (layout === 'bars') {
            skillsContent = renderSkillsAsBars(category.skills);
        } else if (layout === 'tags') {
            skillsContent = renderSkillsAsTags(category.skills);
        } else if (layout === 'icons') {
            skillsContent = renderSkillsAsIcons(category.skills);
        }
        
        return `
            <div data-animation="${animClass}">
                <h3 class="text-xl font-bold mb-6 flex items-center text-gray-800">
                    ${category.icon ? `<i class="fas fa-${category.icon} mr-3 text-primary"></i>` : ''}
                    ${category.title}
                </h3>
                
                ${skillsContent}
            </div>
        `;
    }).join('');
    
    // Certifications section
    let certificationsSection = '';
    if (skills.certifications?.enabled !== false && skills.certifications?.list?.length > 0) {
        const certifications = skills.certifications.list.map(cert => 
            `<div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all border border-gray-100 flex items-center">
                <i class="fas fa-certificate text-primary mr-3 text-xl"></i>
                <span class="font-medium">${cert}</span>
            </div>`
        ).join('');
        
        certificationsSection = `
            <div class="mt-16" data-animation="animate__fadeIn">
                <h3 class="text-xl font-bold mb-6 flex items-center text-gray-800">
                    <i class="fas fa-${skills.certifications.icon || 'award'} mr-3 text-primary"></i>
                    ${skills.certifications.title || 'Certifications'}
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${certifications}
                </div>
            </div>
        `;
    }
    
    return `
        <section id="skills" class="py-20 px-4 bg-gray-50 transition-colors duration-300" aria-labelledby="skills-title">
            <div class="container mx-auto max-w-5xl">
                <div class="flex flex-col items-center text-center mb-16" data-animation="animate__fadeIn">
                    <h2 id="skills-title" class="text-3xl md:text-4xl font-bold mb-4 font-display">${title}</h2>
                    <div class="w-20 h-1 bg-primary mb-6"></div>
                    <p class="max-w-2xl text-lg text-gray-700">
                        ${description}
                    </p>
                </div>
                
                <div class="grid md:grid-cols-${Math.min(categories.length, 2)} gap-10">
                    ${categoriesContent}
                </div>
                
                ${certificationsSection}
            </div>
        </section>
    `;
}

/**
 * Render skills as progress bars
 */
function renderSkillsAsBars(skills) {
    if (!skills || skills.length === 0) return '';
    
    return `
        <div class="space-y-4">
            ${skills.map(skill => `
                <div>
                    <div class="flex justify-between mb-1">
                        <span class="text-gray-700">${skill.name}</span>
                        <span class="text-gray-700">${skill.level}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="skill-bar bg-blue-600 h-2.5 rounded-full" data-level="${skill.level}"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Render skills as tags
 */
function renderSkillsAsTags(skills) {
    if (!skills || skills.length === 0) return '';
    
    return `
        <div class="flex flex-wrap gap-3">
            ${skills.map(skill => `
                <span class="bg-white px-4 py-2 rounded-full shadow text-gray-800 hover:shadow-md transition-shadow">
                    ${skill.name}
                </span>
            `).join('')}
        </div>
    `;
}

/**
 * Render skills as icons
 */
function renderSkillsAsIcons(skills) {
    if (!skills || skills.length === 0) return '';
    
    return `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            ${skills.map(skill => `
                <div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all text-center">
                    <i class="${skill.icon ? `fab fa-${skill.icon}` : 'fas fa-code'} text-3xl mb-2 text-primary"></i>
                    <p class="font-medium">${skill.name}</p>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Render Education section
 */
function renderEducation(education) {
    // Default values
    const title = education?.title || "Education";
    
    // Get education list
    const schools = education?.schools || [];
    
    if (schools.length === 0) {
        return `
            <section id="education" class="py-20 px-4 bg-white transition-colors duration-300" aria-labelledby="education-title">
                <div class="container mx-auto max-w-5xl">
                    <div class="flex flex-col items-center text-center mb-6" data-animation="animate__fadeIn">
                        <h2 id="education-title" class="text-3xl md:text-4xl font-bold mb-4 font-display">${title}</h2>
                        <div class="w-20 h-1 bg-primary mb-6"></div>
                    </div>
                    <p class="text-center text-gray-500">No education history listed.</p>
                </div>
            </section>
        `;
    }
    
    // Generate HTML for each school
    const schoolsHtml = schools.map((school, index) => {
        const focusAreas = (school.focusAreas || []).map(area => 
            `<li class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>${area}</span>
            </li>`
        ).join('');
        
        const activities = (school.activities || []).map(activity => 
            `<li class="flex items-start">
                <i class="fas fa-trophy text-yellow-500 mt-1 mr-2"></i>
                <span>${activity}</span>
            </li>`
        ).join('');
        
        return `
            <div class="bg-gray-50 rounded-xl overflow-hidden shadow-lg p-6 md:p-8 border border-gray-100 mb-8 last:mb-0" data-animation="animate__fadeInUp" data-animation-delay="${index * 200}ms">
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="md:w-1/4">
                        <div class="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                            <i class="fas fa-${school.icon || 'graduation-cap'} text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">${school.name}</h3>
                        ${school.location ? `<p class="text-gray-600 mb-4">${school.location}</p>` : ''}
                        <div class="text-sm text-gray-600 mb-4">
                            <p>${school.period}</p>
                            <p class="font-medium mt-2">${school.degree}</p>
                            <p>${school.field}</p>
                            ${school.gpa ? `<p class="mt-2">GPA: ${school.gpa}</p>` : ''}
                        </div>
                    </div>
                    
                    <div class="md:w-3/4">
                        ${(focusAreas || activities) ? `
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            ${focusAreas ? `
                            <div>
                                <h4 class="text-lg font-semibold mb-3 text-gray-800">Focus Areas</h4>
                                <ul class="space-y-2 text-gray-700">
                                    ${focusAreas}
                                </ul>
                            </div>
                            ` : ''}
                            
                            ${activities ? `
                            <div>
                                <h4 class="text-lg font-semibold mb-3 text-gray-800">Activities & Achievements</h4>
                                <ul class="space-y-2 text-gray-700">
                                    ${activities}
                                </ul>
                            </div>
                            ` : ''}
                        </div>
                        ` : ''}
                        
                        ${school.capstoneProject ? `
                        <div>
                            <h4 class="text-lg font-semibold mb-3 text-gray-800">Capstone Project</h4>
                            <p class="text-gray-700">
                                ${school.capstoneProject}
                            </p>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <section id="education" class="py-20 px-4 bg-white transition-colors duration-300" aria-labelledby="education-title">
            <div class="container mx-auto max-w-5xl">
                <div class="flex flex-col items-center text-center mb-16" data-animation="animate__fadeIn">
                    <h2 id="education-title" class="text-3xl md:text-4xl font-bold mb-4 font-display">${title}</h2>
                    <div class="w-20 h-1 bg-primary mb-6"></div>
                </div>
                
                ${schoolsHtml}
            </div>
        </section>
    `;
}

/**
 * Render Contact section - with form removed but contact info kept
 */
function renderContact(contact) {
    // Default values
    const title = contact?.title || "Get In Touch";
    const description = contact?.description || "";
    
    // Contact info section only (form removed)
    let infoSection = '';
    if (contact?.info) {
        const infoTitle = contact.info.title || "Contact Information";
        
        // Contact items
        const contactItems = (contact.info.items || []).map(item => {
            if (item.isLink) {
                return `
                    <div class="flex items-start">
                        <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                            <i class="fas fa-${item.icon}"></i>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-800 mb-1">${item.title}</h4>
                            <a href="${item.url}" class="text-primary hover:text-secondary hover:underline transition-colors">${item.value}</a>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="flex items-start">
                        <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                            <i class="fas fa-${item.icon}"></i>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-800 mb-1">${item.title}</h4>
                            <p class="text-gray-700">${item.value}</p>
                        </div>
                    </div>
                `;
            }
        }).join('');
        
        // Availability section
        let availabilitySection = '';
        if (contact.info.availability?.enabled !== false) {
            availabilitySection = `
                <div class="mt-8">
                    <h4 class="font-medium text-gray-800 mb-3">${contact.info.availability.title || 'Availability'}</h4>
                    <p class="text-gray-700 mb-4">
                        ${contact.info.availability.text || 'Currently available for new opportunities.'}
                    </p>
                    ${contact.info.availability.level ? `
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div class="skill-bar bg-green-600 h-2.5 rounded-full" data-level="${contact.info.availability.level}"></div>
                    </div>
                    <p class="text-sm text-gray-500">${contact.info.availability.label || `Current availability: ${contact.info.availability.level}`}</p>
                    ` : ''}
                </div>
            `;
        }
        
        infoSection = `
            <div class="mx-auto max-w-md bg-white rounded-xl shadow-lg p-6 border border-gray-100" data-animation="animate__fadeIn">
                <h3 class="text-xl font-bold mb-6 text-gray-800">${infoTitle}</h3>
                
                <div class="space-y-6">
                    ${contactItems}
                </div>
                
                ${availabilitySection}
            </div>
        `;
    }
    
    return `
        <section id="contact" class="py-20 px-4 bg-gradient-to-b from-gray-50 to-gray-100 transition-colors duration-300 contact-section" aria-labelledby="contact-title">
            <div class="container mx-auto max-w-5xl">
                <div class="flex flex-col items-center text-center mb-16" data-animation="animate__fadeIn">
                    <h2 id="contact-title" class="text-3xl md:text-4xl font-bold mb-4 font-display">${title}</h2>
                    <div class="w-20 h-1 bg-primary mb-6"></div>
                    <p class="max-w-2xl text-lg text-gray-700">
                        ${description}
                    </p>
                </div>
                
                ${infoSection}
            </div>
        </section>
    `;
}

/**
 * Render Footer section
 */
function renderFooter(footer, profile) {
    // Use profile name if available
    const name = profile?.name || '';
    const title = profile?.title || '';
    
    // Default logo
    const logo = footer?.logo || `<span class="text-blue-400 mr-1">&lt;</span>${getInitials(name)}<span class="text-blue-400 ml-1">/&gt;</span>`;
    
    // Default tagline
    const tagline = footer?.tagline || title;
    
    // Footer links - Remove Contact link
    const links = (footer?.links || [
        {text: "About", url: "#about"},
        {text: "Experience", url: "#experience"},
        {text: "Projects", url: "#projects"},
        {text: "Skills", url: "#skills"}
    ]).map(link => 
        `<a href="${link.url}" class="text-gray-300 hover:text-white transition">${link.text}</a>`
    ).join('');
    
    // Social links (reuse from profile if not provided)
    const socialLinks = (footer?.socialLinks || profile?.socialLinks || []).map(link => 
        `<a href="${link.url}" class="text-gray-300 hover:text-white transition" aria-label="${link.ariaLabel || ''}">
            <i class="fab fa-${link.icon || link.name} text-xl"></i>
        </a>`
    ).join('');
    
    // Copyright
    const copyright = footer?.copyright || `© ${new Date().getFullYear()} ${name}. All rights reserved.`;
    
    return `
        <footer class="bg-gray-800 text-white py-12 px-4 transition-colors duration-300">
            <div class="container mx-auto max-w-5xl">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <div class="mb-8 md:mb-0">
                        <a href="#" class="text-2xl font-bold text-white font-display flex items-center">
                            ${logo}
                        </a>
                        <p class="text-gray-400 mt-2">${tagline}</p>
                    </div>
                    
                    <div class="flex flex-wrap justify-center gap-6">
                        ${links}
                    </div>
                    
                    <div class="mt-8 md:mt-0 flex space-x-4">
                        ${socialLinks}
                    </div>
                </div>
                
                <div class="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p class="text-gray-400">${copyright}</p>
                </div>
            </div>
        </footer>
    `;
}

/**
 * Get initials from a name
 */
function getInitials(name) {
    if (!name) return 'DP'; // Default: Developer Portfolio
    
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}