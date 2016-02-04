module.exports = function() {
  if (window.location.pathname !== '/d3-collection/') {
    const body = document.querySelector('body');
    const mainContent = document.querySelector('.l-main');
    const menuBtn = document.querySelector('#js-menubtn');
    const sideBar = document.querySelector('#js-sidebar');

    const toggleMenu = () => {
      menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const mainHeight = mainContent.clientHeight + 40;
        sideBar.style.height = `${mainHeight}px`;
        body.classList.toggle('menu-open');
        if (body.classList.contains('menu-open')) {
          body.classList.add('menu-close');
        } else {
          body.classList.remove('menu-close');
        }
        !body.classList.toggle('menu-close');
      });
    };

    const coverFitting = () => {
      const cover = document.querySelector('.js-content-cover');
      if (cover) {
        const winHeight = window.innerHeight;
        const footer = document.querySelector('.js-footer');
        const footerHeight = footer.offsetHeight;
        const fittingHeight = winHeight - footerHeight;
        if (fittingHeight > 500) {
          cover.style.height = `${fittingHeight}px`;
        }
      }
    };

    const init = () => {
      toggleMenu();
      coverFitting();
    };

    init();
  }
};
