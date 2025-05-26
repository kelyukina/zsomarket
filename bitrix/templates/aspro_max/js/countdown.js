function useCountdown() {
  BX.ready(() => {
    const $coundowns = $(".view_sale_block");
    if ($coundowns.length) {
      $coundowns.iAppear(
        function (e) {
          BX.loadScript(
            [
              arAsproOptions["SITE_TEMPLATE_PATH"] + "/js/jquery.plugin.min.js",
              arAsproOptions["SITE_TEMPLATE_PATH"] + "/js/jquery.countdown.min.js",
              arAsproOptions["SITE_TEMPLATE_PATH"] + "/js/jquery.countdown-ru.js",
            ],
            function () {
              initCountdown();
            }
          );
        },
        { accX: 0, accY: 150 }
      );
    }
  });
}
