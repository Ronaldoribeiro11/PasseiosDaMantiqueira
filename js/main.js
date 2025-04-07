// Menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    // Abrir/fechar menu
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('open');
        menuOverlay.style.pointerEvents = navMenu.classList.contains('open') ? 'all' : 'none';
        menuOverlay.style.opacity = navMenu.classList.contains('open') ? '1' : '0';
    });
    
    // Fechar menu ao clicar no overlay
    menuOverlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
        this.style.pointerEvents = 'none';
        this.style.opacity = '0';
    });
    
    // Fechar menu ao clicar em um link
    const menuLinks = document.querySelectorAll('.main-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('open');
            menuOverlay.style.pointerEvents = 'none';
            menuOverlay.style.opacity = '0';
        });
    });
    
    // Adicionar classes de animação aos elementos conforme aparecem na tela
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                const animationType = element.getAttribute('data-animation') || 'fadeIn';
                element.classList.add(animationType);
                element.style.opacity = '1';
            }
        });
    };
    
    // Verificar animações ao carregar e ao rolar
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Inicializar tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
    
    function showTooltip(e) {
        const tooltipText = this.getAttribute('data-tooltip');
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        
        this.tooltip = tooltip;
    }
    
    function hideTooltip() {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }
});

// Função para carregar conteúdo dinâmico
function loadContent(url, targetElementId) {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) return;
    
    targetElement.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner spin"></i></div>';
    
    fetch(url)
        .then(response => response.text())
        .then(html => {
            targetElement.innerHTML = html;
            // Disparar evento para que scripts possam ser executados no conteúdo carregado
            const event = new Event('contentLoaded');
            document.dispatchEvent(event);
        })
        .catch(error => {
            targetElement.innerHTML = `<div class="error-message">Erro ao carregar o conteúdo: ${error.message}</div>`;
        });
}