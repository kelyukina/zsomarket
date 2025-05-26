// selectOffer js
function useOfferSelect() {
    BX.ready(() => {
        if (!("SelectOfferProp" in window)) {
            const $catalogItems = $(".load-offer-js");
            if ($catalogItems.length) {
                $catalogItems.iAppear(
                    function (e) {
                        loadScripts(
                            [
                                arAsproOptions.SITE_TEMPLATE_PATH + "/js/select_offer.min.js",
                                arAsproOptions.SITE_TEMPLATE_PATH + "/js/select_offer_func.min.js",
                            ]
                        );
                    },
                    { accX: 0, accY: 100 }
                );
            }
        }

        if (!("appAspro" in window) || !window.appAspro.skuDetailJSLoad) {
            const $catalogDetail = $(".sku_in_detail");
            if ($catalogDetail.length) {
                $catalogDetail.iAppear(
                    function (e) {
                        loadScripts(arAsproOptions.SITE_TEMPLATE_PATH + "/js/select_offer_detail.min.js");
                    },
                    { accX: 0, accY: 100 }
                );
            }
        }
        
    });
}