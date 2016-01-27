(function() {
  var eventsApp;

  angular.module('ngLocale', [], [
    '$provide', function($provide) {
      var PLURAL_CATEGORY;
      PLURAL_CATEGORY = {
        ZERO: 'zero',
        ONE: 'one',
        TWO: 'two',
        FEW: 'few',
        MANY: 'many',
        OTHER: 'other'
      };
      $provide.value('$locale', {
        'NUMBER_FORMATS': {
          'DECIMAL_SEP': '.',
          'GROUP_SEP': ',',
          'PATTERNS': [
            {
              'minInt': 1,
              'minFrac': 0,
              'macFrac': 0,
              'posPre': '',
              'posSuf': '',
              'negPre': '-',
              'negSuf': '',
              'gSize': 3,
              'lgSize': 3,
              'maxFrac': 3
            }, {
              'minInt': 1,
              'minFrac': 2,
              'macFrac': 0,
              'posPre': '¤',
              'posSuf': '',
              'negPre': '¤-',
              'negSuf': '',
              'gSize': 3,
              'lgSize': 3,
              'maxFrac': 2
            }
          ],
          'CURRENCY_SYM': '¥'
        },
        'pluralCat': function(n) {
          return PLURAL_CATEGORY.OTHER;
        },
        'DATETIME_FORMATS': {
          'MONTH': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          'SHORTMONTH': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          'DAY': ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
          'SHORTDAY': ['日', '月', '火', '水', '木', '金', '土'],
          'AMPMS': ['午前', '午後'],
          'medium': 'yyyy/MM/dd H:mm:ss',
          'short': 'yy/MM/dd H:mm',
          'fullDate': 'y年M月d日EEEE',
          'longDate': 'y年M月d日',
          'mediumDate': 'yyyy/MM/dd',
          'shortDate': 'yy/MM/dd',
          'mediumTime': 'H:mm:ss',
          'shortTime': 'H:mm',
          'id': 'ja-jp'
        }
      });
    }
  ]);

  eventsApp = angular.module('eventsApp', ['ui.bootstrap', 'ngAnimate']).controller('get_events', [
    '$scope', '$http', '$window', function($scope, $http, $window) {
      var addInfo, adjust, allCloseInfoWindow, allOpenInfoWindow, circles, commercialInfo, deleteInfo, error, getComments, infoWindows, latitude, longitude, makeCircle, makeGoogleMap, makeMarker, map, markerYoshida, markers, radius, radiusChanged, resetInfo, setLat, setLng, setRad, success, tags;
      radius = 0;
      markerYoshida = null;
      $window.start_date = new Date;
      $window.end_date = new Date;
      tags = "";
      latitude = 0.0;
      longitude = 0.0;
      infoWindows = [];
      markers = [];
      circles = [];
      map = null;
      allCloseInfoWindow = function() {
        var i;
        i = 0;
        while (i < infoWindows.length) {
          infoWindows[i].close();
          i++;
        }
      };
      allOpenInfoWindow = function() {
        var i, _results;
        i = 0;
        _results = [];
        while (i < infoWindows.length) {
          infoWindows[i].open(map, markers[i]);
          _results.push(i++);
        }
        return _results;
      };
      window.onload = function() {
        initialize();
        adjust();
      };
      $(window).resize(function() {
        return adjust();
      });
      adjust = function() {
        var buttonSize, co, height, w;
        co = $(".container");
        w = co.outerWidth() - co.width();
        height = $(window).height();
        buttonSize = $('.btn').outerHeight();
        $("#map_canvas").height(height);
        $("#map_canvas").width(co.width - w);
        $("#map_canvas").height(height - buttonSize);
      };
      addInfo = function(data) {
        var info, infoWindow, infoWindowOption, marker, title, wid;
        title = '<div class="link-color"  data-toggle="modal" data-target="#myModal" onclick="$(\'#event_id\').val(' + (data.id + " ") + ');view_detail();$(\'.modal-title\').text(\'' + data.title + '\');">' + data.title + "</div>";
        info = "<div>" + title + "</div>";
        marker = new google.maps.Marker({
          map: map,
          position: new google.maps.LatLng(data.lat, data.lng),
          event_id: data.id,
          event_title: data.title
        });
        markers.push(marker);
        wid = $(window).width();
        infoWindowOption = {
          position: new google.maps.LatLng(data.lat, data.lng),
          maxWidth: wid / 2,
          disableAutoPan: true,
          content: info
        };
        infoWindow = new google.maps.InfoWindow(infoWindowOption);
        infoWindow.open(map);
        infoWindows.push(infoWindow);
        google.maps.event.addListener(marker, "click", function(e) {
          infoWindow.open(map, this);
          $('event_id').val(marker.event_id);
        });
      };
      commercialInfo = function() {
        var height, img_width, opt, window_width;
        window_width = $('#map_canvas').width() * 0.8;
        img_width = window_width * 0.8;
        height = $('#map_canvas').height() * 0.8;
        opt = 'style="max-width:' + (img_width + "px") + '"';
        $.getJSON("/eventer/commercials/1.json", function(data) {
          var img, infoWindow, infoWindowOption;
          img = "<div style=\"overflow:hidden\"><a target=\"_blank\" href=\"" + data.url + "\" target=_blanc>" + ("<img " + opt + " src=\"/eventer") + data.image_path + "\"></a></div>";
          infoWindowOption = {
            position: new google.maps.LatLng(data.lat, data.lng),
            maxWidth: window_width,
            maxHeight: height,
            disableAutoPan: true,
            zIndex: 99999,
            content: img
          };
          infoWindow = new google.maps.InfoWindow(infoWindowOption);
          infoWindow.open(map);
        });
      };
      getComments = function(lat, lng, rad, startDate, endDate, tags) {
        return $.getJSON("/eventer/events/comment.json", {
          lat: lat,
          lng: lng,
          rad: rad,
          start_date: startDate,
          end_date: endDate,
          tags: tags
        }, function(data) {
          var i;
          $window.datas = data;
          i = 0;
          while (i < data.length) {
            addInfo(data[i]);
            i++;
          }
          allCloseInfoWindow();
        });
      };
      makeCircle = function(lat, lng, rad) {
        var circle, myplaceOptions;
        myplaceOptions = {
          strokeColor: "#0000FF",
          strokeOpacity: 0.0,
          stokeWeight: 1,
          fillColor: "#0000FF",
          fillOpacity: 0.35,
          map: map,
          center: new google.maps.LatLng(lat, lng),
          radius: rad
        };
        circle = new google.maps.Circle(myplaceOptions);
        return circles.push(circle);
      };
      radiusChanged = function(obj) {
        var v;
        v = obj[obj.selectedIndex].value;
        radius(v);
        return resetInfo();
      };
      makeMarker = function(lat, lng) {
        var icon;
        icon = new google.maps.MarkerImage("/eventer/benkei.png", new google.maps.Size(64, 64), new google.maps.Point(0, 0), new google.maps.Point(64, 64), new google.maps.Size(64, 64));
        if (markerYoshida) {
          markerYoshida.setMap(null);
        }
        markerYoshida = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          icon: icon,
          draggable: true,
          zIndex: 9999999
        });
        markerYoshida.setMap(map);
        return google.maps.event.addListener(markerYoshida, "dragend", function(event) {
          setLat(markerYoshida.getPosition().lat());
          setLng(markerYoshida.getPosition().lng());
          resetInfo();
        });
      };
      resetInfo = function() {
        var lat, lng, rad, radkm;
        deleteInfo();
        lat = latitude;
        lng = longitude;
        rad = radius * 1000;
        radkm = radius;
        makeCircle(lat, lng, rad);
        return getComments(lat, lng, radkm, $window.start_date, $window.end_date, tags);
      };
      deleteInfo = function() {
        var i;
        i = 0;
        while (i < markers.length) {
          markers[i].setMap(null);
          i++;
        }
        i = 0;
        while (i < infoWindows.length) {
          infoWindows[i].close();
          i++;
        }
        i = 0;
        while (i < circles.length) {
          circles[i].setMap(null);
          i++;
        }
        markers = [];
        infoWindows = [];
        circles = [];
      };
      success = function(position) {
        var lat, lng, rad;
        console.log("success");
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        rad = radius;
        if (rad === 0) {
          rad = 3;
        }
        setLat(lat);
        setLng(lng);
        setRad(rad);
        makeGoogleMap(lat, lng);
        commercialInfo();
        makeCircle(lat, lng, rad * 1000);
        makeMarker(lat, lng);
        return getComments(lat, lng, rad, $window.start_date, $window.end_date, "");
      };
      error = function() {
        var lat, lng, rad;
        console.log("error");
        lat = 35.468182;
        lng = 133.048593;
        rad = radius;
        if (rad === 0) {
          rad = 5;
        }
        setLat(lat);
        setLng(lng);
        setRad(rad);
        makeGoogleMap(lat, lng);
        commercialInfo();
        makeCircle(lat, lng, rad * 1000);
        makeMarker(lat, lng);
        rad = radius;
        return getComments(lat, lng, rad, $window.start_date, $window.end_date, "");
      };
      setLat = function(l) {
        return latitude = Number(l);
      };
      setLng = function(l) {
        return longitude = Number(l);
      };
      setRad = function(r) {
        return radius = Number(r);
      };
      $window.initialize = function() {
        var geo;
        markerYoshida = null;
        if (window.google && google.gears) {
          geo = google.gears.factory.create("beta.geolocation");
          geo.getCurrentPosition(success, error);
        } else if (navigator.geolocation) {
          error();
        } else {
          alert("位置情報取得を有効にしてください。");
        }
      };
      makeGoogleMap = function(lat, lng) {
        var mapOptions;
        mapOptions = {
          center: new google.maps.LatLng(lat, lng),
          zoom: 12,
          scrollwheel: false,
          streetViewControl: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        return map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
      };
      $scope.events = [];
      $http.get('/eventer/events/map').success(function(data, status) {
        return $scope.events = data;
      });
      $scope.send = function() {
        var event_id;
        event_id = $('#event_id').val();
        return $http({
          url: '/eventer/comments',
          method: 'POST',
          data: {
            value: $scope.comment,
            event_id: event_id
          }
        }).success(function(data, status) {
          return $scope.status = '投稿完了！';
        }).error(function(data, staus) {
          return console.log("commnets error");
        });
      };
      $scope.close = function() {
        $scope.status = null;
        $scope.comment = null;
        return $scope.detail_view = false;
      };
      $scope.viewListModal = function() {
        $scope.list_events = $window.datas;
        $('#listModalLabel').text('一覧');
        return console.log($scope.list_events);
      };
      $scope.view_detail = function(event_id) {
        return view_detail(event_id);
      };
      $window.view_detail = function(event_id) {
        if (!event_id) {
          event_id = $('#event_id').val();
        } else {
          $('#event_id').val(event_id);
        }
        return $http({
          url: '/eventer/events/' + event_id.toString() + ".json",
          method: 'get'
        }).success(function(data, status) {
          $scope.event = data;
          $('.modal-title').text(data.title);
          return $scope.detail_view = true;
        }).error(function(data, staus) {
          return console.log("events error");
        });
      };
      $scope.tags = [];
      $http.get('/eventer/tag_collections/get_all_tag').success(function(data, status) {
        var d, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          d = data[_i];
          _results.push($scope.tags.push({
            id: d.id,
            name: d.name
          }));
        }
        return _results;
      });
      $scope.filter = function() {
        var e, ej, message, rad, s, sj, t, _i, _len, _ref;
        tags = [];
        _ref = $('.tags');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          t = _ref[_i];
          if (t.checked) {
            tags.push(t.name);
          }
        }
        if ($window.end_date < $window.start_date) {
          e = $window.end_date;
          s = $window.start_date;
          sj = (s.getFullYear()) + "年 " + (s.getMonth() + 1) + "月 " + (s.getDate()) + "日";
          ej = (e.getFullYear()) + "年 " + (e.getMonth() + 1) + "月 " + (e.getDate()) + "日";
          message = "開始日が終了日の後になっています。\n" + ej + "〜" + sj + "の期間で検索します。";
          alert(message);
        }
        rad = $scope.radius;
        if (rad) {
          setRad(rad);
          if (rad === 0.2) {
            map.setZoom(15);
          } else if (rad === 0.5) {
            map.setZoom(14);
          } else if (rad === 1) {
            map.setZoom(13);
          } else if (rad === 3) {
            map.setZoom(12);
          } else if (rad === 5) {
            map.setZoom(11);
          } else if (rad === 10) {
            map.setZoom(10);
          }
        } else {
          setRad(3);
          map.setZoom(12);
        }
        return resetInfo();
      };
      return $scope.resetPosition = function() {
        var lat, lng;
        deleteInfo();
        lat = latitude;
        lng = longitude;
        return makeMarker(lat, lng);
      };
    }
  ]).controller('datepicker', [
    '$scope', '$http', '$window', function($scope, $http, $window) {
      var nextdate;
      $scope.startdt = new Date();
      nextdate = new Date();
      nextdate.setDate(nextdate.getDate() + 8);
      $scope.enddt = nextdate;
      $window.end_date = nextdate;
      $scope.today = function() {
        return $scope.dt = new Date();
      };
      $scope.clear = function() {
        return $scope.dt = null;
      };
      $scope.disabled = function(date, mode) {
        return mode === "day" && (date.getDay() === 0 || date.getDay() === 6);
      };
      $scope.toggleMin = function() {
        return $scope.minDate = ($scope.minDate ? null : new Date());
      };
      $scope.toggleMin();
      $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
      };
      $scope.dateOptions = {
        formatYear: "yy",
        startingDay: 0
      };
      $scope.format = "yyyy/MM/dd";
      return $scope.$watchCollection('[startdt,enddt]', function(newValue, oldValue) {
        if (newValue[0] !== oldValue[0]) {
          $window.start_date = newValue[0];
        }
        if (newValue[1] !== oldValue[1]) {
          return $window.end_date = newValue[1];
        }
      });
    }
  ]).config([
    'datepickerConfig', 'datepickerPopupConfig', 'timepickerConfig', function(datepickerConfig, datepickerPopupConfig, timepickerConfig) {
      datepickerConfig.showWeeks = false;
      datepickerConfig.formatDayTitle = 'yyyy年 MMMM';
      datepickerPopupConfig.currentText = '本日';
      datepickerPopupConfig.clearText = '消去';
      datepickerPopupConfig.closeText = '閉じる';
      datepickerConfig.dayNamesShort = ["1", "2", "3", "4", "5", "6", "7"];
      datepickerPopupConfig.toggleWeeksText = '週番号';
      timepickerConfig.showMeridian = false;
    }
  ]);

}).call(this);
