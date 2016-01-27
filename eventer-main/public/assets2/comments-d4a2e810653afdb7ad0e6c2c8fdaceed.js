(function() {
  var index2App;

  index2App = angular.module('index2App', []).controller('index2ctrl', [
    '$scope', '$http', '$window', function($scope, $http, $window) {
      var getname;
      $(function() {
        console.log('hoge');
        $scope.names = [
          {
            first: 'seii',
            second: 't'
          }, {
            first: 'ito',
            second: 'k'
          }
        ];
        $scope.names = [];
        return console.log('tara');
      });
      getname = function() {
        console.log('get_name');
        return $http.get('/comments/get_name').success(function(data, status) {
          console.log(data);
          return $scope.names = data;
        });
      };
      return getname();
    }
  ]);

}).call(this);
