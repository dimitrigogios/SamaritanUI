;(function ($, exports, undefined){

    var isMobile = false;

    var fixed_menu = {
        init: function() {
            /*$(document).on('isMobile', function() {
                isMobile = true;
            });*/

            $(document).on('scrollUp', function() {
                var posScrl = $(window).scrollTop();
                var height = parseFloat($('.site-content > nav.navigation').outerHeight(true));
                //console.log(posScrl);

                if( posScrl > 50 ) {
                    if(!$('.site-content > nav.navigation').hasClass('animation')) {
                        $('.site-content > nav.navigation').addClass('animation');
                    }
                    if(!$('.site-content > nav.navigation').hasClass('fixed')) {
                        $('.site-content > nav.navigation').addClass('fixed').removeClass('absolute');
                    }
                    $('.site-content > nav.navigation').css('top', 0);
                }
                if(posScrl == 0 ) {
                    if(!$('.site-content > nav.navigation').hasClass('absolute')) {
                        $('.site-content > nav.navigation').addClass('absolute').removeClass('fixed').removeAttr('style');
                    }
                }
                if(posScrl < 50 ) {
                    if( $('.article-navigation').hasClass('m-fixed-i') ) {
                        $('.article-navigation').toggleClass('m-absolute-i');
                        $('.article-navigation').toggleClass('m-fixed-i');
                    }
                }
            }).on('scrollDown', function() {
                var posScrl = $(window).scrollTop();
                var height = parseFloat($('.site-content > nav.navigation').outerHeight(true));
                //console.log(posScrl);

                if( posScrl > 50 ) {
                    $('.site-content > nav.navigation').css('top', -height);

                    if( $('.article-navigation').hasClass('m-absolute-i') ) {
                        $('.article-navigation').toggleClass('m-absolute-i');
                        $('.article-navigation').toggleClass('m-fixed-i');
                    }
                }
            }).on('scrollEnded, contentLoaded, articleLoaded', function(){
                setTimeout(function(){
                    var posScrl = $(window).scrollTop();
                    if(posScrl == 0 ) {
                        $('.site-content > nav.navigation').removeClass('absolute').removeClass('fixed').addClass('absolute').removeAttr('style');
                    }
                }, 90);
            });
        }
    }
    

    /* =============================================================================
        jQuery Ready
    ========================================================================= */
    $(function () {
        //console.log('custom script.js loaded !!');

        fixed_menu.init();
    });

})(jQuery, window);