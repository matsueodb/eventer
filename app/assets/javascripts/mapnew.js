Marker = null;
map = null;
//window.onload = function(){
  //  initializenew();
//}
$(document).ready(function(){
    console.log('aaaa');
    initializenew();
});
function initializenew() {
    var mode = '';
    console.log('mapnew.js init');
    console.log($('#mode').html());
    if( $('#mode').html() == '編集'){
        mode = 'edit';
    }else if( $('#mode').html() == '表示'){
       mode = 'show'
    }else{
        if($('#event_title').val() != ''){
            mode = 'edit'
        }else{
            mode = 'new'
        }
    }
    if(mode == 'show' || mode == 'edit'){
        var latlng = new google.maps.LatLng($('#event_lat').val(), $('#event_lng').val());
    }else{
        var latlng = new google.maps.LatLng(35.468182, 133.048593);
    }

    var opts = {
        zoom: 12,
        scrollwheel: false,
        streetViewControl:false,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    //infoWindowを表示させない
    var set = google.maps.InfoWindow.prototype.set;
    google.maps.InfoWindow.prototype.set = function(key, val) {
        if (key === "map") {
            if (! this.get("noSupress")) {
                return;
            }
        }
        set.apply(this, arguments);
    }

    map = new google.maps.Map(document.getElementById("map_canvas_setting"),opts);
    Marker = new google.maps.Marker({
        position: latlng,
        draggable: true,
        map: map
    });
    if(mode == 'show'){
        Marker.draggable = false;
    }
    Marker.setMap(map);

    if(mode == 'new' || mode == 'edit'){
        google.maps.event.addListener(Marker,'dragend',
                                      function(event) {
                                          setLatLng(Marker.getPosition().lat(),Marker.getPosition().lng());
                                          geocode();});

        //地図クリックイベントの登録
        google.maps.event.addListener(map, 'click',
                                      function(event) {
                                          if (Marker){Marker.setMap(null)};
                                          Marker = new google.maps.Marker({
                                              position: event.latLng,
                                              draggable: true,
                                          map: map
                                          });
                                          setLatLng(Marker.getPosition().lat(),
                                                    Marker.getPosition().lng());
                                          geocode();
                                          //マーカードラッグイベントの登録
                                          google.maps.event.addListener(Marker,'dragend',
                                                                        function(event) {
                                                                            setLatLng(Marker.getPosition().lat(),Marker.getPosition().lng());
                                                                            geocode();
                                                                        })
                                      })

    //初期位置の表示
        geocode();
    }
    setLatLng(Marker.getPosition().lat(),
              Marker.getPosition().lng());

 };
function setLatLng(lat,lng){
    document.getElementById('event_lat').value = lat;
    document.getElementById('event_lng').value = lng;
};

function geocode(){
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'location': Marker.getPosition()},
                     function(results, status) {
                         if (status == google.maps.GeocoderStatus.OK && results[0]){
                             document.getElementById('event_address').value =
                                 results[0].formatted_address.replace(/^日本, /, '');
                         }else{
                             document.getElementById('event_address').value =
                                 "Geocode 取得に失敗しました";
                             alert("Geocode 取得に失敗しました reason: "
                                       + status);
                         }
                     });
}
function codeaddress(id_name) {
    if(id_name){
        var address = document.getElementById(id_name).value;
    }else{
        var address = document.getElementById("event_address").value;
    }
    console.log(address);
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            Marker.setPosition(results[0].geometry.location);
            var lat = results[0].geometry.location.lat();
            var lng = results[0].geometry.location.lng();
            setLatLng(lat,lng);
            geocode();
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}
