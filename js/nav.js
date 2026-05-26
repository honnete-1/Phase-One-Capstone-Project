document.addEventListener('DOMContentLoaded', () => {

  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {

    menuBtn.addEventListener('click', () => {

    mobileMenu.classList.toggle('hidden');
     const isOpen = !mobileMenu.classList.contains('hidden');
      menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      menuBtn.textContent = isOpen ? '✕' : '☰';
    });
  }

});
