;(function( $ ) {
    $.fn.checked = function(value) {
        if(value === true || value === false) {
            // Set the value of the checkbox
            $(this).each(function(){ this.checked = value; });
        } 
        else if(value === undefined || value === 'toggle') {
            // Toggle the checkbox
            $(this).each(function(){ this.checked = !this.checked; });
        }

        return this;
    };
})( jQuery );

;(function ($, exports, undefined){

    var isMobile = {
        init: function() {
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                console.log('is mobile device');
                if( !$('body').hasClass('is-mobile') ) {
                    $('body').addClass('is-mobile');
                }
                $(document).trigger("is-mobile");
                return true;
            }
            return false;
        }
    };

    var isLandscape = {
        init: function() {
            if( (window.innerHeight < window.innerWidth) && isMobile.init() ){
                if( !$('.turn-around').hasClass('landscape') ) {
                    $('.turn-around').addClass('landscape');
                }
            } else {
                $('.turn-around').removeClass('landscape');
            }
        }
    };

    var toTop = {
        init: function() {
            if( isMobile.init() ) {
                $('.to-top').on('touchstart', function(e) {
                    e.preventDefault();
                    $('html, body', parent.document).animate({ scrollTop: $("body").offset().top},150,"swing");
                });
            } else {
                $('.to-top').on('click', function(e) {
                    e.preventDefault();
                    $("html, body").animate({ scrollTop: 0 }, 150, 'swing');
                    return false;
                });
            }
        }
    }

    var footerControl = {
        init: function() {
            if( $('footer').hasClass('absolute') && !$('body').hasClass('skrollr') ) {
                var theight = parseInt($('footer').outerHeight(true));
                $('body').css('padding-bottom', theight);
            }
        }
    }

    var scrollAnimate,
        lastScrollTop = 0;
    
    var user_interaction = {
        init: function() {
            var rtime = new Date(1, 1, 700, 12, 0, 0);
            var timeout = false;
            var delta = 200;
            var i = 0;

            $( window ).scroll(function() {
                var posScrl = $(window).scrollTop();

                //make the site autoslide into new positions
                clearTimeout(scrollAnimate);
                scrollAnimate = setTimeout( function() {

                    var diff = lastScrollTop - posScrl;
                    if( diff < 0 ) {
                        diff = (-1)*diff;
                    }

                    if (posScrl > lastScrollTop ){
                        // downscroll code
                        //console.log('scroll down');
                        $(document).trigger('scrollDown');

                    } else {
                        // upscroll code
                        // console.log('scroll up');
                        $(document).trigger('scrollUp');
                    }

                    lastScrollTop = posScrl;
                }, 2);

                rtime = new Date();
                if (timeout === false) {
                    timeout = true;
                    setTimeout(scrollend, delta);
                }

            });
            
            $(window).resize(function() {
                rtime = new Date();
                if (timeout === false) {
                    timeout = true;
                    setTimeout(resizeend, delta);

                }
            });

            function resizeend() {
                if (new Date() - rtime < delta) {
                    setTimeout(resizeend, delta);
                } else {
                    timeout = false;
                    //console.log('resize ended');
                    $(document).trigger('windowResizeEnded');
                    i++;
                }               
            }

            var scrolTimeOut;
            function scrollend() {
                clearTimeout(scrolTimeOut);

                if (new Date() - rtime < delta) {
                    setTimeout(scrollend, delta);
                } else {
                    timeout = false;
                    //console.log('scroll ended');

                    scrolTimeOut = setTimeout( function() {
                        $(document).trigger('scrollEnded');
                    }, 90);
                }               
            }
        }
    };

    

    /* =============================================================================
        jQuery Ready
    ========================================================================= */
    $(function () {
        console.log('app.js loaded !!');

        user_interaction.init();

        isMobile.init();

        toTop.init();

        footerControl.init();
    });

    $(window).resize(function() {
        isLandscape.init();
        footerControl.init();
    });

})(jQuery, window);