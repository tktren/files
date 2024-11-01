
/*browser detect function*/

(function ($, ua) {

    var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [],
        tem,
        res;

    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        res = 'IE ' + (tem[1] || '');
    } else if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null)
            res = tem.slice(1).join(' ').replace('OPR', 'Opera');
        else
            res = [M[1], M[2]];
    } else {
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M = M.splice(1, 1, tem[1]);
        res = M;
    }

    res = typeof res === 'string' ? res.split(' ') : res;

    $.browser = {
        name: res[0],
        version: res[1],
        msie: /msie|ie/i.test(res[0]),
        firefox: /firefox/i.test(res[0]),
        opera: /opera/i.test(res[0]),
        chrome: /chrome/i.test(res[0]),
        edge: /edge/i.test(res[0])
    }

})(typeof jQuery != 'undefined' ? jQuery : window.$, navigator.userAgent);

/*browser detect function*/

/*cookie plugin*/
jQuery.cookie = function (name, value, options) {
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000))
            } else {
                date = options.expires
            }
            expires = '; expires=' + date.toUTCString()
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('')
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break
                }
            }
        }
        return cookieValue
    }
};
/*\cookie plugin*/

var daysofexpire = 1200;

/*Calendar drawing*/
function initCal(opts) {
    var cD = new Date(currentTime);
    var dim = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    dim[1] = (((cD.getFullYear() % 100 != 0) && (cD.getFullYear() % 4 == 0)) || (cD.getFullYear() % 400 == 0)) ? 29 : 28;
    var fD = new Date(cD.getFullYear(), cD.getMonth(), 1);
    var sday = (fD.getDay() != 0) ? (fD.getDay() - 1) : 6; // make monday 0 and sunday 6
    var buff = "";
    var i = 0;
    for (today = 1 - sday; today <= dim[cD.getMonth()]; today++) {
        var cssName = "";
        if (today == cD.getDate()) cssName = opts.todayClass;
        else if (i == 5 || i == 6) cssName = opts.weekendClass;
        buff += "<" + opts.dayElement + " class=\"" + ((opts.dayClass) ? (opts.dayClass + " ") : "") + cssName + "\">" + ((today > 0) ? today : "&nbsp;") + "</" + opts.dayElement + ">";
        if (++i == 7) {
            i = 0;
            buff += "<br clear=\"all\" />";
        }
    }
    return buff;
}
/*\Calendar drawing*/

/*Clock drawing*/

function drawClock() {
    var clock = new Clock();
    clock.init();
}

function Clock() {

    var canvas = document.getElementById('clockCanvas');

    this.color = {
        circle: '#858585',
        seconds: '#858585',
        hands: '#2f2f2f',
        outer: '#e0e0e0',
        text: '#000'
    };

    this.font = '12px Verdana';

    this.drawHand = function (c2d, l, seconds) {
        c2d.lineWidth = 1;
        c2d.beginPath();
        if (seconds) {
            c2d.moveTo(1, 1);
            c2d.lineTo(1, -l);
            c2d.lineTo(-1, -l);
            c2d.lineTo(-1, 1);
            c2d.lineTo(1, 1);
            c2d.fillStyle = this.color.seconds;
        } else {
            c2d.moveTo(0, 3);
            c2d.lineTo(-3, 0);
            c2d.lineTo(0, -l);
            c2d.lineTo(3, 0);
            c2d.lineTo(0, 3);
            c2d.fillStyle = this.color.hands;
        }
        c2d.fill();
    };

    this.drawCircle = function (c2d, x, y, r, filled) {
        c2d.lineWidth = 1;
        c2d.beginPath();
        c2d.arc(x, y, r, 0, Math.PI * 2, true);
        if (filled) {
            c2d.fillStyle = this.color.circle;
            c2d.fill();
        } else {
            c2d.strokeStyle = this.color.outer;
            c2d.stroke();
        }
    };

    this.time = function () {
        // add a new second
        currentTime += 1000;
        // get the current time
        var now = new Date();
        now.setTime(currentTime);
        var hrs = now.getHours(),
            min = now.getMinutes(),
            sec = now.getSeconds(),
            time = {
                hrs: hrs,
                min: min,
                sec: sec
            };
        return time;
    }

    this.showClock = function () {
        var c2d = canvas.getContext('2d');

        var sec, min, hrs, time = this.time();
        sec = time.sec;
        min = time.min;
        hrs = time.hrs;

        // clear content and set properties
        c2d.clearRect(0, 0, 112, 112);
        c2d.font = this.font;
        c2d.textBaseline = 'middle';
        c2d.textAlign = 'center';
        c2d.lineWidth = 1;

        // draw outer circle
        this.drawCircle.call(this, c2d, 56, 56, 56, false);

        // translate to center
        c2d.translate(56, 56);

        // print hours
        for (i = 5; i <= 60; i += 5) {
            ang = Math.PI / 30 * i;
            sang = Math.sin(ang);
            cang = Math.cos(ang);
            nx = sang * 45;
            ny = cang * -45;
            c2d.fillStyle = this.color.text;
            c2d.fillText(i / 5, nx, ny);
        }
        c2d.save();

        // draw hand for hours
        c2d.rotate(Math.PI / 6 * (hrs + (min / 60) + (sec / 3600)));
        this.drawHand.call(this, c2d, 28);
        c2d.restore();
        c2d.save();

        // draw hand for minutes
        c2d.rotate(Math.PI / 30 * (min + (sec / 60)));
        this.drawHand.call(this, c2d, 41);
        c2d.restore();
        c2d.save();

        // draw hand for seconds
        c2d.rotate(Math.PI / 30 * sec);
        this.drawHand.call(this, c2d, 49, true);
        c2d.restore();

        // draws the inner circle for the hands
        this.drawCircle.call(this, c2d, 0, 0, 4, true);

        c2d.translate(-56, -56);
    };

    this.init = function () {
        var $this = this;
        if (typeof clock_tid !== 'undefined' && clock_tid > -1) window.clearInterval(clock_tid);
        if (canvas && canvas.getContext) {
            var clockHandler = function () {
                $this.showClock.call($this);
            };
            window.clock_tid = window.setInterval(clockHandler, 1000);
        } else {
            // fallback to flash
            var sec, min, hrs;
            var clockHandler = function () {
                var time = $this.time();
                sec = time.sec;
                min = time.min;
                hrs = time.hrs;
            };
            window.clock_tid = window.setInterval(clockHandler, 1000);
            $('#clockCanvas').html('<embed width="128" height="128" src="flash/clocknewHome.swf" FlashVars="serverTime=' + hrs + ':' + min + ':' + sec + '"></embed>');
        }
    };

}

