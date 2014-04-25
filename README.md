angular-modellist
=================

Why?
----
When storing model data in a service, you most likely will need to bind to it in your view(s).
If we bind this data in multiple places we run the risk of loosing the instance if we aren't careful.

```javascript
var myCtrl1 = function(myService) {
	$scope.arrayData = myService.data;
};

var myCtrl2 = function(myService) {
	$scope.arrayData = myService.data;

	$scope.getNewData = function() {
		$http.get("someUrl").success(res) {
			$scope.arrayData = res; // This causes us to loose our reference
		};
	};
};
```

This service provides an object that wraps an array, but always keeps the same instance when operations are performed on it.

```javascript
// myService.data = ModelList();

var myCtrl1 = function(myService) {
	$scope.arrayData = myService.data;
};

var myCtrl2 = function(myService) {
	$scope.arrayData = myService.data;

	$scope.getNewData = function() {
		$http.get("someUrl").success(res) {
			$scope.arrayData.overwrite(res); // Now our other controls arrayData updates with this one!
		};
	};
};
```
How To Use: 
-----------

Just include the module into your app:

```javascript
angular.module("myApp", ["ModuleList"]);
```

Inject:

```javascript
angular.module("myApp", ["ModelList"]).factory("myService", function(ModelList, $http) {
	
	var myService = ModelList();

	myService.update = function() {
		$http.get("myUrl").success(function(res) {
			myService.overwrite(res.data);
		});
	};
	
	return myService;
})
.controller("myCtrl", function($scope, myService) {
	$scope.myService = myService;
})
.controller("myOtherCtrl", function($scope, myService) {
	$scope.myService = myService;
});
```

Use the `getBindableList` method to bind to directives.

```html
<div ng-controller="myCtrl">
	<div ng-repeat="item in myService.getBindableList()">
	</div>
	<button ng-click="myService.update()">
</div>
<div ng-controller="myOtherCtrl">
	<div ng-repeat="item in myService.getBindableList()">
	<button ng-click="myService.update()">
</div>
```

Both of the `ng-repeat` directives will be in sync when the list is updated.

API
---

Most array methods are supported in their native form except a couple:

- `map`: Mutates the array and does not return a new array
- `concat`: Mutates the array and does not return a new array
- `filter`: Mutates the array and does not return a new array

Custom methods:

- `get(Number)` Gets an item at index
- `set(*, Number)` Sets an item at index
- `clean()`: Empties the array
- `overwrite(Array)`: Overwrites the array with the items in the new array
- `clone()`: Returns a new ModelList object with a cloned list
- `getBindableList()`: Returns the array. Only should be used for binding

A `length` property is also kept in sync just like native array behaviour.
