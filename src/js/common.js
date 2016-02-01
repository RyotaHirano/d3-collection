module.exports = function() {
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
    });
  };

  const init = () => {
    toggleMenu();
  };

  init();
};
