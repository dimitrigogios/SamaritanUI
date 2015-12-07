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
    };

    var ite = 0,
    	isNavigation = false;

    var myEvent = "click",
        myTransistion = "",
        allow = true;

    var classToggler = {
    	toggl: function() {

    		$(document).on(myEvent, "[class*='toggle-']", function(e){
                //e.stopPropagation();
                e.stopImmediatePropagation();
    			//e.preventDefault();

                $(this).parent().parent().find('.expanded').each(function() {
                    $(this).removeClass("expanded");
                });

                var classNameArr = $(this).attr('class').split(' ');
                var targetEl = $(this).parent();

                if(typeof $(this).data('toggle-element') != 'undefined' && $(this).data('toggle-element') != '' ) {
                    targetEl = $(this).data('toggle-element');
                    targetEl = $(targetEl);
                }

                //console.log(targetEl);

                $.map(classNameArr, function(value, index){
                    if( value.toLowerCase().indexOf('toggle-') >= 0 ) {
                        var temp = value.split('-');
                        if( targetEl.hasClass(temp[1]) ) {
                        }
                        targetEl.toggleClass(temp[1]);
                    }
                });
    		});

    		// don't collapse the whole menu
    		$(document).on(myEvent, ".navigation li", function(e){
    			e.stopPropagation();
    			$(this).parent().find('.expanded').each(function() {
    				$(this).removeClass("expanded");
    			});
    		});
    	},
    	checkParent: function(el) {
    		if( ite < 11 ) {
    			if( el.parent().hasClass('navigation') ) {
    				ite = 0;
    				isNavigation = true;
    				return true;
	    		} else {
	    			ite++;
	    			classToggler.checkParent(el.parent());
	    		}
    		} else {
    			isNavigation = false;
    			return false;
    		}
    	},
    	closeToggl: function() {
    		$("[class*='toggle-']").each(function() {
                var classNameArr = $(this).attr('class').split(' ');
    			var targetEl = $(this).parent();

    			if(typeof $(this).data('toggle-element') != 'undefined' && $(this).data('toggle-element') != '' ) {
    				targetEl = $(this).data('toggle-element');
    			}

    			$.map(classNameArr, function(value, index){
    				if( value.toLowerCase().indexOf('toggle-') >= 0 ) {
    					var temp = value.split('-');
    					if( $(targetEl).hasClass(temp[1]) ) {
    						$(targetEl).toggleClass(temp[1]);
    					}
    				}
    			});
            });
    	}
    }

    /* =============================================================================
        jQuery Ready
    ========================================================================= */
    $(function () {
        console.log('classToggler.js loaded !!');

        if( platform.isMobile() ) {
            myEvent = "touchstart";
        } else {
            myEvent = "click";
        }

        classToggler.toggl();

        $(document).on(myEvent, function(e){
        	classToggler.closeToggl();
		});
        $(window).resize(function() {
        	classToggler.closeToggl();

            if( platform.isMobile() ) {
                myEvent = "touchstart";
            } else {
                myEvent = "click";
            }
		});
    });

})(jQuery, window);