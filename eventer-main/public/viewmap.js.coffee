map = null
radius = 5000

#$(document).ready(function(){
#    console.log('aaa');
#    initialize();
#});
filtering = ->
  deleteInfo()
  lat = getLatitude()
  lng = getLongitude()
  rad = getRadius()
  makeCircle lat, lng, rad
  radkm = getRadius("km")
  filStartDate = $("#startDate").datepicker("getDate")
  filEndDate = $("#endDate").datepicker("getDate")
  setStartDate filStartDate
  setEndDate filEndDate
  $.getJSON("/events/comment.json",
    lat: lat
    lng: lng
    rad: radkm
    start_date: filStartDate
    end_date: filEndDate
  , (data) ->
    i = 0

    while i < data.length
      addInfo data[i]
      i++
    return
  ).done ->
    tagFilter()
    return

  return
setStartDate = (date) ->
  start_date = date
  return
getStartDate = (date) ->
  if start_date
    start_date
  else
    new Date()
setEndDate = (date) ->
  end_date = date
  return
getEndDate = (date) ->
  if end_date
    end_date
  else
    new Date()
tagFilter = ->
  i = 0

  while i < infoWindows.length
    infoWindows[i].close()
    i++
  tagfil = document.getElementsByClassName("tag_filter")
  i = 0

  while i < tagfil.length
    j = 0

    while j < infoWindows.length
      tags = infoWindows[j].tags
      k = 0

      while k < tags.length
        infoWindows[j].open map  if tagfil[i].checked is true  if tags[k].tag_collection_id is tagfil[i].id.replace("tags_", "")
        k++
      j++
    i++
  return
jpDate = (date) ->
  d = new Date(date)
  ye = String(d.getFullYear())
  mo = String(d.getMonth() + 1)
  da = String(d.getDate())
  we = String(d.getDay())
  wNames = [
    "日"
    "月"
    "火"
    "水"
    "木"
    "金"
    "土"
  ]
  ye + "/" + mo + "/" + da + "(" + wNames[we] + ")"
addInfo = (data) ->
  c = ""
  i = 0

  while i < data.comment.length
    c += "・" + data.comment[i].value + "<br>"
    i++
  t = ""
  if data.tag_id
    i = 0

    while i < data.tag_id.length
      t += "・" + data.tag[i].value + "<br>"
      i++
  title = "<div class=\"title\">" + data.title + "</div>"
  tags = "<div class=\"tags\">" + t + "</div>"
  summary = "<div class=\"summary\">" + data.summary + "</div>"
  place_name = "<div class=\"place_name\">" + data.place_name + "</div>"
  address = "<div class=\"address\">" + data.address + "</div>"
  if data.start_date is data.end_date
    term = "<div class=\"term\">" + jpDate(data.start_date) + "</div>"
  else
    term = "<div class=\"term\">" + jpDate(data.start_date) + "-" + jpDate(data.end_date) + "</div>"
  comments = "<div class=\"comment\">" + c + "</div>"
  buttons = "<div><input type=\"button\" value=\"詳細\" onClick=\"detail(" + String(data.id) + ")\"></div>"
  info = "<div class=\"infoWindow\">" + title + tags + summary + place_name + address + term + comments + buttons + "</div>"
  marker = new google.maps.Marker(
    map: map
    position: new google.maps.LatLng(data.lat, data.lng)
    event_id: data.id
    event_title: data.title
  )
  markers.push marker
  infoWindowOption =
    position: new google.maps.LatLng(data.lat, data.lng)
    tags: data.tags
    startDate: data.start_date
    endDate: data.end_date
    maxWidth: 200
    disableAutoPan: true
    content: info

  infoWindow = new google.maps.InfoWindow(infoWindowOption)
  infoWindow.open map
  infoWindows.push infoWindow
  google.maps.event.addListener marker, "click", (e) ->
    infoWindow.open map, this
    document.getElementById("comment_event_id").value = marker.event_id
    return

  return