/*\Clock drawing*/

/*Vesti & Sportni, Edna links hover*/

function newsBlockInit() {
    $(".newsLinks a").removeClass('selected');
    $(this).addClass('selected');
    $('#newsImageHolder .image').css('background-image', 'none');
    $('#newsImageHolder .image').css('background-image', 'url(' + newsImages[$(this).index()] + ')');
    $('#newsImageHolder a').attr('href', $(this).attr('href'));
    $('#newsImageHolder a').attr('counter', $(this).attr('counter'));
}

function blocksIniti() {

    $(".newsLinks a").on('mouseover', newsBlockInit);

    $(".ednaLinks a").on('mouseover',
        function () {
            $(".ednaLinks a").removeClass('selected');
            $(this).addClass('selected');
            $('#ednaImageHolder .image').css('background-image', 'none');
            $('#ednaImageHolder .image').css('background-image', 'url(' + ednaImages[$(this).index()] + ')');
            $('#ednaImageHolder a').attr('href', $(this).attr('href'));
            $('#ednaImageHolder a').attr('data-counter', $(this).attr('data-counter'));
        }
    );

    $(".ednaLinks a, #ednaImageHolder a").click(function () {
        makeClick($(this).attr('data-counter'))
    });

    $(".sportLinks a").hover(
        function () {
            $(".sportLinks a").removeClass('selected');
            $(this).addClass('selected');
            $('#sportImageHolder .image').css('background-image', 'none');
            $('#sportImageHolder .image').css('background-image', 'url(' + sportImages[$(this).index()] + ')');
            $('#sportImageHolder a').attr('href', $(this).attr('href'));
            $('#sportImageHolder a').attr('counter', $(this).attr('counter'));
        }
    );

}

$(window).on('load', blocksIniti);
/*Vesti & Sportni links hover*/

$(function () {
    /*Deafault value form function*/
    $(".defaultValue").on('focus', function () {
        if ($(this).val() == $(this)[0].title) {

            $(this).val("");
        }
    });

    $(".defaultValue").on('blur', function () {
        if ($(this).val() == "") {

            $(this).val($(this)[0].title);
        }
    });
    $(".defaultValue").blur();
    /*\Deafault value form function*/

    /* Search form submit */
    $("#searchForm .searchButton").click(function () {
        $("#searchForm").submit();

    });
    /* \Search form submit */

    /*Text input background change*/
    $("#loginForm .textField, #citySearch .text").on('focus', function () {
        $(this).addClass('focus');
    });
    $("#loginForm .textField, #citySearch .text").on('blur', function () {
        $(this).removeClass('focus');
    });
});
/*\Text input background change*/

