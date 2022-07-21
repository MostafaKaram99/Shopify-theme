$.cookie = function(key, value, options) {
    if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
        options = $.extend({}, options);
        if (value === null || value === undefined) {
            options.expires = -1
        }
        if (typeof options.expires === 'number') {
            var days = options.expires,
                t = options.expires = new Date();
            t.setDate(t.getDate() + days)
        }
        value = String(value);
        return (document.cookie = [encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''))
    }
    options = value || {};
    var decode = options.raw ? function(s) {
        return s
    } : decodeURIComponent;
    var pairs = document.cookie.split('; ');
    for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
        if (decode(pair[0]) === key) return decode(pair[1] || '')
    }
    return null
}

if ((typeof Shopify) === 'undefined') {
    Shopify = {};
}
if (!Shopify.formatMoney) {
    Shopify.formatMoney = function(cents, format) {
        var value = '',
            placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
            formatString = (format || this.money_format);
        if (typeof cents == 'string') {
            cents = cents.replace('.', '');
        }

        function defaultOption(opt, def) {
            return (typeof opt == 'undefined' ? def : opt);
        }

        function formatWithDelimiters(number, precision, thousands, decimal) {
            precision = defaultOption(precision, 2);
            thousands = defaultOption(thousands, ',');
            decimal = defaultOption(decimal, '.');
            if (isNaN(number) || number == null) {
                return 0;
            }
            number = (number / 100.0).toFixed(precision);
            var parts = number.split('.'),
                dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
                cents = parts[1] ? (decimal + parts[1]) : '';
            return dollars + cents;
        }
        switch (formatString.match(placeholderRegex)[1]) {
            case 'amount':
                value = formatWithDelimiters(cents, 2);
                break;
            case 'amount_no_decimals':
                value = formatWithDelimiters(cents, 0);
                break;
            case 'amount_with_comma_separator':
                value = formatWithDelimiters(cents, 2, '.', ',');
                break;
            case 'amount_no_decimals_with_comma_separator':
                value = formatWithDelimiters(cents, 0, '.', ',');
                break;
        }
        return formatString.replace(placeholderRegex, value);
    };
}

window.novtheme = window.novtheme || {};
var isLoggedIn;
isLoggedIn = false;
var current_width = $(window).width(),
    min_width = 768,
    responsive_mobile = current_width < min_width,
    flag_sticky = false;

var wishListsArr = localStorage.getItem('wishListsArr') ? JSON.parse(localStorage.getItem('wishListsArr')) : [];
localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));
if (wishListsArr.length) {
    wishListsArr = JSON.parse(localStorage.getItem('wishListsArr'));
};
novtheme.init = function() {
    novtheme.cacheSelectors();
    novtheme.eventBlockCart();
    novtheme.hoverAccount();
    novtheme.ajaxFilter();
    novtheme.quickview();
    novtheme.popupCart();
    novtheme.ThumbnailProduct();
    novtheme.VerticalThumbnailProduct();
    novtheme.VerticalThumbnailLeft();
    novtheme.RelatedBlog();
    novtheme.load_canvas_menu();
    novtheme.NovTogglePage();
    novtheme.galery_image();
    novtheme.Countdown();
    novtheme.click_button_canvas_menu();
    novtheme.productImageSwitch();
    novtheme.goToTop();
    novtheme.goToTopMobile();
    novtheme.NovHeightBoxContent();
    novtheme.MenuSidebar();
    novtheme.NovToggleAction();
    novtheme.NovToggleSearch();
    novtheme.NovEventClickSearchMobile();
    novtheme.Product__Thumnail();
    novtheme.Product_Megamenu();
    novtheme.NovMediumToggle();
    novtheme.HideShowPassword();
    novtheme.NovSearchToggle();
    novtheme.tooltip();
    novtheme.initNovWishListIcons();
    novtheme.doAddOrRemoveWishlistProduct();
    novtheme.doAddOrRemoveWishlist();
    novtheme.variantName();
    if (current_width >= 992) {
        novtheme.StickyHeader(true);
        flag_sticky = true;
    }
    if ($('.template-cart').length > 0 ) {
        novtheme.NovStickIn();
    }
};

//Tooltip, activated by hover event
novtheme.tooltip = function() {
    $("body").tooltip({   
        selector: "[data-toggle='tooltip']",
        container: "body"
    });
};
novtheme.swapChildren = function(obj1, obj2) {
    var temp = obj2.children().detach();
    obj2.empty().append(obj1.children().detach());
    obj1.append(temp);
};
novtheme.toggleMobileStyles = function() {
    if (responsive_mobile) {
        $("*[id^='_desktop_']").each(function(idx, el) {
            var target = $('#' + el.id.replace('_desktop_', '_mobile_'));
            if (target) {
                novtheme.swapChildren($(el), target);
            }
        });
    } else {
        $("*[id^='_mobile_']").each(function(idx, el) {
            var target = $('#' + el.id.replace('_mobile_', '_desktop_'));
            if (target) {
                novtheme.swapChildren($(el), target);
            }
        });
    }
};
novtheme.toggleSticky = function(action) {
    if (action == true) {
        $("*[class^='contentsticky_']").each(function(idx, el) {
            var target = $('.' + el.classList['0'].replace('contentsticky_', 'contentstickynew_'));
            if (target.length) {
                novtheme.swapChildren($(el), target);
            }
        });
    } else {
        $("*[class^='contentstickynew_']").each(function(idx, el) {
            var target = $('.' + el.classList['0'].replace('contentstickynew_', 'contentsticky_'));
            if (target.length) {
                novtheme.swapChildren($(el), target);
            }
        });
    }
}