commercialInfo = ->
  $.getJSON "/commercials/1.json", (data) ->
    img = "<a href=\"" + data.url + "\" target=_blanc>" + "<img width=\"300px\" height=\"200px\" src=\"" + data.image_path + "\"></a>"
    infoWindowOption =
      position: new google.maps.LatLng(data.lat, data.lng)
      maxWidth: 300
      maxHeight: 200
      disableAutoPan: true
      zIndex: 99999
      content: img

    infoWindow = new google.maps.InfoWindow(infoWindowOption)
    infoWindow.open map
    return

  return
initialize = ->
  markerYoshida = null
  
  #    error();
  $("#map_canvas").height 300
  w = $(".container").width()
  console.log w
  $("#map_canvas").width w - 30
  console.log "init"
  console.log $("#map_canvas").height()
  if window.google and google.gears
    console.log "if"
    geo = google.gears.factory.create("beta.geolocation")
    geo.getCurrentPosition success, error
  else if navigator.geolocation
    console.log "elseif"
    navigator.geolocation.getCurrentPosition success, error
  else
    alert "no geo found"
  return
setLatitude = (lat) ->
  latitude = Number(lat)
  return
getLatitude = ->
  if latitude
    latitude
  else
    0
setLongitude = (lng) ->
  longitude = Number(lng)
  return
getLongitude = ->
  if longitude
    longitude
  else
    0
setRadius = (rad) -> #meter
  radius = Number(rad)
  return
getRadius = (km) -> #returen kilo meter if km is ture
  if radius
    if km
      radius / 1000
    else
      radius
  else
    0
sendComment = ->
  $.post "/comments",
    comment:
      event_id: "1"
      name: "comment[value]"
      value: "test"
  , (data) ->
    console.log data
    return

  return
getComments = (lat, lng, rad, startDate, endDate) -> #rad is kilo meter
  $.getJSON "/events/comment.json",
    lat: lat
    lng: lng
    rad: rad
    start_date: startDate
    end_date: endDate
  , (data) ->
    i = 0

    while i < data.length
      addInfo data[i]
      i++
    return

  return
success = (position) ->
  console.log "success"
  lat = position.coords.latitude
  lng = position.coords.longitude
  rad = Number($("#radius").val())
  setLatitude lat
  setLongitude lng
  setRadius rad
  makeGoogleMap lat, lng
  commercialInfo()
  makeCircle lat, lng, rad
  rad = getRadius("km")
  return

#   getComments(lat,lng,rad,sdate,edate);
error = ->
  console.log "error"
  lat = 35.468182 #Matsue City Office
  lng = 133.048593
  rad = 5000
  
  #var sdate =  $( "#startDate" ).datepicker('setDate',new Date );
  #var edate =  $( "#endDate" ).datepicker('setDate',new Date );
  sdate = "2015/01/01"
  edate = "2015/04/01"
  setLatitude lat
  setLongitude lng
  setRadius rad
  setStartDate sdate
  setEndDate edate
  makeGoogleMap lat, lng
  commercialInfo()
  makeCircle lat, lng, rad
  rad = getRadius("km")
  getComments lat, lng, rad, sdate, edate
  return
makeGoogleMap = (lat, lng) ->
  mapOptions =
    center: new google.maps.LatLng(lat, lng)
    zoom: 12
    scrollwheel: false
    streetViewControl: true
    mapTypeId: google.maps.MapTypeId.ROADMAP

  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions)
  return
makeCircle = (lat, lng, rad) ->
  myplaceOptions =
    strokeColor: "#0000FF"
    strokeOpacity: 0.0
    stokeWeight: 1
    fillColor: "#0000FF"
    fillOpacity: 0.35
    map: map
    center: new google.maps.LatLng(lat, lng)
    radius: rad

  circle = new google.maps.Circle(myplaceOptions)
  circles.push circle
  return