/* Astro and Weather block toggle */
$(function () {
    $("body").on("click", ".info .left", function () {
        $(this).parent().next().slideToggle();
        $(this).toggleClass('selected')
    });
    /*\ Astro and Weather block toggle */

    /*Astro block sign choose*/
    $("body").on("click", "#astroContent .infoMore li", function () {

        var zodiaid = $(this).attr('id');
        $.cookie("ZodID", zodiaid.replace('z', ''), {
            expires: daysofexpire,
            path: '/',
            domain: '.abv.bg'
        });
        $.ajax({

            type: "GET",
            cache: false,
            dataType: "html",
            url: "/home/astro/sign/" + zodiaid.replace('z', ''),
            success: function (data) {


                $('#astro').html(data);
                $('#astroContent .infoMore').show().slideUp('fast');


            }
        });
    });
    /*\Astro block sign choose*/


    /*Weather choose*/
    $("body").on("click", "#sinoptikContent .infoMore li", function () {
        var id = $(this).attr('id');
        $.cookie("TownID", id.replace('w', ''), {
            expires: daysofexpire,
            path: '/',
            domain: '.abv.bg'
        });
        $.ajax({

            type: "GET",
            cache: false,
            dataType: "html",
            url: "/home/sinoptik/cache/" + id.replace('w', ''),
            success: function (data) {

                $('#sinoptik').html(data);
                $('#sinoptikContent .infoMore').show().slideUp('fast');
                $("#citySearch .text").blur();
                $('#sLoader').hide();


            }
        });
    });
    /*\Weather choose*/


    /*Weather search button*/
    $("body").on("click", "#citySearch .searchButton", function () {
        $('#searchResults').html('<span class="caption"></span>');
        $('#citySearch #lHolder').append('<div class="loader"></div>');
        var urltext = $('#citySearch .text').val().replace(' ', '+');

        $.get("//sinoptik.bg/api/app_search?q=" + encodeURIComponent(urltext), function (data) {
            console.log('serach city result: ', data);
            var locationcount = !data ? 0 : data.length == 0 ? 0 : data.locations.length;
            if (locationcount == 0) {
                $('#searchResults .caption').html('ÐÑÐ¼Ð° Ð½Ð°Ð¼ÐµÑ€ÐµÐ½Ð¸ Ñ€ÐµÐ·ÑƒÐ»Ñ‚Ð°Ñ‚Ð¸.')
            } else {
                $('#searchResults .caption').html('Ð ÐµÐ·ÑƒÐ»Ñ‚Ð°Ñ‚Ð¸ Ð¾Ñ‚ Ñ‚ÑŠÑ€ÑÐµÐ½Ðµ:')
                for (var x in data.locations) {

                    var country = data.locations[x].country;
                    var city = data.locations[x].name;
                    var cityid = data.locations[x].id;

                    $('#searchResults').append('<span id="w' + cityid + '" class="cityChoose">' + city + ', ' + country + '</span><br clear="all" />');

                };
            }
            $('#searchResults').show();
            $('#citySearch .loader').remove();

        });
    });

    /*Enter press search input*/
    $('body').on('keypress', '#citySearch .text', function (event) {

        if (event.which == 13 && $(this).val() != '') {
            event.preventDefault();
            $('#citySearch .searchButton').click();
        }
    });
    /*\Enter press search input*/

    /*\Weather search button*/

    /*Option choose*/
    $("body").on("click", "#searchResults .cityChoose", function () {
        var id = $(this).attr('id');

        getCity(id);
        $.cookie("TownID", id.replace('w', ''), {
            expires: daysofexpire,
            path: '/',
            domain: '.abv.bg'
        });
        $('#searchResults span').html('');
        $('#searchResults').hide();
        $('#sinoptikContent .infoMore').slideUp();
        $('#citySearch .text').val('');
        $('#citySearch .text').blur();
        $('#sinoptikContent .infoMore .selected').removeClass('selected');
        $('#currentCity').removeClass('selected');
    });
    /*\Option choose*/

});

$._dev_ = /abvnew/g.test(location) ? true : false;

/*sinoptik (ip or cookie) */
function getCityInfo() {
    if ($.cookie('TownID') && $.cookie('TownID').indexOf('exist') == -1) {
        getCity($.cookie('TownID'));
    } else {
        $.get($._dev_ ? 'https://bimg.abv.bg/a/search_ip.php' : '/home/sinoptik/search_ip', {
            crossDomain: true
        }).done(function (data) {
            getCity(data);
        });
    }
}
/*sinoptik (ip or cookie) */

/*get City */
function getCity(locationID) {
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'text xml',
        url: ($._dev_ ? 'https://bimg.abv.bg/a/location_cc.php?id=' : '/home/sinoptik/location_cc/') + locationID.replace('w', ''),
        crossDomain: true,
        success: function (data) {
            townName = data.getElementsByTagName("lname")[0].firstChild.data;
            locationLink = data.getElementsByTagName("link")[0].firstChild.data;
            tempNow = data.getElementsByTagName("temp")[0].firstChild.data;
            flikeNow = data.getElementsByTagName("like")[0].firstChild.data;
            descNow = data.getElementsByTagName("shdesc")[0].firstChild.data;
            minToday = data.getElementsByTagName("min")[0].firstChild.data;
            maxToday = data.getElementsByTagName("max")[0].firstChild.data;
            descToday = data.getElementsByTagName("desc")[1].firstChild.data;
            minTomorrow = data.getElementsByTagName("min")[1].firstChild.data;
            maxTomorrow = data.getElementsByTagName("max")[1].firstChild.data;
            descTomorrow = data.getElementsByTagName("desc")[2].firstChild.data;
            picNow = data.getElementsByTagName("pic")[0].firstChild.data;
            picToday = data.getElementsByTagName("pic")[1].firstChild.data;
            picTomorrow = data.getElementsByTagName("pic")[2].firstChild.data;
            var degree = '&deg;';
            $('#sinoptikContent .gradus span').html(tempNow + degree + 'C');
            $('#sinoptikContent .smallgradus span:eq(0)').html(flikeNow + degree);
            $('#sinoptikContent .forecast:eq(0)').html(descNow);
            $('#sinoptikContent .smallgradus span:eq(1)').html(minToday + degree);
            $('#sinoptikContent .smallgradus span:eq(2)').html(maxToday + degree);
            $('#sinoptikContent .forecast:eq(1)').html(descToday);
            $('#sinoptikContent .smallgradus span:eq(3)').html(minTomorrow + degree);
            $('#sinoptikContent .smallgradus span:eq(4)').html(maxTomorrow + degree);
            $('#sinoptikContent .forecast:eq(2)').html(descTomorrow);
            $('#currentCity').html(townName);
            $('#sinoptikContent .infocell.first .image').css('background-image', 'url(https://img.abv.bg/n/i/wh/sinoptikpng/' + picNow + ')');
            $('#sinoptikContent .infocell:eq(1) .image').css('background-image', 'url(https://m.netinfo.bg/sinoptik/icons/small/' + picToday + ')');
            $('#sinoptikContent .infocell:eq(2) .image').css('background-image', 'url(https://m.netinfo.bg/sinoptik/icons/small/' + picTomorrow + ')');
            $('#sinoptikLink').attr('href', 'https://sinoptik.bg/' + locationLink);
            $('#sinoptikLinkToday').attr('href', 'https://sinoptik.bg/' + locationLink + '/hourly/');
            $('#sinoptikLinkTomorrow').attr('href', 'https://sinoptik.bg/' + locationLink + '/5-days/2');
            $('#sinoptikContent .right').attr('href', 'https://sinoptik.bg/' + locationLink + '/10-days');
            $('#sinoptikContent .infoMore').slideUp();
            $('#sLoader').hide();
        }
    });

}
/*\get City */


