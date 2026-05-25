// =======================================================================
// 1. GESTION DE LA STICKY NAVIGATION
// =======================================================================
const nav = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 500) {
        nav.classList.add('scrolled');
        nav.classList.remove('scrolled-up');
    } else if (currentScroll < 200) {
        nav.classList.remove('scrolled', 'scrolled-up');
    } else if (currentScroll < lastScroll && nav.classList.contains('scrolled')) {
        nav.classList.remove('scrolled');
        nav.classList.add('scrolled-up');
    }
    lastScroll = currentScroll;
});

// =======================================================================
// 2. GESTION DU CARROUSEL DE PROJETS (3 par 3)
// =======================================================================
const cards = document.querySelectorAll('.project-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentIndex = 0;

function updateCarousel() {
    cards.forEach((card, index) => {
        card.classList.remove('card-left', 'card-center', 'card-right', 'card-hidden');

        if (index === currentIndex) {
            card.classList.add('card-center');
        } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
            card.classList.add('card-left');
        } else if (index === (currentIndex + 1) % cards.length) {
            card.classList.add('card-right');
        } else {
            card.classList.add('card-hidden');
        }
    });
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    });

    updateCarousel();
}

// =======================================================================
// 3. GESTION DU BANDEAU DÉFILANT (TICKER) DES LOGOS
// =======================================================================
const logos = [
    { src: 'assets/img/iut-nca.png', alt: 'Logo IUT', height: '90px' },
    { src: 'assets/img/lamut.png', alt: 'Logo Mutuelle' },
    { src: 'assets/img/dgfip.png', alt: 'Logo DGFIP' },
    { src: 'assets/img/cpe-lyon.png', alt: 'Logo CPE Lyon' },
    { src: 'assets/img/bpce-it.png', alt: 'Logo BPCE IT' },
];

const track = document.getElementById('track');

if (track) {
    // On répète plusieurs fois pour fluidifier la boucle à l'infini
    for (let s = 0; s < 6; s++) {
        logos.forEach(l => {
            const item = document.createElement('div');
            item.className = 'logo-item';
            // Attention au chemin : comme on est dans le dossier JS, 
            // le chemin relatif du HTML racine s'applique car le script est appelé depuis l'index.
            item.innerHTML = `<img src="./${l.src}" alt="${l.alt}" style="height: ${l.height || '45px'}">`;
            track.appendChild(item);
        });
    }
}

// =======================================================================
// 4. GESTION DE LA FENÊTRE POP-UP DES COMPÉTENCES (MODALE)
// =======================================================================
const skillsData = {
    dev: {
        title: "Développement Web & Logiciel",
        skills: ["Python", "Java / C++", "HTML / CSS / JavaScript", "React / Node.js", "Git & GitHub"]
    },
    data: {
        title: "Data & IA",
        skills: ["Bases de données SQL (PostgreSQL)", "Pandas / NumPy / Scikit-Learn", "Machine Learning & Deep Learning", "Analyse de séries temporelles"]
    },
    sysres: {
        title: "Systèmes & Réseaux",
        skills: ["Administration Linux / Windows", "Routage & Switching", "Scripting (Python, Bash)", "Support utilisateur (GLPI)"]
    },
    langues: {
        title: "Langues",
        skills: ["Français (Maternel)", "Anglais (Niveau B2)", "Espagnol (Niveau A2)"]
    },
    soft: {
        title: "Soft Skills",
        skills: ["Travail en équipe", "Rigueur et organisation", "Curiosité intellectuelle", "Adaptabilité", "Résolution de problèmes complexes"]
    }
};

const compCards = document.querySelectorAll('.comp-card');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.querySelector('.close-modal');

function openModal(category) {
    const data = skillsData[category];
    if (data && modalTitle && modalBody && modalOverlay) {
        modalTitle.textContent = data.title;
        
        const ul = document.createElement('ul');
        data.skills.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill;
            ul.appendChild(li);
        });
        
        modalBody.innerHTML = '';
        modalBody.appendChild(ul);
        modalOverlay.classList.add('active');
    }
}

function closeModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
}

compCards.forEach(card => {
    card.addEventListener('click', () => {
        const category = card.getAttribute('data-category');
        openModal(category);
    });
});

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// =======================================================================
// 5. GESTION DU FORMULAIRE DE CONTACT (AJAX)
// =======================================================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        // Empêche la page de se recharger et d'aller sur la page Formspree
        e.preventDefault(); 
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const initialBtnText = submitBtn.textContent;
        
        // État de chargement
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Succès de l'envoi
                submitBtn.textContent = 'Message envoyé !';
                submitBtn.style.backgroundColor = '#4caf50';
                submitBtn.style.color = '#fff';
                contactForm.reset();
                
                // Remise à l'état initial du bouton après 4 secondes
                setTimeout(() => {
                    submitBtn.textContent = initialBtnText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                }, 4000);
            } else {
                // Erreur serveur (champ non rempli, captcha, etc)
                submitBtn.textContent = 'Erreur lors de l\'envoi';
                submitBtn.style.backgroundColor = '#f44336'; 
                submitBtn.style.color = '#fff';
                
                setTimeout(() => {
                    submitBtn.textContent = initialBtnText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                }, 4000);
            }
        } catch (error) {
            // Erreur réseau (pas de connexion internet par exemple)
            console.error('Erreur réseau:', error);
            submitBtn.textContent = 'Erreur réseau';
            submitBtn.style.backgroundColor = '#f44336'; 
            submitBtn.style.color = '#fff';
            
            setTimeout(() => {
                submitBtn.textContent = initialBtnText;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.color = '';
                submitBtn.disabled = false;
            }, 4000);
        }
    });
}