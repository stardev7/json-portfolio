# Developer Portfolio Website

A beautiful, interactive, and customizable portfolio website template for developers. This system allows you to create a professional online presence without writing code by simply editing a JSON configuration file.


## Features

- **JSON-driven Content**: Update all content without touching code
- **Responsive Design**: Perfect experience on mobile, tablet, and desktop
- **Interactive Animations**: Smooth scroll-triggered animations
- **Dark/Light Mode**: Automatic detection with manual override
- **Terminal Visualization**: Interactive terminal-style element in hero section
- **Skill Visualizations**: Animated skill bars and progress indicators
- **Work Timeline**: Chronological display of work experience
- **Project Showcases**: Highlight your key projects with details
- **Contact Information**: Easy ways for visitors to reach you

## Quick Start

1. Download or clone this repository
2. Edit the `data/content.json` file with your personal information
3. Add your profile photo to the `assets/images` directory
4. Deploy the files to any web hosting service
5. Enjoy your new portfolio!

## Customizing Your Portfolio

### Adding Your Photo

To add your photo while keeping the terminal visualization:

1. Add your photo to the `assets/images` directory
2. In `data/content.json`, add the path to your profile section:

```json
"profile": {
  "name": "Your Name",
  "title": "Your Title",
  "avatar": "assets/images/your-photo.jpg",
  ...
}
```

The photo will appear alongside the terminal in the hero section.

### Customizing Content

All content is managed through the `data/content.json` file. Here's how to customize each section:

#### Basic Metadata

```json
"meta": {
  "title": "Your Name | Your Title",
  "description": "SEO description for your portfolio",
  "themeColor": "blue", 
  "accentColor": "indigo"
}
```

Available theme colors: `blue`, `green`, `purple`, `orange`

#### Profile Information

```json
"profile": {
  "name": "Your Name",
  "title": "Your Professional Title",
  "location": "Your Location",
  "bio": "Short professional summary",
  "avatar": "assets/images/your-photo.jpg"
}
```

#### Navigation Bar

```json
"navbar": {
  "logo": "<YN/>", 
  "links": [
    {"text": "About", "url": "#about"},
    {"text": "Experience", "url": "#experience"},
    {"text": "Projects", "url": "#projects"},
    {"text": "Skills", "url": "#skills"},
    {"text": "Contact", "url": "#contact"}
  ]
}
```

#### Hero Section

```json
"hero": {
  "greeting": "Hello, I'm",
  "description": "Custom description with <span class=\"text-blue-600\">highlighted</span> text",
  "terminal": {
    "enabled": true,
    "lines": [
      "Hello World!",
      "I build things for the web",
      "Welcome to my portfolio"
    ]
  }
}
```

#### About Section

```json
"about": {
  "title": "About Me",
  "description": "Your detailed description",
  "cards": [
    {
      "icon": "code", 
      "title": "Frontend Development",
      "description": "Description of your frontend skills"
    },
    {
      "icon": "server",
      "title": "Backend Development",
      "description": "Description of your backend skills"
    }
  ]
}
```

