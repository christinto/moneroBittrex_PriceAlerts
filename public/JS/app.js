//sets up new angular app
//production code :D
//Different controllers can belong to this single module
angular.module('PriceApp',[]);

var app = angular.module('PriceApp', []);

//pre-text box line, app.controller('priceCtrl', function($scope, $http, $interval) {
app.controller('priceCtrl', ['$scope','$http','$interval', function($scope, $http, $interval) {    
  this.loadNotifications = function(){
    $http.get("/getLatestPrice")
    .then(function(response) {
        //var result = response.data;
        //var currentPrice = response.data.currentPrices.spotPrice;
        //var lastPrice = result.lastPrices.spotPrice;
        if (response.data !== '') {
          var currentPrice = response.data.currentPrices.spotPrice;
          var lastPrice = response.data.lastPrices.spotPrice;
          var percentagechangeCalc = (currentPrice - lastPrice) / lastPrice * 100;
          $scope.percentagechange = percentagechangeCalc;
          $scope.currentprice = response.data.currentPrices.spotPrice;
          $scope.lastprice = response.data.lastPrices.spotPrice;
        }
        else {
          $scope.percentagechange = 'Data unavailable';
          $scope.currentprice = 'Data unavailable';
          $scope.lastprice = 'Data unavailable';
        }
     });
    };
    //Puts in interval, first trigger after 30 seconds
    var theInterval = $interval(function(){
      this.loadNotifications();
   }.bind(this), 30000);

    $scope.$on('$destroy', function () {
        $interval.cancel(theInterval)
    });

//code that we only want to run once at start of application goes here
this.loadPriceChangeSinceLastStartup = function(){
    $http.get("/getLatestPrice")
    .then(function(response) {
      if (response.data !== '') {
        var currentPrice = response.data.currentPrices.spotPrice;
        var lastPrice = response.data.lastPrices.spotPrice;
        var percentagechangeCalc = (currentPrice - lastPrice) / lastPrice * 100;
        var percentchangeStartCalc = (currentPrice - lastPrice) / lastPrice * 100;
        $scope.percentagechange = percentagechangeCalc;
        $scope.percentagechangestart = percentchangeStartCalc;
        $scope.currentprice = response.data.currentPrices.spotPrice;
        $scope.lastprice = response.data.lastPrices.spotPrice;
      }
      else {
        $scope.percentagechangestart = 'Data unavailable';
        $scope.percentagechange = 'Data unavailable';
        $scope.currentprice = 'Data unavailable';
        $scope.lastprice = 'Data unavailable';
      }
   });
 };
 //invokes initially
 this.loadPriceChangeSinceLastStartup();
 

 //number or text pattern to only allow one value and certain types of keys to be input to textbox
 //$scope.onlyNumbers = /^[\u0030-\u0039]+$/; OR $scope.onlyNumbers = /^[0-9]+$/;
 //If this was for text could use this pattern>> wordPattern: /^\s*\w*\s*$/
$scope.priceEntry = {
  numberEnter: 'Please enter your preferred price',
  numberPattern: /^[0-9]+$/
};

}]);


