/*promo list*/
$(function () {
    var _img_counter_ = (new Image);
    var dt = new Date("Jul 5, 2018 23:59:59");
    var checkDate = (dt.getTime() - (new Date).getTime()) / (1000 * 60 * 60 * 24) >= 0;

    var promoList = [];

    if (checkDate) {
        promoList = [{
            image: 'https://www.abv.bg/images/kare_love.jpg',
            link: 'https://a.abv.bg/www/delivery/ck.php?oaparams=2__bannerid=177643__zoneid=63__oadest=http://www.mylovemarks.eu/'
        }];
    } else {
        promoList = [
        {
            image: 'https://www.abv.bg/images/abv_305x250_2.png',
            link: 'http://mobile.abv.bg/?utm_source=ABV&utm_medium=Banner&utm_content=Easy'
        },
        {
            image: 'https://www.abv.bg/images/abv_305x250_1.png',
            link: 'http://mobile.abv.bg/?utm_source=ABV&utm_medium=Banner&utm_content=Fast'
        },
        {
            image: 'https://www.abv.bg/images/abv_305x250_3.png',
            link: 'http://mobile.abv.bg/?utm_source=ABV&utm_medium=Banner&utm_content=Safe'
        },
        {
            image: 'https://www.abv.bg/images/305x250-1.png',
            link: 'https://blog.abv.bg/abv-syveti-kakvo-e-spam/?utm_source=ABV&utm_medium=Banner&utm_campaign=blog&utm_content=spam'
        },
        {
            image: 'https://www.abv.bg/images/305x250-2.png',
            link: 'https://blog.abv.bg/abv-syveti-otgovaria-na-vaprosa-kakvo-e-fishing/?utm_source=ABV&utm_medium=Banner&utm_campaign=blog&utm_content=fishing'
        },
        {
            image: 'https://www.abv.bg/images/305x250-3.png',
            link: 'https://blog.abv.bg/abv-saveti-razberi-vsichko-za-registraciata/?utm_source=ABV&utm_medium=Banner&utm_campaign=blog&utm_content=vsichko-za-registraciata'
        },
        {
            image: 'https://www.abv.bg/images/305x250-4.png',
            link: 'https://blog.abv.bg/abv-saveti-sigurnostta-v-internet/?utm_source=ABV&utm_medium=Banner&utm_campaign=blog&utm_content=sigurnostta-v-internet'
        },
        {
            image: 'https://www.abv.bg/images/305x250-5.png',
            link: 'https://blog.abv.bg/parva-poshta-vij-kak-i-zashto/?utm_source=ABV&utm_medium=Banner&utm_campaign=blog&utm_content=parva-poshta'
        },
        {
            image: 'https://www.abv.bg/images/305x250-6.png',
            link: 'https://blog.abv.bg/abv-saveti-kak-da-badete-navsiakade-s-washata-abvposhta/?utm_source=ABV&utm_medium=Banner&utm_campaign=blog&utm_content=badete-navsiakade'
        },
        {
            image: 'https://www.abv.bg/images/305x250-7.png',
            link: 'https://blog.abv.bg/abv-saveti-vsichko-za-email-messenger/?utm_source=ABV&utm_medium=Banner&utm_campaign=blog&utm_content=email-messenger'
        },
        {
            image: 'https://www.abv.bg/images/305x250-8.png',
            link: 'https://blog.abv.bg/gdpr-kakvo-kak-i-zashto'
        },
        {
            image: 'https://www.abv.bg/images/305x250-9.png',
            link: 'https://blog.abv.bg/gdpr-upravlenie-na-danni'
        },
        {
            image: 'https://www.abv.bg/images/305x250_dox.png',
            link: 'https://blog.abv.bg/kakvo-novo-v-dox-bg/#utm_source=ABV&utm_medium=Banner&utm_content=Dox'
        },
        // promo new
        {
            image: 'https://www.abv.bg/images/vaztanovyavane_na_dostap.png',
            link: 'https://blog.abv.bg/kak-mojem-da-vyzstanovim-dostypa-do/'
        },
        {
            image: 'https://www.abv.bg/images/zashto_gubim_dostap.png',
            link: 'https://blog.abv.bg/zaguba-na-dostap-do-email-v-abv-bg/'
        }
        ];
    }

    // var RandomPromo = Math.floor(Math.random() * promoList.length + 1);

    var RandomPromo = getPromoBanner(promoList, 2);

    if (checkDate)
        _img_counter_.src = 'https://a.abv.bg/www/delivery/lg.php?bannerid=177025&campaignid=5122&zoneid=63&time=' + (new Date).getTime();

    // $('#promoZone a').attr('href', promoList[RandomPromo - 1].link);
    // $('#promoZone a').css('background', 'url(' + promoList[RandomPromo - 1].image + ')');

    $('#promoZone a').attr('href', RandomPromo.link);
    $('#promoZone a').css('background', 'url(' + RandomPromo.image + ')');

});

function christmas() {
    $('#mainHeader h1').css({
        backgroundImage: 'url(https://www.abv.bg/images/abv_christmas.png)'
    });
}

