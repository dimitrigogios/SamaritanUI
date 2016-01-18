;(function ($, exports, undefined){
    //'use strict';

    /* Globals */
    var widths = {
        desktop : 940,
        tablet  : 748,
        mobile  : 300,
        controlWidth: 0           
    };

    var toggle_el,
        push_el,
        target_el,
        strArr,
        pressed = false,
        firstLoad = true;

    //new vars
    var currEl = {name:'', open: false},
        nextEl = {name:'', open: false},
        myTimeout;

    var togglList = [];
    var toggl = {}

    var moveSideMenu = {
        init:function() {
            $('button.toggler').each(function() {
                elementToggler.getElement($(this));

                if( push_el == 'left' ) {
                    var push = 'right';
                } else if( push_el == 'right' ) {
                    var push = 'left';
                } else if( push_el == 'bottom' ) {
                    var push = 'top';
                } else if( push_el == 'top' ) {
                    var push = 'bottom';
                } else {
                    var push = 'left';
                }

                var width = parseInt( $( toggle_el ).outerWidth(true) );
                $( toggle_el ).css(push, -width);

                if( !$( toggle_el ).hasClass('animation') ) {
                    $( toggle_el ).addClass('animation');
                    if( strArr.length > 1 ) {

                        $.each(strArr, function(k,v) {
                            $( v ).each(function() {
                                $(this).addClass('animation'); 
                            });
                        });
                    } else {
                        $( target_el ).addClass('animation');
                    }
                }

                //$( toggle_el ).attr('data-start-hidden', 'false');
            });
        },
        resetInit: function() {
            $(document).on('windowResizeEnded', function() {
                moveSideMenu.init();
            });
        }
    }

    var elementToggler = {
        getElement: function(el) {
            toggle_el   = el.attr('data-toggle-element');
            push_el     = el.attr('data-push-target-element');
            target_el   = el.attr('data-target-element');

            strArr      = target_el.split(',');
        },
        toggleElClass: function(el) {
            el.toggleClass('clicked');
            $( toggle_el ).toggleClass('collapsed');
        },
        togglePosition: function() {
            //has to be new elements
            var width = parseInt( $( toggle_el ).outerWidth(true) );
            
            if( strArr.length > 1 ) {
                $.each(strArr, function(k,v) {
                    $( v ).css(push_el, -width);
                });
            } else {
                $( target_el ).css(push_el, -width);
            }

            $( toggle_el ).removeAttr('style');
        },
        removeStyle: function() {
            var width = parseInt( $( toggle_el ).outerWidth(true) );

            if( push_el == 'left' ) {
                var push = 'right';
            } else if( push_el == 'left' ) {
                var push = 'left';
            } else if( push_el == 'bottom' ) {
                var push = 'top';
            } else if( push_el == 'top' ) {
                var push = 'bottom';
            } else {
                var push = 'left';
            }

            if( strArr.length > 1 ) {
                $.each(strArr, function(k,v) {
                    $( v ).css(push_el, 0);
                });
            } else {
                $( target_el ).css(push_el, 0);
            }

            $( toggle_el ).css(push, -width);
        },
        init: function() {
            $(document).on('click', 'button.toggler', function(e){
                e.stopPropagation();
                console.log('toggler click');
                clearTimeout(myTimeout);

                currEl.name = $(this).attr('id');

                var closeNext = function() {
                    if( nextEl.name != currEl.name  && nextEl.open ) {
                        console.log('something else is open, closing nextEl');

                        elementToggler.getElement( $('#'+nextEl.name) );
                        elementToggler.toggleElClass( $('#'+nextEl.name) );
                        elementToggler.removeStyle();

                        currEl.open = false;
                    }
                    return true;
                };

                $.when( closeNext() ).then(function() {
                    console.log('done');
                    if( currEl.open ) {
                        console.log('close current');
                        currEl.open = false;

                        elementToggler.getElement( $('#'+currEl.name) );
                        elementToggler.toggleElClass( $('#'+currEl.name) );
                        elementToggler.removeStyle();

                        nextEl.name = currEl.name;
                        nextEl.open = currEl.open;

                        myTimeout = setTimeout(function() {
                            if( strArr.length > 1 ) {
                                $.each(strArr, function(k,v) {
                                    $( v ).removeAttr('style');
                                });
                            } else {
                                $( target_el ).removeAttr('style');
                            }
                        }, 600);

                    } else if( !currEl.open ) {
                        console.log('open current');
                        currEl.open = true;

                        elementToggler.getElement( $('#'+currEl.name) );
                        elementToggler.toggleElClass( $('#'+currEl.name) );
                        elementToggler.togglePosition();

                        nextEl.name = currEl.name;
                        nextEl.open = currEl.open;

                    }
                });
            });

            $(document).on('click', 'div[data-document="false"]', function(e) {

                 e.stopPropagation();
            });

            $(document, '.close-menu').on('click', function() {
                $.each($('button[data-document="true"]'), function() {
                    if( $( this ).hasClass('clicked') ) {
                        $(this).click();
                    }
                });
            });
        }
    };

    /* =============================================================================
        jQuery Ready
    ========================================================================= */
    $(function () {
        console.log('menu.js loaded !!');

        $(document).on('contentLoaded', function(){
            if( firstLoad ) {
                firstLoad = false;
                setTimeout(function(){
                    moveSideMenu.init();
                }, 200);
            }
        });
        
        moveSideMenu.resetInit();

        elementToggler.init();

    });

    /*$(window).resize(function() {
    });*/

})(jQuery, window);