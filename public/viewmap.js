infoWindows = [];
markers = [];
circles = [];
window.onload = function(){
    console.log('onload');
    initialize();
}
//$(document).ready(function(){
//    console.log('aaa');
//    initialize();
//});
function filtering(){
    deleteInfo();
    var lat = getLatitude();
    var lng = getLongitude();
    var rad = getRadius();
    makeCircle(lat,lng,rad);
    var radkm = getRadius('km')
    filStartDate = $( "#startDate" ).datepicker( "getDate" );
    filEndDate = $( "#endDate" ).datepicker( "getDate" ) ;
    setStartDate(filStartDate);
    setEndDate(filEndDate);
    $.getJSON("/events/comment.json",{lat:lat,lng:lng,rad:radkm,start_date:filStartDate,end_date:filEndDate},function(data){
        for(var i=0;i<data.length;i++){
            addInfo(data[i]);
	}
    }).done(function(){
        tagFilter();
    });
}
function setStartDate(date){
    start_date = date
}
function getStartDate(date){
    if(start_date){
        return start_date;
    }else{
        return new Date();
    }
}
function setEndDate(date){
    end_date = date
}
function getEndDate(date){
    if(end_date){
        return end_date;
    }else{
        return new Date();
    }
}

function tagFilter(){
    for(var i=0;i < infoWindows.length;i++){
        infoWindows[i].close();
    }
    var tagfil = document.getElementsByClassName("tag_filter");
    for(var i=0; i < tagfil.length; i++){
        for(var j=0; j < infoWindows.length; j++){
            var tags = infoWindows[j].tags;
            for(var k=0;k<tags.length;k++){
                if( tags[k].tag_collection_id  == tagfil[i].id.replace("tags_","") ){
                    if(tagfil[i].checked == true){
                        infoWindows[j].open(map);
                    }
                }
            }
        }
    }
}

function jpDate(date)
{
    var d = new Date(date);
    var ye = String(d.getFullYear());
    var mo = String(d.getMonth() + 1);
    var da = String(d.getDate());
    var we = String(d.getDay());
    var wNames = ['日', '月', '火', '水', '木', '金', '土'];
    return ye+"/"+mo+"/"+da+"("+wNames[we]+")"
}
function addInfo(data){
    var c = "";
    for(var i=0;i<data.comment.length;i++){
        c += '・' + data.comment[i].value + '<br>';
    }
    var t = "";
    if(data.tag_id){
        for(var i=0;i<data.tag_id.length;i++){
            t += '・' + data.tag[i].value + '<br>';
        }
    }

    var title = '<div class="title">'+data.title+'</div>';
    var tags = '<div class="tags">'+t+'</div>';
    var summary = '<div class="summary">'+data.summary+'</div>';
    var place_name = '<div class="place_name">'+data.place_name+'</div>';
    var address = '<div class="address">'+data.address+'</div>';
    if(data.start_date == data.end_date){
        var term = '<div class="term">'+jpDate(data.start_date) +'</div>';
    }else{
        var term = '<div class="term">'+jpDate(data.start_date) +'-'+ jpDate(data.end_date) +'</div>';
    }
    var comments = '<div class="comment">'+c+'</div>';
    var buttons = '<div><input type="button" value="詳細" onClick="detail('+String(data.id)+')"></div>';

    var info = '<div class="infoWindow">' + title + tags + summary + place_name + address + term + comments + buttons +'</div>';

    var marker = new google.maps.Marker({
        map : map,
	position : new google.maps.LatLng(data.lat, data.lng),
        event_id : data.id,
        event_title: data.title
    });

    markers.push(marker);
    var infoWindowOption = {
	position : new google.maps.LatLng(data.lat, data.lng),
        tags : data.tags,
        startDate: data.start_date,
        endDate: data.end_date,
        maxWidth: 200,
        disableAutoPan: true,
        content : info
    }
    var infoWindow = new google.maps.InfoWindow(infoWindowOption);
    infoWindow.open(map);
    infoWindows.push(infoWindow);
    google.maps.event.addListener(marker, "click", function (e) {
        infoWindow.open(map, this);
        document.getElementById('comment_event_id').value = marker.event_id;
    });
}

