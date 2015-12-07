;(function ($, exports, undefined){
    //'use strict';

    /* Globals */
    var widths = {
            desktopXl   : 1280,
            desktopL    : 960,
            tablet      : 959,
            mobileL     : 767,
            mobileP     : 479,
            controlWidth: 0           
        },
        myEvent = "click";

    var tabs = {
        init: function() {
            $(document).on(myEvent, '.nav-tabs li, .nav-buttons li', function() {
               $('li',$(this).parent()).removeClass('active');
               $(this).addClass('active');
            });
        }
    }

    /* =============================================================================
        jQuery Ready
    ========================================================================= */
    $(function () {
        console.log('navs.js loaded !!');

        if( platform.isMobile() ) {
            myEvent = "touchstart";
        } else {
            myEvent = "click";

        }

        tabs.init();

    });

})(jQuery, window);