novtheme.StickyHeader = function(flag_sticky) {
    if ($('.site-header').hasClass('sticky-menu')) {
        if (flag_sticky == true) {
            var time;
            var height = $('.site-header').height();
            var flag = true;
            $(window).scroll(function() {
                if (time) clearTimeout(time);
                time = setTimeout(function() {
                    if ($(window).scrollTop() > height) {
                        if (flag == true) {
                            $('#header-sticky').addClass('sticky-menu-active');
                            $('.site-header').css('height', height);
                            novtheme.toggleSticky(true);
                            flag = false;
                        }
                    } else {
                        if (flag == false) {
                            $('#header-sticky').removeClass('sticky-menu-active');
                            novtheme.toggleSticky(false);
                            $('.site-header').css('height', 'auto');
                            flag = true;
                        }
                    }
                }, 100);
            });
        }
    }
}
var flag_sticky = false;
$(window).on('resize', function() {
    var _cw = current_width;
    var _mw = min_width;
    var _w = $(window).width();
    var _toggle = (_cw >= _mw && _w < _mw) || (_cw < _mw && _w >= _mw);
    responsive_mobile = _cw >= _mw;
    current_width = _w;
    if (_toggle) {
        novtheme.toggleMobileStyles();
        novtheme.load_canvas_menu();
        novtheme.NovTogglePage();
        novtheme.NovHeightBoxContent();
        novtheme.popupCart();
    }
    if (current_width <= 768) {
        if (flag_sticky == true) {
            novtheme.toggleSticky(false);
            $('#header-sticky').removeClass('sticky-menu-active');
        }
    } else {}
});
novtheme.ajaxFilter = function() {
    var isAjaxFilterClick = false;
    if ($(".template-collection")) {
        History.Adapter.bind(window, 'statechange', function() {
            var State = History.getState();
            if (!isAjaxFilterClick) {
                ajaxFilterParams();
                var newurl = ajaxFilterCreateUrl();
                ajaxFilterGetContent(newurl);
            }
        });
    }
    ajaxFilterParams = function() {
        Shopify.queryParams = {};
        if (location.search.length) {
            for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
                aKeyValue = aCouples[i].split('=');
                if (aKeyValue.length > 1) {
                    Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
                }
            }
        }
    }
    ajaxFilterCreateUrl = function(baseLink) {
        var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');
        if (baseLink) {
            if (newQuery != "")
                return baseLink + "?" + newQuery;
            else
                return baseLink;
        }
        return location.pathname + "?" + newQuery;
    }
    ajaxFilterClick = function(baseLink) {
        delete Shopify.queryParams.page;
        var newurl = ajaxFilterCreateUrl(baseLink);
        isAjaxFilterClick = true;
        History.pushState({
            param: Shopify.queryParams
        }, newurl, newurl);
        ajaxFilterGetContent(newurl);
    }
    ajaxFilterData = function(data) {
        var currentList = $("#shopify-section-collection-template .collection-view-items");
        var dataList = $(data).find("#shopify-section-collection-template .collection-view-items");
        $('.sortPagiBar .showing-total').replaceWith($(data).find(".sortPagiBar .showing-total"));
        currentList.replaceWith(dataList);
        if ($(".nov-pagination", "#shopify-section-collection-template").length > 0) {
            $(".nov-pagination", "#shopify-section-collection-template").replaceWith($(data).find(".nov-pagination"));
        } else {
            $(".collection-view-items").parent().append($(data).find(".nov-pagination"));
        }
        var currentSidebarAjaxFilter = $("#novSidebarAjaxFilter");
        var dataSidebarAjaxFilter = $(data).find("#novSidebarAjaxFilter");
        currentSidebarAjaxFilter.replaceWith(dataSidebarAjaxFilter);
    }
    ajaxFilterSortby = function() {
        if (Shopify.queryParams.sort_by) {
            var sortby = Shopify.queryParams.sort_by;
            var text = $('.filters-toolbar__item .dropdown-item.active').html();
            $('.filters-toolbar__item .dropdown-toggle').html(text);
        }
        $('.filters-toolbar__item').on('click', '.dropdown-item', function(e) {
            e.preventDefault();
            $('.filters-toolbar__item .dropdown-item').removeClass('active');
            $(this).addClass('active');
            $('.filters-toolbar__item .dropdown-toggle').html($(this).html());
            var sortby = $(this).data("value");
            Shopify.queryParams.sort_by = sortby;
            ajaxFilterClick();
        });
    }
    ajaxFilterView = function() {
        if($(document).width() <768 ) {
            $('.collection-view-items').removeClass('view_4').addClass('view_2');
        }
        if (localStorage.getItem('view_collection')) {
           $('.collection-view-items').attr('class', localStorage.getItem('view_collection'));
        }
        $('.gridlist-toggle a').click(function(e) {
            e.preventDefault();
            var typeview = $(this).data('type');
            if (!$(this).hasClass('active')) {
                $('.collection-view-items').removeClass('view_4 view_3 view_2 list');
                $('.collection-view-items').addClass(typeview);
                $('.collection-view-items').data('foo', 'news');
                $('.gridlist-toggle a').removeClass('active');
                $(this).addClass('active');
            }
            localStorage.setItem('view_collection', $('.collection-view-items').attr('class'));
        });

        if ($('.collection-view-items').hasClass('view_4')) {
            $('.gridlist-toggle a').removeClass('active');
            $('.gridlist-toggle a[data-type="view_4"]').addClass('active');
        }
        if ($('.collection-view-items').hasClass('view_3')) {
            $('.gridlist-toggle a').removeClass('active');
            $('.gridlist-toggle a[data-type="view_3"]').addClass('active');
        }
        if ($('.collection-view-items').hasClass('view_2')) {
            $('.gridlist-toggle a').removeClass('active');
            $('.gridlist-toggle a[data-type="view_2"]').addClass('active');
        }
        if ($('.collection-view-items').hasClass('list')) {
            $('.gridlist-toggle a').removeClass('active');
            $('.gridlist-toggle a[data-type="list"]').addClass('active');
        }

        $('.filter_button').click(function(e){
            $('.sidebar-filter').addClass('active');
            $('.sidebar-overlay').addClass('act');
        });
        $('.close-filter').click(function(e){
            $('.sidebar-filter').removeClass('active');
            $('.sidebar-overlay').removeClass('act');
        });
        localStorage.removeItem("view_collection");
    }
    ajaxFilterPaging = function() {
        $('.nov-pagination .pagination a', '#shopify-section-collection-template').click(function(event) {
            event.preventDefault();
            var linkPage = $(this).attr("href").match(/page=\d+/g);
            if (linkPage) {
                Shopify.queryParams.page = parseInt(linkPage[0].match(/\d+/g));
                if (Shopify.queryParams.page) {
                    var newurl = ajaxFilterCreateUrl();
                    isAjaxFilterClick = true;
                    History.pushState({
                        param: Shopify.queryParams
                    }, newurl, newurl);
                    ajaxFilterGetContent(newurl);
                    $('body,html').animate({
                        scrollTop: 400
                    }, 600);
                }
            }
        });
    }
    ajaxFilterTags = function() {
        var currentTags = [];
        if (Shopify.queryParams.constraint) {
            currentTags = Shopify.queryParams.constraint.split('+');
            $('.filter-tags .filter-item_content li').each(function() {
                var check = currentTags.indexOf($(this).data('tag'));
                if (check > -1) {
                    $(this).addClass('active');
                }
            })
        }
        $('.filter-tags .filter-item_content li').click(function(event) {
            event.preventDefault();
            var selectedTag = $(this);
            var tagName = selectedTag.data('tag');
            if (tagName) {
                var tagPos = currentTags.indexOf(tagName);
                if (tagPos > -1) {
                    currentTags.splice(tagPos, 1);
                    selectedTag.removeClass('active');
                } else {
                    currentTags.push(tagName);
                    selectedTag.addClass('active');
                }
            }
            if (currentTags.length) {
                Shopify.queryParams.constraint = currentTags.join('+');
            } else {
                delete Shopify.queryParams.constraint;
            }
            ajaxFilterClick();
        });
    }
    ajaxFilterColor = function() {
        var currentTags = [];
        if (Shopify.queryParams.constraint) {
            currentTags = Shopify.queryParams.constraint.split('+');
            $('.filter-color .filter-item_content li').each(function() {
                var check = currentTags.indexOf($(this).data('value'));
                if (check > -1) {
                    $(this).addClass('active');
                }
            })
        }
        $('.filter-color .filter-item_content li').click(function(event) {
            event.preventDefault();
            var selectedTag = $(this);
            var tagName = selectedTag.data('value');
            if (tagName) {
                var tagPos = currentTags.indexOf(tagName);
                if (tagPos > -1) {
                    currentTags.splice(tagPos, 1);
                    selectedTag.removeClass('active');
                } else {
                    currentTags.push(tagName);
                    selectedTag.addClass('active');
                }
            }
            if (currentTags.length) {
                Shopify.queryParams.constraint = currentTags.join('+');
            } else {
                delete Shopify.queryParams.constraint;
            }
            ajaxFilterClick();
        });
    }
    ajaxFilterSize = function() {
        var currentTags = [];
        if (Shopify.queryParams.constraint) {
            currentTags = Shopify.queryParams.constraint.split('+');
            $('.filter-size .filter-item_content li').each(function() {
                var check = currentTags.indexOf($(this).data('value'));
                if (check > -1) {
                    $(this).addClass('active');
                }
            })
        }
        $('.filter-size .filter-item_content li').click(function(event) {
            event.preventDefault();
            var selectedTag = $(this);
            var tagName = selectedTag.data('value');
            if (tagName) {
                var tagPos = currentTags.indexOf(tagName);
                if (tagPos > -1) {
                    currentTags.splice(tagPos, 1);
                    selectedTag.removeClass('active');
                } else {
                    currentTags.push(tagName);
                    selectedTag.addClass('active');
                }
            }
            if (currentTags.length) {
                Shopify.queryParams.constraint = currentTags.join('+');
            } else {
                delete Shopify.queryParams.constraint;
            }
            ajaxFilterClick();
        });
    }
    ajaxFilterType = function() {
        var currentTags = [];
        if (Shopify.queryParams.constraint) {
            currentTags = Shopify.queryParams.constraint.split('+');
            $('.filter-type .filter-item_content li').each(function() {
                var check = currentTags.indexOf($(this).data('value'));
                if (check > -1) {
                    $(this).addClass('active');
                }
            })
        }
        $('.filter-type .filter-item_content li').click(function(event) {
            event.preventDefault();
            var selectedTag = $(this);
            var tagName = selectedTag.data('value');
            if (tagName) {
                var tagPos = currentTags.indexOf(tagName);
                if (tagPos > -1) {
                    currentTags.splice(tagPos, 1);
                    selectedTag.removeClass('active');
                } else {
                    currentTags.push(tagName);
                    selectedTag.addClass('active');
                }
            }
            if (currentTags.length) {
                Shopify.queryParams.constraint = currentTags.join('+');
            } else {
                delete Shopify.queryParams.constraint;
            }
            ajaxFilterClick();
        });
    }
    ajaxFilterVendor = function() {
        var currentTags = [];
        if (Shopify.queryParams.constraint) {
            currentTags = Shopify.queryParams.constraint.split('+');
            $('.filter-vendor .filter-item_content li').each(function() {
                var check = currentTags.indexOf($(this).data('value'));
                if (check > -1) {
                    $(this).addClass('active');
                }
            })
        }
        $('.filter-vendor .filter-item_content li').click(function(event) {
            event.preventDefault();
            var selectedTag = $(this);
            var tagName = selectedTag.data('value');
            if (tagName) {
                var tagPos = currentTags.indexOf(tagName);
                if (tagPos > -1) {
                    currentTags.splice(tagPos, 1);
                    selectedTag.removeClass('active');
                } else {
                    currentTags.push(tagName);
                    selectedTag.addClass('active');
                }
            }
            if (currentTags.length) {
                Shopify.queryParams.constraint = currentTags.join('+');
            } else {
                delete Shopify.queryParams.constraint;
            }
            ajaxFilterClick();
        });
    }
    ajaxFilterPrice = function() {
        var currentTags = [];
        if (Shopify.queryParams.constraint) {
            currentTags = Shopify.queryParams.constraint.split('+');
            $('.filter-price .filter-item_content li').each(function() {
                var check = currentTags.indexOf($(this).data('value'));
                if (check > -1) {
                    $(this).addClass('active');
                }
            })
        }
        $('.filter-price .filter-item_content li').click(function(event) {  
            event.preventDefault();
            var selectedTag = $(this);
            var tagName = selectedTag.data('value');
            if (tagName) {
                var tagPos = currentTags.indexOf(tagName);
                if (tagPos > -1) {
                    currentTags.splice(tagPos, 1);
                    selectedTag.removeClass('active');
                } else {
                    currentTags.push(tagName);
                    selectedTag.addClass('active');
                }
            }
            if (currentTags.length) {
                Shopify.queryParams.constraint = currentTags.join('+');
            } else {
                delete Shopify.queryParams.constraint;
            }
            ajaxFilterClick();
        });
    }
    ajaxFilterReview = function() {
        if ($(".shopify-product-reviews-badge").length > 0) {
            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
        };
    }
    ajaxFilterClear = function() {
        $(".ajaxFilter").each(function() {
            var sidebarTag = $(this);
            if (sidebarTag.find(".listFilter > li.active").length > 0) {
                sidebarTag.find(".novClear").show().click(function(e) {
                    var currentTags = [];
                    if (Shopify.queryParams.constraint) {
                        currentTags = Shopify.queryParams.constraint.split('+');
                    }
                    sidebarTag.find(".listFilter > li.active").each(function() {
                        var selectedTag = $(this);
                        var tagName = selectedTag.data("filter");
                        if (tagName) {
                            var tagPos = currentTags.indexOf(tagName);
                            if (tagPos >= 0) {
                                currentTags.splice(tagPos, 1);
                            }
                        }
                    });
                    if (currentTags.length) {
                        Shopify.queryParams.constraint = currentTags.join('+');
                    } else {
                        delete Shopify.queryParams.constraint;
                    }
                    ajaxFilterClick();
                    e.preventDefault();
                });
            }
        });
    }
    ajaxFilterClearAll = function() {
        $('.list-filter-selected a.novClearAll').click(function(e) {
            delete Shopify.queryParams.constraint;
            delete Shopify.queryParams.q;
            ajaxFilterClick();
            e.preventDefault();
        });
    }
    ajaxFilterAddToCart = function() {
        ajaxCart.init({
            formSelector: '.formAddToCart',
            cartContainer: '#cart-info',
            addToCartSelector: '.btnAddToCart',
            cartCountSelector: '#CartCount, .cart-products-count',
            cartCostSelector: '#CartCost',
            moneyFormat: null
        });
        // e.preventDefault();
    }
    ajaxFilterGetContent = function(newurl) {
        $.ajax({
            type: 'get',
            url: newurl,
            beforeSend: function() {
                $('.process-loading').show();
            },
            success: function(data) {
                novtheme.initNovWishListIcons();
                ajaxFilterData(data);
                ajaxFilterSortby();
                ajaxFilterView();
                ajaxFilterTags();
                ajaxFilterType();
                ajaxFilterVendor();
                ajaxFilterSize();
                ajaxFilterColor();
                ajaxFilterPrice();
                ajaxFilterPaging();
                ajaxFilterReview();
                ajaxFilterClearAll();
                $('.process-loading').hide();
                ajaxFilterAddToCart();
                var newTitle = $(data).filter('title').text();
                document.title = newTitle;
                if ($('#currencies').length != 0) {
                    Currency.convertAll(shopCurrency, $('#currencies span.selected').attr('data-currency'));
                };
            },
            error: function(xhr, text) {
                $('.process-loading').hide();
            }
        });
    }
    novtheme.initNovWishListIcons();
    ajaxFilterParams();
    ajaxFilterSortby();
    ajaxFilterView();
    ajaxFilterTags();
    ajaxFilterType();
    ajaxFilterVendor();
    ajaxFilterSize();
    ajaxFilterColor();
    ajaxFilterPrice();
    ajaxFilterPaging();
    ajaxFilterClear();
    ajaxFilterClearAll();
}
novtheme.initNovWishListIcons = function() {
    if (!wishListsArr.length) {
        return;
    }

    for (var i = 0; i < wishListsArr.length; i++) {
        var icon = $('[data-product-handle="'+ wishListsArr[i] +'"]');
        icon.addClass('whislist-added');
        icon.find('.wishlist-text').text('Remove Wishlist');
    };

    if (typeof(Storage) !== 'undefined') {
        if (wishListsArr.length <= 0) {
            return;
        }

        setTimeout(function() {
            wishListsArr.forEach(function(item) {
                novtheme.setNovAddedForWishlistIcon(item);
            });
        }, 1000);
    } else {
        alert('Storage no support!');
    }
};
novtheme.setNovAddedForWishlistIcon = function(ProductHandle) {
    var wishlistElm = $('[data-product-handle="'+ ProductHandle +'"]');
    var textadd = 'Add To Wishlist';
    var textremove = 'Remove Wishlist';
    idxArr = wishListsArr.indexOf(ProductHandle);

    if (idxArr >= 0) {
        wishlistElm.addClass('whislist-added');
        wishlistElm.find('.wishlist-text').text(textremove);
        wishlistElm.attr('title',textremove);
    }
    else {
        wishlistElm.removeClass('whislist-added');
        wishlistElm.find('.wishlist-text').text(textadd);
        wishlistElm.attr('title',textadd);
    };
};
novtheme.doAddOrRemoveWishlist = function() {
    var iconWishLists = '.item-product [data-icon-wishlist]';
    var textadd = 'Add To Wishlist';
    var textremove = 'Remove Wishlist';
        
    $(document).off('click.addOrRemoveWishlist', iconWishLists).on('click.addOrRemoveWishlist', iconWishLists, function(e) {
        e.preventDefault();

        var self = $(this),
        productId = self.data('id'),
        ProductHandle = self.data('product-handle'),
        idxArr = wishListsArr.indexOf(ProductHandle);

        if (!self.hasClass('whislist-added')) {
            self.addClass('whislist-added');
            self.find('.wishlist-text').text(textremove);
            self.attr({'title':textremove, 'data-original-title':textremove});
            $('.tooltip-inner').text(textremove);

            var title = self.parents('.item-product').find('.product__title').html();
            var image = self.parents('.item-product').find('.product__thumbnail').attr('src');

            $('.loading-modal').find('.product-title').html(title);
            $('.loading-modal').find('.product-image').attr('src', image);
            $('.loading-modal').find('.btn-wishlist').show();
            $('.loading-modal').css({"opacity": "1", "visibility": "initial", "transform": "translateX(0)", "transition": "all 0.3s"});
            $('.loading-modal').addClass('novload');
            setTimeout(function() {
                $('.loading-modal').css({"opacity": "0", "visibility": "hidden", "transform": "translateX(410px)", "transition": "all 0.3s"});
                $('.loading-modal').removeClass('novload');
            }, 5000);

            if ($('[data-wishlist-container]').length) {
                novtheme.createNovWishListTplItem(ProductHandle);
            };

            wishListsArr.push(ProductHandle);
            localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));

        } else {
            self.removeClass('whislist-added');
            self.find('.wishlist-text').text(textadd);
            self.attr({'title':textadd, 'data-original-title':textadd});
            $('.tooltip-inner').text(textadd);
            if ($('[data-wishlist-added="wishlist-'+productId+'"]').length) {
                $('[data-wishlist-added="wishlist-'+productId+'"]').remove();
            }

            wishListsArr.splice(idxArr, 1);
            localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));
        };

        novtheme.setNovAddedForWishlistIcon(ProductHandle);
    });
};
novtheme.doAddOrRemoveWishlistProduct = function() {
    var iconWishLists = '.product-single a[data-icon-wishlist]';

    $(document).off('click.addOrRemoveWishlist', iconWishLists).on('click.addOrRemoveWishlist', iconWishLists, function(e) {
        e.preventDefault();

        var self = $(this),
        productId = self.data('id'),
        ProductHandle = self.data('product-handle'),
        idxArr = wishListsArr.indexOf(ProductHandle);

        if (!self.hasClass('whislist-added')) {
            self.addClass('whislist-added');
            self.find('.wishlist-text').text('Remove Wishlist');

            var title = self.parents('.product-single').find('.product-single__title').html();
            var image = self.parents('.product-single').find('.product-single__photos .thumblist .thumbItem img').attr('src');
            $('.loading-modal').find('.product-title').html(title);
            $('.loading-modal').find('.product-image').attr('src', image);
            $('.loading-modal').find('.btn-wishlist').show();
            $('.loading-modal').css({"opacity": "1", "visibility": "initial", "transform": "translateX(0)", "transition": "all 0.3s"});
            $('.loading-modal').addClass('novload');
            setTimeout(function() {
                $('.loading-modal').css({"opacity": "0", "visibility": "hidden", "transform": "translateX(410px)", "transition": "all 0.3s"});
                $('.loading-modal').removeClass('novload');
            }, 5000);

            if ($('[data-wishlist-container]').length) {
                novtheme.createNovWishListTplItem(ProductHandle);
            };

            wishListsArr.push(ProductHandle);
            localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));

        } else {
            self.removeClass('whislist-added');
            self.find('.wishlist-text').text('Add To WishList');

            
            if ($('[data-wishlist-added="wishlist-'+productId+'"]').length) {
                $('[data-wishlist-added="wishlist-'+productId+'"]').remove();
            }

            wishListsArr.splice(idxArr, 1);
            localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));
        };

        novtheme.setNovAddedForWishlistIcon(ProductHandle);
    });
};
novtheme.createNovWishListTplItem = function(ProductHandle) {
  var wishListCotainer = $('[data-wishlist-container]');

  jQuery.getJSON(window.router + '/products/'+ProductHandle+'.js', function(product) {
    var productHTML = '',
        price_min = Shopify.formatMoney(product.price_min, "$");

        productHTML += '<div class="grid-item" data-wishlist-added="wishlist-'+product.id+'">';
        productHTML += '<div class="inner item-product row align-items-center" data-product-id="product-'+product.handle+'">';
        productHTML += '<div class="column_content col-xl-5 col-lg-5 col-md-4 col-sm-12 col-xs-12"><div class="product-image">';
        productHTML +='<a href="'+product.url+'" class="product-grid-image" data-collections-related="/collections/all?view=related">';
        productHTML += '<img src="'+product.featured_image+'" alt="'+product.featured_image.alt+'">';
        productHTML += '</a></div>';
        productHTML += '<div class="product-info">';
        productHTML += '<div class="product-title">';
        productHTML += '<a href="'+product.url+'" title="'+product.title+'">'+product.title+'</a></div></div>';
        productHTML += '<div class="column_content col-xl-3 col-lg-3 col-md-2 col-sm-12 col-xs-12 text-center"><div class="price-box">'+ price_min +'</div></div>';
        productHTML += '<div class="column_content col-xl-2 col-lg-2 col-md-3 col-sm-12 col-xs-12 text-center"><a class="btn whislist-added" href="#" data-product-handle="'+ product.handle +'" data-icon-wishlist data-id="'+ product.id +'"><i class="fa fa-trash-o" aria-hidden="true"><i class="fa fa-trash-o" aria-hidden="true"></i>translation missing: en.products.product.remove</a></div>';
        productHTML += '<div class="column_content col-xl-2 col-lg-2 col-md-3 col-sm-12 col-xs-12 text-center">';
        productHTML += '<form action="/cart/add" method="post" class="variants formAddToCart" id="-'+product.id+'" data-id="product-actions-'+product.id+'" enctype="multipart/form-data">';

    if (product.available) {
        if (product.variants.length == 1) {
            productHTML += '<button class="btn btnAddToCart" type="submit" data-form-id="#-'+product.id+'" ><span>Add to bag</span><span>Add to bag</span></button><input type="hidden" name="id" value="'+ product.variants[0].id +'" />'; 
        } 
        if (product.variants.length > 1){
            productHTML += '<a class="btn btnAddToCart" title="'+product.title+'" href="'+product.url +'"><i class="zmdi zmdi-check"></i><span>Select Options</span></a>';
        }
    }
    else {
        productHTML += '<button class="btn btnAddToCart" type="button" disabled="disabled">Unavailable</button>';
    } 

    productHTML += '</form></div>';

    productHTML += '</div></div>';

    wishListCotainer.append(productHTML);
  });
};
novtheme.quickview = function() {
    var product = {};
    var option1 = '';
    var option2 = '';
    Shopify.doNotTriggerClickOnThumb = false;
    selectCallbackQuickView = function(variant, selector) {
        var productItem = jQuery('#popup-quickview .proBoxInfo'),
            addToCart = productItem.find('.btnAddToCart'),
            productPrice = productItem.find('.pricePrimary'),
            comparePrice = productItem.find('.priceCompare');
        if (variant) {
            if (variant.available) {
                addToCart.removeClass('disabled').removeAttr('disabled');
                $(addToCart).find("span").text("Add to bag");
            } else {
                addToCart.addClass('disabled').attr('disabled', 'disabled');
                $(addToCart).find("span").text("Notify Me");
            }
            productPrice.html(Shopify.formatMoney(variant.price, theme.moneyFormat));
            if (variant.compare_at_price > variant.price) {
                comparePrice.html(Shopify.formatMoney(variant.compare_at_price, theme.moneyFormat)).show();
            } else {
                comparePrice.hide();
            }
            Currency.convertAll(shopCurrency, $('#currencies span.selected').attr('data-currency'));
            var form = jQuery('#' + selector.domIdPrefix).closest('form');
            for (var i = 0, length = variant.options.length; i < length; i++) {
                var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] + '"]');
                if (radioButton.size()) {
                    radioButton.get(0).checked = true;
                }
            }
            if (variant && variant.featured_image) {
                var originalImage = $(".proImageQuickview");
                var newImage = variant.featured_image;
                var element = originalImage[0];
                Shopify.Image.switchImage(newImage, element, function(newImageSizedSrc, newImage, element) {
                    $('.proThumbnails img').each(function() {
                        var parentThumbImg = $(this).parent();
                        var productImage = $(this).parent().data("image");
                        if (newImageSizedSrc.includes(productImage)) {
                            $(this).parent().trigger('click');
                            return false;
                        }
                    });
                });
            }
        } else {
            addToCart.addClass('disabled').attr('disabled', 'disabled');
            $(addToCart).find("span").text("Notify Me");
        }
    }
    changeImageQuickView = function(img, selector) {
        var src = $(img).attr("src");
        src = src.replace("_compact", "");
        $(selector).attr("src", src);
    }
    novUpdateOptionsInSelector = function(t) {
        switch (t) {
            case 0:
                var n = "root";
                var r = $("#popup-quick-view .single-option-selector:eq(0)");
                break;
            case 1:
                var n = $("#popup-quick-view .single-option-selector:eq(0)").val();
                var r = $("#popup-quick-view .single-option-selector:eq(1)");
                break;
            case 2:
                var n = $("#popup-quick-view .single-option-selector:eq(0)").val();
                n += " / " + $("#popup-quick-view .single-option-selector:eq(1)").val();
                var r = $("#popup-quick-view .single-option-selector:eq(2)")
        }
        var i = r.val();
        r.empty();
        var s = Shopify.optionsMapQuickview[n];
        if (typeof s != "undefined") {
            for (var o = 0; o < s.length; o++) {
                var u = s[o];
                var a = $("<option></option>").val(u).html(u);
                r.append(a)
            }
        }
        $('#popup-quick-view .swatch[data-option-index="' + t + '"] .swatch-element').each(function() {
            if ($.inArray($(this).attr("data-value"), s) !== -1) {
                $(this).removeClass("soldout").find(":radio").removeAttr("disabled", "disabled");
            } else {
                $(this).addClass("soldout").find(":radio").removeAttr("checked").attr("disabled", "disabled")
            }
        });
        if ($.inArray(i, s) !== -1) {
            r.val(i)
        }
        r.trigger("change")
    }
    novLinkOptionSelectors = function(t) {
        for (var n = 0; n < t.variants.length; n++) {
            var r = t.variants[n];
            if (r.available) {
                Shopify.optionsMapQuickview["root"] = Shopify.optionsMapQuickview["root"] || [];
                Shopify.optionsMapQuickview["root"].push(r.option1);
                Shopify.optionsMapQuickview["root"] = Shopify.uniq(Shopify.optionsMapQuickview["root"]);
                if (t.options.length > 1) {
                    var i = r.option1;
                    Shopify.optionsMapQuickview[i] = Shopify.optionsMapQuickview[i] || [];
                    Shopify.optionsMapQuickview[i].push(r.option2);
                    Shopify.optionsMapQuickview[i] = Shopify.uniq(Shopify.optionsMapQuickview[i])
                }
                if (t.options.length === 3) {
                    var i = r.option1 + " / " + r.option2;
                    Shopify.optionsMapQuickview[i] = Shopify.optionsMapQuickview[i] || [];
                    Shopify.optionsMapQuickview[i].push(r.option3);
                    Shopify.optionsMapQuickview[i] = Shopify.uniq(Shopify.optionsMapQuickview[i])
                }
            }
        }
        novUpdateOptionsInSelector(0);
        if (t.options.length > 1)
            novUpdateOptionsInSelector(1);
        if (t.options.length === 3)
            novUpdateOptionsInSelector(2);
        $(".single-option-selector:eq(0)").change(function() {
            novUpdateOptionsInSelector(1);
            if (t.options.length === 3)
                novUpdateOptionsInSelector(2);
            return true
        });
        $(".single-option-selector:eq(1)").change(function() {
            if (t.options.length === 3)
                novUpdateOptionsInSelector(2);
            return true
        });
    }
    loadQuickViewSlider = function(n, r) {
        var loadingImgQuickView = $('.loadingImage');
        var s = Shopify.resizeImage(n.featured_image, "359x");
        loadingImgQuickView.hide();
        if (n.images.length > 0) {
            var o = r.find(".proThumbnailsQuickview .nov-slick-carousel");
            for (i in n.images) {
                var u = Shopify.resizeImage(n.images[i], "359x");
                var a = Shopify.resizeImage(n.images[i], "430x");
                var f = '<div class="thumbItem"><a href="#" data-imageid="' + n.id + '" data-image="' + u + '"><img src="' + a + '" alt="Produc Image" /></a></div>';
                o.append(f)
            }
           o.find("a").click(function(e) {
                e.preventDefault();
                var t = r.find(".proImageQuickview");
                if (t.attr("src") != $(this).attr("data-image")) {
                    t.attr("src", $(this).attr("data-image"));
                    loadingImgQuickView.show();
                    t.load(function(t) {
                        $(this).unbind("load");
                        loadingImgQuickView.hide()
                    })
                }
            });
            o.slick({
                nextArrow: '<div class="arrow-next"><i class="zmdi zmdi-chevron-right"></i></div>',
                prevArrow: '<div class="arrow-prev"><i class="zmdi zmdi-chevron-left"></i></div>',
                slidesToShow: 1,
                slidesToScroll: 1,
                rows: 1,
                arrows: true,
                dots: false,
                infinite: !1,
                adaptiveHeight: !0
            })
        } else {
            r.find("#popup-quickview .proThumbnailsQuickview").remove();
        }
    }
    convertToSlug = function(e) {
        return e.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
    }
    addCheckedSwatch = function() {
        $('.swatch .color label').on('click', function() {
            $('.swatch .color').each(function() {
                $(this).find('label').removeClass('checkedBox');
            });
            $(this).addClass('checkedBox');
        });
    }
    quickViewVariantsSwatch = function(t, quickview) {
        if (t.variants.length > 1) {
            for (var r = 0; r < t.variants.length; r++) {
                var i = t.variants[r];
                var s = '<option value="' + i.id + '">' + i.title + "</option>";
                quickview.find("form.formQuickview .proVariantsQuickview > select").append(s);
            }
            new Shopify.OptionSelectors('productSelectQuickview', {
                product: t,
                onVariantSelected: selectCallbackQuickView
            });
            if (t.options.length == 1) {
                $("form.formQuickview .selector-wrapper:eq(0)").prepend("<label>" + t.options[0].name + "</label>")
            }
            quickview.find("form.formQuickview .selector-wrapper label").each(function(n, r) {
                $(this).html(t.options[n].name)
            })
            var o = window.file_url.substring(0, window.file_url.lastIndexOf("?"));
            var u = window.asset_url.substring(0, window.asset_url.lastIndexOf("?"));
            var a = "";
            for (var r = 0; r < t.options.length; r++) {
                a += '<div class="swatch clearfix" data-option-index="' + r + '">';
                a += '<div class="header">' + t.options[r].name + "</div>";
                a += '<div class="swatch_fiiter">';
                    var f = false;
                    if (/Color|Colour/i.test(t.options[r].name)) {
                        f = true
                    }
                    var l = new Array;
                    for (var c = 0; c < t.variants.length; c++) {
                        var i = t.variants[c];
                        var h = i.options[r];
                        var p = this.convertToSlug(h);
                        var d = "quickview-swatch-" + r + "-" + p;
                        if (l.indexOf(h) < 0) {
                            a += '<div data-value="' + h + '" class="swatch-element ' + (f ? "color " : "") + p + (i.available ? " available " : " soldout ") + '">';
                            if (f) {
                                a += '<div class="tooltip">' + h + "</div>"
                            }
                            a += '<input id="' + d + '" type="radio" name="option-' + r + '" value="' + h + '" ' + (c == 0 ? " checked " : "") + (i.available ? "" : " disabled") + " />";
                            if (f) {
                                a += '<label class="' + p + '" for="' + d + '" style="background-color: ' + p + '";><img class="crossed-out" src="' + u + 'soldout.png" /><i></i></label>'
                            } else {
                                a += '<label class="' + p + '" for="' + d + '">' + h + '<img class="crossed-out" src="' + u + 'soldout.png" /></label>'
                            }
                            a += "</div>";
                            if (i.available) {
                                $('#popup-quickview .swatch[data-option-index="' + r + '"] .' + p).removeClass("soldout").addClass("available").find(":radio").removeAttr("disabled")
                            }
                            l.push(h)
                        }
                    }
                a += "</div>"
                a += "</div>"
            }
            quickview.find("form.formQuickview .proVariantsQuickview > select").after(a);
            quickview.find(".swatch :radio").change(function() {
                var t = $(this).closest(".swatch").attr("data-option-index");
                var q = $(this).val();
                $(this).closest("form").find(".single-option-selector").eq(t).val(q).trigger("change");
            });
            addCheckedSwatch();
            if (t.available) {
                Shopify.optionsMapQuickview = {};
                novLinkOptionSelectors(t);
            }
        } else {
            quickview.find("form.formQuickview .proVariantsQuickview > select").remove();
            var v = '<input type="hidden" name="id" value="' + t.variants[0].id + '">';
            quickview.find("form.formQuickview").append(v)
        }
    }
    validateQty = function(qty) {
        if ((parseFloat(qty) == parseInt(qty)) && !isNaN(qty)) {} else {
            qty = 1;
        }
        return qty;
    };
    $(document).on('click', '.quickviewClose', function(e) {
        $("#popup-quickview").html("");
    });
};
novtheme.popupCart = function(e) {
    $(document).on('click', '.popupCartClose', function(e) {
        e.preventDefault();
        $("#popup-Cart .jsPopupview").html('');
        $('#popup-Cart').modal('toggle');
    });
};
novtheme.click_button_canvas_menu = function() {
    $('#show-megamenu').on("click", function() {
        if ($('.canvas-menu').hasClass('active')) {
            $('.canvas-menu').removeClass('active');
            $('body').removeClass('canvasmenu-right');
            $(this).removeClass('close');
        } else {
            $('.canvas-menu').addClass('active');
            $('body').addClass('canvasmenu-right');
            $(this).addClass('close');
        }
        return false;
    });
}
novtheme.load_canvas_menu = function() {
    var $main_menu = $(".site-nav", "#AccessibleNav");
    if (current_width < 768) {
        if ($("#canvas-main-menu").length < 1 && $main_menu.length > 0) {
            var $menu = $main_menu.parent().clone();
            $menu.attr("id", "canvas-main-menu");
            $($menu).find(".menu").removeAttr('id');
            $('.canvas-menu').append($menu);
            $menu.mmenu({
                offCanvas: false,
                "navbar": {
                    "title": false
                }
            });
            novtheme.remove_canvas_menu();
        }
    }
}
novtheme.remove_canvas_menu = function() {
    $('.canvas-header-box .close-box, .canvas-overlay').on("click", function() {
        $('.canvas-menu').removeClass('active');
        $('body').removeClass('canvasmenu-right');
        return false;
    });
}
novtheme.ThumbnailProduct = function() {
    if ($('html').hasClass('lang-rtl'))
        rtl = true;
    else
        rtl = false;
    var autoplay = $("#productThumbs .owl-carousel").data('autoplay');
    var autoplayTimeout = $("#productThumbs .owl-carousel").data('autoplayTimeout');
    var items = $("#productThumbs .owl-carousel").data('items');
    var margin = $("#productThumbs .owl-carousel").data('margin');
    var nav = $("#productThumbs .owl-carousel").data('nav');
    var dots = $("#productThumbs .owl-carousel").data('dots');
    var loop = $("#productThumbs .owl-carousel").data('loop');
    var items_tablet = $("#productThumbs .owl-carousel").data('items_tablet') ? $("#productThumbs .owl-carousel").data('items_tablet') : 3;
    var items_mobile = $("#productThumbs .owl-carousel").data('items_mobile') ? $("#productThumbs .owl-carousel").data('items_mobile') : 2;
    var center = $("#productThumbs .owl-carousel").data('center') ? $("#productThumbs .owl-carousel").data('center') : false;
    var start = $("#productThumbs .owl-carousel").data('start') ? $("#productThumbs .owl-carousel").data('start') : 0;
    $("#productThumbs .owl-carousel").owlCarousel({
        navText: ['<i class="zmdi zmdi-chevron-left"></i>', '<i class="zmdi zmdi-chevron-right"></i>'],
        lazyLoad: true,
        lazyContent: true,
        loop: loop,
        autoplay: autoplay,
        autoplayTimeout: autoplayTimeout,
        items: items,
        margin: margin,
        rtl: rtl,
        dots: dots,
        nav: nav,
        center: center,
        responsive: {
            0: {
                items: items_mobile,
                center: false,
                margin: 10
            },
            768: {
                items: items_tablet,
                margin: 10
            },
            992: {
                items: items,
                margin: margin
            },
            1200: {
                items: items,
                startPosition: start,
                margin: margin
            },
        }
    });
}
novtheme.VerticalThumbnailProduct = function() {
    if ($('html').hasClass('lang-rtl'))
        var rtl = true
    else
        var rtl = false
    $('#productThumb .nov-thumb_vertical').slick({
        nextArrow: '<div class="arrow-next"><i class="zmdi zmdi-chevron-down"></i></div>',
        prevArrow: '<div class="arrow-prev"><i class="zmdi zmdi-chevron-up"></i></div>',
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        arrows: false,
        responsive: [{
            breakpoint: 1200,
            settings: {
                verticalSwiping: false,
                slidesToShow: 4,
                slidesToScroll: 1,
                arrows: false
            }
        }, {
            breakpoint: 992,
            settings: {
                arrows: false,
                slidesToShow: 4,
                slidesToScroll: 1,
                vertical: false,
                verticalSwiping: false,
            }
        }, {
            breakpoint: 768,
            settings: {
                vertical: false,
                verticalSwiping: false,
                arrows: false,
                slidesToShow: 4,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 480,
            settings: {
                vertical: false,
                verticalSwiping: false,
                arrows: false,
                slidesToShow: 3,
                slidesToScroll: 1
            }
        }]
    });
    // if($(document).width() <= 991 ) {
    //     $('.product_external .thumbs-vertical').slick({
    //         nextArrow: '<div class="arrow-next"><i class="zmdi zmdi-chevron-right"></i></div>',
    //         prevArrow: '<div class="arrow-prev"><i class="zmdi zmdi-chevron-left"></i></div>',
    //         infinite: false,
    //         slidesToShow: 1,
    //         slidesToScroll: 1,
    //         adaptiveHeight: true,
    //         arrows: true,
    //     }).on('afterChange',function(e,o){
    //         $('iframe').each(function(){
    //             $(this)[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
    //         });
    //     }).slick();
    // };

    $(window).on('mousewheel DOMMouseScroll wheel', (function(e) {
        $('.thumbs-vertical .item.act').each(function(){
            var item = $(this),
                p = item.data('position'),
                hd = item.height()/2,
                hu = item.height() -150,
                srt = $(window).scrollTop(),
                y = e.originalEvent.deltaY,
                offset_top = item.offset().top;
            if (y > 0) {
                if (p < $('.thumbs-vertical .item').length) {
                    var npd = p + 1;
                } else {
                    var npd = p;
                }
                if (srt > offset_top + hd) {
                   item.removeClass('act');
                   $('.thumbs-vertical .item[data-position="'+ npd +'"]').addClass('act');
                   $('.thumbItem[data-position="'+ p +'"]').removeClass('active');
                   $('.thumbItem[data-position="'+ npd +'"]').addClass('active');
                } 
            } else {
                if (p > 1) {
                    var npu = p - 1;
                } else {
                    var npu = p;
                }
                if (srt < offset_top - hd) {
                    item.removeClass('act');
                    $('.thumbs-vertical .item[data-position="'+ npu +'"]').addClass('act');
                    $('.thumbItem[data-position="'+ p +'"]').removeClass('active');
                    $('.thumbItem[data-position="'+ npu +'"]').addClass('active');
                }
            }
        });
    }));
    $('.product_external .thumbItem').click(function(){
        var p = $(this).data('position');
        $('.product_external .thumbItem').removeClass('active');
        $(this).addClass('active');
        $('.thumbs-vertical .item').removeClass('act');
        $('.thumbs-vertical .item[data-position="'+ p +'"]').addClass('act');
        var ost = $('.thumbs-vertical .item.act').offset().top;
        $("body,html").animate({scrollTop: ost - 30}, "normal");
    });
}
novtheme.VerticalThumbnailLeft = function() {
    $('#productThumbs .nov-thumb_left').slick({
        nextArrow: '<div class="arrow-next"><i class="zmdi zmdi-chevron-down"></i></div>',
        prevArrow: '<div class="arrow-prev"><i class="zmdi zmdi-chevron-up"></i></div>',
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        arrows: false,
        responsive: [{
            breakpoint: 1200,
            settings: {
                verticalSwiping: false,
                slidesToShow: 4,
                slidesToScroll: 1,
                arrows: false
            }
        }, {
            breakpoint: 992,
            settings: {
                vertical: true,
                verticalSwiping: false,
                arrows: false,
                slidesToShow: 4,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 768,
            settings: {
                vertical: false,
                verticalSwiping: false,
                arrows: false,
                slidesToShow: 4,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 480,
            settings: {
                vertical: false,
                verticalSwiping: false,
                arrows: false,
                slidesToShow: 3,
                slidesToScroll: 1
            }
        }]
    });
}
novtheme.RelatedBlog = function() {
    if ($('html').hasClass('lang-rtl'))
        rtl = true;
    else
        rtl = false;
    var $this = $('.BlogRelated .owl-carousel');
    var autoplay = $($this).data('autoplay');
    var autoplayTimeout = $($this).data('autoplayTimeout');
    var items = $($this).data('items');
    var margin = $($this).data('margin');
    var nav = $($this).data('nav');
    var dots = $($this).data('dots');
    var loop = $($this).data('loop');
    var items_tablet = $($this).data('items_tablet') ? $($this).data('items_tablet') : 3;
    var items_mobile = $($this).data('items_mobile') ? $($this).data('items_mobile') : 1;
    var center = $($this).data('center') ? $($this).data('center') : false;
    var start = $($this).data('start') ? $($this).data('start') : 0;
    $($this).owlCarousel({
        navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
        lazyLoad: true,
        lazyContent: true,
        loop: loop,
        autoplay: autoplay,
        autoplayTimeout: autoplayTimeout,
        items: items,
        margin: margin,
        rtl: rtl,
        dots: dots,
        nav: nav,
        responsive: {
            0: {
                items: items_mobile,
                center: center,
                margin: 15
            },
            768: {
                items: items_tablet,
                margin: 15
            },
            992: {
                items: items,
                margin: margin
            },
            1200: {
                items: items,
                startPosition: start,
                margin: margin
            },
        }
    });
}
novtheme.callbackReview = function() {
    if ($(".shopify-product-reviews-badge").length > 0) {
        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
    };
}
//Countdown
novtheme.Countdown = function() {
    $('[data-countdown]').each(function() {
        var $this = $(this), finalDate = $(this).data('countdown');
        $this.countdown(finalDate, function(event) {
            //var totalHours = event.offset.totalDays * 24 + event.offset.hours;
            var countdown_format = '<div class="item-time"><span class="data-time"><span class="data-number">%D</span><span class="name-time">Days</span></div>'
                               + '<div class="item-time"><span class="data-time"><span class="data-number">%H</span><span class="name-time">Hours</span></div>'
                               + '<div class="item-time"><span class="data-time"><span class="data-number">%M</span><span class="name-time">Mins</span></div>'
                               + '<div class="item-time"><span class="data-time"><span class="data-number">%S</span><span class="name-time">Secs</span></div>';
            $this.html(event.strftime(countdown_format));
        });
    });
}
novtheme.productPage = function(options) {
    var moneyFormat = options.money_format,
        variant = options.variant,
        selector = options.selector;
    var $productImage = $('#ProductPhotoImg'),
        $addToCart = $('#AddToCart'),
        $productPrice = $('#ProductPrice-nov-product-template'),
        $comparePrice = $('#ComparePrice-nov-product-template'),
        $quantityElements = $('.quantity-selector, label + .js-qty'),
        $quantity = $('.product-form__item--quantity'),
        $addToCartText = $('#AddToCartText');
	//var product = Shopify.getProduct(selector.product.handle);
  	//console.log(product);
    if (variant) {
        var form = $('#' + selector.domIdPrefix).parents('form');
        for (var i = 0, length = variant.options.length; i < length; i++) {
            var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] + '"]');
            if (radioButton.size()) {
                radioButton.get(0).checked = true;
            }
        }
        if (variant.featured_image) {
            var newImage = variant.featured_image;
            var element = $productImage[0];
            Shopify.Image.switchImage(newImage, element, function(src, imgObject, el) {
                $('.thumblist img').each(function() {
                    var idProductImage = $(this).parent().data('image');
                    if (idProductImage == src) {
                        $(this).parent().trigger('click');
                      	var position = $(this).parents('.owl-item').index();
                      	$('.thumblist .owl-carousel').trigger('to.owl.carousel', position);
                      	return false;
                    }
                });
            });
        }
        if (variant.available) {
            $quantity.show();
            $addToCart.removeClass('disabled').prop('disabled', false);
            $addToCartText.html("Add to bag");
            $quantityElements.show();
            $('.group-quantity .control-label').show();
            $('.group-quantity').css('margin-top', '0');
            $('input').parent('.swatch-element').find('.sold').hide();
        } else {
            $quantity.hide();
            $addToCart.addClass('disabled').prop('disabled', true);
            $addToCartText.html("Notify Me");
            $quantityElements.hide();
            $('input:not(:checked)').parent('.swatch-element').find('.sold').hide();
            $('input:checked').parent('.swatch-element').find('.sold').show();
            $('input:checked').parent('.swatch-element').attr('data-toggle', 'modal');
            $('.group-quantity .control-label').hide();
            $('.group-quantity').css('margin-top', '30px');
        }
        $productPrice.html(theme.Currency.formatMoney(variant.price, moneyFormat));
        if (variant.compare_at_price > variant.price) {
            $comparePrice.html(theme.Currency.formatMoney(variant.compare_at_price, moneyFormat)).show();
        } else {
            $comparePrice.hide();
        }
        if ($('#currencies').length != 0) {
            Currency.convertAll(shopCurrency, $('#currencies span.selected').attr('data-currency'));
        }
    } else {
        $quantity.removeClass('d-block');
        $addToCart.addClass('disabled').prop('disabled', true);
        $addToCartText.html("Unavailable");
        $quantityElements.hide();
    }
}
novtheme.productImageSwitch = function() {
    if (novtheme.cache.$thumbImages.length) {
        $('.thumbItem').each(function() {
            if ($('.thumb_all_variant').length == 0) {
                var srcproFeatured = $('#ProductPhotoImg').attr('src');
                var srcthumnail = $('.product-single__thumbnail', this).attr('data-image');
                if (srcproFeatured == srcthumnail) {
                    $(this).addClass('active');
                };
            }
        });
        $('.owl-carousel .owl-stage .owl-item').removeClass('firstActiveItem');
        $('.owl-carousel .owl-stage .owl-item.active').each(function(index) {
            if (index === 0) {
                $(this).addClass('firstActiveItem');
            }
        });
        if ($('.variant_img').length > 0) {
            var dataimg = $('#ProductPhotoImg').data('src');
            $('.swatch-element.color input:checked').parent().find('.image_color').attr('src', dataimg);
        }
        novtheme.cache.$thumbImages.on('click', function(evt) {
            evt.preventDefault();
            var newImage = $(this).attr('data-image');
            $('.thumbItem').removeClass('active');
            $(this).parent().addClass('active');
            $('.owl-carousel .owl-stage .owl-item').removeClass('firstActiveItem');
            novtheme.switchImage(newImage, null, novtheme.cache.$productImage);
            $('.template-product .tabdesc .zoomImg').attr('src', newImage);
            $('.template-product .product_external .zoomImg').attr('src', newImage);
            if ($('.variant_img').length > 0) {
                $('.swatch-element.color input:checked').parent().find('.image_color').attr('src', newImage);
            }
        });
    }
}
novtheme.switchImage = function(src, imgObject, el) {
    var $el = $(el);
    $el.attr('src', src);
}
novtheme.cacheSelectors = function() {
    novtheme.cache = {
        $html: $('html'),
        $body: $(document.body),
        $navigation: $('#AccessibleNav'),
        $mobileSubNavToggle: $('.mobile-nav__toggle'),
        $changeView: $('.change-view'),
        $productImage: $('#ProductPhotoImg'),
        $thumbImages: $('#productThumb').find('a.product-single__thumbnail'),
        $thumbImages: $('#productThumbs').find('a.product-single__thumbnail'),
        $thumbItem: $('.thumb_grid').find('.thumbItem'),
        
        $recoverPasswordLink: $('#RecoverPassword'),
        $hideRecoverPasswordLink: $('#HideRecoverPasswordLink'),
        $recoverPasswordForm: $('#RecoverPasswordForm'),

        $recoverPasswordIndex: $('#RecoverPasswordIndex'),
        $hideRecoverPasswordIndex: $('#HideRecoverPasswordIndex'),
        $recoverPasswordFormIndex: $('#RecoverPasswordFormIndex'),

        $customerLoginForm: $('#CustomerLoginForm'),
        $passwordResetSuccess: $('#ResetSuccess')
    };
}
novtheme.eventBlockCart = function(e) {
    // Cart canvas
    $('.cart_canvas .open_header_cart_canvas').click(function() {
        $('.header-cart-canvas').addClass('active');
    })
    $('.close_canvas_cart').click(function() {
        $('.header-cart-canvas').removeClass('active');
    })
    // Hover Cart
    
    if (!('ontouchstart' in document)) {
        $('.cart_dropdown .header-cart').hover(function() {
            if (!$('.cart_dropdown #cart-info').is(':visible')) {
                $(".cart_dropdown #cart-info").slideDown('fast');
            }
        });
        $('.cart_dropdown #cart_block').mouseleave(function() {
            $(".cart_dropdown #cart-info").slideUp('fast');
        });
    } else {
        //mobile
        $('.header-cart').click(function() {
            if ($('#cart-info').is(':visible')) {
                $("#cart-info").slideUp('fast');
            } else {
                $("#cart-info").slideDown('fast');
            }
        });
    }
}
novtheme.hoverAccount = function(e) {
    if ($(window).width() > 1199) {
        $(".site-header_myaccount").hover(function(){
            $(".site-header_myaccount").addClass("show");
            $(".account-list").addClass("show");
        },
        // Event two mouse out remove class               
        function(){
            $(".site-header_myaccount").removeClass("show");
            $(".account-list").removeClass("show");
        });
    }
}
novtheme.NovToggleAction = function() {
    $(document).on('click', function(f) {
        if ($(f.target).is('.nov_sideward') == false) {
            $('.nov-toggle').removeClass('active');
            $('.nov-toggle .nov-toggle-btn').removeClass('act');
            $('.canvas-overlay').removeClass('act');
        }
        if ($(f.target).is('.nov-toggle .nov-toggle-btn') == true) {
            $('.nov-toggle').removeClass('active');
            $('.nov-toggle .nov-toggle-btn').removeClass('act');
            $('.canvas-overlay').removeClass('act');
        }
    });
}
novtheme.NovToggleSearch = function() {
    $('.search-toggle').on('click.break', function(event) {
        var wrapper = $('.overlay-search');
        wrapper.addClass('open');
        $('.site-header').addClass('open');
        $('#header-sticky').addClass('open');
        $('body').addClass('open');
        $('.search-bar__form .search-bar__input').focus();
    });
    $('.close-search', '.overlay-search').on('click.break', function(event) {
        var wrapper = $('.overlay-search');
        wrapper.removeClass('open');
        $('.site-header').removeClass('open');
        $('#header-sticky').removeClass('open');
        $('body').removeClass('open');
    });
}
novtheme.NovTogglePage = function() {
    $('.nov-toggle-page').on('click', function(e) {
        var target = $(this).data('target');
        $('body').hasClass('show-boxpage') ? ($('body').removeClass('show-boxpage')) : ($('body').addClass('show-boxpage'));
        $(target).hasClass('active') ? ($(target).removeClass('active')) : ($(target).addClass('active'));
        e.preventDefault();
    });
    $('.box-header .close-box').on('click', function(e) {
        $('body').removeClass('show-boxpage');
        $(this).parents('.mobile-boxpage').removeClass('active');
        $('.back-box', '#mobile-pageaccount').removeClass('active');
        $('#mobile-pageaccount').find('.box-content').removeClass('active');
        e.preventDefault();
    });
    $('.links-currency, .links-language').on('click', function(e) {
        var target_link = $(this).data('target'),
            title_box = $(this).data('titlebox');
        $('#mobile-pageaccount').find('.box-content').removeClass('active');
        $('.title-box', '#mobile-pageaccount').html(title_box);
        $('.back-box', '#mobile-pageaccount').addClass('active');
        $(target_link).hasClass('active') ? ($(target_link).removeClass('active')) : ($(target_link).addClass('active'));
        e.preventDefault();
    });
    $('.back-box', '#mobile-pageaccount').on('click', function(e) {
        var titlebox_parent = $('#mobile-pageaccount').data('titlebox-parent');
        $('#mobile-pageaccount').find('.box-content').removeClass('active');
        $('.title-box', '#mobile-pageaccount').html(titlebox_parent);
        $(this).removeClass('active');
        e.preventDefault();
    })
}
novtheme.NovHeightBoxContent = function() {
    var height = $(window).outerHeight(),
        boxheight = $('.box-header').outerHeight(),
        menubottom = $('#stickymenu_bottom_mobile').outerHeight();
    $('.box-content', '.mobile-boxpage').each(function() {
        $(this).outerHeight(height - 45);
    });
}
novtheme.NovEventClickSearchMobile = function() {
    $('#stickymenu_bottom_mobile .js-btn-search').click(function() {
        $('#mobile_search .search-header__input').focus();
        $("body,html").animate({
            scrollTop: 0
        }, "normal");
    })
}
novtheme.goToTop = function() {
    var timer;
    $(window).scroll(function () {
        if (timer)
            clearTimeout(timer)
        timer = setTimeout(function () {
            if ($(window).scrollTop() >= 200) {
                $('#_desktop_back_top').fadeIn();
            } else {
                $('_desktop_back_top').fadeOut();
            }
        }, 300);

    });
    $("#_desktop_back_top").click(function () {
        $("body,html").animate({scrollTop: 0}, "normal");
        return!1
    });
}
novtheme.goToTopMobile = function() {
    if ($(window).width() < 768) {
        var timer;
        $(window).scroll(function() {
            if (timer) clearTimeout(timer)
            timer = setTimeout(function() {
                $('#back_top').fadeIn();
            }, 200);
        });
        $("#back_top").click(function() {
            $("body,html").animate({
                scrollTop: 0
            }, "normal");
            return !1
        });
    }
}
novtheme.PopupNewletter = function() {
    var date = new Date();
    var minutes = 60;
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    if ($.cookie('popupNewLetterStatus') != 'closed' && $('body').outerWidth() > 768) {
        $("#popup-subscribe").modal({
            show: !0
        });
    }
    $.cookie("popupNewLetterStatus", "closed", {
        'expires': date,
        'path': '/'
    })
    $('input.no-view').change(function() {
        if ($('input.no-view').prop("checked") == 1) {
            $.cookie("popupNewLetterStatus", "closed", {
                'expires': date,
                'path': '/'
            })
        } else {
            $.cookie("popupNewLetterStatus", "", {
                'expires': date,
                'path': '/'
            })
        }
    })
}
novtheme.variantName = function() {
    if ($('.template-product .thumb_grid').length > 0) {
        var val = $('.swatch[data-option-index="0"] .swatch-element input:checked').parent().data('value');
        $('.thumbItem[data-variant="'+val+'"]').addClass('show');
        
        $('.swatch[data-option-index="0"] .swatch-element label').on('click', function() {
            var value = $(this).parent().data('value');
            $('.thumbItem').removeClass('show');
            $('.thumbItem[data-variant="'+value+'"]').addClass('show');
        }); 
    }
}
novtheme.MenuSidebar = function() {
    if ($(window).width() < 768) {
        $('.filter-item_title').click(function (){
            $('.filter-item_content').slideUp();
            if($(this).hasClass('add')){
                $(this).next().slideUp();
                $(this).removeClass('add');
            }
            else{
                $(this).next().slideDown();
                $('.filter-item_title').removeClass('add');
                $(this).addClass('add');
            }
        });
    }
}
//Thumnail Slick Product Deal
novtheme.Product__Thumnail = function() {
    $('.product-thumb .item-product').each(function (index) {
        var asNavFor_nav = $('.thumnailslider-for', this).data('asnavfornav');
        var autoplay = $('.thumnailslider-nav', this).data('autoplay');
        var autoplayTimeout = $('.thumnailslider-nav', this).data('autoplayTimeout');
        var items = $('.thumnailslider-nav', this).data('items');
        var items_lg_tablet = $('.thumnailslider-nav', this).data('items_lg_tablet');
        var items_tablet = $('.thumnailslider-nav', this).data('items_tablet');
        var items_mobile = $('.thumnailslider-nav', this).data('items_mobile');
        var items_mobiles = $('.thumnailslider-nav', this).data('items_mobiles');
        var margin = $('.thumnailslider-nav', this).data('margin');
        var nav = $('.thumnailslider-nav', this).data('nav');
        var dots = $('.thumnailslider-nav', this).data('dots');
        var loop = $('.thumnailslider-nav', this).data('loop');
        var vertical = $('.thumnailslider-nav', this).data('vertical');
        var position = $('.thumnailslider-nav', this).find('.selected').data('position-image');
        var asNavFor_for = $('.thumnailslider-nav', this).data('asnavforfor');
        if ($('html').hasClass('lang-rtl'))
            var rtl = true;
        else
            var rtl = false;
        $(asNavFor_for, this).slick({
            rtl: rtl,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: false,
            fade: true,
            loop: false,
            arrows: false,
            asNavFor: asNavFor_nav
        });
        $(asNavFor_nav, this).slick({
            rtl: rtl,
            slidesToShow: items,
            slidesToScroll: 1,
            asNavFor: asNavFor_for,
            centerMode: false,
            loop: false,
            focusOnSelect: true,
            dots: false,
            arrows: false,
            responsive: [
                {
                    breakpoint: 1920,
                    settings: {
                        slidesToShow: items
                    }
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: items_lg_tablet
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: items_tablet,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: items_mobile,
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: items_mobiles,
                    }
                }
            ]
        });
    })
}
novtheme.Product_Megamenu = function() {
    var $this = $('.novmenu_product');
    var autoplay = $($this).data("autoplay");
    var autoplaytimeout = $($this).data("autoplaytimeout");
    var dots = $($this).data("dots");
    var nav = $($this).data("nav");
    $($this).slick({
        nextArrow: '<div class="arrow-next"><i class="fa fa-long-arrow-left"></i></div>',
        prevArrow: '<div class="arrow-prev"><i class="fa fa-long-arrow-right"></i></div>',
        lazyLoad: true,
        autoplay: autoplay,
        autoplaytimeout: 5000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: nav,
        dots: dots,
        infinite: true,
        fade: false,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 1
            },
            1200: {
                items: 1
            }
        }
    });
}
$(document).ready(function() {
    var d = $(this),
        mobile = false;
    $(novtheme.init);
    if (responsive_mobile) {
        novtheme.toggleMobileStyles();
    }
    if ($("#popup-subscribe").length) {
        $(window).on('load', function() {
            var timer = window.setTimeout(novtheme.PopupNewletter(), 2000);
        });
    }
    if ($("#popupAlert").length) {
        $(window).on('load', function() {
            $('#popupAlert').modal();
        });
    }
    $(window).on('resize', function() {
        if (d.width() <= 980 && mobile == false) {
            mobile = true;
        } else if (d.width() > 980) {
            mobile = false;
        }
    });
  
    $(window).load(function() { 
        var loader = $( '.preloader_nov' );
        if ( loader.length ) {
            $( window ).on( 'beforeunload', function() {
                loader.fadeIn( 500, function() {
                    loader.children().fadeIn( 500 )
                });
            });
            loader.fadeOut( 1500 );
            loader.children().fadeOut( 1500 );
        }
    });
    
    // verical menu
    $('.vertical_menu .show_sub, .ver_menu .show_mor').click(function(e){
        $(this).parent().each(function(){
            e.preventDefault();
        });
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).parent().parent('.site-nav--has-dropdown').children('.site-nav__dropdown, .dropdown_menu').slideUp(300);
            $(this).children().addClass('zmdi-chevron-down').removeClass('zmdi-chevron-up');
        } else {
            $(this).addClass('active').parent().parent('.site-nav--has-dropdown').children('.site-nav__dropdown, .dropdown_menu').slideDown(300);
            $(this).children().addClass('zmdi-chevron-up').removeClass('zmdi-chevron-down');
        }
        $('.vertical_menu .show_sub, .ver_menu .show_mor').not(this).removeClass('active').parent().parent('.site-nav--has-dropdown').children('.site-nav__dropdown, .dropdown_menu').slideUp(300);
        $('.vertical_menu .show_sub, .ver_menu .show_mor').not(this).children().removeClass('zmdi-chevron-up').addClass('zmdi-chevron-down');
    });

    // mobile vertical sidebar
    $(".btn-mobile_vertical_menu").click(function(){
        $("#_mobile_vertical_menu").addClass('active');
        $("#_mobile_sidebarmenu_content").addClass('active');
        $(".sidebar-overlay").addClass('act');
    });

    // vertical dropdown
    if($(document).width() <= 1199 && $(document).width() >= 992) {
        $(".vertical_dropdown").removeClass('active');
        $("#_desktop_vertical_menu").css('display', 'none')
    }
    if($(document).width() >= 992 ) {
        $('.vertical_dropdown').click(function(){
            if( $(this).hasClass('active')) {
                $(this).removeClass('active');
                $("#_desktop_vertical_menu").slideUp(450)
            }
            else {
                $(this).addClass('active')
                $("#_desktop_vertical_menu").slideDown(450);
                if($(document).width() < 992){
                    $(".sidebar-overlay").addClass('act');
                }
            }
        });
    }

    // menu 991 > 768
    // if($(document).width() <= 991 && $(document).width() >= 768) {
    //     $('.menu_mb').click(function(){
    //         if( $(this).hasClass('active')) {
    //             $(this).removeClass('active');
    //             $(".dropdown_menu").slideUp(450);
    //         }
    //         else {
    //             $(this).addClass('active');
    //             $(".dropdown_menu").slideDown(450);
    //         }
    //     });
    // }

    var show_more = $(".vertical_menu").data('count_showmore');
    
    if ($('.vertical_menu>ul>li').length > show_more) {
        $(".vertical_menu .show_more").removeClass('hidden');
    }
    $('.vertical_menu .show_more').click(function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }
        if ($('.vertical_menu>ul>li').hasClass('hide')) {
            $('.vertical_menu>ul>li.hide').slideToggle(300);
        }
    });

    if($(document).width() < 992 ) {
        $(".vertical_dropdown").removeClass('active');
        $('.vertical_dropdown').click(function(){
            $("#_desktop_vertical_menu").addClass('active');
            $(".sidebar-overlay").addClass('act');
            $('.ver_menu').addClass('active')
        });
    }

    if($(document).width() > 767 ) {
        $('.cart_canvas .header-cart').click(function(){
            $(".sidebar-overlay").addClass('act');
            $("#_desktop_cart").addClass('active');
        });
        $('.close_account').click(function(){
            $(this).removeClass('active');
            $(".sidebar-overlay").removeClass('act');
        });
        $('.close_cart').click(function(){
            $(".sidebar-overlay").removeClass('act');
            $('#_desktop_cart').removeClass('active')
        });
    }

    $(".sidebar-overlay").click(function() {
        $(this).removeClass('act');
        $("#_mobile_vertical_menu").removeClass('active');
        $(".vertical_toggle").removeClass('active');
        $(".btn_active").css('opacity', '1');
        if ($(document).width() >= 992) {
            $("#_desktop_vertical_menu").slideUp(450);
        };
        $('.vertical_dropdown').removeClass('active');
        $("#_desktop_vertical_menu").removeClass('active');
        $('.sidebar_menu').removeClass('active');
        $('.sidebar-filter').removeClass('active');
        $('.ver_menu').removeClass('active');
        $('#_desktop_cart').removeClass('active');
    });

    //Related Product
    if ($('html').hasClass('lang-rtl'))
        rtl = true;
    else
        rtl = false;
    var autoplay = $(".owl-relatedproduct").data('autoplay');
    var autoplayTimeout = $(".owl-relatedproduct").data('autoplayTimeout');
    var items = $(".owl-relatedproduct").data('items');
    var margin = $(".owl-relatedproduct").data('margin');
    var nav = $(".owl-relatedproduct").data('nav');
    var dots = $(".owl-relatedproduct").data('dots');
    var loop = $(".owl-relatedproduct").data('loop');
    var items_tablet = $(".owl-relatedproduct").data('items_tablet') ? $(".owl-relatedproduct").data('items_tablet') : 3;
    var items_mobile = $(".owl-relatedproduct").data('items_mobile') ? $(".owl-relatedproduct").data('items_mobile') : 1;
    var center = $(".owl-relatedproduct").data('center') ? $(".owl-relatedproduct").data('center') : false;
    var start = $(".owl-relatedproduct").data('start') ? $(".owl-relatedproduct").data('start') : 0;
    $(".owl-relatedproduct").owlCarousel({
        navText: ['<i class="zmdi zmdi-chevron-left"></i>', '<i class="zmdi zmdi-chevron-right"></i>'],
        lazyLoad: true,
        lazyContent: true,
        loop: loop,
        autoplay: autoplay,
        autoplayTimeout: autoplayTimeout,
        items: items,
        margin: margin,
        rtl: rtl,
        dots: dots,
        nav: nav,
        responsive: {
            0: {
                items: items_mobile,
                center: center,
                margin: 10,
            },
            768: {
                items: items_tablet,
                margin: 30
            },
            992: {
                items: 4,
                margin: 30
            },
            1200: {
                items: items,
                startPosition: start,
                margin: 30
            },
            1440: {
                items: items,
                startPosition: start,
                margin: margin
            },
        }
    });
    checkClasses();
    $(".owl-relatedproduct").on('translated.owl.carousel', function(event) {
        checkClasses();
    });

    function checkClasses() {
        var total = $('.owl-relatedproduct .owl-stage .owl-item.active').length;
        $('.owl-relatedproduct .owl-stage .owl-item').removeClass('firstActiveItem lastActiveItem');
        $('.owl-relatedproduct .owl-stage .owl-item.active').each(function(index) {
            if (index === 0) {
                $(this).addClass('firstActiveItem');
            }
            if (index === total - 1 && total > 1) {
                $(this).addClass('lastActiveItem');
            }
        });
    }
    if ($(document).width() > 767) {
        $("#AccessibleNav .site-nav--has-dropdown >.show_sub").click(function() {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).parents('.site-nav--has-dropdown').children('.site-nav__dropdown').slideUp(300);
            } else {
                $('#AccessibleNav .site-nav--has-dropdown >.show_sub').removeClass('active');
                $(this).addClass('active');
                $('#AccessibleNav .site-nav--has-dropdown .site-nav__dropdown').slideUp(300);
                $(this).parents('.site-nav--has-dropdown').children('.site-nav__dropdown').slideDown(300);
            }
        });
    }
    if ($(document).width() > 767) {
        $("#AccessibleNav .site-nav__childlist-item .show_sub").click(function() {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).parents('.site-nav__childlist-item').children('.site-nav__dropdown-children').slideUp(300);
            } else {
                $(this).addClass('active');
                $(this).parents('.site-nav__childlist-item').children('.site-nav__dropdown-children').slideDown(300);
            }
        });
    }
    $('.menu_button').click(function(){
        $('.sidebar_menu').addClass('active');
        $('.sidebar-overlay').addClass('act');
    })
    $('.close-menu').click(function(){
        $('.sidebar_menu').removeClass('active');
        $('.sidebar-overlay').removeClass('act');
    })
    novtheme.NovMediumToggle = function() {
        $('.card-header').on("click", function(e) {
            $(this).hasClass("active") ? ($(this).removeClass('active')) : ($(this).addClass('active'))
        });
    }


    novtheme.HideShowPassword = function() {
        $('.hide_show_password').show();
        $('.hide_show_password span').addClass('show')
          
        $('.hide_show_password span').click(function(){
            if( $(this).hasClass('show')) {
                $(this).html('<i class="zmdi zmdi-eye"></i>');
                $('input[name="customer[password]"]').attr('type','text');
                $(this).removeClass('show');
            } else {
                $(this).html('<i class="zmdi zmdi-eye-off"></i>');
                $('input[name="customer[password]"]').attr('type','password');
                $(this).addClass('show');
            }
        });
            
        $('form button[type="submit"]').on('click', function(){
            $('.hide_show_password span').text('Show').addClass('show');
            $('.hide_show_password').parent().find('input[name="customer[password]"]').attr('type','password');
        });
    }


    // Toggle Search
    novtheme.NovSearchToggle = function() {

    }

    // Social header 
    $('.btn-social').click(function () {
        if($('.social-header').hasClass('active')) {
            $('.social-header').removeClass('active')
        } else {
            $('.social-header').addClass('active')
        }
    })

    $('.group-quantity .btnProductWishlist').click(function () {
        if($(this).hasClass('whislist-added')) {
            $('#popup-Wishlist').removeClass('novload')
        } else {
            $('#popup-Wishlist').addClass('novload')
        }
    })

    //Sticky page cart
    if ($('.template-cart').length > 0 ) {
        novtheme.NovStickIn = function() {
           
        }
    }
    novtheme.galery_image = function() {
        $('[data-fancybox="gallery"]').fancybox({
            buttons: [
            "slideShow",
            "thumbs",
            "zoom",
            "fullScreen",
            // "share",
            "close"
            ],
            loop: false,
            protect: true
        });
    };
    
    //Sticky page product detail
    //Sticky page product detail
    if ($(window).width() > 991 && $('.template-product').length > 0) {
        $(".product_external .info_content").stick_in_parent({
            offset_top: 120,
        });
        $(".product_external .thumbsticky").stick_in_parent({
            offset_top: 50,
        });
        $(".product-thumb_left .thumbsticky").stick_in_parent({
            offset_top: 50,
        });
    }
    if ($(window).width() > 767 && $('.template-product').length > 0) {
        $(".product_basic .info_content").stick_in_parent({
            offset_top: 0,
        });
        $(".product_variant .box-info").stick_in_parent({
            offset_top: 120,
        });
        $(".product_outstock .info_content").stick_in_parent({
            offset_top: 80,
        });
        $(".product_simple .info_content").stick_in_parent({
            offset_top: 80,
        });
    }

    $('.template-product .accordion .btn-link').click(function(){
        var ofst = $(window).scrollTop() + 1;
        $("body,html").animate({scrollTop: ofst}, "fast");
    });

    $(".product-swatch-color a").click(function(e){
        e.preventDefault();
        var data_image_variant = $(this).data('image-variant');
        var src_img = $(this).parents('.item-product').find('.product__thumbnail');
        src_img.attr('srcset', data_image_variant);
        $(this).parents('.item-product').find(".product__thumbnail-second").addClass('hidden');
        $(this).parents('.item-product').find(".product__thumbnail").addClass('block');
    });

    $(".product-swatch-color").each(function() {
        var n = $(this).children('.swatch-element').length - 3;
        if ($(this).children('.swatch-element').length > 3) {
            $(this).find('.number').text(n);
            $(this).find('.show_more').show();
        }
        $(this).find('.swatch-element:gt(2)').addClass('hide');
        $(this).children('.show_more').click(function () {
            if ($(this).hasClass('active')) {
                $(this).parent('.swatch-element').removeClass('act');
                $(this).parent().find('.hide').hide();
                $(this).removeClass('active');
                $(this).parent().find('.number').show();
            } else {
                $(this).parent('.swatch-element').addClass('act');
                $(this).parent().find('.hide').show();
                $(this).addClass('active');
                $(this).parent().find('.number').hide();
            }
        })
    })

    $('.btnsold_out').click(function () {
        // $('.btnsold_out').find('button[data-target="#Form_newletter"]').attr('data-target','#Form_newletters').delay(2000);
        $('.note').addClass("d-none");
        $('.loading').addClass("d-block");
        $('.loading i').addClass("fa-spinner");
        setTimeout(RemoveClass, 500);
    });
    
    $('.no-view').click(function () {
        if($('.contact-form').hasClass('add')) {
            $('.contact-form').removeClass('add')
        } else {
            $('.contact-form').addClass('add')
        }
    })

    function RemoveClass() {
        $('.note').removeClass("d-none");
        $('.loading').removeClass("d-block");
        $('.loading i').removeClass("zmdi-hc-spin");
    }

    if ($(window).width() > 767) {
        var $productImageZoom = $('.image-zoom');
        $productImageZoom.trigger('zoom.destroy');
        $productImageZoom
        .wrap('<span style="display:inline-block"></span>')
        .css('display', 'block')
        .parent()
        .zoom({
            url: $(this).find('img').attr('data-zoom')
        });
    }

    new WOW().init();
});
