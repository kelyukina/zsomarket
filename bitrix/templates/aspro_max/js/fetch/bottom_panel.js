BX.ajax({
  url: arAsproOptions["SITE_DIR"] + "ajax/bottom_panel.php",
  processData: false,
  onsuccess: function (html) {
    const ob = BX.processHTML(html);
    if (ob.STYLE.length > 0) {
      BX.loadCSS(ob.STYLE);
    }

    document.querySelector("body").insertAdjacentHTML("beforeend", ob.HTML);
    if (location.pathname) {
        document.querySelectorAll('.bottom-icons-panel__content-link').forEach(node => {
            node.classList.remove('bottom-icons-panel__content-link--active')
            if (node.getAttribute('href') === location.pathname) {
                node.classList.add('bottom-icons-panel__content-link--active')
            }
        })
    }

    BX.ajax.processScripts(ob.SCRIPT);
  },
});
