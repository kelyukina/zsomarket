function addTextToPrintBtn() {
    const $print = document.querySelector(".btn_basket_heading--print");
    if ($print && !$print.classList.contains("btn_basket_heading--with_title")) {
        const $title = BX.create({
            tag: "span",
            attrs: {
                class: "title"
            },
            html: arAsproOptions.THEME.EXPRESSION_FOR_PRINT_PAGE
        });
        $print.classList.add("btn_basket_heading--with_title"), 
        $print.appendChild($title)
    }
}
function addShareBasket(parent) {
    if(addShareBasket && arAsproOptions["THEME"]["SHOW_SHARE_BASKET"] === "Y"){
        if (arAsproOptions.PRICES.MIN_PRICE && arAsproOptions.PRICES.MIN_PRICE > BX.Sale.BasketComponent.result.allSum) BX.remove(document.querySelector(".basket-checkout-block-share"));
        else if (!document.querySelector(".basket-checkout-block-share ") && BX.Sale && BX.Sale.BasketComponent && "items" in BX.Sale.BasketComponent) {
            const btnShareBasket = BX.create({
                tag: "div",
                attrs: {
                    class: "btn_basket_heading btn_basket_heading--with_title basket-checkout-block basket-checkout-block-share colored_theme_hover_bg-block",
                    title: arAsproOptions.THEME.EXPRESSION_FOR_SHARE_BASKET
                },
                html: '<span class="animate-load" data-event="jqm" data-param-form_id="share_basket" data-name="share_basket"><i class="svg colored_theme_hover_bg-el-svg"><svg class="svg svg-share" xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><path data-name="Ellipse 223 copy 8" d="M1613,203a2.967,2.967,0,0,1-1.86-.661l-3.22,2.01a2.689,2.689,0,0,1,0,1.3l3.22,2.01A2.961,2.961,0,0,1,1613,207a3,3,0,1,1-3,3,3.47,3.47,0,0,1,.07-0.651l-3.21-2.01a3,3,0,1,1,0-4.678l3.21-2.01A3.472,3.472,0,0,1,1610,200,3,3,0,1,1,1613,203Zm0,8a1,1,0,1,0-1-1A1,1,0,0,0,1613,211Zm-8-7a1,1,0,1,0,1,1A1,1,0,0,0,1605,204Zm8-5a1,1,0,1,0,1,1A1,1,0,0,0,1613,199Z" transform="translate(-1602 -197)" fill="#B8B8B8"></path></svg></i><span class="title">' + arAsproOptions.THEME.EXPRESSION_FOR_SHARE_BASKET + "</span></span>"
            });
            parent.parentNode.insertBefore(btnShareBasket, parent)
        }
    } 
}
BX.addCustomEvent("onShowBasketHeadingBtn", (function(eventdata) {
    addTextToPrintBtn(), addShareBasket(eventdata.parent)
})), $(document).on("click", "a.delay", (function() {
    const wishFilter = this.hash.substring(1);
    if (void 0 !== wishFilter) {
        const $wish = document.querySelector('a[data-filter="' + wishFilter + '"]');
        $wish && $wish.click()
    }
}));
//# sourceMappingURL=basket.min.js.map