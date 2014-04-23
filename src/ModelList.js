/**
 * @ngdoc service
 * @name core.ModelList
 * @description
 *
 * A special list type that always keeps the same instance of the array. Useful for
 * binding data to services and used in view creation. 
 */
/**
 * @ngdoc method
 * @name core.ModeList#getBindableList
 * @methodOf core.ModeList
 * @description
 *
 * Returns the array behind the List. This should only be used for binding to it.
 * You should not modify the array directly.
 */
/**
 * @ngdoc method
 * @name core.ModelList#overwrite
 * @methodOf core.ModelList
 * @description
 *
 * Overwrites the array with a new one while keeping the same array instance
 * so as to not break bindings.
 *
 * @param {Array} array The array to overwrite with
 */
/**
 * @ngdoc method
 * @name core.ModelList#set
 * @methodOf core.ModelList
 * @description
 *
 * Sets an item at array position.
 *
 * @param {*} item The item to set
 * @param {Number} index The index to set
 */
/**
 * @ngdoc method
 * @name core.ModelList#get
 * @methodOf core.ModelList
 * @description
 *
 * Gets an item at array position.
 */
/**
 * @ngdoc method
 * @name core.ModelList#clean
 * @methodOf core.ModelList
 * @description
 *
 * Empties the array while keeping the same instance.
 */
/**
 * @ngdoc method
 * @name core.ModelList#pull
 * @methodOf core.ModelList
 * @description
 *
 * Removes an item instance from the array.
 *
 * @param {*} items Items to remove
 */
angular.module("ModelList", []).factory("ModelList", [function() {
    "use strict";

    var isArray = angular.isArray;
    var bind = angular.bind;
    var forEach = angular.forEach;
    var isFunction = angular.isFunction;
    var arrayPrototype = Array.prototype;
    var slice = arrayPrototype.slice;

    var arrayMethods = [
      "join", "pop", "push", "reverse", "shift", "unshift", 
      "slice", "splice", "sort", "forEach", "some", "every", "indexOf", 
      "lastIndexOf", "reduce", "reduceRight"
    ];

    // Quick polyfills for features that aren't supported.
    // These polyfills are just rough barebones implementations.
    // If you need almost native implementation use a proper
    // shim or polyfill.
    var polys = {
      indexOf: function(element) {
        for (var i = 0, len = this.length; i < len; i++) {
          if (this[i] === element) {
            return i;
          }
        }

        return -1;
      },
      reduce: function(fn, start) {
        var result = start;

        for (var i = 0, len = this.length; i < len; i++) {
          result = fn(result, this[i]);
        }

        return result;
      }
    };

    var reduce = isFunction(arrayPrototype.reduce) ? arrayPrototype.reduce : polys.reduce;
    var indexOf = isFunction(arrayPrototype.indexOf) ? arrayPrototype.indexOf : polys.indexOF;

    var ModelList = function(array, clone) {
      // We don't want this accessable. No one should be able to modify this directly.
      var list = isArray(array) ? (clone ? array.slice(0) : array) : [];

      this.length = list.length;

      // Copy all native array functions and bind them to our list
      forEach(arrayMethods, function(fnName) {
        if (isFunction(arrayPrototype[fnName])) {
          this[fnName] = bind(list, arrayPrototype[fnName]);
        }
      }, this);

      // If the browser doesn't support native forEach use angulars
      if (!isFunction(this.forEach)) {
        this.forEach = bind(this, forEach, list);
      }

      // Bind any polyfills if those functions didn't exist
      forEach(polys, function(fn, name) {
        if (!isFunction(fn)) {
          this[name] = bind(list, fn);
        }
      }, this);

      // Map normally returns a new instance.
      // We want to keep the same instance so this map function
      // will mutate the array and NOT return a new array.
      this.map = function(fn) {
        for (var i = 0, len = list.length; i < len; i++) {
          list[i] = fn(list[i], i);
        }
      };

      // Concat method that simulates a native concat by pushing all elements
      // of the arrays into the array instance.
      this.concat = function(array) {
        var result = reduce.call(slice.call(arguments, 0), function(result, arg) {
          return result.concat(arg);
        }, []);
        
        list.push.apply(list, result);
      };

      // Filter normally returns a new array. This will filter the array
      // while retaining the same instance.
      this.filter = function(fn) {
        forEach(list, function(item, index) {
          if (!fn(item, index)) {
            this.pull(item);
          }
        }, this);
      };

      // This is the function that should be used to bind.
      // Normally used for an `ng-repeat` directive.
      this.getBindableList = function() {
        return list;
      };

      this.overwrite = function(array) {
        this.clean();
        this.concat(array);
      };

      this.set = function(item, index) {
        list.splice(index, 0, item);
      };

      // We need to clean the array but still keep the same instance.
      this.clean = function() {
        list.splice(0, list.length);
      };

      this.get = function(index) {
        return list[index];
      };
      
      // Convience method for removing object instances from the array
      this.pull = function() {
        var items = slice.call(arguments, 0);

        for (var i = 0, len = items.length; i < len; i++) {
          list.splice(indexOf.call(list, items[i]), 1);
        }
      };

      // Wrap each method with a wrapper function that updates the
      // length property
			/* jshint loopfunc: true */
      for (var fnName in this) {
        if (this.hasOwnProperty(fnName)) {
					(function(fn, fnName) {
						if (!isFunction(fn)) {
							return;
						}

						this[fnName] = bind(this, function() {
							var result = fn.apply(this, arguments);

							this.length = list.length;
							return result;
						});
					}.call(this, this[fnName], fnName));
        }
      }
    };

    return function(list, clone) {
      return new ModelList(list, clone);
    };
  }
]);
