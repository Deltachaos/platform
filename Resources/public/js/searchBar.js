$(document).ready(function () {
    var _searcjFlag = false;

    $(".search-form").submit(function(){
        if ($(this).find('.search').val().length == 0) {
            return false;
        }
    });

    $("#search-bar-dropdown li a").click(function (e) {
        $("#search-bar-from").val($(this).parent().attr('data-alias'));
        $("#search-bar-button").html($(this).html() + '<span class="caret"></span>');
        SearchByTagClose()
        SearchInputWidth()
        e.preventDefault();
    });

    SearchInputWidth()
    function SearchByTag() {
        var queryString = jQuery('#search-bar-search').val();
        if (queryString == '' || queryString.length < 3) {
            $("#search-div").removeClass('header-search-focused');
            $('.custom-dropdown ul li').remove();
        } else {
            $.ajax({
                url: $('#top-search-form').attr('action'),
                dataType: "json",
                data: {
                    search: queryString,
                    from: $("#search-bar-from").val(),
                    limit: 5
                },
                success: function (data) {
                    $("#search-div").removeClass('header-search-focused');
                    $('.custom-dropdown ul li').remove();
                    $("#recordsCount").val(data['records_count']);
                    if (data['count'] > 0) {
                        for (var i = 0; i < data['count']; i++) {
                            $('.custom-dropdown ul').append(
                                '<li>'
                                    + '<a href="' + data['data'][i]['record_url'] + '">'
                                    + '<span class="name"><strong>' + data['data'][i]['record_string'] + '</strong></span>'
                                    + data['data'][i]['entity_type']
                                    + '</a>'
                                    + '</li>'
                            );
                        }
                        $("#search-div").addClass('header-search-focused');
                    }
                }
            });
        }
    };
    function SearchInputWidth() {
        var _generalWidth = $('#search-div').width()
        var _btnSearchWidth = $("#search-div button.btn-search").outerWidth() + $('#search-bar-button').outerWidth();
        var _inputSearchWidth = _generalWidth - _btnSearchWidth;
        $('#search-bar-search').width(_inputSearchWidth);
        var _dropdownSearchWidth = $('#search-div div.header-search-frame').width() - 1;
        /* just design need without border */
        $('#search-div div.custom-dropdown').outerWidth(_dropdownSearchWidth);

    };

    function SearchByTagClose() {
        $("#search-div").removeClass('header-search-focused');
        var queryString2 = $('#search-bar-search').val();
        if (queryString2.length > 0) {
            $('#search-div').addClass('search-focus');
        } else {
            $('#search-div').removeClass('search-focus');
        }
    };

    $('#search-bar-search').keydown(function (event) {
        switch(event.keyCode) {
            case 13: //enter
                $("#top-search-form").submit();
                event.preventDefault();
                return false;
                break;
            case 40: //down
            case 38: //up
                $("#search-div").addClass('header-search-focused');
                $('#search-dropdown a:first').focus();
                event.preventDefault();
                return false;
                break;
            default:
                SearchByTag();
        };
    });

    $(document).on('keydown', '#search-dropdown a', function (evt) {
        var $this = $(this);

        function select_previous () {
            $this.parent('li').prev().find('a').focus();
            evt.stopPropagation();
            return false;
        }

        function select_next () {
            $this.parent('li').next().find('a').focus();
            evt.stopPropagation();
            return false;
        }

        switch(evt.keyCode) {
            case 13: // Enter key
            case 32: // Space bar
                $this.click();
                evt.stopPropagation();
                break;
            case 9: // Tab key
                if (evt.shiftKey) {
                    select_previous();
                }
                else {
                    select_next();
                }
                evt.preventDefault();
                break;
            case 38: // Up arrow
                select_previous();
                break;
            case 40: // Down arrow
                select_next();
                break;
        }
    });

    $(document).on('focus', '#search-dropdown a', function (evt) {
        $(this).parent('li').addClass('hovered');
    });

    $(document).on('focusout', '#search-dropdown a', function (evt) {
        $(this).parent('li').removeClass('hovered');
    });

    $("#search-bar-search").focusout(function () {
        if (!_searcjFlag) {
            SearchByTagClose()
        }
    });

    $('#search-div').mouseenter(function () {
        _searcjFlag = true;
    }).mouseleave(function () {
            _searcjFlag = false;
        });

    $('#search-bar-search').focusin(function () {
        $('#search-div').addClass('search-focus');
    });
});