The `icon` field uses [Font Awesome](https://fontawesome.com/icons) icon names.

#### Experience Section

```json
"experience": {
  "title": "Work Experience",
  "description": "My professional journey",
  "layout": "timeline", // or "cards" or "list"
  "jobs": [
    {
      "company": "Company Name",
      "location": "Location",
      "position": "Your Title",
      "period": "Jan 2022 - Present",
      "achievements": [
        "Achievement 1",
        "Achievement 2"
      ],
      "skills": ["Skill 1", "Skill 2"]
    }
  ]
}
```

#### Projects Section

```json
"projects": {
  "title": "Key Projects",
  "description": "Highlighting my work",
  "layout": "featured", // or "grid" or "list"
  "list": [
    {
      "icon": "chart-line",
      "title": "Project Title",
      "description": "Project description",
      "tags": ["Tag1", "Tag2"],
      "projectUrl": "https://project-url.com",
      "repoUrl": "https://github.com/username/repo",
      "featured": true
    }
  ]
}
```

#### Skills Section

```json
"skills": {
  "title": "Skills & Expertise",
  "description": "My technical abilities",
  "categories": [
    {
      "title": "Frontend Development",
      "icon": "laptop-code",
      "layout": "bars", // or "tags" or "icons"
      "skills": [
        {"name": "React.js", "level": "95%"},
        {"name": "TypeScript", "level": "90%"}
      ]
    }
  ],
  "certifications": {
    "enabled": true,
    "title": "Certifications",
    "list": [
      "AWS Certified Solutions Architect",
      "MongoDB Developer Certification"
    ]
  }
}
```

#### Education Section

```json
"education": {
  "title": "Education",
  "schools": [
    {
      "name": "University Name",
      "location": "Location",
      "degree": "Degree Type",
      "field": "Field of Study",
      "period": "2018 - 2022",
      "gpa": "3.8/4.0",
      "focusAreas": ["Focus Area 1", "Focus Area 2"],
      "activities": ["Activity 1", "Activity 2"]
    }
  ]
}
```

#### Contact Section

```json
"contact": {
  "title": "Get In Touch",
  "description": "Contact section description",
  "info": {
    "items": [
      {
        "icon": "envelope",
        "title": "Email",
        "value": "your.email@example.com",
        "isLink": true,
        "url": "mailto:your.email@example.com"
      },
      {
        "icon": "github",
        "title": "GitHub",
        "value": "github.com/username",
        "isLink": true,
        "url": "https://github.com/username"
      }
    ]
  }
}
```

### Disabling Sections

To disable a section, set its `enabled` property to `false`:

```json
"education": {
  "enabled": false,
  ...
}
```

### Changing Colors

To change the color scheme, modify the `themeColor` and `accentColor` properties in the `meta` section. Available options:

- `blue` (default)
- `green`
- `purple`
- `orange`

For more advanced customization, edit the Tailwind config in `index.html`.

## Deployment Guide

### GitHub Pages

1. Create a GitHub repository
2. Push your portfolio files to the repository
3. Go to repository Settings > Pages
4. Select the branch to deploy (usually `main`)
5. Click Save, and your site will be published to `https://username.github.io/repository-name/`

### Netlify

1. Create a Netlify account at [netlify.com](https://www.netlify.com/)
2. Click "New site from Git"
3. Connect to your GitHub/GitLab/Bitbucket account
4. Select your repository
5. Click "Deploy site"

### Vercel

1. Create a Vercel account at [vercel.com](https://vercel.com/)
2. Click "Import Project"
3. Enter your repository URL or connect your GitHub account
4. Configure project settings (leave as default for simple sites)
5. Click "Deploy"

### Traditional Web Hosting

1. Compress all files into a ZIP archive
2. Log in to your web hosting control panel
3. Navigate to the file manager
4. Upload and extract the ZIP file to your desired directory (usually `public_html`)
5. Your portfolio is now live at your domain

## Customizing Animations

Animation settings can be customized in `assets/js/main.js`. Scroll-triggered animations use the IntersectionObserver API and the [Animate.css](https://animate.style/) library.

To add animations to an element, use the `data-animation` attribute:

```html
<div data-animation="animate__fadeInUp">Content here</div>
```

Common animation classes:
- `animate__fadeIn`
- `animate__fadeInUp`
- `animate__fadeInDown`
- `animate__slideInLeft`
- `animate__slideInRight`

## Browser Support

The portfolio website works in all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Internet Explorer is not supported.

## Credits & Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Font Awesome](https://fontawesome.com/) for icons
- [Animate.css](https://animate.style/) for animations
- [Google Fonts](https://fonts.google.com/) for typography

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please open an issue on the GitHub repository.