function getPromoBanner(b, f) {
    /* 	
    	set ratio - 2, 3, 4, 6, 12 	
    */
    var num = f ? f : 3;

    if (b.length < num + 1) return rdmCell(b);
    else
        switch (rdmGr()) {
            case 'set':
                return rdmCell(mtrx(b).set);
            case 'promo':
                return rdmCell(mtrx(b).promo);
            case 'rest':
                return rdmCell(mtrx(b).rest);
        }

    function getSet() {
        var m = (new Date).getMonth() + 1,
            count = 0;
        for (var x = 0; x <= 12; x = x + 12 / num)
            if (m > x) count++;
        return count;
    }

    function rdmCell(a) {
        return a[Math.round(Math.random() * (a.length - 1))];
    }

    function rdmGr() {
        var r = Math.floor( Math.random() * 10 ) || 10,
            group = r === 10 ? 'promo' : r < 6 ? 'set' : 'rest';
        console.log('result: {', group, '}');
        return group;
    }

    function mtrx(a) {
        var setN = getSet(),
            arr = a.concat([]),
            srl = arr.length - 2,
            setLength = (num - srl % num + srl) / num,
            start = (setN - 1) * setLength,
            promo = arr.splice(arr.length - 2, 2),
            set = arr.splice(start, setLength),
            o = {
                promo: promo,
                set: set,
                rest: arr
            };
        console.log('banners groups: ', o);
        return o;
    }
}

/*\promo list*/


/*google search focus*/
$(function () {

    $("#searchForm .textField").focus(function () {

        $('#powGoogle').addClass('focus');
    });
    $("#searchForm .textField").blur(function () {

        $('#powGoogle').removeClass('focus');
    });

    $(".defaultValue").on('focus', function () {

        $(this).addClass('focus');
    });
    $(".defaultValue").on('blur', function () {

        $(this).removeClass('focus');
    });

});
/*\google search focus*/

function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}


/*Abv slider plugin*/
jQuery.fn.abvSlider = function () {
    return this.each(function () {
        var $this = $(this);
        var randomSlide;
        var eid = this.id;
        var curr;
        var ednapaid;
        if (eid == "ednaShow") {
            for (var i = 0; i <= 4; i++) {
                ednaList[i].paid == "yes" ? ednapaid = i : ednapaid = undefined;
                if (typeof ednapaid != 'undefined') break;
            }
        }

        if (eid == "ednaShow" && !$.cookie("ednapaid") && typeof ednapaid != 'undefined') {
            curr = ednapaid;
            randomSlide = ednapaid;
            $.cookie("ednapaid", '1', {
                expires: 1,
                path: '/',
                domain: '.abv.bg'
            });
        } else {
            randomSlide = Math.floor(Math.random() * 5);
            curr = randomSlide;
        }

        var arrayName = eval(this.id.replace('Show', 'List'));
        $this.printD = function (id, arrayName) {
            if (arrayName[id].type == "vic") {
                var textCat = typeof arrayName[id].title !== 'undefined' ? arrayName[id].title : 'Ð’Ð¸Ñ† Ð½Ð° Ð´ÐµÐ½Ñ';
                var linkCat = '<a class="abv-vic linkCat" href="https://vicove.vesti.bg/" target="_blank">ÐžÑ‰Ðµ Ð²Ð¸Ñ†Ð¾Ð²Ðµ</a>';
                var textLink = 'Vicove.vesti.bg';
                var textHref = 'https://vicove.vesti.bg/';
                $('<div class="toShow' + id + ' slideFrame" >' + linkCat + '<span class="abv-vic newsCat">' + textCat + '</span><p class="newsCaption vic">' + arrayName[id].text + '</p> </div>').appendTo(this);
                $('#funLink').attr('href', textHref);
                $('#funLink').text(textLink);
                $('#funHeadLink').attr('href', textHref);
            } else if (arrayName[id].type && arrayName[id].type != "vic") {
                // var textCat = (arrayName[id].type!="game") ? 'Ð’Ð¸Ð´ÐµÐ¾' : 'Ð˜Ð³Ñ€Ð°';
                var textCat = (arrayName[id].type != "game") ? '' : 'Ð˜Ð³Ñ€Ð°';
                var linkCat = (arrayName[id].type != "game") ? '<a class="linkCat" href="https://vbox7.com" target="_blank">Vbox7.com</a>' : '<a class="linkCat" href="http://vgames.bg" target="_blank">Vgames.bg</a>';
                var textLink = (arrayName[id].type != "game") ? 'Vbox7.com' : 'Vgames.bg';
                var textHref = (arrayName[id].type != "game") ? 'https://vbox7.com' : 'http://vgames.bg';
                $('<div class="toShow' + id + ' slideFrame" >' + linkCat + '<a href="' + arrayName[id].url + '" target="_blank" class="icon ' + arrayName[id].type + '"></a><span class="newsCat">' + textCat + '</span><p class="newsCaption"><a href="' + arrayName[id].url + '" target="_blank">' + arrayName[id].text + '</a></p> <a href="' + arrayName[id].url + '" target="_blank"><img src="' + arrayName[id].img + '" alt="" width="260" height="180"/></a></div>').appendTo(this);
                $('#funLink').attr('href', textHref);
                $('#funLink').text(textLink);
                $('#funHeadLink').attr('href', textHref);
            } else {
                var paid = "";
                var titlepaid = "";
                if (arrayName[id].paid == "yes") {
                    paid = "&nbsp;<img style='border:none' alt='ÐŸÐ»Ð°Ñ‚ÐµÐ½Ð° Ð¿ÑƒÐ±Ð»Ð¸ÐºÐ°Ñ†Ð¸Ñ' src='https://img.abv.bg/AbvProductAds/pp_icon.gif' />";
                    titlepaid = 'title="ÐŸÐ»Ð°Ñ‚ÐµÐ½Ð° Ð¿ÑƒÐ±Ð»Ð¸ÐºÐ°Ñ†Ð¸Ñ"';

                }

                $('<div class="toShow' + id + ' slideFrame" ><p class="newsCaption"><a href="' + arrayName[id].url + '" ' + titlepaid + ' target="_blank">' + arrayName[id].text + paid + '</a></p> <a href="' + arrayName[id].url + '" target="_blank"><img src="' + arrayName[id].img + '" alt="" width="260" height="180"/></a></div>').appendTo(this);
            }

        };

        $this.number = arrayName.length - 1;

        $this.slr = function () {

            oldCurr = curr;
            options1 = {
                direction: "left"
            };
            options2 = {
                direction: "right"
            };
            if (curr < $this.number)
                curr += 1;
            else curr = 0;

            $this.setPoint(curr);

            $this.printD(curr, arrayName);

            $this.find('.toShow' + oldCurr).hide('slide', options1, 700, function () {
                $(this).remove();
            });
            $this.find('.toShow' + curr).effect('slide', options2, 700, function () {
                $('#' + eid + '').next().next().find('button:eq(1)').removeAttr('disabled');
            });
        }

        $this.sll = function () {

            oldCurr = curr;
            options1 = {
                direction: "left"
            };
            options2 = {
                direction: "right"
            };
            if (curr > 0)
                curr -= 1;
            else curr = $this.number;
            $this.setPoint(curr);

            $this.printD(curr, arrayName);
            $this.find('.toShow' + oldCurr).hide('slide', options2, 700, function () {
                $(this).remove();
            });
            $this.find('.toShow' + curr).effect('slide', options1, 700, function () {
                $('#' + eid + '').next().next().find('button:eq(0)').removeAttr('disabled');
            });
        }

        $this.setPoint = function (curr) {
            $(this).next().find('a').removeClass('active');
            $(this).next().find('a:eq(' + curr + ')').addClass('active');

        }

        $(this).next().find('a').click(function () {
            $(this).parent().find('a').removeClass('active');
            $(this).addClass('active');
            if ($(this).index() != curr) {
                if ($(this).index() < curr) {
                    options1 = {
                        direction: "left"
                    };
                    options2 = {
                        direction: "right"
                    };
                } else {
                    options1 = {
                        direction: "right"
                    };
                    options2 = {
                        direction: "left"
                    };
                }
                oldCurr = curr;
                curr = $(this).index();

                $this.printD(curr, arrayName);
                $this.find('.toShow' + oldCurr).hide('slide', options2, 700, function () {
                    $(this).remove();
                });
                $this.find('.toShow' + curr).effect('slide', options1, 700);

            }
        });


        $(this).next().next().find('button:eq(0)').addClass('found');
        $(this).next().next().find('button:eq(1)').addClass('found');
        $(this).next().next().find('button:eq(0)').on('click', function () {
            $this.sll();
            $(this).attr('disabled', 'disabled');
        });
        $(this).next().next().find('button:eq(1)').on('click', function () {
            $this.slr();
            $(this).attr('disabled', 'disabled');
        });
        $this.printD(randomSlide, arrayName);
        $(this).next().find('a:eq(' + randomSlide + ')').addClass('active');


    });



}
/*\Abv slider plugin*/