radiusChanged = (obj) ->
  v = obj[obj.selectedIndex].value
  console.log v
  setRadius v
  resetInfo()
  return
makeMarker = (lat, lng) ->
  markerYoshida.setMap null  if markerYoshida
  markerYoshida = new google.maps.Marker(
    position: new google.maps.LatLng(lat, lng)
    icon: "/yoshida.png"
    draggable: true
    zIndex: 9999999
  )
  markerYoshida.setMap map
  google.maps.event.addListener markerYoshida, "dragend", (event) ->
    setLatitude markerYoshida.getPosition().lat()
    setLongitude markerYoshida.getPosition().lng()
    resetInfo()
    return

  return
resetInfo = ->
  deleteInfo()
  lat = getLatitude()
  lng = getLongitude()
  rad = getRadius()
  radkm = getRadius("km")
  sdate = getStartDate()
  edate = getEndDate()
  filtering()
  return

# makeCircle(lat,lng,rad);
# getComments(lat,lng,radkm,sdate,edate);
deleteInfo = ->
  i = 0

  while i < markers.length
    markers[i].setMap null
    i++
  i = 0

  while i < infoWindows.length
    infoWindows[i].close()
    i++
  i = 0

  while i < circles.length
    circles[i].setMap null
    i++
  markers = []
  infoWindows = []
  circles = []
  return
resetPosition = ->
  deleteInfo()
  lat = getLatitude()
  lng = getLongitude()
  makeMarker lat, lng
  return
allCloseInfoWindow = ->
  random = false
  i = 0

  while i < infoWindows.length
    infoWindows[i].close()
    i++
  return
allOpenInfoWindow = ->
  random = false
  i = 0

  while i < infoWindows.length
    infoWindows[i].open map, markers[i]
    i++
  return
detail = (id) ->
  container = $("#container")
  menu = $("#menu")
  detail = $("#detail")
  detail.show()
  menu.hide()
  if container.hasClass("visible")
    container.removeClass("visible").animate "margin-left": "0px"
  else
    container.addClass("visible").animate "margin-left": "300px"
  $.getJSON "/events/" + id, (data) ->
    c = ""
    i = 0

    while i < data.comment.length
      c += "・" + data.comment[i].comment.value + "<br>"
      i++
    t = ""
    i = 0

    while i < data.tags.length
      t += "・" + data.tags[i].tag.name
      i++
    title = "<div class=\"title\">" + data.title + "</div>"
    tags = "<div class=\"tags\"><b>Tag:</b>" + t + "</div>"
    summary = "<dev class=\"summary\"><b>概要：</b>" + data.summary + "</div>"
    place_name = "<div class=\"place_name\"><b>場所：</b>" + data.place_name + "</div>"
    address = "<div class=\"address\"><b>住所：</b>" + data.address + "</div>"
    if data.start_date is data.end_date
      term = "<div class=\"term\"><b>日付：</b>" + jpDate(data.start_date) + "</div>"
    else
      term = "<div class=\"term\"><b>期間：</b>" + jpDate(data.start_date) + "-" + jpDate(data.end_date) + "</div>"
    comments = "<div class=\"comment\"><b>コメント：</b>" + c + "</div>"
    buttons = "<div><input type=\"button\" value=\"詳細\" onClick=\"detail(" + String(data.id) + ")\"></div>"
    document.getElementById("comment_event_id").value = data.id
    document.getElementById("detail_info").innerHTML = title + tags + summary + place_name + address + term + comments
    return

  return
infoWindows = []
markers = []
circles = []
window.onload = ->
  console.log "onload"
  initialize()
  return

$(window).resize ->
  co = $(".container")
  lpad = co.css("padding-left")
  rpad = co.css("padding-right")
  console.log co.outerWidth()
  width = co.width() - (lpad + rpad)
  height = $(window).height()
  console.log co.width()
  console.log "aaaa"
  console.log width
  $("#map_canvas").width $(".container").width() - 30
  $("#map_canvas").height height - 100
  return
