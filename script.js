/**
 * DEV_OPS PORTFOLIO WEB ENGINE
 * Core Javascript Logic (Vanilla ES6)
 * Handles Typewriter, Theme Engine, Shell Sandbox, Projects Grid Loader, Modals, and Form Validations
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Projects Database Fallback (if CORS restricts fetch during offline/file:// usage)
  const projectsFallback = [
    {
      id: "gitops-pipeline",
      title: "Cloud-Native GitOps CI/CD Pipeline",
      category: "devops",
      shortDescription: "Automated zero-downtime Canary deployments on Kubernetes using ArgoCD, Helm, and AWS EKS.",
      longDescription:
        "A robust, production-grade cloud-native GitOps deployment pipeline designed to automate application lifecycle management. It monitors application repositories, runs automated testing suites, builds containerized microservices, and synchronizes state seamlessly using declarative GitOps models.",
      techStack: ["Kubernetes", "ArgoCD", "Helm", "AWS EKS", "Terraform", "GitLab CI", "Prometheus"],
      architecture:
        "Developer Push -> GitLab CI Builds & Tests -> Semantic Release -> Git Config Update -> ArgoCD Syncs State -> AWS EKS Cluster (Canary Rollouts with Argo Rollouts & Prometheus Metrics Hook)",
      duration: "4 Weeks",
      highlights: [
        "Achieved 99.99% deployment uptime via automated Canary rollouts and dynamic rollbacks.",
        "Provisioned infrastructure-as-code (IaC) modular components securely with Terraform.",
        "Optimized Docker build times by 40% using multi-stage builds and layer caching.",
      ],
      githubLink: "https://github.com/example/gitops-kubernetes-cicd",
      liveLink: "https://github.com/example/gitops-kubernetes-cicd",
    },
    {
      id: "chaos-platform",
      title: "Automated Chaos Engineering Platform",
      category: "tooling",
      shortDescription:
        "Python-based resiliency testing suite injecting network latency and system faults into Kubernetes clusters.",
      longDescription:
        "An automated system reliability tool built to inject failure patterns (pod terminations, high CPU/Memory load, network degradation) into staging Kubernetes namespaces. Provides interactive resiliency scoring dashboards to prevent cascading runtime failures.",
      techStack: ["Python", "FastAPI", "Ansible", "Terraform", "Docker", "Grafana", "Chaos Mesh"],
      architecture:
        "FastAPI Web Controller -> Ansible Playbooks -> Chaos Mesh Custom Resources -> Staging Namespaces -> Real-time Telemetry Scrape -> Resilience Score Report Generator",
      duration: "6 Weeks",
      highlights: [
        "Identified and mitigated 5 major database connection pool vulnerabilities before production releases.",
        "Integrated dynamic Grafana panels showcasing system recovery times during active stress tests.",
        "Designed full RESTful control API using FastAPI with JWT protection and role-based permissions.",
      ],
      githubLink: "https://github.com/example/chaos-resilience-suite",
      liveLink: "https://github.com/example/chaos-resilience-suite",
    },
    {
      id: "microservices-gateway",
      title: "Distributed Payment & Analytics Gateway",
      category: "fullstack",
      shortDescription:
        "High-throughput microservices architecture with real-time telemetry, gRPC communication, and React frontend.",
      longDescription:
        "A highly performant distributed banking/payment gateway processing concurrent transactions securely. Connects a modern React dashboard to an ultra-fast Go/gRPC backend stack, supported by Redis cache pools and asynchronous task queues.",
      techStack: ["Go", "React", "gRPC", "Redis", "PostgreSQL", "Docker", "Nginx", "RabbitMQ"],
      architecture:
        "React Client -> Nginx Gateway -> Go Web API -> gRPC Internal Microservices -> RabbitMQ Event Bus -> PostgreSQL Transaction Ledger (with Redis read caches)",
      duration: "8 Weeks",
      highlights: [
        "Slashed query latency by 65% by implementing smart Redis cache-aside strategies.",
        "Handled 15,000+ concurrent requests per second with highly lightweight Go routines and gRPC channels.",
        "Designed responsive visual charting using React & Chart.js showcasing transaction metrics.",
      ],
      githubLink: "https://github.com/example/distributed-grpc-gateway",
      liveLink: "https://github.com/example/distributed-grpc-gateway",
    },
    {
      id: "serverless-telemetry",
      title: "Serverless Multi-Cluster Telemetry Agent",
      category: "cloud",
      shortDescription:
        "Lightweight serverless IoT and Edge telemetry aggregator with AWS Lambda, DynamoDB, and live dashboard.",
      longDescription:
        "A hyper-scalable, cost-efficient serverless backend and visual dashboard tracking resource telemetry from remote servers. Deployed fully serverless, processing thousands of device telemetry logs per minute with zero server maintenance.",
      techStack: ["Node.js", "AWS Lambda", "DynamoDB", "API Gateway", "AWS S3", "ChartJS", "Serverless Framework"],
      architecture:
        "Remote Telemetry Agents -> AWS API Gateway -> AWS Lambda Workers -> DynamoDB Timeseries Storage -> React SPA (loaded from CloudFront CDN & S3)",
      duration: "3 Weeks",
      highlights: [
        "Operated at $0 base hosting cost due to AWS Serverless Free Tier optimization.",
        "Established efficient DynamoDB partition key structures to enable fast real-time timeseries lookups.",
        "Built clean CSS-based dashboards with smooth transitions, custom alert filters, and SMS alerts.",
      ],
      githubLink: "https://github.com/example/serverless-telemetry-system",
      liveLink: "https://github.com/example/serverless-telemetry-system",
    },
  ];

  let projectsData = [...projectsFallback];

  /* ==========================================
     1. Typewriter Animation Engine
     ========================================== */
  const typewriterElement = document.getElementById("typewriter");
  if (typewriterElement) {
    const phrases = [
      "highly automated deployments.",
      "zero-downtime scaling setups.",
      "interactive developer utilities.",
      "premium full-stack services.",
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 120; // Typing Speed

    function type() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        delay = 60; // Deleting Speed
      } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        delay = 120; // Typing Speed
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        delay = 2000; // Pause at full word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 500; // Pause before typing new word
      }

      setTimeout(type, delay);
    }
    type();
  }

  /* ==========================================
     2. Theme Management Engine
     ========================================== */
  const htmlNode = document.documentElement;
  const themeBtn = document.getElementById("theme-btn");
  const themeDropdown = document.querySelector(".theme-dropdown");
  const themeMenu = document.getElementById("theme-menu");
  const themeOptions = document.querySelectorAll("[data-select-theme]");

  // Load Saved Theme or Default to Cyberpunk
  const storedTheme = localStorage.getItem("portfolio-theme") || "cyberpunk";
  setTheme(storedTheme);

  // Toggle dropdown visibility
  themeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle("open");
  });

  // Theme option clicks
  themeOptions.forEach((opt) => {
    opt.addEventListener("click", () => {
      const targetTheme = opt.getAttribute("data-select-theme");
      setTheme(targetTheme);
      themeDropdown.classList.remove("open");
    });
  });

  // Close dropdown on click outside
  document.addEventListener("click", () => {
    themeDropdown.classList.remove("open");
  });

  function setTheme(themeName) {
    htmlNode.setAttribute("data-theme", themeName);
    localStorage.setItem("portfolio-theme", themeName);

    // Update active highlight classes in dropdown
    themeOptions.forEach((opt) => {
      if (opt.getAttribute("data-select-theme") === themeName) {
        opt.style.fontWeight = "700";
        opt.style.background = "rgba(255, 255, 255, 0.08)";
      } else {
        opt.style.fontWeight = "500";
        opt.style.background = "transparent";
      }
    });
  }

  /* ==========================================
     3. Responsive Header & Navigation
     ========================================== */
  const navbar = document.getElementById("navbar");
  const navMenu = document.getElementById("nav-menu");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelectorAll(".nav-link");

  // Sticky border & blur on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    highlightActiveSection();
  });

  // Mobile Menu Toggle
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navMenu.classList.toggle("open");
    const toggleIcon = menuToggle.querySelector("i");
    if (navMenu.classList.contains("open")) {
      toggleIcon.setAttribute("data-lucide", "x");
    } else {
      toggleIcon.setAttribute("data-lucide", "menu");
    }
    lucide.createIcons();
  });

  // Close mobile menu when clicking nav link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      const toggleIcon = menuToggle.querySelector("i");
      toggleIcon.setAttribute("data-lucide", "menu");
      lucide.createIcons();
    });
  });

  // Close mobile menu clicking outside
  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains("open")) {
      navMenu.classList.remove("open");
      const toggleIcon = menuToggle.querySelector("i");
      toggleIcon.setAttribute("data-lucide", "menu");
      lucide.createIcons();
    }
  });

  // Sync scroll with navigation menu links
  const sections = document.querySelectorAll("section[id]");
  function highlightActiveSection() {
    let scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active");
        });
        const activeLink = document.getElementById(`link-${sectionId}`);
        if (activeLink) activeLink.classList.add("active");
      }
    });
  }

  /* ==========================================
     4. Projects Fetch, Render & Filters
     ========================================== */
  const projectsGrid = document.getElementById("projects-grid");
  const filterTabs = document.querySelectorAll(".filter-tab");

  // Load from local json database
  async function loadProjects() {
    try {
      const response = await fetch("projects.json");
      if (response.ok) {
        projectsData = await response.json();
      }
    } catch (e) {
      console.warn("Using fallback local projects database due to environment CORS policies.");
    } finally {
      renderProjects("all");
    }
  }

  function renderProjects(filterValue) {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = "";

    const filtered = filterValue === "all" ? projectsData : projectsData.filter((p) => p.category === filterValue);

    filtered.forEach((project, idx) => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.setAttribute("data-id", project.id);

      // Select visual icon based on tech or category
      let iconName = "cpu";
      if (project.category === "devops") iconName = "git-branch";
      else if (project.category === "fullstack") iconName = "layout-grid";
      else if (project.category === "tooling") iconName = "terminal";

      card.innerHTML = `
        <div class="project-card-header">
          <div class="project-icon-box">
            <i data-lucide="${iconName}"></i>
          </div>
          <span class="project-badge-tag">${project.category}</span>
        </div>
        <div class="project-card-body">
          <h3 class="project-card-title">${project.title}</h3>
          <p class="project-card-desc">${project.shortDescription}</p>
          <div class="project-card-tech">
            ${project.techStack
              .slice(0, 3)
              .map((tech) => `<span class="tech-badge">${tech}</span>`)
              .join("")}
            ${project.techStack.length > 3 ? `<span class="tech-badge">+${project.techStack.length - 3} more</span>` : ""}
          </div>
        </div>
        <div class="project-card-footer">
          <span class="project-learn-more">
            Inspect Architecture <i data-lucide="arrow-right"></i>
          </span>
          <div class="project-card-links">
            <a href="${project.githubLink}" target="_blank" class="card-icon-link" aria-label="Repository" onclick="event.stopPropagation()">
              <i data-lucide="github"></i>
            </a>
          </div>
        </div>
      `;

      // Set entry animation delay for stagger
      card.style.animation = `slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both`;
      card.style.animationDelay = `${idx * 0.08}s`;

      // Click card to open details modal
      card.addEventListener("click", () => {
        openProjectModal(project.id);
      });

      projectsGrid.appendChild(card);
    });

    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  // Filter click handlers
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const targetFilter = tab.getAttribute("data-filter");
      renderProjects(targetFilter);
    });
  });

  // Kickoff Load
  loadProjects();

  /* ==========================================
     5. Detailed Project Modals Layout
     ========================================== */
  const modalOverlay = document.getElementById("project-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  function openProjectModal(projectId) {
    const project = projectsData.find((p) => p.id === projectId);
    if (!project || !modalOverlay) return;

    // Populate modal content fields
    document.getElementById("modal-project-category").textContent = project.category.toUpperCase();
    document.getElementById("modal-project-title").textContent = project.title;
    document.getElementById("modal-project-duration").textContent = project.duration;
    document.getElementById("modal-project-long-desc").textContent = project.longDescription;
    document.getElementById("modal-project-architecture").textContent = project.architecture;

    // Links
    const modalGit = document.getElementById("modal-github-link");
    const modalLive = document.getElementById("modal-live-link");
    modalGit.setAttribute("href", project.githubLink);
    modalLive.setAttribute("href", project.liveLink);

    // Populate Tech stack badges
    const techContainer = document.getElementById("modal-project-tech-tags");
    techContainer.innerHTML = project.techStack.map((t) => `<span class="tech-badge">${t}</span>`).join("");

    // Populate Highlights lists
    const highlightsContainer = document.getElementById("modal-project-highlights");
    highlightsContainer.innerHTML = project.highlights.map((h) => `<li>${h}</li>`).join("");

    // Open transitions
    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Disable scroll background

    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  function closeProjectModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Re-enable scroll background
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeProjectModal);
  }

  // Click outside modal container closes it
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeProjectModal();
      }
    });
  }

  // Escape key closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("open")) {
      closeProjectModal();
    }
  });

  /* ==========================================
     6. Sandbox DevOps Command Line Terminal
     ========================================== */
  const terminalInput = document.getElementById("terminal-input");
  const terminalOutput = document.getElementById("terminal-output");
  const sessionTimeNode = document.getElementById("current-session-time");

  if (sessionTimeNode) {
    const d = new Date();
    sessionTimeNode.textContent = d.toISOString().slice(0, 19).replace("T", " ");
  }

  // Command History Buffer
  let commandHistory = [];
  let historyIndex = -1;

  if (terminalInput && terminalOutput) {
    // Focus terminal input when clicking inside the terminal container
    document.getElementById("main-terminal").addEventListener("click", () => {
      terminalInput.focus();
    });

    terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const command = terminalInput.value.trim();
        if (command) {
          executeCommand(command);
          commandHistory.push(command);
          historyIndex = commandHistory.length;
          terminalInput.value = "";
        }
      } else if (e.key === "ArrowUp") {
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex];
        }
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = "";
        }
        e.preventDefault();
      }
    });

    function printLine(text, className = "") {
      const div = document.createElement("div");
      div.className = `term-line ${className}`;
      div.innerHTML = text;
      terminalOutput.appendChild(div);
      terminalOutput.scrollTop = terminalOutput.scrollHeight; // Auto Scroll
    }

    function executeCommand(fullCommand) {
      // Print command prefix line
      printLine(`<span class="terminal-prompt">guest@devops-ops-shell:~$</span> ${fullCommand}`);

      const parts = fullCommand.toLowerCase().split(" ");
      const cmd = parts[0];
      const arg = parts.slice(1).join(" ");

      switch (cmd) {
        case "help":
          printLine("SYSTEM SHELL PERMITTED OPERATIONS LIST:", "text-accent");
          printLine("  <span class='term-highlight'>about</span>         - Details regarding systems career & focus");
          printLine("  <span class='term-highlight'>skills</span>        - Technical capabilities matrix");
          printLine("  <span class='term-highlight'>projects</span>      - List of loaded operations architectures");
          printLine(
            "  <span class='term-highlight'>inspect [id]</span>  - Open dynamic modal specifications for a project"
          );
          printLine(
            "  <span class='term-highlight'>neofetch</span>      - Run custom hardware/software system telemetry reporting"
          );
          printLine(
            "  <span class='term-highlight'>theme [name]</span>  - Instantly load layout theme (<span class='code-inline'>cyberpunk</span> | <span class='code-inline'>nebula</span> | <span class='code-inline'>glass-light</span>)"
          );
          printLine(
            "  <span class='term-highlight'>pipeline</span>      - Show and simulate the active AWS EC2 Docker CI/CD pipeline"
          );
          printLine(
            "  <span class='term-highlight'>contact</span>       - Secure mailbox and operational coordinate details"
          );
          printLine("  <span class='term-highlight'>clear</span>         - Flush active screen scroll buffer");
          break;

        case "about":
        case "cat":
          if (cmd === "cat" && arg === "about.md") {
            // alias
          }
          printLine("PROFILE META: Full-Stack Systems Engineer", "text-accent");
          printLine(
            "Over 5 years of professional focus orchestrating containerized clusters, defining resilient CI/CD structures, and coding beautiful, state-of-the-art interactive frontends.",
            "term-result"
          );
          printLine(
            "Focused on bridging operational gaps, standardizing deployment strategies (GitOps), and developing highly scalable microservice solutions.",
            "term-result"
          );
          break;

        case "skills":
          printLine("Ecosystem Competencies Database:", "text-accent");
          printLine("  <strong>Cloud & IaC:</strong> AWS (95%), Terraform (90%), GCP (80%)", "term-result");
          printLine("  <strong>Orchestration:</strong> Kubernetes (92%), Docker (95%), ArgoCD (88%)", "term-result");
          printLine(
            "  <strong>Core Backend:</strong> Go/Golang (85%), Python/FastAPI (90%), Shell Scripting (95%)",
            "term-result"
          );
          printLine(
            "  <strong>Frontend:</strong> React & NextJS (85%), Vanilla ES6 JS/HTML5/CSS3 (90%)",
            "term-result"
          );
          printLine("  <strong>Observability:</strong> Prometheus, Grafana, ELK Logging stack (88%)", "term-result");
          break;

        case "projects":
          printLine("Active Project Registry:", "text-accent");
          projectsData.forEach((p) => {
            printLine(`  • ID: <span class='term-highlight'>${p.id}</span> - ${p.title}`, "term-result");
          });
          printLine(
            "  <i>Type '<span class='code-inline'>inspect [id]</span>' to launch modal specifications. Example: <span class='code-inline'>inspect chaos-platform</span></i>"
          );
          break;

        case "inspect":
          if (!arg) {
            printLine("Error: Please specify a project ID. E.g. 'inspect gitops-pipeline'", "term-error");
          } else {
            const proj = projectsData.find((p) => p.id === arg);
            if (proj) {
              printLine(`Launching Modal Dashboard for: <span class='term-highlight'>${proj.title}</span>...`);
              openProjectModal(proj.id);
            } else {
              printLine(
                `Error: Project ID '${arg}' not found in registry. Type 'projects' to review logs.`,
                "term-error"
              );
            }
          }
          break;

        case "neofetch":
          const currentTheme = htmlNode.getAttribute("data-theme").toUpperCase();
          printLine(`
<pre class="text-accent" style="line-height:1.2; font-family: monospace; font-size:11px;">
   /\\_/\\      guest@devops-ops-shell
  ( o.o )     ----------------------
   > ^ <      OS: Custom Linux Shell Sandbox v2.4.1
  (  | |  )   Host: Portfolio SPA System Node
 (___|___)    Kernel: Chrome/Webkit Javascript Core
              Uptime: 100% (High Availability)
              Active Theme: ${currentTheme}
              Shell Interface: /bin/bash (Sandbox Sandbox)
              Shell Mode: Fully Interactive (Level 1)
</pre>
          `);
          break;

        case "theme":
          if (!arg) {
            printLine("Error: Theme command requires argument (cyberpunk | nebula | glass-light).", "term-error");
          } else if (["cyberpunk", "nebula", "glass-light"].includes(arg)) {
            setTheme(arg);
            printLine(`Success: Color theme configuration updated to '<span class='term-highlight'>${arg}</span>'.`);
          } else {
            printLine(`Error: Theme '${arg}' invalid. Options: 'cyberpunk', 'nebula', 'glass-light'.`, "term-error");
          }
          break;

        case "pipeline":
        case "cicd":
        case "ci-cd":
          printLine("INITIATING CI/CD PIPELINE TELEMETRY... [AWS EC2 TARGET]", "text-accent");
          printLine("Connecting to active GitHub Actions runner context...", "term-result");

          const pipelineSteps = [
            { desc: "Checkout Source Code & Load Environment Secrets", status: "SUCCESS" },
            { desc: "Setup Node.js Environment (v20)", status: "SUCCESS" },
            { desc: "Install validation dependencies (npm ci)", status: "SUCCESS" },
            { desc: "Run HTMLHint semantic structure validation (npm run lint:html)", status: "SUCCESS" },
            { desc: "Run ESLint JavaScript code quality checks (npm run lint:js)", status: "SUCCESS" },
            { desc: "Run Stylelint CSS architecture checks (npm run lint:css)", status: "SUCCESS" },
            { desc: "Run Prettier source formatting compliance checks (npm run format:check)", status: "SUCCESS" },
            { desc: "Setup QEMU & Docker Buildx runner engines", status: "SUCCESS" },
            { desc: "Build Docker image (nginx:alpine baseline)", status: "SUCCESS" },
            { desc: "Push Docker image to registry (danishdarga/portfolio:latest)", status: "SUCCESS" },
            { desc: "Establish secure SSH tunnel handshake to AWS EC2 VM host", status: "SUCCESS" },
            { desc: "Pull updated container image on target AWS VM host", status: "SUCCESS" },
            { desc: "Gracefully stop and clear previous portfolio web container", status: "SUCCESS" },
            { desc: "Deploy new container and map port 80 traffic", status: "ACTIVE" },
          ];

          let stepIdx = 0;
          function runSimulation() {
            if (stepIdx < pipelineSteps.length) {
              const s = pipelineSteps[stepIdx];
              const isLast = stepIdx === pipelineSteps.length - 1;
              const colorClass = isLast ? "text-accent" : "term-result";
              const statusText = isLast ? "[★ RUNNING]" : "[✔ SUCCESS]";
              printLine(`  ${statusText.padEnd(12)} - ${s.desc}`, colorClass);
              stepIdx++;
              setTimeout(runSimulation, 250);
            } else {
              printLine("<br>===============================================================");
              printLine(
                "STATUS: <span class='term-highlight'>DEPLOYMENT LIVE</span> ON AWS EC2 TARGET HOST",
                "text-accent"
              );
              printLine(
                "Network Endpoint: <a href='http://localhost' target='_blank' class='term-highlight'>http://&lt;EC2_PUBLIC_IP&gt;</a>",
                "term-result"
              );
              printLine("Image Registry: danishdarga/portfolio:latest", "term-result");
              printLine("Infrastructure State: 100% HEALTHY", "term-result");
              printLine("===============================================================");
            }
          }
          setTimeout(runSimulation, 200);
          break;

        case "contact":
          printLine("Secure Handshake Protocols:", "text-accent");
          printLine("  <strong>SMTP Connection:</strong> admin@sysdevops.io", "term-result");
          printLine("  <strong>Signal Coordinate:</strong> San Francisco, CA (Remote Friendly)", "term-result");
          printLine(
            "  <strong>RSA SSH Public Handshake:</strong> ssh-rsa AAAAB3NzaC1yc... (Copy from contact section)",
            "term-result"
          );
          break;

        case "clear":
          terminalOutput.innerHTML = "";
          break;

        default:
          printLine(
            `bash: command not found: '${cmd}'. Type '<span class='term-highlight'>help</span>' for lists of system operations.`,
            "term-error"
          );
      }
    }
  }

  /* ==========================================
     7. Form Interactive Validations & Transmissions
     ========================================== */
  const contactForm = document.getElementById("contact-form");
  const formFeedback = document.getElementById("form-feedback");
  const feedbackResetBtn = document.getElementById("feedback-reset-btn");

  const inputs = {
    name: document.getElementById("contact-name"),
    email: document.getElementById("contact-email"),
    subject: document.getElementById("contact-subject"),
    message: document.getElementById("contact-message"),
  };

  const errors = {
    name: document.getElementById("error-name"),
    email: document.getElementById("error-email"),
    subject: document.getElementById("error-subject"),
    message: document.getElementById("error-message"),
  };

  // Blur validation trigger
  if (contactForm) {
    Object.keys(inputs).forEach((key) => {
      const input = inputs[key];
      if (input) {
        input.addEventListener("blur", () => {
          validateField(key);
        });
        input.addEventListener("input", () => {
          // Clear error during active typing
          const wrapper = input.parentElement;
          if (wrapper) wrapper.classList.remove("error");
        });
      }
    });

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let isAllValid = true;
      Object.keys(inputs).forEach((key) => {
        const isValid = validateField(key);
        if (!isValid) isAllValid = false;
      });

      if (isAllValid) {
        // Trigger Transmit visual animation
        const submitBtn = document.getElementById("form-submit-btn");
        const submitBtnSpan = submitBtn.querySelector("span");
        const submitBtnIcon = submitBtn.querySelector("i");

        submitBtn.disabled = true;
        submitBtnSpan.textContent = "TRANSMITTING PACKAGE...";
        submitBtnIcon.setAttribute("data-lucide", "refresh-cw");
        submitBtnIcon.classList.add("blinking");
        if (typeof lucide !== "undefined") lucide.createIcons();

        // Simulate secure SMTP post
        setTimeout(() => {
          // Hide Form
          contactForm.classList.add("hidden");
          // Show successful delivery card
          formFeedback.classList.remove("hidden");

          // Reset button back to standard state
          submitBtn.disabled = false;
          submitBtnSpan.textContent = "TRANSMIT PACKAGE";
          submitBtnIcon.setAttribute("data-lucide", "send");
          submitBtnIcon.classList.remove("blinking");
          if (typeof lucide !== "undefined") lucide.createIcons();
        }, 1200);
      }
    });

    if (feedbackResetBtn) {
      feedbackResetBtn.addEventListener("click", () => {
        contactForm.reset();

        // Remove focus styling classes
        Object.keys(inputs).forEach((key) => {
          const wrapper = inputs[key]?.parentElement;
          if (wrapper) wrapper.classList.remove("error");
        });

        formFeedback.classList.add("hidden");
        contactForm.classList.remove("hidden");
      });
    }
  }

  function validateField(fieldName) {
    const input = inputs[fieldName];
    if (!input) return true;

    const val = input.value.trim();
    let isValid = true;
    let customErrorMsg = "";

    if (fieldName === "name") {
      isValid = val.length > 0;
      customErrorMsg = "Username must not be empty";
    } else if (fieldName === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(val);
      customErrorMsg = "Provide a valid SMTP address";
    } else if (fieldName === "subject") {
      isValid = val.length > 0;
      customErrorMsg = "Specify a subject topic";
    } else if (fieldName === "message") {
      isValid = val.length >= 15;
      customErrorMsg = "Message must contain at least 15 characters";
    }

    const wrapper = input.parentElement;
    if (wrapper) {
      const errorNode = errors[fieldName];
      if (!isValid) {
        wrapper.classList.add("error");
        if (errorNode) errorNode.textContent = customErrorMsg;
      } else {
        wrapper.classList.remove("error");
      }
    }

    return isValid;
  }
});