$(function () {
    /*sort blocks initialization*/
    $(".column").sortable({
        connectWith: ".column",
        handle: ".targetholder",
        update: function (event, ui) {
            var orderleft = $('.column.left').sortable('toArray').join('');
            var orderright = $('.column.right').sortable('toArray').join('');
            var cookieString = "l" + orderleft + "r" + orderright;
            $.cookie("block_pos", cookieString, {
                expires: daysofexpire,
                path: '/',
                domain: '.abv.bg'
            });
            $('#rsHolder').show();
        }
    });
    /*\sort blocks initialization*/
    /*input selection*/
    $('.column *').not(':has(input)').not('input').disableSelection();
    /*\input selection*/
    $('#username').focus();


    /*reset line close*/
    $('#rsHolder .close').click(function () {
        $('#rsHolder').hide();
    });
    /*\reset line close*/
    /*reset line click*/
    $('#rsHolder #resetSettings').click(function () {
        var cVal = $.cookie('block_pos');
        $.cookie("block_pos", cVal, {
            expires: -1,
            path: '/',
            domain: '.abv.bg'
        });
        window.location.reload();
    });
    /*reset line click*/

});

/*Fasha*/

function fasha() {

    if ($.browser.chrome && $.browser.version >= 13 && !$.cookie('chrome_extension') && !chrome.app.isInstalled) {

        $('.fasha .close').on('click', function () {
            $.cookie('chrome_extension', 1, {
                expires: 180,
                path: '/',
                domain: '.abv.bg'
            });
        });
        $('#chromeExt').show();
        $('#chromeExt .addon').on('click', function () {

            chrome.webstore.install();
            $('#chromeExt').remove();
            $.cookie('chrome_extension', 1, {
                expires: 730,
                path: '/',
                domain: '.abv.bg'
            });

        });
    } else if ($.browser.msie && $.browser.version >= 6 && !$.cookie('ie_extension')) {
        $('#explorerAddfav').show();
        $('.fasha .close').on('click', function () {
            $.cookie('ie_extension', 1, {
                expires: 180,
                path: '/',
                domain: '.abv.bg'
            });
        })
        $('#explorerAddfav .moreinfo').on('click', function () {
            document.body.style.behavior = 'url(#default#homepage)';
            document.body.setHomePage('https://www.abv.bg');
            $.cookie('ie_extension', 1, {
                expires: 730,
                path: '/',
                domain: '.abv.bg'
            });
            $(this).parent().parent().remove();
        });
    } else if ($.browser.firefox && !$.cookie('ff_extension')) {
        $('#ffExt').show();
        $('.fasha .close').on('click', function () {
            $.cookie('ff_extension', 1, {
                expires: 180,
                path: '/',
                domain: '.abv.bg'
            });
        });
    }

    $('.fasha .close').on('click', function () {
        $(this).parent().remove();
    });

}

