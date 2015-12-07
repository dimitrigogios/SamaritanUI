;(function ($, exports, undefined){
    //'use strict';

    /* Globals */
    var widths = {
        desktop : 940,
        tablet  : 748,
        mobile  : 300,
        controlWidth: 0           
    };

    var imageLoader = {
        init: function() {
            // Only load images if the browser 'cuts the mustard' <http://responsivenews.co.uk/post/18948466399/cutting-the-mustard/>
            /*if ( ! document.addEventListener || ! document.querySelector) {
                return alert("This page is \"cutting the mustard\" and your browser didn't make it.");
            }*/
            //document.addEventListener('DOMContentLoaded', function() {
                var placeholders = document.querySelectorAll('.defer-image');

                for (var i = 0, len = placeholders.length; i < len; i++) {
                    console.log('test');
                    imageLoader.deferImage(placeholders[i]);
                }
            //});
        },
        deferImage: function(element) {
            var i, len, attr;
            var img = new Image();
            var placehold = element.children[0];

            element.className+= 'block is-loading';

            img.onload = function() {
                element.className = element.className.replace('is-loading', 'is-loaded');
                element.replaceChild(img, placehold);
            };

            for (i = 0, len = placehold.attributes.length; i < len; i++) {
                attr = placehold.attributes[i];

                if (attr.name.match(/^data-/)) {
                    img.setAttribute(attr.name.replace('data-', ''), attr.value);
                    img.addClass('responsive');
                    img.setAttribute('itemprop','image');
                }
            }
        }
    };

    angular.module('article').directive('imageLoader', ['$timeout', function($timeout) {
        return {
            restrict: 'E',
            link: function($scope, $element, attrs) {
                console.log('lloll');
                var i, len, attr;
                var img = new Image();
                var placehold = $element[0].children[0];

                $element[0].className+= 'block is-loading';                    
                
                img.onload = function() {
                    $element[0].className = $element[0].className.replace('is-loading', 'is-loaded');
                    $element[0].replaceChild(img, placehold);
                };
                $timeout(function() {
                    for (i = 0, len = placehold.attributes.length; i < len; i++) {
                        attr = placehold.attributes[i];

                        if (attr.name.match(/^data-/)) {
                            img.setAttribute(attr.name.replace('data-', ''), attr.value);
                            img.setAttribute('class','responsive');
                            img.setAttribute('itemprop','image');
                        }
                    }
                }, 1);
            },
        };
    }]);

    /* =============================================================================
        jQuery Ready
    ========================================================================= */
    $(function () {
        console.log('imageloader.js loaded !!');

        imageLoader.init();

    });

    /*$(window).resize(function() {
    });*/

})(jQuery, window);