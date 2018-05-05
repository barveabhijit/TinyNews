if(!TN) var TN = {};
if (!TN.viewMy) TN.viewMy = {};

(function($viewMy){

    var imageContainer = null;
    var topStories = {};
    var custId = TN.utils.getCookie('TNUser');
    var likeBeingProcessed = false;
    var dislikeBeingProcessed = false;
    var reclipBeingprocessed = false;

    (function($topStories){
        var pageNum = 1;
        var maxPages = 1;
        var catType;
        var okToLoadMore = false;
        var imagesHtml = "";
        var imageContainer = $('#imageContainer');
        //var topCount = 10;
        var maxCats = 0;
        var catCount = 0;
        var categoriesJson;
        var masonryInitialized = false;

        function getStoriesAndWishListFiltered( custId, num, page, type, category ){
            TN.services.getStoriesAndWishListFiltered(custId, num, page, type, category).
                done(loadImageContainer);
        }

        function loadImageContainer( json ){

            var totalItems = 0;
            var itemCount = 0;
            var imagesHtml = "";

            function getImageItemHtml(itemDetails, countersObject){

                function getStoryCopy(itemDetails){
                    var opEdItemHtml = "";
                    if( !!itemDetails.who ){
                        opEdItemHtml += 'Who: ' + itemDetails.who+'<br/>';
                    }
                    if( !!itemDetails.what ){
                        opEdItemHtml += 'What: ' + itemDetails.what+'<br/>';
                    }
                    if( !!itemDetails.where ){
                        opEdItemHtml += 'Where: ' + itemDetails.where+'<br/>';
                    }
                    if( !!itemDetails.when ){
                        opEdItemHtml += 'When: ' + itemDetails.when+'<br/>';
                    }
                    if( !!itemDetails.how ){
                        opEdItemHtml += 'How: ' + itemDetails.how+'<br/>';
                    }
                    if( !!itemDetails.why ){
                        opEdItemHtml += 'Why: ' + itemDetails.why+'<br/>';
                    }
                    if( !!itemDetails.oped ){
                        opEdItemHtml += itemDetails.oped+'<br/>';
                    }
                    return ( !!opEdItemHtml ? '<p>' + opEdItemHtml + '</p>' : '');
                }

                function getOriginUrlHtml(){
                    var storyUrl = itemDetails.storyUrl;
                    var originUrlHtml = "";
                    if( !!storyUrl ){
                        if( !!storyUrl ){
                            originUrlHtml += ' via <a class="storyViaLink" href="' + storyUrl + '">' + TN.utils.getBaseUrl(storyUrl) + '</a>';
                        }
                    }
                    return originUrlHtml;
                }

                //temp
                //var reclipsCount = 0;

                var storyHtml = '\
                <article class="story userStoryBoardItem"> \
                    <section class="storyBlcok"> \
                    <input class="messageId" type="hidden" value="' + itemDetails.messageId + '"/> \
                    <input class="storyId" type="hidden" value="' + itemDetails.storyId + '"/> \
                        <img class="storyImage" src="' + itemDetails.imageThumbUrl + '&width=200" alt="' + itemDetails.imageThumbUrl.substr(itemDetails.imageThumbUrl.search('storyId')) + '"> \
                        <div class="storyHeader"><h1 class="storyHeadline">'+itemDetails.headline+'</h1></div> \
                    <hr class="hRulerStory"> \
                    <div class="storyInfo block">' +
                    getStoryCopy(itemDetails) +
                    '</div> \
                <div class="storyComment block"> \
                            <ul class="storyCommentList"> \
                                <li class="like likeNormal"></li> \
                                <li class="dislike dislikeNormal"></li> \
                                <li class="comment"></li> \
                                <li class="reclip last"></li> \
                            </ul> \
                        </div>  \
                        <div class="storyPerson block"> \
                            <div class="block"> \
                                <img height="36" width="36" src="' + itemDetails.authorThumbUrl + '"> \
                                    <h2>' + (itemDetails.isWish ? "via " : "by ") +'<a>' + itemDetails.authorName  + getOriginUrlHtml() + '</a></h2> \
                                    <p>'+( !!itemDetails.storyDate ? itemDetails.storyDate : '' )+'</p> \
                                </div> \
                                <hr class="hRulerStory"> \
                                <ul class="Personinfo">' +
                    ( !!countersObject ?
                        '<li class="likesCount"><span>' + countersObject.likesCounter + '</span> likes</li> \
                                    <li class="dislikesCount"><span>' + countersObject.unLikesCounter + '</span> dislikes</li> \
                                    <li class="commentsCount"><span>' + TN.commentHandler.trueNumOfComments(itemDetails.comments) + '</span> comments</li> \
                                    <li class="reclipsCount last"><span>' + itemDetails.clips + '</span> reclips</li>' :
                        '<li>Counters Info Not Available</li>') +
                    '</ul> \
                </div>' +
                    TN.commentHandler.getCommentsHtml(itemDetails.comments) +
                    '</section> \
                </article>';

                return storyHtml;

            }

            function getItemDetails(itemSummary){
                var storyId = itemSummary.id;
                TN.services.getStory(storyId).
                    done(function(json){
                        if( !!json && !!json[0] ){

                            function addItemToPage(){
                                // Attach isWish flag to json[0] and set it to true in case the item is 
                                // wishlisted by user as reported by getStoriesAndWishListFiltered:
                                json[0].isWish = (itemSummary.wish == "Y") ? true : false;
                                
                                // Create countersObject directly instead of taking it from getMessageStats:
                                var countersObject = {};
                                countersObject.buzzid = storyId;
                                countersObject.commentsCounter = json[0].numComments;
                                countersObject.detailedReadCounter = 0; // output of getStory WS doesn't yet provide "detailedReadCounter" so we set it to 0 for now
                                countersObject.likesCounter = json[0].likes;
                                countersObject.messageId = json[0].messageId;
                                countersObject.messageType = json[0].type;
                                countersObject.unLikesCounter = json[0].unlikes;

                                itemCount++;

                                // Make an identical copy of .comments array called .messageResponseList to make the "storedDetailItem" legacy-compatible
                                json[0].messageResponseList = [];
                                jQuery.each(json[0].comments, function(index, val){
                                    json[0].messageResponseList.push(val);
                                });

                                TN.utils.storeDetailItem(json[0].messageId, json[0], countersObject);
                                imagesHtml += getImageItemHtml(json[0], countersObject);
                                // Once final item details are loaded, load the DOM
                                if( itemCount === totalItems ){
                                    var imagesHtmlElem = $(imagesHtml);
                                    // Test for unreachable or corrupt images and remove stories (article element)
                                    // with such images before appending anything to masonryCont since they break
                                    // the "lightbox" function:
                                    imagesHtmlElem.find('.storyImage').each(function(){
                                        var tempImgElem = $(this);
                                        tempImgElem.attr("src", this.src).error(function(){
                                            TN.utils.deleteDetailItem(tempImgElem.parent().find('.messageId').val());
                                            tempImgElem.parent().parent().detach();
                                        });
                                    });
                                    imagesHtmlElem.hide();

                                    imageContainer.append(imagesHtmlElem).imagesLoaded( function() {

                                        $('.allStoryBlocks').unbind().bind('click', function(){
                                            var jqElem = $(this);
                                            TN.commentHandler.getAllComments(jqElem, jqElem.parents('.storyBlcok'));
                                        });

                                        if(!masonryInitialized){
                                            imageContainer.masonry({
                                                itemSelector : '.story',
                                                isFitWidth : true,
                                                columnWidth : 227,
                                                gutterWidth : 25
                                            });
                                            masonryInitialized = true;
                                        } else {
                                            imageContainer.masonry('appended', imagesHtmlElem);
                                        }
                                        imagesHtmlElem.show();

                                        // imagesHtml = ''; // Seems it doesn't produce any difference for jQuery Masonry

                                        if( pageNum < maxPages ) {
                                            pageNum++;
                                            getStoriesAndWishListFiltered(viewId, 10, pageNum, 'mine', '');
                                        }

                                        $('#catSelector').attr('disabled', false);
                                        okToLoadMore = true;
                                    });
                                }
                            }

                            addItemToPage();
                            /*TN.services.getMesageStats(messageId).done(function(countersJson){
                                if( !!countersJson && countersJson[0] ){
                                    addItemToPage(countersJson[0]);
                                }
                            }).fail(function(){
                                    addItemToPage();
                                });*/
                        }
                    }
                );
            }


            if( json && json[0] ){

                maxPages = parseFloat(json[0].numPages);

                if( json[0].stories  ){

                    totalItems = json[0].stories.length;
                    for( var i = 0; i<totalItems; i++ ){
                        var currItem = json[0].stories[i];
                        if(!!currItem){
                            //get details of the currentitem
                            getItemDetails(currItem);
                        }
                    }
                }
            }
        }

        $topStories.reload = function(newType){
            catType = newType;
            if( imageContainer.html().trim() ){
                imageContainer.masonry('destroy');
            }
            imageContainer.empty();
            pageNum = 1;
            $topStories.show();
        };

        $topStories.show = function(){
            // disable the category select dropdown
            $('#catSelector').attr('disabled', true);

            /*TN.services.getAllMessageTypeActiveCategories().done(function(json){
                if( !!json ){
                    categoriesJson = json;
                }
            });*/

            TN.services.getStoriesAndWishListFiltered(viewId, 10, 1, 'mine', '').
                done(loadImageContainer).
                always(function(){
                    // placeholder
                });

            $('.storyBlcok .storyComment .comment').livequery('click', function(){
                TN.commentHandler.addCommentBox($(this).parents('.storyBlcok'));
            });

            $('.storyBlcok .storyComment .like').livequery('click', function(){
                if( !likeBeingProcessed ){
                    likeBeingProcessed = true;
                    var jqElem = $(this);
                    var parentCont = jqElem.parents('.storyBlcok');

                    if( !!parentCont.data('like') ){
                        TN.likeHandler.reverseLikeCount( custId, parentCont, catType, jqElem).
                            always(function(){
                                likeBeingProcessed = false;
                            });
                    }
                    else {
                        TN.likeHandler.updateLikeCount( custId, parentCont, catType, jqElem).
                            always(function(){
                                likeBeingProcessed = false;
                            });
                    }
                }
            });

            $('.storyBlcok .storyComment .like').livequery('mousedown', function(){
                var jqElem = $(this);
                jqElem.removeClass('likeNormal');
                jqElem.removeClass('likeSelected');
                jqElem.addClass('likeClicked');
            });

            $('.storyBlcok .storyComment .like').livequery('mouseleave', function(){
                var jqElem = $(this);

                if( jqElem.hasClass('likeClicked') ){
                    var parentCont = jqElem.parents('.storyBlcok');

                    jqElem.removeClass('likeClicked');
                    if( !!parentCont.data('like') ){
                        jqElem.addClass('likeSelected');
                    }
                    else {
                        jqElem.addClass('likeNormal');
                    }
                }
            });

            $('.storyBlcok .storyComment .dislike').livequery('click', function(){
                if( !dislikeBeingProcessed ){
                    dislikeBeingProcessed = true;
                    var jqElem = $(this);
                    var parentCont = jqElem.parents('.storyBlcok');

                    if( !!parentCont.data('dislike') ){
                        TN.likeHandler.reverseDislikeCount( custId, parentCont, catType, jqElem).
                            always(function(){
                                dislikeBeingProcessed = false;
                            });
                    }
                    else {
                        TN.likeHandler.updateDislikeCount( custId, parentCont, catType, jqElem).
                            always(function(){
                                dislikeBeingProcessed = false;
                            });
                    }
                }
            });

            $('.storyBlcok .storyComment .dislike').livequery('mousedown', function(){
                var jqElem = $(this);
                jqElem.removeClass('dislikeNormal');
                jqElem.removeClass('dislikeSelected');
                jqElem.addClass('dislikeClicked');
            });

            $('.storyBlcok .storyComment .dislike').livequery('mouseleave', function(){
                var jqElem = $(this);

                if( jqElem.hasClass('dislikeClicked') ){
                    var parentCont = jqElem.parents('.storyBlcok');

                    jqElem.removeClass('dislikeClicked');
                    if( !!parentCont.data('dislike') ){
                        jqElem.addClass('dislikeSelected');
                    }
                    else {
                        jqElem.addClass('dislikeNormal');
                    }
                }
            });

            $('.storyBlcok .storyComment .reclip').livequery('click', function(){
                if(( !reclipBeingprocessed ) && (viewId != custId)){
                    reclipBeingprocessed = true;

                    var jqElem = $(this);
                    var parentCont = jqElem.parents('.storyBlcok');
                    var messageId = parentCont.find('.messageId').val();

                    TN.services.addToWishListWithFittingRoomData(custId, messageId, 'public').
                        done(function(){
                            alert('This item has been successfully added to favorites');
                        }).
                        fail(function(jqXHR, textStatus, errorThrown){
                            alert('There was an error in processing your request:' + errorThrown);
                        }).
                        always(function(){
                            reclipBeingprocessed = false;
                        });
                }
                if (viewId == custId) {
                    alert("Can't clip items on own story board.");
                }
            });

            $('.storyBlcok').livequery('mouseleave', function(){
                $(this).find('.imageHoverBox').hide();
            });

            $('.storyBlcok .storyImage, .storyBlcok .storyInfo, .storyBlcok .storyHeadline').livequery('click', function(){
                var parentCont = $(this).parents('.storyBlcok');
                var messageId = parentCont.find('.messageId').val();
                okToLoadMore = false;
                TN.lightbox.show(custId, messageId, function(newLikesCount, newDislikesCount, newCommentsCount){
                    okToLoadMore = true;

                    if( !!newLikesCount || newLikesCount === 0 ){
                        parentCont.find('.likesCount span').html(newLikesCount);
                    }
                    if( !!newDislikesCount || newDislikesCount === 0 ){
                        parentCont.find('.dislikesCount span').html(newDislikesCount);
                    }
                    if( !!newCommentsCount || newCommentsCount === 0 ){
                        parentCont.find('.commentsCount span').html(newCommentsCount);
                    }

                    TN.commentHandler.reloadComments(parentCont);
                });
            });

        };

        /*$(window).scroll( function() {
              if (( $(window).scrollTop() >= $(document).height() - $(window).height() - 500 ) && imageContainer.is(':visible') && okToLoadMore) {
              if( pageNum < maxPages ){
                  pageNum++;
                  loadItems();
              }
          }
        });*/

    }(topStories));

    function loadCategories(){
        TN.services.getAllMessageTypeActiveCategories().done(function(json){
            if( !!json ){
                var csCatDropdown = $('#catSelector');
                var maxItems = json.length;
                for( var i = 0; i < maxItems; i++ ){
                    if (json[i].id == "Q") continue;
                    if( json[i].global === 1 || json[i].global === 0 ){
                        csCatDropdown.append('<option value="'+ json[i].id + '">' + json[i].id + '</option>');
                    }
                }
                csCatDropdown.change(function(){
                    topStories.reload($(this).find('option:selected').attr('value'));
                });
            }
        });
    }

    $viewMy.initialize = function(){
        TN.baseHeader.initialize();
        loadCategories();
        topStories.show();
    };

}(TN.viewMy));