$(fasha);

/*\Fasha*/

function selectAdNews(id, url) {
    var o;

    $('.newsLinks a[data-id]').each(function () {

        if (id == $(this).data('id')) {
            newsImages.splice(3, 0, newsImages[$(this).index()]);
            newsImages.splice($(this).index() + 1, 1);

            $(this).attr('href', url + $(this).attr('href'));
            o = $(this).detach();
        }

    });

    if (o) $('.newsLinks a[data-id]:eq(2)').after(o);

}

function selectAdGong(id, url) {
    var o, img, arr = sportImages;

    $('.sportLinks a[title="ÐŸÐ»Ð°Ñ‚ÐµÐ½Ð° Ð¿ÑƒÐ±Ð»Ð¸ÐºÐ°Ñ†Ð¸Ñ"]').each(function () {

        var data = $(this).data(),
            ta = $(this).attr('href').split('-');

        if (!data.id)
            data.id = ta[ta.length - 1];

        if (id.toString() == $(this).data('id')) {
            arr.splice(3, 0, arr[$(this).index()]);
            arr.splice($(this).index() + 1, 1);

            if (url) $(this).attr('href', url + $(this).attr('href'));

            o = $(this).detach();
        }

    });

    if (o) $('.sportLinks a:eq(2)').after(o);

}

function selectAdEdna(id, url) {

    if (typeof Array.prototype.move == 'undefined')
        Array.prototype.move = function (from, to) {
            this.splice(to, 0, this.splice(from, 1)[0]);
        };

    var i = 0;

    for (var x = 0; x <= ednaList.length - 1; x++) {
        var a = ednaList[x].url.split('-');
        if (a[a.length - 1] == id) {
            if (url) ednaList[i].url = url + ednaList[i].url;
            ednaList.move(i, 0);
            break;
        }
        i++;
    }

    slideReInit();

    function slideReInit() {

        $('#ednaControls a.active').removeClass();
        $.cookie("ednapaid", '', {
            expires: -1
        });
        $('#ednaShow').html('');
        $('#ednaShow').next().next().find('button:eq(0)').unbind('click');
        $('#ednaShow').next().next().find('button:eq(1)').unbind('click');
        $('#ednaControls a').unbind('click');
        $('#ednaShow').abvSlider();

    }

}

/* form validation check */

function loginFormValidation(d) {
    var form = d.querySelector('#loginForm'),
        s = form.querySelector('input[type=submit]');

    form.addEventListener("submit", function (e) {
        e = e ? e : window.event;
        if (!form.querySelector('input[type=text]').value.length || !form.querySelector('input[type=password]').value.length) {
            e.preventDefault();
            e.stopPropagation();
            console.log('ÐÐµ ÑÑ‚Ðµ Ð²ÑŠÐ²ÐµÐ»Ð¸ Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¸Ñ‚ÐµÐ» Ð¸Ð»Ð¸ Ð¿Ð°Ñ€Ð¾Ð»Ð°!');
        }
    });

}

$(function () {
    loginFormValidation(document);
});

/* form validation check end */

/* md5 */

var $md5 = function (string) {
    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x, y, z) {
        return (x & y) | ((~x) & z);
    }

    function G(x, y, z) {
        return (x & z) | (y & (~z));
    }

    function H(x, y, z) {
        return (x ^ y ^ z);
    }

    function I(x, y, z) {
        return (y ^ (x | (~z)));
    }

    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    function WordToHex(lValue) {
        var WordToHexValue = "",
            WordToHexValue_temp = "",
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
    var S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
    var S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
    var S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;
    string = Utf8Encode(string);
    x = ConvertToWordArray(string);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }
    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    return temp.toLowerCase();
}

if ($.cookie('hFyuTdd'))
    $.cookie('hFyuTdd', '', {
        expires: -1
    });

if ($.cookie('_h'))
    $.cookie('_h', $.cookie('_h'), {
        expires: 365,
        path: '/',
        domain: '.abv.bg'
    });
else
    $.cookie('_h', $md5(((new Date).getTime() + (navigator.userAgent)).replace(/\s+/gi, '')), {
        expires: 365,
        path: '/',
        domain: '.abv.bg'
    });

/* md5 end */

/* Gemius counter 
  (C)2000-2018 Gemius SA - gemiusPrism  / abv.bg/Home Page
*/
var _GID_ = 'pyM6ETuay1axb8mosdTjz6R..KfGoHBcgod0mxirr8X.07';
/* Gemius counter end */

/* test page fix */

if (/abvnew/g.test(location)) {
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'text html',
        url: "https://bimg.abv.bg/a/abv_index.php",
        crossDomain: true,
        success: function (data) {
            for (var x = 1; x < 5; x++) {
                $('body')
                    .append(
                        $('<script />')
                            .text(
                                $(data)
                                    .find('#' + x + ' script')
                                    .text()
                            )
                    );
                $('#' + x).html($(data).find('#' + x).html());
            }
        }
    }).done(function () {
        blocksIniti();
        $('#funShow').abvSlider();
    });
} else {
    // Sliders initialization
    $(function () {
        $('#funShow').abvSlider();
    });
}


/*Sliders initialization
$(function () {
    $('#funShow').abvSlider();
});*/
/*\Sliders initialization*/


