angular.module('openstage.controllers', [])

.controller('EventsCtrl', function($scope, $ionicPlatform, $cordovaGeolocation, $ionicLoading, $localstorage) {

  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="spiral" class="spinner-stable"></ion-spinner><br>Loading...'
    });
  };

  $scope.hide = function() {
    $ionicLoading.hide();
  };

  $scope.doRefresh = function() {
    findEvents();
  };

  var firebaseRef = new Firebase("https://openstage.firebaseio.com/");

  // Create a GeoFire index
  var geoFire = new GeoFire(firebaseRef.child("location"));

  $scope.events = [];

  function findEvents() {
    $ionicPlatform.ready(function() {
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var _lat  = position.coords.latitude
          var _lng = position.coords.longitude

          console.log(_lat + ' ' + _lng);

          var geoQuery = geoFire.query({
            center: [position.coords.latitude, position.coords.longitude],
            radius: 30
          });

          $scope.events = [];
          geoQuery.on("key_entered", function(key, location, distance) {
            console.log(key + " entered query at " + location + " (" + distance + " km from center)");
            firebaseRef.child("events").child(key).once("value", function(dataSnapshot) {
              console.log(dataSnapshot.val());
              $scope.events.push(dataSnapshot.val());
              $scope.showList = true;
              $scope.hide();
            })
          });

          $scope.$broadcast('scroll.refreshComplete');

        }, function(err) {
          // error
        });
    });
  }

  $scope.show();
  findEvents();

  Date.prototype.addDays = function(days)
  {
      var dat = new Date(this.valueOf());
      dat.setDate(dat.getDate() + days);
      return dat;
  }

  $scope.getDate = function(dayOfWeek) {
    var today = new Date();
    var todayDay = today.getDay();
    if ((dayOfWeek - todayDay) < 0) {
      var difference = dayOfWeek + 7 - todayDay;
      return today.addDays(difference).getDate();
    }
    else {
      var difference = dayOfWeek - todayDay;
      return today.addDays(difference).getDate();
    }
  }

  $scope.getMonth = function(dayOfWeek) {
    var today = new Date();
    var todayDay = today.getDay();
    if ((dayOfWeek - todayDay) < 0) {
      var difference = dayOfWeek + 7 - todayDay;
      var month = today.addDays(difference).getMonth();
      if (month == 0)
        return 'JAN';
      else if (month == 1)
        return 'FEB';
      else if (month == 2)
        return 'MAR';
      else if (month == 3)
        return 'APR';
      else if (month == 4)
        return 'MAY';
      else if (month == 5)
        return 'JUNE';
      else if (month == 6)
        return 'JULY';
      else if (month == 7)
        return 'AUG';
      else if (month == 8)
        return 'SEPT';
      else if (month == 9)
        return 'OCT';
      else if (month == 10)
        return 'NOV';
      else if (month == 11)
        return 'DEC';
      else
        return null;
    }
    else {
      var difference = dayOfWeek - todayDay;
      var month = today.addDays(difference).getMonth();
      if (month == 0)
        return 'JAN';
      else if (month == 1)
        return 'FEB';
      else if (month == 2)
        return 'MAR';
      else if (month == 3)
        return 'APR';
      else if (month == 4)
        return 'MAY';
      else if (month == 5)
        return 'JUNE';
      else if (month == 6)
        return 'JULY';
      else if (month == 7)
        return 'AUG';
      else if (month == 8)
        return 'SEPT';
      else if (month == 9)
        return 'OCT';
      else if (month == 10)
        return 'NOV';
      else if (month == 11)
        return 'DEC';
      else
        return null;
    }
  }

  function initStorage() {
    if ($localstorage.get('star') === undefined) {
      var a = [];
      $localstorage.set('star', JSON.stringify(a));
    }
  }

  initStorage();

  $scope.star = function(name) {
    var a = [];
    a = JSON.parse($localstorage.get('star'));
    a.push(name);
    $localstorage.set('star', JSON.stringify(a));
    console.log(name);
    console.log($localstorage.get('star'));
  }
})

