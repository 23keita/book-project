// Gestion du Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});


document.addEventListener('DOMContentLoaded', function() {

    // Gestion du mode sombre (Dark Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const enableDarkMode = () => {
        body.classList.add('dark-mode');
        if (themeToggle) themeToggle.checked = true;
        localStorage.setItem('theme', 'dark');
    };

    const disableDarkMode = () => {
        body.classList.remove('dark-mode');
        if (themeToggle) themeToggle.checked = false;
        localStorage.setItem('theme', 'light');
    };


    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        enableDarkMode();
    } else {
        disableDarkMode(); // Assure que le thème clair est appliqué et le toggle est correct
    }

    // Gestion du menu hamburger pour mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });

        // Ferme le menu quand un lien est cliqué
        document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }));
    }

    // Carrousel de témoignages
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    if (testimonials.length > 0) {
        // Affiche le premier témoignage
        testimonials[currentTestimonial].classList.add('active');

        setInterval(() => {
            // Cache le témoignage actuel
            testimonials[currentTestimonial].classList.remove('active');

            // Passe au suivant
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;

            // Affiche le nouveau témoignage
            testimonials[currentTestimonial].classList.add('active');
        }, 7000); // Change de témoignage toutes les 7 secondes
    }

    // Animation d'apparition des sections au défilement
    const sectionsToAnimate = document.querySelectorAll('.animated-section');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Quand l'élément devient visible
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // On arrête d'observer l'élément une fois qu'il est visible pour ne pas répéter l'animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15 // Déclenche l'animation quand 15% de la section est visible
        });

        sectionsToAnimate.forEach(section => {
            observer.observe(section);
        });
    } else {
        // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
        sectionsToAnimate.forEach(section => section.classList.add('visible'));
    }

    // Glitch effect on hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Set data-text attribute for the CSS glitch effect
        heroTitle.setAttribute('data-text', heroTitle.textContent);
    }

    // Parallax effect on hero section
    const heroVideoWrapper = document.querySelector('.hero-video-wrapper');
    if (heroVideoWrapper) {
        window.addEventListener('scroll', function() {
            // This check prevents the effect on mobile where it can be janky
            if (window.innerWidth > 768) {
                const scrollPosition = window.scrollY;
                // The 0.5 factor creates the parallax effect. Adjust it for more or less effect.
                heroVideoWrapper.style.transform = `translateY(${scrollPosition * 0.5}px)`;
            }
        });
    }

    // Animation des chiffres clés au défilement
    const keyFiguresSection = document.querySelector('.key-figures-section');
    if (keyFiguresSection) {
        const animateKeyFigures = (entries, observer) => {
            entries.forEach(entry => {
                // Déclenche l'animation quand la section est visible
                if (entry.isIntersecting) {
                    const figures = entry.target.querySelectorAll('.figure');
                    figures.forEach(figure => {
                        const targetText = figure.textContent;
                        const target = parseInt(targetText.replace(/\D/g, ''));
                        const prefix = targetText.match(/^\D*/)[0] || '';
                        const suffix = targetText.match(/\D*$/)[0] || '';

                        figure.textContent = prefix + '0' + suffix; // Commence à 0

                        const duration = 2000; // Durée de l'animation en ms
                        const stepTime = 20; // Intervalle de mise à jour
                        const totalSteps = duration / stepTime;
                        const increment = target / totalSteps;
                        let current = 0;

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                clearInterval(timer);
                                figure.textContent = targetText; // Assure que la valeur finale est exacte
                            } else {
                                figure.textContent = prefix + Math.ceil(current) + suffix;
                            }
                        }, stepTime);
                    });
                    observer.unobserve(entry.target); // L'animation ne se joue qu'une fois
                }
            });
        };

        const keyFiguresObserver = new IntersectionObserver(animateKeyFigures, { threshold: 0.5 });
        keyFiguresObserver.observe(keyFiguresSection);
    }

    // Gestion du bouton "Retour en haut"
    const backToTopButton = document.getElementById('back-to-top-btn');

    window.addEventListener('scroll', () => {
        // Affiche le bouton si l'utilisateur a défilé de plus de 400px
        if (window.scrollY > 400) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Carte interactive sur la page de contact
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Coordonnées de Paris
        //const mapCoordinates = [48.8566, 2.3522];
        const mapCoordinates = [11.3236, -12.2864]; // Labe, Guinee
        const map = L.map('map').setView(mapCoordinates, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

       // Création d'une icône personnalisée
       var myIcon = L.icon({
           iconUrl: 'img/marker-icon.png', // Remplacez par le chemin de votre icône
           iconSize: [38, 50], // Taille de l'icône
           iconAnchor: [22, 50], // Point de l'icône qui correspondra à la position du marqueur
           popupAnchor: [-3, -76] // Point d'où la popup s'ouvre relativement à l'icône
       });

       L.marker(mapCoordinates, {icon: myIcon}).addTo(map)
           .bindPopup('<b>Booklite</b><br>Nos bureaux à Labé, Guinée.')
           .openPopup();

    // Blog: Pagination, Recherche et Filtres par Tag
    const blogSection = document.querySelector('.blog-section');

    if (blogSection) {
        const allPosts = Array.from(blogSection.querySelectorAll('.post-preview'));
        const postList = blogSection.querySelector('.post-list');
        const paginationContainer = blogSection.querySelector('.pagination');
        const searchInput = document.getElementById('search-input');
        const tagFilterContainer = blogSection.querySelector('.tag-filter-container');
        const noResultsMessage = document.getElementById('no-results-message');

        let state = {
            posts: allPosts,
            itemsPerPage: 3,
            currentPage: 1,
            searchTerm: '',
            activeTag: 'all'
        };

        function updateView() {
            // 1. Filter posts
            let filteredPosts = state.posts;

            if (state.activeTag !== 'all') {
                filteredPosts = filteredPosts.filter(post => {
                    const postTags = post.dataset.tags || '';
                    return postTags.split(',').includes(state.activeTag);
                });
            }

            if (state.searchTerm) {
                const searchTerm = state.searchTerm.toLowerCase();
                filteredPosts = filteredPosts.filter(post => {
                    const title = post.querySelector('h2 a').textContent.toLowerCase();
                    const content = post.querySelector('p').textContent.toLowerCase();
                    return title.includes(searchTerm) || content.includes(searchTerm);
                });
            }

            // 2. Handle "No Results" message
            noResultsMessage.style.display = filteredPosts.length === 0 ? 'block' : 'none';
            noResultsMessage.textContent = "Aucun article ne correspond à votre sélection.";

            // 3. Paginate the filtered posts
            const totalPages = Math.ceil(filteredPosts.length / state.itemsPerPage);
            state.currentPage = Math.min(state.currentPage, totalPages) || 1;
            const startIndex = (state.currentPage - 1) * state.itemsPerPage;
            const endIndex = startIndex + state.itemsPerPage;
            const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

            // 4. Render posts
            allPosts.forEach(post => post.style.display = 'none');
            paginatedPosts.forEach(post => post.style.display = 'block');

            // 5. Render pagination
            renderPagination(totalPages);
        }

        function renderPagination(totalPages) {
            paginationContainer.innerHTML = '';
            if (totalPages <= 1) {
                paginationContainer.style.display = 'none';
                return;
            }
            paginationContainer.style.display = 'flex';

            for (let i = 1; i <= totalPages; i++) {
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = i;
                link.dataset.page = i;
                link.setAttribute('aria-label', `Aller à la page ${i}`);
                if (i === state.currentPage) {
                    link.classList.add('active');
                }
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    state.currentPage = i;
                    updateView();
                    postList.scrollIntoView({ behavior: 'smooth' });
                });
                paginationContainer.appendChild(link);
            }
        }

        function setupTagFilters() {
            const allTags = new Set();
            state.posts.forEach(post => {
                const tags = post.dataset.tags || '';
                tags.split(',').forEach(tag => {
                    if (tag) allTags.add(tag.trim());
                });
            });

            tagFilterContainer.innerHTML = `<button class="tag-filter-btn active" data-tag="all">Tous les articles</button>`;
            allTags.forEach(tag => {
                const button = document.createElement('button');
                button.className = 'tag-filter-btn';
                button.dataset.tag = tag;
                button.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
                tagFilterContainer.appendChild(button);
            });

            tagFilterContainer.addEventListener('click', (e) => {
                if (e.target.matches('.tag-filter-btn')) {
                    tagFilterContainer.querySelector('.active').classList.remove('active');
                    e.target.classList.add('active');
                    state.activeTag = e.target.dataset.tag;
                    state.currentPage = 1; // Reset to first page
                    updateView();
                }
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchTerm = e.target.value.trim();
                state.currentPage = 1; // Reset to first page
                updateView();
            });
        }

        // Initial setup
        setupTagFilters();
        updateView();
    }

    // Projects Page: Filter by category
    const projectsSection = document.querySelector('.projects-section');
    if (projectsSection) {
        const filterContainer = projectsSection.querySelector('.project-filter-container');
        const projectsGrid = projectsSection.querySelector('.projects-grid');
        const allProjects = Array.from(projectsGrid.querySelectorAll('.project-card'));

        if (filterContainer && projectsGrid && allProjects.length > 0) {
            // 1. Get all unique tags
            const allTags = new Set();
            allProjects.forEach(project => {
                const tags = project.dataset.tags || '';
                tags.split(',').forEach(tag => {
                    if (tag) allTags.add(tag.trim());
                });
            });

            // 2. Create filter buttons
            filterContainer.innerHTML = `<button class="project-filter-btn active" data-tag="all">Tous les projets</button>`;
            allTags.forEach(tag => {
                const button = document.createElement('button');
                button.className = 'project-filter-btn';
                button.dataset.tag = tag;
                // Capitalize and format specific tags for better display
                let buttonText = tag.charAt(0).toUpperCase() + tag.slice(1);
                if (tag === 'mcd/mld') buttonText = 'MCD/MLD';
                if (tag === 'bi') buttonText = 'BI';
                button.textContent = buttonText;
                filterContainer.appendChild(button);
            });

            // 3. Add event listener for filtering
            filterContainer.addEventListener('click', (e) => {
                if (e.target.matches('.project-filter-btn')) {
                    filterContainer.querySelector('.active').classList.remove('active');
                    e.target.classList.add('active');

                    const selectedTag = e.target.dataset.tag;
                    const transitionDuration = 400; // ms, doit correspondre au CSS

                    allProjects.forEach(project => {
                        const projectTags = project.dataset.tags || '';
                        const isMatch = selectedTag === 'all' || projectTags.split(',').includes(selectedTag);
                        const isVisible = project.classList.contains('visible');

                        if (isMatch && !isVisible) {
                            // Rendre visible un projet qui était caché
                            project.style.display = 'block';
                            setTimeout(() => project.classList.add('visible'), 10);
                        } else if (!isMatch && isVisible) {
                            // Cacher un projet qui était visible
                            project.classList.remove('visible');
                            setTimeout(() => {
                                project.style.display = 'none';
                            }, transitionDuration);
                        }
                    });
                }
            });

            // Animate projects in on page load with a staggered effect
            allProjects.forEach((project, index) => {
                setTimeout(() => project.classList.add('visible'), index * 100);
            });
        }
    }

    // Gestion de la bannière de cookies
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept-btn');

    if (cookieBanner && cookieAcceptBtn) {
        // Vérifie si les cookies ont déjà été acceptés
        if (!localStorage.getItem('cookiesAccepted')) {
            // Affiche la bannière
            cookieBanner.classList.add('show');
        }

        cookieAcceptBtn.addEventListener('click', () => {
            // Cache la bannière
            cookieBanner.classList.remove('show');
            // Mémorise le choix de l'utilisateur
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }

    // Interactive gallery on project detail page
    const interactiveGallery = document.querySelector('.interactive-gallery');
    if (interactiveGallery) {
        const mainImageContainer = interactiveGallery.querySelector('.gallery-main-image');
        const mainImagePicture = mainImageContainer.querySelector('picture');
        const mainImageSource = mainImagePicture.querySelector('source');
        const mainImageImg = mainImagePicture.querySelector('img');

        const thumbnails = Array.from(interactiveGallery.querySelectorAll('.gallery-thumbnail'));
        const prevBtn = interactiveGallery.querySelector('.gallery-nav-btn.prev');
        const nextBtn = interactiveGallery.querySelector('.gallery-nav-btn.next');
        let currentIndex = thumbnails.findIndex(t => t.classList.contains('active'));

        function updateGallery(newIndex) {
            // Loop the navigation
            if (newIndex < 0) {
                newIndex = thumbnails.length - 1;
            } else if (newIndex >= thumbnails.length) {
                newIndex = 0;
            }

            const newThumbnail = thumbnails[newIndex];
            const newWebpSrc = newThumbnail.dataset.webp;
            const newFallbackSrc = newThumbnail.href;
            const newAlt = newThumbnail.querySelector('img').alt;

            // Fade out, change src, then fade in
            mainImageContainer.style.opacity = 0;
            setTimeout(() => {
                if (mainImageSource && newWebpSrc) {
                    mainImageSource.srcset = newWebpSrc;
                }
                mainImageImg.src = newFallbackSrc;
                mainImageImg.alt = newAlt;
                mainImageContainer.style.opacity = 1;
            }, 200); // Should be less than the CSS transition duration

            // Update active thumbnail
            thumbnails[currentIndex].classList.remove('active');
            newThumbnail.classList.add('active');

            // Update current index
            currentIndex = newIndex;
        }

        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', (e) => {
                e.preventDefault();
                updateGallery(index);
            });
        });

        if (prevBtn) prevBtn.addEventListener('click', () => updateGallery(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => updateGallery(currentIndex + 1));

        // Ajoute la navigation au clavier (flèches gauche/droite)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault(); // Empêche le défilement horizontal de la page
                updateGallery(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault(); // Empêche le défilement horizontal de la page
                updateGallery(currentIndex + 1);
            }
        });
    }

    // Project Detail Page: Navigation
    const projectDetailSection = document.querySelector('.project-detail-section');
    if (projectDetailSection) {
        const projectNavigation = projectDetailSection.querySelector('.project-navigation');
        
        // This list of URLs must be maintained manually and should match the order on projets.html
        const projectUrlList = [
            'projet-alpha.html',
            'projet-beta.html',
            'projet-gamma.html',
            'projet-delta.html'
        ];

        const currentPagePath = window.location.pathname.split('/').pop();
        const currentIndex = projectUrlList.indexOf(currentPagePath);

        const prevLink = projectNavigation.querySelector('.prev-project');
        const nextLink = projectNavigation.querySelector('.next-project');

        if (currentIndex > -1) {
            // Set up previous project link
            if (currentIndex > 0) {
                prevLink.href = projectUrlList[currentIndex - 1];
                prevLink.style.visibility = 'visible';
            } else {
                prevLink.style.visibility = 'hidden';
            }

            // Set up next project link
            if (currentIndex < projectUrlList.length - 1) {
                nextLink.href = projectUrlList[currentIndex + 1];
                nextLink.style.visibility = 'visible';
            } else {
                nextLink.style.visibility = 'hidden';
            }
        }
    }

    // FAQ Accordion
    const faqContainer = document.querySelector('.faq-container');
    if (faqContainer) {
        faqContainer.addEventListener('click', (e) => {
            const questionButton = e.target.closest('.faq-question');
            if (!questionButton) return;

            const faqItem = questionButton.parentElement;
            const isExpanded = questionButton.getAttribute('aria-expanded') === 'true';

            faqItem.classList.toggle('active');
            questionButton.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Social Share functionality
    const postShare = document.querySelector('.post-share');
    if (postShare) {
        const pageUrl = window.location.href;
        const pageTitle = document.title;

        const twitterBtn = postShare.querySelector('.twitter');
        if (twitterBtn) {
            twitterBtn.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`;
            twitterBtn.target = '_blank';
            twitterBtn.rel = 'noopener noreferrer';
        }

        const linkedinBtn = postShare.querySelector('.linkedin');
        if (linkedinBtn) {
            linkedinBtn.href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(pageTitle)}`;
            linkedinBtn.target = '_blank';
            linkedinBtn.rel = 'noopener noreferrer';
        }

        const copyLinkBtn = postShare.querySelector('.copy-link');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(pageUrl).then(() => {
                    const originalIcon = copyLinkBtn.innerHTML;
                    copyLinkBtn.innerHTML = `<i class="fas fa-check"></i>`;
                    copyLinkBtn.title = "Lien copié !";
                    setTimeout(() => {
                        copyLinkBtn.innerHTML = originalIcon;
                        copyLinkBtn.title = "Copier le lien";
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            });
        }
    }
}});