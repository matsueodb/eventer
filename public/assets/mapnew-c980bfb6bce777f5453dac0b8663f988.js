function initializenew(){var e="";if(console.log("mapnew.js init"),console.log($("#mode").html()),e="\u7de8\u96c6"==$("#mode").html()?"edit":"\u8868\u793a"==$("#mode").html()?"show":""!=$("#event_title").val()?"edit":"new","show"==e||"edit"==e)var o=new google.maps.LatLng($("#event_lat").val(),$("#event_lng").val());else var o=new google.maps.LatLng(35.468182,133.048593);var t={zoom:12,scrollwheel:!1,streetViewControl:!1,center:o,mapTypeId:google.maps.MapTypeId.ROADMAP},a=google.maps.InfoWindow.prototype.set;google.maps.InfoWindow.prototype.set=function(e){("map"!==e||this.get("noSupress"))&&a.apply(this,arguments)},map=new google.maps.Map(document.getElementById("map_canvas_setting"),t),Marker=new google.maps.Marker({position:o,draggable:!0,map:map}),"show"==e&&(Marker.draggable=!1),Marker.setMap(map),("new"==e||"edit"==e)&&(google.maps.event.addListener(Marker,"dragend",function(){setLatLng(Marker.getPosition().lat(),Marker.getPosition().lng()),geocode()}),google.maps.event.addListener(map,"click",function(e){Marker&&Marker.setMap(null),Marker=new google.maps.Marker({position:e.latLng,draggable:!0,map:map}),setLatLng(Marker.getPosition().lat(),Marker.getPosition().lng()),geocode(),google.maps.event.addListener(Marker,"dragend",function(){setLatLng(Marker.getPosition().lat(),Marker.getPosition().lng()),geocode()})}),geocode()),setLatLng(Marker.getPosition().lat(),Marker.getPosition().lng())}function setLatLng(e,o){document.getElementById("event_lat").value=e,document.getElementById("event_lng").value=o}function geocode(){geocoder=new google.maps.Geocoder,geocoder.geocode({location:Marker.getPosition()},function(e,o){o==google.maps.GeocoderStatus.OK&&e[0]?document.getElementById("event_address").value=e[0].formatted_address.replace(/^\u65e5\u672c, /,""):(document.getElementById("event_address").value="Geocode \u53d6\u5f97\u306b\u5931\u6557\u3057\u307e\u3057\u305f",alert("Geocode \u53d6\u5f97\u306b\u5931\u6557\u3057\u307e\u3057\u305f reason: "+o))})}function codeaddress(e){if(e)var o=document.getElementById(e).value;else var o=document.getElementById("event_address").value;console.log(o),geocoder.geocode({address:o},function(e,o){if(o==google.maps.GeocoderStatus.OK){map.setCenter(e[0].geometry.location),Marker.setPosition(e[0].geometry.location);var t=e[0].geometry.location.lat(),a=e[0].geometry.location.lng();setLatLng(t,a),geocode()}else alert("Geocode was not successful for the following reason: "+o)})}Marker=null,map=null,$(document).ready(function(){console.log("aaaa"),initializenew()});