# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

index2App =angular.module('index2App',[])
  .controller 'index2ctrl', ['$scope','$http','$window',
    ($scope,$http,$window) ->

      $ ()->
        console.log 'hoge'
        $scope.names =[
          {
            first:'seii'
            second:'t'
          },
          {
            first:'ito'
            second:'k'
          }
        ]

        $scope.names = []
        console.log 'tara'


      getname = ()->
        console.log 'get_name'
        $http.get('/comments/get_name')
         .success (data,status)->
          console.log data
          $scope.names = data

      getname()

  ]
