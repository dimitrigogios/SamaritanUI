/*
// =================================================================
//
// Description:         Platform function
// Comment:             Contains main function like, action messages
// Last modified:       05-11 2015
// Author:              Dimitri Gogios
//                   
// =================================================================
*/
platform = function ($) {
    // private variables only to calc.sum see how variables are kept within
    var mobile = false;

    // private methods
    function updateLoadedValue() {
        $(document).trigger('loadedChanged');
        this.loaded = true;
    }

    function isMobile() {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            /*console.log('is mobile device');
            if( !$('body').hasClass('is-mobile') ) {
                $('body').addClass('is-mobile');
            }
            $(document).trigger("is-mobile");*/
            mobile = true;
        }
    }

    var self = this;

    this.func = {
        isMobile: function () {
            isMobile();
            return mobile;
        }
    };

    // public functions
    return func;

}(jQuery);