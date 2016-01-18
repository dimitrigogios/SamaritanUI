;(function($, exports) {
    
    'use strict';

    var app = angular.module('article', [
        'ngRoute',
        'angulartics',
        'angulartics.google.analytics',
        'scrollto',
        'duScroll',
        'articleControllers'
    ]);

    app.config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            // !!
            // first line correspons to base-tag placement !!!
            // !!

            //$locationProvider.html5Mode(true);
            $locationProvider.hashPrefix('!');

            $routeProvider
                .when('/', {
                    templateUrl: '/includes/templates/index.html',
                    controller: 'page-ctrl'
                })
                .when('/:pageid', {
                    templateUrl: '/includes/templates/page.html',
                    controller: 'page-ctrl'
                })
                .when('/:pageid/:articleid', {
                    templateUrl: '/includes/templates/article.html',
                    controller: 'article-ctrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }
    ]);

    var scrollArray = [],
        scrollValue = 0,
        isLastVar = false;

    var defArticlesLoaded,
        defArticlesMenuLoaded;

    var articleControllers = angular.module('articleControllers', ['ngRoute']);
    //'$element', '$timeout', '$interval',
    articleControllers

    .controller('index-ctrl', ['$scope', '$http', 'articleService', '$sce', '$timeout', function($scope, $http, articleService, $sce, $timeout) {
        //console.log('article articles controller initiated !! ');
    }])
    .controller('page-ctrl', ['$scope', '$http', 'articleService', '$sce', '$timeout', '$routeParams', '$document', '$location', '$rootScope', function($scope, $http, articleService, $sce, $timeout, $routeParams, $document, $location, $rootScope) {
        
        /*defArticlesLoaded       = new $.Deffered();
        defArticlesMenuLoaded   = new $.Deffered();*/

        var page;
        var tempPage = $routeParams.pageid;

        $('#btn-article-navigation').removeClass('hide');

        if( typeof tempPage != 'undefined' ) {
            page = tempPage.replace('-',' ');
        } else {
            page = 'frontpage';
            
            $('#btn-article-navigation').addClass('hide');
        }

        $scope.page = tempPage;

        var getValue = false,
            activeBtnTimer;
        
        articleService.getArticles('articlesByCategory', page, 'ASC')
            .success(function(data) {

                $scope.articles = data;

                getValue = true;
            })
            .then(function() {
                $document.trigger('contentLoaded');

                articleService.getArticlesAsMenu('articlesAsMenu', page, 'ASC', true)
                    .success(function(data) {
                        $scope.menuArticles = data;
                    })
                    .then(function() {
                        $document.trigger('menuListLoaded');
                    });

                //$scope.$destroy();
            });

        $scope.sanitizeHtml = function($thisStr) {
            return $sce.trustAsHtml($thisStr);
        };

        $scope.toggleArticleActive = function(id, $event) {
                var articleValueNew = $('#activate-article-'+id, $(event.currentTarget)).prop('checked');
                var el = $('label[for="activate-article-'+id+'"] > span', $(event.currentTarget));

                var articleItem = 'articleActive';
                var articleId = id;

                articleService.updateArticleById(articleId, articleValueNew, articleItem)
                    .success(function(data){
                        console.log('success !!');
                    }).then(function(){
                        if( getValue ) {
                            getValue = false;

                            activeBtnTimer = $timeout(function() {
                                getValue = true;
                                el.toggleClass('btn-show');
                            }, 100);
                        }
                    });
        }

        $scope.getUrl = function(url) {
            url = url.toLowerCase();
            url = url.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
            return url;
        };

        var preCodeTimer,
            menuLoadedTimer,
            scrollEndedTimer;

        //Custom To SamaritanUI
        function setCurrentMenu() {
            $.each(scrollArray, function(k,v){
                //windowsize > 500 && windowsize < 600
                if( v > scrollValue-105 &&  v < scrollValue+105 ) {
                    //console.log(v);

                    $('.article-navigation a.top').removeClass('current').parent().removeClass('current');
                    $('.article-navigation a.sub').removeClass('current').parent().removeClass('current');

                    $('a[data-offset="'+v+'"]').addClass('current').parent().addClass('current');

                    if( !$('a.sub.current').parent().parent().parent().hasClass('current') ) {
                        $('a.sub.current').parent().parent().parent().addClass('current');
                    }
                }
                if( isLastVar ) {
                    $('.article-navigation a.top').removeClass('current').parent().removeClass('current');
                    $('.article-navigation a.sub').removeClass('current').parent().removeClass('current');

                    $('a.last').addClass('current').parent().addClass('current');
                }
            });
        }
        function isLast() {
            if(scrollValue + $(window).height() == $(document).height()) {
                isLastVar = true;
            }
        }

        
        $(document).on('scroll', function() {
            scrollValue = $(window).scrollTop();

            isLast();

            setCurrentMenu();

            $('a[data-offset="'+scrollValue+'"]').addClass('current');

            if( scrollValue > 99 ) {
                if( !$('.article-navigation > .list-unstyled').hasClass('fixed') ) {
                    console.log($('.article-navigation .list-unstyled').offset().left);
                    $('.article-navigation > .list-unstyled').addClass('fixed').css('left', $('.article-navigation .list-unstyled').offset().left).css('top', 0);
                }
            } else {
                $('.article-navigation > .list-unstyled').removeClass('fixed').removeAttr('style');
            }
        })
        .on('contentLoaded', function() {
            preCodeTimer = $timeout(function() {
                if( !$('.logged-in').length ) {
                    $('pre code').each(function(i, block) {
                        hljs.highlightBlock(block);
                    });
                }
            }, 100);
        })
        .on('menuListLoaded', function() {
            menuLoadedTimer = $timeout(function() {
                setCurrentMenu();
            }, 500);
        })
        .on('scrollEnded', function() {
            scrollValue = $(window).scrollTop();
            
            isLast();

            setCurrentMenu();

            scrollEndedTimer = $timeout(function() {
                setCurrentMenu();
                
                isLastVar = false;
            }, 800);
        });
        

        $scope.$on('$destroy', function( event ) {
            //console.log('$destroy() was called !!');
            $timeout.cancel( preCodeTimer );
            $timeout.cancel( menuLoadedTimer );
            $timeout.cancel( scrollEndedTimer );

            $scope.articles     = null;
            $scope.menuArticles = null;
            $document.off('scroll');
            $document.off('contentLoaded');
            $document.off('menuListLoaded');
            $document.off('scrollEnded');
        });
    }])
    .controller('article-ctrl', ['$scope', '$rootScope', '$http', 'articleService', '$routeParams', '$location', '$route', '$sce', '$timeout', '$document', function($scope, $rootScope, $http, articleService, $routeParams, $location, $route, $sce, $timeout, $document) {
        console.log('article controller initiated !! ');

        $scope.showArticle = false;
        /*$scope.selectedOptionId;
              $scope.selectedOption;
              $scope.selectPrimaryCategories;*/
        $scope.selectSecondaryCategories = {
                        availableOptions: [],
                        selectedSecondaryOption: {} //This sets the default value of the select in the ui
                    };

        var page = $routeParams.pageid;
        
        var articleId_temp = $scope.articleid = $routeParams.articleid;
        var articleId = articleId_temp.match(/([0-9]+)/);

        var preCodeTimer;

        articleService.getArticleById(articleId[0], 'article')
            .success(function(data) {
                if (data.length === 0) {
                    
                    // similar behavior as an HTTP redirect
                    window.location.replace('/404/');
                    return false;
                } else {
                    console.log('article fetched !!');
                    $scope.article = data;
                    var articleT = $scope.article.articleTitle.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').toLowerCase();
                    var articleI = $scope.article.articleId;
                    var path0 = page+'/';

                    $scope.sanitizeHtml = function($thisStr) {
                        return $sce.trustAsHtml($thisStr);
                    };

                    $location.path(path0+articleI+'-'+articleT);
                    $scope.showArticle = true;

                    preCodeTimer = $timeout(function() {
                        if( !$('.logged-in').length ) {
                            $('pre code').each(function(i, block) {
                                hljs.highlightBlock(block);
                            });
                        }
                    }, 150);

                    $scope.selectedOptionId = $scope.article.articleArticleCategoryId;
                    $scope.selectedOption = $scope.article.articleCategoryTitle;

                    $scope.selectPrimaryCategories = {
                        availableOptions: [],
                        selectedOption: {id: $scope.selectedOptionId, name: $scope.selectedOption} //This sets the default value of the select in the ui
                    };

                    if( $scope.article.articleArticleSecondaryCategoryId != null ) {
                        $scope.selectedSecondaryOptionId = $scope.article.articleArticleSecondaryCategoryId;
                        $scope.selectedSecondaryOption = $scope.article.articleSecondaryCategoryTitle;

                        $scope.selectSecondaryCategories = {
                            availableOptions: [{id: null, name: 'No secondary category'}],
                            selectedSecondaryOption: {id: $scope.selectedSecondaryOptionId, name: $scope.selectedSecondaryOption} //This sets the default value of the select in the ui
                        };
                    } else {
                        $scope.selectSecondaryCategories = {
                            availableOptions: [{id: null, name: 'No secondary category'}],
                            selectedSecondaryOption: {id: null, name: 'No secondary category'} //This sets the default value of the select in the ui
                        };
                    }

                    $document.trigger('articleLoaded');
                }                
            })
            .error(function(data){
                console.log('something went wrong !! ');
            });


         

        articleService.getArticleCategories()
            .success(function(data) {
                if (data.length === 0) {
                    console.log('primaryCategories not retreived, but connected to DB');
                } else {
                    console.log('primaryCategories retreived');
                    $.map(data, function(value,index) {
                        $scope.selectPrimaryCategories.availableOptions.push({id: data[index].articleCategoryId, name: data[index].articleCategoryTitle});
                    });
                }                
            })
            .error(function(data){
                console.log('something went wrong !! ');
            });

        articleService.getArticles('articlesByCategory', page.replace('-', ' '), 'ASC')
            .success(function(data) {
                if (data.length === 0) {
                    console.log('secondaryCategories not retreived, but connected to DB');
                } else {
                    console.log('secondaryCategories retreived');
                    //console.log(data);
                    $.map(data, function(value,index) {
                        $scope.selectSecondaryCategories.availableOptions.push({id: data[index].articleId, name: data[index].articleTitle});
                    });
                }                
            })
            .error(function(data){
                console.log('something went wrong !! ');
            });

        $scope.updateCategory = function(articleItem) {
            var id = articleId[0];

            if( articleItem == 'articleArticleCategoryId' ) {
                var articleValue = $scope.selectPrimaryCategories.selectedOption.id;
            } else {
                var articleValue = $scope.selectSecondaryCategories.selectedSecondaryOption.id;
            }
            //console.log(articleValue);
            articleService.updateArticleById(id, articleValue, articleItem)
                .success(function(data) {
                    console.log(articleItem+' updated');
                })
                .error(function(data){
                    console.log('something went wrong !! ');
                });
        }

        /*$scope.$on('$destroy', function( event ) {
            $scope.selectSecondaryCategories = null;
            $timeout.cancel( preCodeTimer );
            console.log('destroy article ctrl mode');
        });*/

    }]);

    var $currentElement,
        $currentElementId,
        $currentText,
        currentClass = '',
        textareaFlag = false,
        $editor,
        editMode = false,
        valueChanged = false,
        disallowExitmode = false,
        toggleUpdaterPressed = false;

    var CKEDITOR_OPTIONS = {
                                language: 'en',
                                uiColor: '#ffffff',
                                autoParagraph: false,
                                height: 600,
                                allowedContent: true,
                                protectedSource: /<i[^>]*><\/i>/g
                            };

    angular.module('article').directive('editFunctions', ['$document', 'articleService', '$timeout', '$location', '$route', '$compile', '$q', function($document, articleService, $timeout, $location, $route, $compile, $q) {
            return {
                restrict: 'A',
                link: function($scope, $element, attrs) {

                    var getValue = true;
                    $scope.toggleArticleActive = function(id, $event) {
                            var articleValueNew = $('#activate-article-'+id, $(event.currentTarget)).prop('checked');
                            var el = $('label[for="activate-article-'+id+'"] > span', $(event.currentTarget));
                            
                            var articleItem = 'articleActive';
                            var articleId = id;

                            console.log('val: '+articleValueNew);

                            articleService.updateArticleById(articleId, articleValueNew, articleItem)
                                .success(function(data){
                                    console.log(data);
                                    console.log('success !!');
                                });
                        if( getValue ) {
                            getValue = false;

                            $timeout(function() {
                                getValue = true;
                                el.toggleClass('btn-show');
                            }, 100);
                        }
                    }

                    $scope.editThis = function(el, e, id) {
                        // circumvent propagation from toggle button pressed
                        if( toggleUpdaterPressed ) { return true; }

                        // Pause the idler-logut-function
                        $( document ).idleTimer("pause");

                        // disallows other windows to be edited while another is open
                        if( disallowExitmode ) { return true; } //exit if disallowExitmode is set

                        e.stopPropagation();

                        if( currentClass != el ) {
                             exitEditingMode();
                             //console.log('tried !!');
                        }

                        // setting currents
                        $currentElement = $element.find(el);
                        $currentElementId = id;

                        if( !$currentElement.hasClass('editing') ) {
                            console.log('entered');
                            // setting variables for checking and validating !!
                            editMode = true;
                            $currentElement.addClass('editing');
                            currentClass = el;

                            //getting and setting current text
                            $currentText = escapeHtml($currentElement.html());

                            if( $currentElement.data('replaceeditor') ) {

                                //text area is flagged !!
                                textareaFlag = true;

                                //disallowExit mode is flagged to true !!
                                disallowExitmode = true;

                                // create variable to connect on Id
                                var textarea_id = el.replace('.', '');

                                //create the html to give to Angulat templating
                                var html = '<div class="form-group editor-line relative z99 block">\
                                                <textarea id="'+textarea_id+'" class="input-action">'+$currentText+'</textarea>\
                                                <div class="btn btn-default editor-actions block w100-i text-center" ng-click="toggleUpdate()">\
                                                    <i class="fa fa-check"></i>\
                                                </div>\
                                            </div>';

                            } else {
                                //create the html to give to Angulat templating
                                var html = '<div class="form-group editor-line relative z99">\
                                                <input class="form-input input-action" value="'+$currentText+'">\
                                                <span class="addon editor-actions text-center pointer" ng-click="toggleUpdate()">\
                                                    <i class="fa fa-check"></i>\
                                                </span>\
                                            </div>';
                            }
                            // create the Angular template
                            var template = angular.element(html);

                            // Append it to the directive element
                            $currentElement.html(template);
                            // And let Angular $compile it
                            $compile(template)($scope);


                            // if text area is Flagge !!
                            if( textareaFlag ) {
                                $editor = CKEDITOR.replace( textarea_id,
                                    CKEDITOR_OPTIONS
                                );
                            }
                        }

                        //console.log('currentClass2: '+ currentClass);
                    };

                    $scope.toggleUpdate = function() {
                        console.log('toggleUpdate !!');

                        // prevent editThis() to be toggled by setting a variable to true !!
                        toggleUpdaterPressed = true;

                        if( textareaFlag ) {
                            // disallowExit mode is flagged to false, so exitEditing is allowed !!
                            disallowExitmode = false;
                        }

                        exitEditingMode();

                        // allow edit mode again after 500 ms !!
                        $timeout(function() {
                            toggleUpdaterPressed = false;
                        }, 500);
                    };

                    $document.on('click', function() {
                        exitEditingMode();
                    });
                    function escapeHtml(text) {
                        var map = {
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            '"': '&quot;',
                            "'": '&#039;'
                        };

                        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
                    }

                    function exitEditingMode() {
                        if( !editMode ) { return true; } //exit if no editing mode is active

                        if( disallowExitmode ) { 
                            // toggle animation class on "save" button
                            $currentElement.addClass('animate');
                            $timeout(function() {
                                $currentElement.removeClass('animate');
                            }, 10);
                            return true;
                        } //exit if disallowExitmode is set
                        
                        // control the new value variable
                        if( textareaFlag) {
                            console.log('is textarea');
                            var articleValueNew = $editor.getData();

                        } else {
                            console.log('is input');
                            var articleValueNew = angular.element(document.querySelector('.input-action')).val();
                        }

                        console.log('new article value is: '+articleValueNew);
                        console.log('previous article value was: '+$currentText);

                        if( $currentElementId != '' && articleValueNew != $currentText ) {
                            console.log('removing edit mode !! ');
                            
                            var articleId = $currentElementId,
                                articleItem = $currentElement.data('update');

                            $currentElement.html(articleValueNew);

                            //console.log(articleValueNew);

                            articleService.updateArticleById(articleId, articleValueNew, articleItem);

                            console.log('site updated !!');
                            console.log('article item is: '+articleItem);

                            //if( articleItem == 'articleTitle' ) {
                            //    var articleT = articleValueNew.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').toLowerCase();
                            //    $location.path(articleId+'-'+articleT);
                            //}

                        } else if( articleValueNew == $currentText ) {
                            console.log('value hasn\'t changed !! ');
                            $element.find('.editing').html(articleValueNew);
                        }

                        console.log('close editing');

                        resetValue();
                    }

                    function resetValue() {
                        $currentElement.removeClass('editing');
                        $currentElement = null,
                        $currentElementId = null,
                        $currentText = null,
                        textareaFlag = false,
                        $editor = null,
                        editMode = false;
                        valueChanged = false;

                        // Resume and reset idle-logout-function
                        $( document ).idleTimer("resume");
                        $( document ).idleTimer("reset");

                        console.log('everything reset !!');
                    }

                    $scope.uploadFiles = function(id) {
                        var allowLoad = false;

                        var $pictureElement = $element.find('.article-entity-picture');

                        var html = '<button id="fileuploader" class="btn btn-default trailing09 trailing09">Upload</buttin>\
                                    <button id="extrabutton" class="btn btn-primary trailing1 hide">Start Upload</button>';
                        // create the Angular template
                        var template = angular.element(html);

                        // Append it to the directive element
                        $pictureElement.append(template);
                        // And let Angular $compile it
                        $compile(template)($scope, function() {
                            console.log('compiling finished !!');
                            var uploader = $("#fileuploader").uploadFile({
                                url:"/_core/modules/filehandler/filehandler.php?admin&action=upload&folder=article"+id,
                                multiple: true,
                                fileName: "myfile",
                                returnType:"json",
                                dragDrop:false,
                                autoSubmit: false,
                                //formData: ,
                                onLoad:function(obj) {
                                    
                                },
                                onSubmit:function(files) {
                                    files : createMyForData()
                                    uploadAllFiles();
                                },
                                onSuccess:function(files,data,xhr,pd) {
                                    //$("#eventsmessage").html($("#eventsmessage").html()+"<br/>Success for: "+JSON.stringify(data));
                                    console.log('Success');
                                },
                                afterUploadAll:function(obj){
                                    //$("#eventsmessage").html($("#eventsmessage").html()+"<br/>All files are uploaded");
                                    console.log('uploaded');
                                },
                                onError: function(files,status,errMsg,pd) {
                                    //$("#eventsmessage").html($("#eventsmessage").html()+"<br/>Error for: "+JSON.stringify(files));
                                    console.log('Error');
                                },
                                onCancel:function(files,pd) {
                                    //$("#eventsmessage").html($("#eventsmessage").html()+"<br/>Canceled  files: "+JSON.stringify(files));
                                    
                                    console.log('Canceled');
                                },
                                onSelect:function(files) {
                                    $element.find('#extrabutton').removeClass('hide');

                                    $timeout(function() {
                                        $element.find('.ajax-file-upload-red').on("click", function(){
                                            $timeout(function() {
                                                if( $element.find('.ajax-file-upload-statusbar').length ) {
                                                    console.log('still there !!');
                                                }else {
                                                    $element.find('#extrabutton').addClass('hide');
                                                }
                                            }, 100);
                                        });
                                    }, 100);
                                }                              
                            });
                            $('#extrabutton').on('click', function() {
                                allowLoad = true;
                                uploader.startUpload();
                                $element.find('.article-entity-picture .form-group').remove();
                                
                            });

                            function createMyForData() {
                                var file_data = $element.find("input[type='file']").get(0).files;
                                return file_data;
                            }
                            function uploadAllFiles() {
                                var file_data = $element.find("input[type='file']").get(0).files;
                                if( allowLoad ) {
                                    console.log('uploadin all files !!');

                                    allowLoad = false;
                                    var file_data = $element.find("input[type='file']").get(0).files;
                                    var articlePictures = '';
                                    var sizeOfPictureArray = file_data.length;

                                    $.each(file_data, function(k,v) {
                                        articlePictures += '/upload/article'+id+'/'+v.name;
                                        if ( sizeOfPictureArray != 1 && k != sizeOfPictureArray-1) {
                                            articlePictures += '|';
                                        }
                                    });

                                    console.log('pictures: '+articlePictures);
                                        
                                    articleService.updateArticleById(id, articlePictures, 'articlePicture')
                                                .success(function() {});
                                }
                            }

                            $.when( uploader ).done(function(obj) {
                                console.log('loading');
                                var elements = $();
                                $.ajax({
                                    cache: false,
                                    url: "/_core/modules/filehandler/filehandler.php?admin&action=load&folder=article"+id,
                                    dataType: "json",
                                    success: function(data) 
                                    {
                                        for(var i=0;i<data.length;i++)
                                        {
                                            //console.log(data[i]);
                                            var t = i;
                                            t++;
                                            elements = elements.add('<div class="form-group group-'+id+'">\
                                                                        <label class="form-label float-left">'+data[i].name+'</label>\
                                                                        <div class="input-group addons">\
                                                                            <span class="delete-item addon pointer" data-folder="'+t+'" data-item-name="'+data[i].name+'">\
                                                                                <i class="fa fa-trash-o"></i>\
                                                                            </span>\
                                                                        </div>\
                                                                    </div>');
                                        }

                                        // create the Angular template
                                        var templateItems = angular.element(elements);

                                        // Append it to the directive element
                                        $pictureElement.append(templateItems);
                                        // And let Angular $compile it
                                        $compile(templateItems)($scope);

                                        $('.delete-item').on('click', function() {
                                            console.log('trying to delete !!');
                                                var id = $(this).data('folder');
                                                var nameValue = $(this).data('item-name');
                                                console.log(id, nameValue);
                                                $.post("/_core/modules/filehandler/filehandler.php?admin&action=delete&folder=article"+id, {op: "delete",name: nameValue},
                                                function (resp,textStatus, jqXHR) {
                                                    //Show Message  
                                                    console.log("File Deleted");
                                                    $('.group-'+id).remove();

                                                    articleService.updateArticleById(id, null, 'articlePicture');
                                                });
                                        });
                                    }
                                });
                            });
                        });
                    }

                /*$scope.$on('$destroy', function( event ) {
                    $currentElement = null;
                    $currentText = null;
                    $editor = null;
                    //$timeout.cancel( buttonTimer2 );
                    console.log('destroy editmode');
                });*/

                }// end of link {}
            };
        }]);

    angular.module('article').directive('createFunctions', ['$document', 'articleService', '$timeout', '$location', '$route', '$compile', '$q', '$sce', function($document, articleService, $timeout, $location, $route, $compile, $q, $sce) {
            return {
                restrict: 'A',
                link: function($scope, $element, attrs) {
                    $scope.createArticleActive = false;
                    $scope.newArticleId;

                    $scope.createArticleCategoryActive = false;
                    $scope.newArticleCategoryId;

                    $scope.articleCategory = {
                        title: 'write an article category title'
                    };

                    $scope.createNewArticle= function() {
                        console.log('creating new article !!');
                        $scope.createArticleCategoryActive = false;

                        articleService.getArticleCategories()
                            .success(function(data) {
                                console.log('articleCategories successfully retrieved !!');
                                $scope.articleCategories = data;
                            })
                            .error(function(data){
                                console.log('something went wrong !! ');
                            });

                        articleService.getHighestSorting()
                            .success(function(data) {
                                $scope.sorting = data;
                            })
                            .error(function(data){
                                console.log('something went wrong !! ');
                            });

                        articleService.createArticle()
                            .success(function(data) {
                                console.log('article successfully created !!');
                                $scope.article = data;

                                var $template_load = $scope.templateUrl = '/includes/templates/create-article.html';

                                // set variable to false, so no more article can be created
                                $scope.createArticleActive = true;

                                // set the new article's id for later use
                                $scope.newArticleId = $scope.article.articleId;

                                // sanitize html, sp it can be trusted/used in template !!
                                $scope.sanitizeHtml = function($thisStr) {
                                    return $sce.trustAsHtml($thisStr);
                                };

                                // replace the textareas with a CKEditor using a recursive function to find element
                                function findElement(el) {
                                    var dom_element = $element.find(el).length;
                                    if( dom_element == 0 ) {
                                        console.log('Element hasn\'t been found yet');
                                        $timeout(function() {
                                            findElement(el);
                                        }, 10);
                                    } else {
                                        console.log('Element has been found !!');
                                        //return true;
                                        dom_element = el.replace('#','');
                                        CKEDITOR.replace( dom_element,
                                            CKEDITOR_OPTIONS
                                        ); 
                                    }
                                }

                                $.when( $template_load ).done(function() {
                                    console.log('loaded !! ');
                                    findElement('#Description');
                                    findElement('#ShortDescription');
                                });
                            })
                            .error(function(data){
                                console.log('something went wrong !! ');
                            });
                    };

                    $scope.cancelNewArticle = function() {
                        console.log('deleting: '+$scope.newArticleId);
                        articleService.deleteArticle($scope.newArticleId)
                            .success(function(data) {
                                if (data === 1) {
                                    console.log('new article canceled !!');

                                    // variable to false, so template can be rewoked !!
                                    $scope.createArticleActive = false;

                                } else {
                                    console.log('new article couldn\'t be deleted !!');
                                }
                            })
                            .error(function(data){
                                console.log('something went wrong !! ');
                            });
                    };
                    $scope.saveNewArticle = function() {
                        //$scope.closeEdit = true;

                        var articleValues = [];

                        // Get title value
                        var articleTitle = $element.find('.article-headline input').val();
                            articleValues.push({'value': articleTitle, 'where': 'articleTitle'});

                        // Get article description
                        var articleDescription = CKEDITOR.instances.Description.getData();
                            articleValues.push({'value': articleDescription, 'where': 'articleDescription'});

                        // Get article short description
                        var articleShortDescription = CKEDITOR.instances.ShortDescription.getData();
                            articleValues.push({'value': articleShortDescription, 'where': 'articleDescription_short'});

                        // Get article category
                        var articleCategories = $element.find('.article-categories').val();
                            articleValues.push({'value': articleCategories, 'where': 'articleArticleCategoryId'});

                        // Get value af checkbox
                        var articleActive = $element.find('#activate-article').prop('checked');
                            articleValues.push({'value': articleActive, 'where': 'articleActive'});

                        // Get value from sorting
                        var sorting = $element.find('#article-sorting').val();
                            articleValues.push({'value': sorting, 'where': 'sorting'});

                        var t = 0;
                        $.map( articleValues, function( val, i ) {
                            var articleValue = articleValues[t].value;
                            var articleItem = articleValues[t].where;

                            articleService.updateArticleById(
                                $scope.newArticleId,
                                articleValue,
                                articleItem
                                ).success(function(data) {
                                    if (data === 1) {
                                        console.log(articleItem+' - was updated !!');

                                    } else {
                                        console.log(articleItem+' - wasn\'t updated !!');
                                    }
                                })
                                .error(function(data){
                                    console.log('something went wrong !! ');
                                });
                            t++;
                        });
                    };

                    $scope.closeNewArticle = function() {
                        $scope.createArticleActive = false;
                    };

                    var buttonTimer1,
                        buttonTimer2;

                    $scope.uploadFiles = function() {
                        var id = $scope.newArticleId;
                        var allowLoad = false;

                        var $pictureElement = $element.find('.article-entity-picture');

                        var html = '<button id="fileuploader" class="btn btn-default trailing09">Upload</buttin>\
                                    <button id="extrabutton" class="btn btn-primary trailing1 hide">Start Upload</button>';
                        // create the Angular template
                        var template = angular.element(html);

                        // Append it to the directive element
                        $pictureElement.append(template);
                        // And let Angular $compile it
                        $compile(template)($scope, function() {
                            console.log('compiling finished !!');
                            var uploader = $("#fileuploader").uploadFile({
                                url:"/_core/modules/filehandler/filehandler.php?admin&action=upload&folder=article"+id,
                                multiple: true,
                                fileName: "myfile",
                                returnType:"json",
                                dragDrop:false,
                                autoSubmit: false,
                                //formData: ,
                                onLoad:function(obj) {
                                    
                                },
                                onSubmit:function(files) {
                                    files : createMyForData()
                                    uploadAllFiles();
                                },
                                onSuccess:function(files,data,xhr,pd) {
                                    //$("#eventsmessage").html($("#eventsmessage").html()+"<br/>Success for: "+JSON.stringify(data));
                                    console.log('Success');
                                },
                                afterUploadAll:function(obj){
                                    //$("#eventsmessage").html($("#eventsmessage").html()+"<br/>All files are uploaded");
                                    console.log('uploaded');
                                },
                                onError: function(files,status,errMsg,pd) {
                                    //$("#eventsmessage").html($("#eventsmessage").html()+"<br/>Error for: "+JSON.stringify(files));
                                    console.log('Error');
                                },
                                onCancel:function(files,pd) {
                                    //$("#eventsmessage").html($("#eventsmessage").html()+"<br/>Canceled  files: "+JSON.stringify(files));
                                    console.log('Canceled');
                                },
                                onSelect:function(files) {
                                    $element.find('#extrabutton').removeClass('hide');

                                    buttonTimer1 = $timeout(function() {
                                        $element.find('.ajax-file-upload-red').on("click", function(){
                                            buttonTimer2 = $timeout(function() {
                                                if( $element.find('.ajax-file-upload-statusbar').length ) {
                                                    console.log('still there !!');
                                                }else {
                                                    $element.find('#extrabutton').addClass('hide');
                                                }
                                            }, 100);
                                        });
                                    }, 100);
                                }
                                
                            });
                            $('#extrabutton').on('click', function() {
                                allowLoad = true;
                                uploader.startUpload();
                                $element.find('.article-entity-picture .form-group').remove();
                            });

                            function createMyForData() {
                                var file_data = $element.find("input[type='file']").get(0).files;
                                return file_data;
                            }
                            function uploadAllFiles() {
                                if( allowLoad ) {
                                    console.log('uploadin all files !!');

                                    allowLoad = false;
                                    var file_data = $element.find("input[type='file']").get(0).files;
                                    var articlePictures = '';
                                    var sizeOfPictureArray = file_data.length;

                                    $.each(file_data, function(k,v) {
                                        articlePictures += '/upload/article'+id+'/'+v.name;
                                        if ( sizeOfPictureArray != 1 && k != sizeOfPictureArray-1) {
                                            articlePictures += '|';
                                        }
                                    });

                                    console.log('pictures: '+articlePictures);
                                        
                                    articleService.updateArticleById(id, articlePictures, 'articlePicture')
                                                .success(function() {
                                                    
                                                    var elements = $();
                                                    $.ajax({
                                                        cache: false,
                                                        url: "/_core/modules/filehandler/filehandler.php?admin&action=load&folder=article"+id,
                                                        dataType: "json",
                                                        success: function(data) 
                                                        {
                                                            for(var i=0;i<data.length;i++) {
                                                                console.log(data[i]);
                                                                console.log('inside for loop');
                                                                var t = i;
                                                                t++;
                                                                elements = elements.add('<div class="form-group group-'+id+'">\
                                                                                            <label class="form-label float-left">'+data[i].name+'</label>\
                                                                                            <div class="input-group addons">\
                                                                                                <span class="delete-item addon pointer" data-folder="'+t+'" data-item-name="'+data[i].name+'">\
                                                                                                    <i class="fa fa-trash-o"></i>\
                                                                                                </span>\
                                                                                            </div>\
                                                                                        </div>');
                                                            }

                                                            // create the Angular template
                                                            var templateItems = angular.element(elements);

                                                            // Append it to the directive element
                                                            $pictureElement.append(templateItems);
                                                            // And let Angular $compile it
                                                            var compiling = $compile(templateItems)($scope);
                                                            $.when( compiling ).done(function() {
                                                                console.log('compiled !!');
                                                            });

                                                            $('.delete-item').on('click', function() {
                                                                console.log('trying to delete !!');
                                                                    var id = $(this).data('folder');
                                                                    var nameValue = $(this).data('item-name');
                                                                    console.log(id, nameValue);
                                                                    $.post("/_core/modules/filehandler/filehandler.php?admin&action=delete&folder=article"+id, {op: "delete",name: nameValue},
                                                                    function (resp,textStatus, jqXHR) {
                                                                        //Show Message  
                                                                        console.log("File Deleted");
                                                                        $('.group-'+id).remove();

                                                                        articleService.updateArticleById(id, null, 'articlePicture');
                                                                    });
                                                            });   
                                                        }
                                                    });
                                                    /*$scope.$on('$destroy', function( event ) {
                                                        elements = null;
                                                    });*/  
                                                });

                                }
                            }

                            $.when( uploader ).done(function(obj) {
                                console.log('uploader initialized !!');
                            });
                        });
                    }

                    $scope.createNewArticleCategory= function() {
                        console.log('creating new article category!!');

                        var $template_load = $scope.templateUrlArticleCategory = '/includes/templates/create-article-category.html';

                        // set variable to true, so no more article can be created
                        $scope.createArticleCategoryActive = true;
                    };
                    $scope.saveNewArticleCategory= function() {
                        articleService.createNewArticleCategory($scope.articleCategory.title)
                            .success(function(data) {
                                console.log('new article category successfully saved !!');
                                $scope.createArticleCategoryActive = false;
                            })
                            .error(function(data){
                                console.log('something went wrong !! ');
                            });
                    }
                    $scope.cancelNewArticleCategory= function() {
                        $scope.createArticleCategoryActive = false;
                    }

                    /*$scope.$on('$destroy', function( event ) {
                        $timeout.cancel( buttonTimer1 );
                        $timeout.cancel( buttonTimer2 );
                        console.log('destroy article update');
                    });*/

                }// end of link {}
            };
        }]);

    angular.module('article').directive('menuList', ['$document', 'articleService', '$timeout', '$location', '$route', '$routeParams', '$compile', '$q', '$sce', function($document, articleService, $timeout, $location, $route, $routeParams, $compile, $q, $sce) {
            return {
                restrict: 'A',
                link: function($scope, $element, attrs) {
                    articleService.getArticleCategories()
                            .success(function(data) {
                                //console.log('articleCategories successfully retrieved !!');
                                $scope.menulist = data;
                            })
                            .error(function(data){
                                console.log('something went wrong !! ');
                            });

                    $scope.getUrl = function(url) {
                        url = url.toLowerCase();
                        url = url.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
                        return url;
                    };

                    $scope.isCurrent = function(url){
                        url = url.toLowerCase();
                        url = url.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');

                        var urlBits = $location.path().split('/');
                        if( urlBits[1] == url ) {
                            return 'current';
                        }
                        return '';
                    };

                    /*$scope.$on('$destroy', function( event ) {
                        $scope.isCurrent = null;
                        $scope.getUrl = null;
                        console.log('destroy menuList');
                    });*/
                }// end of link {}
            };
        }]);

    angular.module('article').directive('getOffset', ['$document', 'articleService', '$timeout', '$location', '$route', '$routeParams', '$compile', '$q', '$sce', function($document, articleService, $timeout, $location, $route, $routeParams, $compile, $q, $sce) {
            return {
                restrict: 'A',
                link: function($scope, $element, attrs) {
                    var offsetTimer,
                        scrollEndedTimer;

                    function calcOffset() {
                        offsetTimer = $timeout(function() {
                            var className = $element.attr('data-el').split('#');

                            var elementResult        = document.getElementById(className[1]),
                                elementResult        = angular.element(elementResult);
                            if( typeof elementResult[0] != 'undefined' ) {
                                $element.attr('data-offset', elementResult[0].offsetTop);
                                scrollArray.push(elementResult[0].offsetTop);
                            }
                        }, 2);
                    }

                    $document.on('menuListLoaded', calcOffset());

                    $scope.scrollTo = function(){
                        var classes = $element.attr('class').split(' ');
                        $.map(classes, function(value,index){
                            if( value == 'last' ) {
                                isLastVar = true;
                            }
                        });
                        //console.log(classes);
                        $("html, body").animate({scrollTop: $element.attr('data-offset')-100}, 180);
                        scrollEndedTimer = $timeout(function(){
                            $document.trigger('scrollEnded');
                        },200);
                    }

                    $scope.$on('$destroy', function( event ) {
                        $timeout.cancel( offsetTimer );
                        $timeout.cancel( scrollEndedTimer );
                        $document.off('menuListLoaded', calcOffset());
                    });

                }// end of link {}
            };
        }]);

    articleControllers.service('articleService', ['$http', function($http) {
        
        // Simple GET request example:
        var getArticles = function(actionName, category, orderBy) {
            return $http.get('/_core/view/article-view.php?action='+actionName+'&category='+category+'&orderBy='+orderBy);
        };

        var getArticlesAsMenu = function(actionName, category, orderBy, menu) {
            if( typeof menu == 'undefined' ) {
                menu = false;
            }
            return $http.get('/_core/view/article-view.php?action='+actionName+'&category='+category+'&orderBy='+orderBy+'&menu='+menu);
        };

        var getArticleById = function(id, actionName) {
            return $http.get('/_core/view/article-view.php?action='+actionName+'&articleId='+id);
        };

        var updateArticleById = function(id, articleValue, articleItem) {

            // Collect all data in a json in order to POST to php !!
            var data = JSON.stringify({
                    id: id,  
                    articleValue: articleValue,  
                    articleItem: articleItem  
                });

            return $http.post('/_core/view/article-view.php?action=articleUpdate', data);
        };

        var createArticle = function() {
            return $http.get('/_core/view/article-view.php?action=articleCreate');
        }

        var deleteArticle = function(id) {
            return $http.get('/_core/view/article-view.php?action=articleDelete&articleId='+id);   
        }

        var getArticleCategories = function() {
            return $http.get('/_core/view/article-view.php?action=articleCategories');   
        }

        var getHighestSorting = function() {
            return $http.get('/_core/view/article-view.php?action=highestSorting');   
        }

        var createNewArticleCategory = function(string) {
            var data = JSON.stringify({
                    categoryTitle: string
                });
            return $http.post('/_core/view/article-view.php?action=createNewArticleCategory', data);   
        }

        return {
            getArticles: getArticles,
            getArticlesAsMenu: getArticlesAsMenu,
            getArticleById: getArticleById,
            updateArticleById: updateArticleById,
            createArticle: createArticle,
            deleteArticle: deleteArticle,
            getArticleCategories: getArticleCategories,
            getHighestSorting: getHighestSorting,
            createNewArticleCategory: createNewArticleCategory
        };

    }]);

})(jQuery, window);