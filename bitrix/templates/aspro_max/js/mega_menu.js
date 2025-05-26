window.addEventListener("DOMContentLoaded", function () {
  const $megaMenuWrapper = document.querySelectorAll(".menu-block, .menu-only");
  
  if ($megaMenuWrapper.length) {
    for (let i = 0; i < $megaMenuWrapper.length; i++) {
      $megaMenuWrapper[i].addEventListener("mouseover", function () {
        // calculate menu items position
        $megaMenuWrapper[i].querySelector(".mega-menu").classList.add("visible");
        CheckTopVisibleMenu();
        InitMenuNavigationAim();

        // init banner
        const $bannerMenu = $megaMenuWrapper[i].querySelectorAll('.owl-carousel-hover');
        if ($bannerMenu.length) {
          $bannerMenu.forEach($el => {
            $el.classList.remove("owl-carousel-hover");
            $el.classList.add("owl-carousel");

            setTimeout(function () {
              InitOwlSlider();
              $el.classList.remove("loader_circle");
            }, 1);
          })
        }
      }, {
        once: true
      });
    }
  }
});