;(function ($, exports, undefined){
    //'use strict';

    /* Globals */
    var widths = {
        desktop : 940,
        tablet  : 748,
        mobile  : 300,
        controlWidth: 0           
    };

    var LOGIN = {
        init: function() {
            $('#login-submit').on('click', function(){
                console.log('click');
                var username = $('#login-username').val(),
                    password = $('#login-password').val();

                $.ajax({
                    url: '/_core/view/user-view.php?action=login',
                    type:'POST',
                    data:
                    {
                        username: username,
                        password: password
                    },
                    success: function(data)
                    {
                        if( data.length == 2 ) {
                            alert('username and password inccorect !!');
                        } else {
                            $.each(data, function(k,v) {
                                $.each(data[k], function(key,value) {
                                    if( key = 'status' && value === 0) {

                                        window.location.href = "http://samaritanui.com/#!/";

                                    } else if( key = 'status' && value === 1 ) {

                                        alert('wrong username');

                                    } else if( key = 'status' && value === 2 ) {

                                        alert('wrong password');
                                        
                                    }
                                });
                            });
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("You can'\t login in here  !! ");
                    }               
                });
            });
            $('.mail-form').keypress(function(event){
                if (event.which == 13) {
                    event.preventDefault();
                    console.log('entered pressed !!');
                    $('#login-submit').click();
                }
            });            
        }
    }

    /* =============================================================================
        jQuery Ready
    ========================================================================= */
    $(function () {
        //console.log('custom login.js loaded !!');
        LOGIN.init();

    });

    $(window).resize(function() {
    });

})(jQuery, window);