function commercialInfo(){
    $.getJSON("/commercials/1.json",function(data){
        var img = '<a href="'+data.url + '" target=_blanc>'
            +'<img width="300px" height="200px" src="'
            + data.image_path + '"></a>'

        var infoWindowOption = {
	    position : new google.maps.LatLng(data.lat, data.lng),
            maxWidth: 300,
            maxHeight: 200,
            disableAutoPan: true,
            zIndex: 99999,
            content: img
        }
        var infoWindow = new google.maps.InfoWindow(infoWindowOption);
        infoWindow.open(map);
    });
}
$(window).resize(function() {
    var co = $('.container');
    var lpad = co.css('padding-left');
    var rpad = co.css('padding-right');
    console.log(co.outerWidth());
    var width = co.width() - (lpad+rpad);
    var height = $(window).height();
    console.log(co.width());
    console.log("aaaa");
    console.log(width);
    $('#map_canvas').width($('.container').width() - 30);
    $('#map_canvas').height(height - 100);
});
function initialize(){
    markerYoshida=null;
//    error();
    $('#map_canvas').height(300);

    var w =  $('.container').width();
    console.log(w);
    $('#map_canvas').width(w-30);
    console.log('init');
    console.log($('#map_canvas').height());
    if(window.google && google.gears) {
        console.log('if');
        var geo = google.gears.factory.create('beta.geolocation');

        geo.getCurrentPosition(success, error);
    }
    else if(navigator.geolocation) {
        console.log('elseif');
        navigator.geolocation.getCurrentPosition(
	    success,error
        )
    }
    else {
        alert("no geo found");
    }
    ;
}

function setLatitude(lat){
    latitude = Number(lat);
}
function getLatitude(){
    if(latitude){
        return latitude;
    }else{
        return 0;
    }
}

function setLongitude(lng){
    longitude = Number(lng);
}
function getLongitude(){
    if(longitude){
        return longitude;
    }else{
        return 0;
    }
}
function setRadius(rad){//meter
    radius = Number(rad);
}
function getRadius(km){//returen kilo meter if km is ture
    if(radius){
        if(km){
            return radius/1000;
        }else{
            return radius;
        }
    }else{
        return 0;
    }
}

function sendComment(){
    $.post('/comments',{comment:{event_id:'1',name:"comment[value]", value:"test"}},function(data){
        console.log(data);
    });
}
function getComments(lat,lng,rad,startDate,endDate){//rad is kilo meter
    $.getJSON("/events/comment.json",{lat:lat,lng:lng,rad:rad,start_date:startDate,end_date:endDate},function(data){
        for(var i=0;i<data.length;i++){
            addInfo(data[i]);
	}
    });
}
function success(position){
    console.log("success");

    var lat = position.coords.latitude;
    var lng =  position.coords.longitude;
    var rad = Number($('#radius').val());
    setLatitude(lat);
    setLongitude(lng);
    setRadius(rad);


    makeGoogleMap(lat,lng);
    commercialInfo();
    makeCircle(lat,lng,rad);
    rad=getRadius('km');
 //   getComments(lat,lng,rad,sdate,edate);

}

function error(){
    console.log("error");
    var lat = 35.468182;//Matsue City Office
    var lng = 133.048593;
    var rad = 5000;
    //var sdate =  $( "#startDate" ).datepicker('setDate',new Date );
    //var edate =  $( "#endDate" ).datepicker('setDate',new Date );
    var sdate = '2015/01/01';
    var edate = '2015/04/01';
    setLatitude(lat);
    setLongitude(lng);
    setRadius(rad);
    setStartDate(sdate);
    setEndDate(edate);
    makeGoogleMap(lat,lng);
    commercialInfo();
    makeCircle(lat,lng,rad);
    rad=getRadius('km');
    getComments(lat,lng,rad,sdate,edate);
}

