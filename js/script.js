// Inicializa o efeito de partículas
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#FF6B67" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#FF6B67", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            }
        });
    }

    // Animação de scroll para os cards
    const stepCards = document.querySelectorAll('.step-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    stepCards.forEach(card => {
        observer.observe(card);
    });

    // Contador de estatísticas
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.intro-section');

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    // Salva o conteúdo original completo
                    const originalContent = stat.textContent;
                    // Extrai o número e o sufixo separadamente
                    const matches = originalContent.match(/^(\d+)(.*)/);
                    if (!matches) return;

                    const target = +matches[1];
                    const suffix = matches[2] || '';
                    let current = 0;

                    const timer = setInterval(() => {
                        current += Math.ceil(target / 50);
                        if (current >= target) {
                            clearInterval(timer);
                            stat.textContent = target + suffix; // Restaura o sufixo original
                        } else {
                            stat.textContent = Math.floor(current);
                        }
                    }, 20);
                });

                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const statCards = document.querySelectorAll('.stat-card');

    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const sourceUrl = this.getAttribute('data-source');
            if (sourceUrl) {
                window.open(sourceUrl, '_blank');
            }
        });
    });
});