window.appAspro = window.appAspro || {}

if (!window.appAspro.phone) {
    window.appAspro.phone = {
        get checkIntlPhone(){
            return typeof window.intlTelInput === 'function'
        },
        get checkInputmask(){
            return typeof window.Inputmask === 'function'
        },
        get checkIntlTelInputUtils(){
            return typeof window.intlTelInputUtils === 'function'
        },
        errorMap: ["INVALID_NUMBER", "INVALID_COUNTRY_CODE", "TOO_SHORT", "TOO_LONG", "INVALID_NUMBER", "INVALID_NUMBER"],
        get config(){
            return this._config || ''
        },
        set config(config){
            this._config = config
        },
        init: function(els, options){
            const self = this;
            const defaultOptions = {
                useValidate: true
            };
            
            if (!options && this.config) {
                options = this.config
            }
            options = $.extend({}, defaultOptions, (options || {}))

            if (this.checkIntlPhone) {
                 if (options.coutriesData) {
                    if (typeof allCountries === 'undefined') {
                        $.ajax({
                            url: options.coutriesData,
                            async: false,
                            success: function (data) {
                                if (allCountries) {
                                    options.countries = allCountries
                                }
                            }
                        })
                    } else {
                        options.countries = allCountries
                    }
                 }
                this.initIntlPhone(els, options)
            } else if (this.checkInputmask && options.mask) {
                this.initNormalPhone(els, options)
            }
        },
        initIntlPhone: function(els, options){
            let defaultOptions = {
                utilsScript: arAsproOptions['SITE_TEMPLATE_PATH'] + '/vendor/js/intl.phone/utils.js',
                preferredCountries: ['ru'],
                autoPlaceholder: 'aggressive',
                nationalMode: false,
                onlyCountries: ['ru'],
                formatOnDisplay: true,
                autoHideDialCode: true,
            };
            options = options || {}
            const pluginOptions = $.extend({}, defaultOptions, options)

            if (pluginOptions.onlyCountries.length && typeof pluginOptions.onlyCountries === 'string') {
                pluginOptions.onlyCountries = pluginOptions.onlyCountries.split(',')
            }
            if (pluginOptions.preferredCountries.length && typeof pluginOptions.preferredCountries === 'string') {
                pluginOptions.preferredCountries = pluginOptions.preferredCountries.split(',')
            }

            const self = this
            
            els.each(function(i, node){
                let iti = window.intlTelInput(node, pluginOptions)
                let _this = $(node)
                _this.data('iti', iti)

                // if (!~_this.val().indexOf('+')) {
                //     _this.val('+'+_this.val())
                // }

                _this.on("change", function () {
                    const inputVal = _this.val();
                    if (!~inputVal.indexOf('+') && inputVal.length) {
                        _this.val('+'+inputVal)
                    }
                    
                    if (typeof intlTelInputUtils !== 'undefined') {
                        var currentText = iti.getNumber(intlTelInputUtils.numberFormat.E164);
                        if (typeof currentText === 'string') {
                            iti.setNumber(currentText);
                        }
                    }
                    /* paste fix */
                    if (!iti.getSelectedCountryData().name) {
                        _this.val(_this.val().replace('+8', '+7'))
                        iti.setNumber(_this.val());
                    }
                    /* */
                });
                _this.on("input", function (e) {
                    const _this = $(this)
                    const telInput = _this.data('iti');
                    let inputVal = _this.val();
                    
                    // console.log('input', 
                    // telInput.getValidationError(),
                    //     self.errorMap[telInput.getValidationError()], 
                    //     inputVal, 
                    //     telInput.isValidNumber(),
                    //     telInput.getSelectedCountryData(),
                    //     e
                    // );

                    if (inputVal.length >= 1 && !inputVal.includes('+')) {
                        _this.val('+'+inputVal);
                        inputVal = _this.val();
                    }
                    if (inputVal.length > 3) {
                        if (!telInput.getSelectedCountryData().name) {
                            _this.val(inputVal.replace('+8', '+7'))
                        } else {
                            // let inputCountryLength = _this.attr('placeholder').replace(/\D/g,'').length
                            // let inputValLength = inputVal.replace(/\D/g,'').length
                            // if (inputValLength > inputCountryLength) {
                            //     // _this.val(inputVal.slice(0, inputCountryLength - inputValLength))
                            // }
                        }
                    }
                    
                    if (typeof intlTelInputUtils !== 'undefined') {
                        var currentText = iti.getNumber(intlTelInputUtils.numberFormat.E164);
                        if (typeof currentText === 'string') {
                            iti.setNumber(currentText);
                            // _this[0].selectionStart =_this[0].selectionEnd = pos
                        }
                    }
                })
                _this.on("keypress", function (e) {
                    let key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
                    
                    if (e.target.value === '') {
                        e.target.value = '+'
                    }
                    return /\d/.test(key)
                })

                //manual change trigger
                _this.trigger('change')
            })

            this.bindPhoneMask(els)
            if (options.useValidate) {
                this.addValidationIntlPhone()
            }
        },
        initNormalPhone: function(els, options){
            let base_mask = options.mask.replace( /(\d)/g, '_' );
            els.inputmask("mask", { mask: options.mask });
            els.blur(function(){
                if( $(this).val() == base_mask || $(this).val() == '' ){
                    if( $(this).hasClass('required') ){
                        $(this).parent().find('label.error').html(BX.message('JS_REQUIRED'));
                    }
                }
            });
            if (options.useValidate) {
                this.addValidationPhone()
            }
        },
        addValidationIntlPhone: function(){
            $.validator.addMethod(
                "intl_phone",
                function (value, element, param) {
                    const telInput = $(element).data('iti');
                    let valid = telInput.isValidNumber()
                    
                    if (element.classList.contains('required') || element.getAttribute('required') !== null) {
                        if (valid) {
                            element.classList.remove('error')
                        } else {
                            element.classList.add('error')
                        }
                    } else {
                        valid = true
                    }
                    return valid
                },
                function (param, element) {
                    const telInput = $(element).data('iti');

                    return BX.message(param[telInput.getValidationError()]) || BX.message(param[0])
                }
                //BX.message("JS_FORMAT")
            );
            $.validator.addClassRules({
                phone: {
                    intl_phone: this.errorMap,
                },
                phone_input: {
                    intl_phone: this.errorMap,
                },
            })
        },
        addValidationPhone: function(){
            if (arAsproOptions['THEME']['VALIDATE_PHONE_MASK']) {
                $.validator.addClassRules({
                    phone: {
                        regexp: arAsproOptions['THEME']['VALIDATE_PHONE_MASK'],
                    },
                    phone_input: {
                        regexp: arAsproOptions['THEME']['VALIDATE_PHONE_MASK'],
                    },
                })
            }
        },
        bindPhoneMask: function(els){
            let _this = this
            els.each(function(i, node) {
                this.addEventListener('countrychange', function(e) {
                    e.stopImmediatePropagation()
                    const _this = $(e.target);

                    if (typeof e.detail === 'object' && e.detail) {
                        if (e.detail.type === "_selectListItem") {
                            _this.trigger('input')
                            _this.valid()
                        }
                    }
                })
            })
        },
    }
}