function makeGoogleMap(lat,lng){
    var mapOptions = {
	center: new google.maps.LatLng(lat,lng),
	zoom: 12,
        scrollwheel: false,
        streetViewControl:true,
	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
}

function makeCircle(lat,lng,rad){
    var myplaceOptions={
	strokeColor: '#0000FF',
	strokeOpacity: 0.0,
	stokeWeight: 1,
	fillColor: '#0000FF',
	fillOpacity: 0.35,
	map: map,
	center: new google.maps.LatLng(lat, lng),
	radius: rad
    };
    circle = new google.maps.Circle(myplaceOptions);
    circles.push(circle);
}

function radiusChanged(obj){
    var v = obj[obj.selectedIndex].value;
    console.log(v);
    setRadius(v);
    resetInfo();
}

function makeMarker(lat,lng){
    if(markerYoshida){
        markerYoshida.setMap(null);
    }
    markerYoshida = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        icon: "/yoshida.png",
        draggable: true,
        zIndex: 9999999
    });
    markerYoshida.setMap(map);
    google.maps.event.addListener(markerYoshida,'dragend',function(event){
        setLatitude(markerYoshida.getPosition().lat());
        setLongitude(markerYoshida.getPosition().lng());
        resetInfo();
    });
}

function resetInfo(){
    deleteInfo();
    var lat = getLatitude();
    var lng = getLongitude();
    var rad = getRadius();
    var radkm = getRadius('km')
    var sdate = getStartDate();
    var edate = getEndDate();
    filtering();
   // makeCircle(lat,lng,rad);
   // getComments(lat,lng,radkm,sdate,edate);

}

function deleteInfo(){
    for(var i=0; i <markers.length; i++){
        markers[i].setMap(null);
    }
     for(var i=0; i <infoWindows.length; i++){
         infoWindows[i].close();
     }
     for(var i=0; i <circles.length; i++){
        circles[i].setMap(null);
     }
    markers = []
    infoWindows = []
    circles = []
}


function resetPosition(){
    deleteInfo();
    var lat = getLatitude();
    var lng = getLongitude();
    makeMarker(lat,lng);
}

function allCloseInfoWindow(){
    random = false;
    for(var i=0; i <infoWindows.length; i++){
        infoWindows[i].close();
    }
}
function allOpenInfoWindow(){
    random = false;
    for(var i=0; i <infoWindows.length; i++){
        infoWindows[i].open(map,markers[i]);
    }
}

function detail(id){
    var container = $('#container');
    var menu = $('#menu');
    var detail = $('#detail');
    detail.show();
    menu.hide();
    if (container.hasClass("visible")) {
        container.removeClass('visible').animate({'margin-left':'0px'});
    } else {
        container.addClass('visible').animate({'margin-left':'300px'});
    }

    $.getJSON("/events/"+id,function(data){
        var c = "";
        for(var i=0;i<data.comment.length;i++){
            c += '・' + data.comment[i].comment.value + '<br>';
        }
        var t = "";

        for(var i=0;i<data.tags.length;i++){
            t += '・' + data.tags[i].tag.name ;
        }

        var title = '<div class="title">'+data.title+'</div>';
        var tags = '<div class="tags"><b>Tag:</b>'+t+'</div>';
        var summary = '<dev class="summary"><b>概要：</b>'+data.summary+'</div>';
        var place_name = '<div class="place_name"><b>場所：</b>'+data.place_name+'</div>';
        var address = '<div class="address"><b>住所：</b>'+data.address+'</div>';
        if(data.start_date == data.end_date){
            var term = '<div class="term"><b>日付：</b>'+jpDate(data.start_date) +'</div>';
        }else{
            var term = '<div class="term"><b>期間：</b>'+jpDate(data.start_date) +'-'+ jpDate(data.end_date) +'</div>';
        }
        var comments = '<div class="comment"><b>コメント：</b>'+c+'</div>';
        var buttons = '<div><input type="button" value="詳細" onClick="detail('+String(data.id)+')"></div>';

        document.getElementById("comment_event_id").value = data.id;
        document.getElementById("detail_info").innerHTML = title + tags + summary + place_name + address + term + comments ;

    });
}