.controller('EventDetailCtrl', function($scope, $stateParams, $ionicLoading) {
  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="spiral" class="spinner-stable"></ion-spinner><br>Loading...'
    });
  };

  $scope.hide = function() {
    $ionicLoading.hide();
  };

  function loadEvent() {
    var firebaseRef = new Firebase("https://openstage.firebaseio.com/");

    firebaseRef.child("events").child($stateParams.eventName).once("value", function(dataSnapshot) {
      console.log(dataSnapshot.val());
      $scope.event = dataSnapshot.val();
      $scope.showEventDetail = true;
      $scope.hide();
    })
  }

  $scope.show();
  loadEvent();
})

.controller('StarredCtrl', function($scope, $localstorage, $ionicLoading) {
  var firebaseRef = new Firebase("https://openstage.firebaseio.com/");

  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="spiral" class="spinner-stable"></ion-spinner><br>Loading...'
    });
  };

  $scope.hide = function() {
    $ionicLoading.hide();
  };

  $scope.doRefresh = function() {
    loadStar();
  };

  $scope.starredEvents = [];

  function loadStar() {
    $scope.starredEvents = [];
    var a = [];
    a = JSON.parse($localstorage.get('star'));

    for (var i = 0; i < a.length; i++) {
      firebaseRef.child("events").child(a[i]).once("value", function(dataSnapshot) {
        $scope.starredEvents.push(dataSnapshot.val());
      })
    }

    $scope.showList = true;
    $scope.hide();

    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.show();
  loadStar();

  $scope.unstar = function(name) {
    var a = [];
    a = JSON.parse($localstorage.get('star'));

    var index = a.indexOf(name);

    if (index > -1) {
      a.splice(index, 1);
    }

    $localstorage.set('star', JSON.stringify(a));

    $scope.doRefresh();
  }

  Date.prototype.addDays = function(days)
  {
      var dat = new Date(this.valueOf());
      dat.setDate(dat.getDate() + days);
      return dat;
  }

  $scope.getDate = function(dayOfWeek) {
    var today = new Date();
    var todayDay = today.getDay();
    if ((dayOfWeek - todayDay) < 0) {
      var difference = dayOfWeek + 7 - todayDay;
      return today.addDays(difference).getDate();
    }
    else {
      var difference = dayOfWeek - todayDay;
      return today.addDays(difference).getDate();
    }
  }

  $scope.getMonth = function(dayOfWeek) {
    var today = new Date();
    var todayDay = today.getDay();
    if ((dayOfWeek - todayDay) < 0) {
      var difference = dayOfWeek + 7 - todayDay;
      var month = today.addDays(difference).getMonth();
      if (month == 0)
        return 'JAN';
      else if (month == 1)
        return 'FEB';
      else if (month == 2)
        return 'MAR';
      else if (month == 3)
        return 'APR';
      else if (month == 4)
        return 'MAY';
      else if (month == 5)
        return 'JUNE';
      else if (month == 6)
        return 'JULY';
      else if (month == 7)
        return 'AUG';
      else if (month == 8)
        return 'SEPT';
      else if (month == 9)
        return 'OCT';
      else if (month == 10)
        return 'NOV';
      else if (month == 11)
        return 'DEC';
      else
        return null;
    }
    else {
      var difference = dayOfWeek - todayDay;
      var month = today.addDays(difference).getMonth();
      if (month == 0)
        return 'JAN';
      else if (month == 1)
        return 'FEB';
      else if (month == 2)
        return 'MAR';
      else if (month == 3)
        return 'APR';
      else if (month == 4)
        return 'MAY';
      else if (month == 5)
        return 'JUNE';
      else if (month == 6)
        return 'JULY';
      else if (month == 7)
        return 'AUG';
      else if (month == 8)
        return 'SEPT';
      else if (month == 9)
        return 'OCT';
      else if (month == 10)
        return 'NOV';
      else if (month == 11)
        return 'DEC';
      else
        return null;
    }
  }
})

.controller('SettingsCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