/*Counters*/
function makeClick(bannerID) {
    $('#countPx').attr('src', 'https://a.abv.bg/www/delivery/lg.php?zoneid=63&bannerid=' + bannerID);
}

$(function () {
    $('#toplinks .left a:eq(0)').click(function () {
        makeClick(172614);
    });
    $('#toplinks .left a:eq(1)').click(function () {
        makeClick(172615);
    });
    $('#mobileVersion').click(function () {
        makeClick(172616);
    });
    $('#toplinks .right').click(function () {
        makeClick(172617);
    });
    $('#loginForm a:eq(1)').click(function () {
        makeClick(172618);
    });
    $('#loginForm a:eq(0)').click(function () {
        makeClick(172619);
    });
    $('section header a:eq(0)').click(function () {
        makeClick(172620);

    });
    $('section header a:eq(1)').click(function () {
        makeClick(172621);

    });
    $('section header a:eq(2)').click(function () {
        makeClick(172622);

    });
    $('section header a:eq(3)').click(function () {
        makeClick(172627);

    });
    $('section header a:eq(4)').click(function () {
        makeClick(172628);

    });
    $('section header a:eq(5)').click(function () {
        makeClick(172629);

    });
    $('section header a:eq(6)').click(function () {
        makeClick(172634);

    });
    $('section header a:eq(7)').click(function () {
        makeClick(172635);

    });
    $('section header a:eq(8)').click(function () {
        makeClick(172641);

    });
    $('section header a:eq(9)').click(function () {
        makeClick(172642);

    });
    $('section header a:eq(10)').click(function () {
        makeClick(172648);

    });
    $('section header a:eq(11)').click(function () {
        makeClick(172649);

    });
    $('section header a:eq(12)').click(function () {
        makeClick(172653);

    });
    $('section header a:eq(13)').click(function () {
        makeClick(172654);

    });
    $('section header a:eq(14)').click(function () {
        makeClick(172658);

    });
    $('section header a:eq(15)').click(function () {
        makeClick(172659);

    });

    $('#funShow .toShow1 a:eq(1),#funShow .toShow1 a:eq(2),#funShow .toShow1 a:eq(3)').on('click', function () {
        makeClick(172644);

    });
    $('#funShow .toShow2 a:eq(1),#funShow .toShow2 a:eq(2),#funShow .toShow2 a:eq(3)').on('click', function () {
        makeClick(172645);

    });
    $('#funShow .toShow3 a:eq(1),#funShow .toShow3 a:eq(2),#funShow .toShow3 a:eq(3)').on('click', function () {
        makeClick(172646);

    });
    $('#funShow .toShow4 a:eq(1),#funShow .toShow4 a:eq(2),#funShow .toShow4 a:eq(3)').on('click', function () {
        makeClick(172647);

    });
    $('#pariteniLinks a:eq(0)').click(function () {
        makeClick(172655);

    });
    $('#pariteniLinks a:eq(1)').click(function () {
        makeClick(172656);

    });
    $('#pariteniLinks a:eq(2)').click(function () {
        makeClick(172657);

    });

    $('#sinoptikLink').on('click', function () {
        makeClick(172650);

    });
    $('#sinoptikLinkToday').on('click', function () {
        makeClick(172651);

    });
    $('#sinoptikLinkTomorrow').on('click', function () {
        makeClick(172652);

    });

    $('#astroContent #infoHolder .image').on('click', function () {
        makeClick(172660);

    });
    $('#astroContent .info .right').on('click', function () {
        makeClick(172661);

    });
    $('#newsImageHolder a').on('click', function () {
        makeClick($(this).attr('counter'));

    });

    $('.newsLinks a:eq(0),#newsImageHolder a').attr('counter', '172623');
    $('.newsLinks a:eq(1)').attr('counter', '172624');
    $('.newsLinks a:eq(2)').attr('counter', '172625');
    $('.newsLinks a:eq(3)').attr('counter', '172626');
    $('.newsLinks a:eq(0)').on('click', function () {
        makeClick(172623);
    });
    $('.newsLinks a:eq(1)').on('click', function () {
        makeClick(172624);
    });
    $('.newsLinks a:eq(2)').on('click', function () {
        makeClick(172625);
    });
    $('.newsLinks a:eq(3)').on('click', function () {
        makeClick(172626);
    });

    $('#sportImageHolder a').on('click', function () {
        makeClick($(this).attr('counter'));
    });

    $('.sportLinks a:eq(0), #sportImageHolder a').attr('counter', '172630');
    $('.sportLinks a:eq(1)').attr('counter', '172631');
    $('.sportLinks a:eq(2)').attr('counter', '172632');
    $('.sportLinks a:eq(3)').attr('counter', '172633');
    $('.sportLinks a:eq(0)').on('click', function () {
        makeClick(172630);
    });
    $('.sportLinks a:eq(1)').on('click', function () {
        makeClick(172631);
    });
    $('.sportLinks a:eq(2)').on('click', function () {
        makeClick(172632);
    });
    $('.sportLinks a:eq(3)').on('click', function () {
        makeClick(172633);
    });
    $('#sinoptik .info a').click(function () {
        makeClick(173206);
    });
    $('#currency .toprow a').click(function () {
        makeClick(173207);
    });

    var ednaBlockClicks = [172636, 172637, 172638, 172639, 172640];

    for (var x in ednaBlockClicks)
        $('.ednaLinks a:eq(' + x + ')').attr('data-counter', ednaBlockClicks[x]);

    $('#ednaImageHolder a').attr('data-counter', ednaBlockClicks[0]);

});

/*\Counters*/