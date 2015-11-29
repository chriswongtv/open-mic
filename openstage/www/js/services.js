angular.module('openstage.services', [])

.factory('Events', function() {

  return {
    get: function(eventName) {
      var firebaseRef = new Firebase("https://openstage.firebaseio.com/");

      firebaseRef.child("events").child(eventName).once("value", function(dataSnapshot) {
        console.log(dataSnapshot.val());
        return dataSnapshot.val();
      })
    }
  };
});

angular.module('openstage.utils', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);