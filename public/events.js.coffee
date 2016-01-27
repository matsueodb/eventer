# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

eventsApp = angular.module('eventsApp',['ui.bootstrap','ngAnimate'])
  .controller 'get_events', ['$scope','$http','$window',
    ($scope,$http,$window) ->
      console.log "aaa"
      $scope.events = []
      getevents = ()->
        console.log 'get_events'
        $http.get('/events/map')
         .success (data,status)->
          $scope.events = data
      getevents()
  ]

  .controller 'get_all_tag', ['$scope','$http','$window',
    ($scope,$http,$window) ->
      $scope.tags = []
      get_tags = ()->
        console.log 'get_all_tag'
        $http.get('/tag_collections/get_all_tag')
         .success (data,status)->
          $scope.tags = data
      get_tags()
  ]

  .controller 'filter', ['$scope','$http','$window',
    ($scope,$http,$window) ->
      $scope.filter = ->
        ts = $('.tagss')
        console.log  $('label.tagss.active')
        for t in  $('label.tagss.active')
          console.log t.innerText
  ]

  .controller 'datepicker', ['$scope','$http','$window',
    ($scope,$http,$window) ->
      $scope.today = ->
        $scope.dt = new Date()
      $scope.today
      $scope.clear = ->
        $scope.dt = null

      $scope.disabled = (date, mode) ->
        mode is "day" and (date.getDay() is 0 or date.getDay() is 6)

      $scope.toggleMin = ->
        $scope.minDate = (if $scope.minDate then null else new Date())
        return

      $scope.toggleMin()
      $scope.open = ($event) ->
        $event.preventDefault()
        $event.stopPropagation()
        $scope.opened = true
        return

      $scope.dateOptions =
        formatYear: "yy"
        startingDay: 0

      $scope.format = "yyyy/MM/dd"

  ]
  .controller 'slidemenu', ['$scope','$http','$window',
    ($scope,$http,$window) ->
      status = "hide"
      $scope.mapHide = false
      $scope.menuHide = true
      $scope.detailHide = true

      $scope.slide = (content)->
        console.log content
        console.log status
        if status == content
          $scope.menuHide = true
          $scope.detailHide = true
          $scope.mapHide = false
          status = "hide"
          return
        else
          if content == 'menu'
            $scope.detailHide = true
            $scope.menuHide = false
            $scope.mapHide = true
          if content == 'detail'
            $scope.detailHide = false
            $scope.menuHide = true
            $scope.mapHide = true
          status = content

  ]
