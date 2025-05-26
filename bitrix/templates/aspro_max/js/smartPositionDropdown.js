
document.addEventListener("DOMContentLoaded", function(){
  const $combinedNodes = document.querySelectorAll('.menu_top_block .menu > li.v_hover.m_combined');

  [].forEach.call($combinedNodes, function($combinedNode) {
    positionDropdown($combinedNode);
  });
});

$(document).on('mouseenter', '.menu_top_block .menu > li.v_hover.m_combined',  e => positionDropdown(e.currentTarget));

function positionDropdown($element) {
  const $dropdown = $element.querySelector('.dropdown');

  if($dropdown) {
    let scrollHeight = document.body.offsetHeight;

    if(scrollHeight - BX.pos($dropdown).bottom < 0) {
      $element.classList.add('m_top');
      $element.classList.remove('m_line')
    }
  }
}
