(function () {
  window.addEventListener('DOMContentLoaded', function () {
    document.addEventListener("click", function (e) {
      const $target = e.target.closest(".fancy-plus");
      
      if ($target && typeof $.fn.fancybox === "function") {
        e.preventDefault();
        
        const $itemsContainer = $target.closest("[data-additional_items]");
        const $galleryItems = $itemsContainer.querySelectorAll('.small-gallery-block__item');
    
        if ($itemsContainer) {
          const arItems = $itemsContainer.dataset.additional_items
            ? JSON.parse($itemsContainer.dataset.additional_items)
            : false;
          
          if (arItems && arItems.length) {
            const index = Array.prototype.slice
              .call($galleryItems)
              .indexOf($target.closest('.small-gallery-block__item'));

            $.fancybox.open(
              arItems,
              {
                tpl: {
                  closeBtn:
                    '<span title="' +
                    BX.message("FANCY_CLOSE") +
                    '" class="fancybox-item fancybox-close inline svg"><svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 24L24 2M2 2L24 24" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>',
                  next:
                    '<a title="' +
                    BX.message("FANCY_NEXT") +
                    '" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                  prev:
                    '<a title="' +
                    BX.message("FANCY_PREV") +
                    '" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>',
                },
                btnTpl: {
                  close:
                    '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">' +
                    '<i class="svg"><svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M2 24L24 2M2 2L24 24" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg></i>' +
                    "</button>",
        
                  arrowLeft:
                    '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}">' +
                    '<div><i class="svg left"><svg width="16" height="26" viewBox="0 0 15 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 13L0.585787 14.4142C-0.195262 13.6332 -0.195262 12.3668 0.585787 11.5858L2 13ZM11.5858 0.585786C12.3668 -0.195262 13.6332 -0.195262 14.4142 0.585786C15.1953 1.36683 15.1953 2.63317 14.4142 3.41421L11.5858 0.585786ZM14.4142 22.5858C15.1953 23.3668 15.1953 24.6332 14.4142 25.4142C13.6332 26.1953 12.3668 26.1953 11.5858 25.4142L14.4142 22.5858ZM0.585787 11.5858L11.5858 0.585786L14.4142 3.41421L3.41421 14.4142L0.585787 11.5858ZM3.41421 11.5858L14.4142 22.5858L11.5858 25.4142L0.585787 14.4142L3.41421 11.5858Z" fill="#999999"/></svg></i></div>' +
                    "</button>",
        
                  arrowRight:
                    '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}">' +
                    '<div><i class="svg right"><svg width="16" height="26" viewBox="0 0 15 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 13L14.4142 14.4142C15.1953 13.6332 15.1953 12.3668 14.4142 11.5858L13 13ZM3.41421 0.585786C2.63317 -0.195262 1.36683 -0.195262 0.585786 0.585786C-0.195262 1.36683 -0.195262 2.63317 0.585786 3.41421L3.41421 0.585786ZM0.585786 22.5858C-0.195262 23.3668 -0.195262 24.6332 0.585786 25.4142C1.36683 26.1953 2.63317 26.1953 3.41421 25.4142L0.585786 22.5858ZM14.4142 11.5858L3.41421 0.585786L0.585786 3.41421L11.5858 14.4142L14.4142 11.5858ZM11.5858 11.5858L0.585786 22.5858L3.41421 25.4142L14.4142 14.4142L11.5858 11.5858Z" fill="white"/></svg></i></div>' +
                    "</button>",
                },
                thumbs: {
                  autoStart: true,
                },
                buttons: ["close"],
                loop: false,
                onActivate: (instance) => {
                  if (typeof InitFancyboxThumbnailsGallery === undefined || typeof Swiper === 'undefined') return;

                  InitFancyboxThumbnailsGallery(instance)
                },
                beforeShow: (instance, current) => {
                  if (typeof Swiper === 'undefined' || !$(".fancybox-thumbs .swiper").length) return;

                  const swiper = $(".fancybox-thumbs .swiper").data("swiper");
                  swiper.slideTo(current.index);
                },
              },
              index
            );
          }
        }
      }
    });
  })
})()
