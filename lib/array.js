
;(function(deps, definition){

  var depModules = []
  if(typeof define != 'undefined'){
    define(deps, definition)
  } 
  else if(typeof module != 'undefined' && module.exports){
    for (var i = 0; i < deps.length; i++) {
      var m = require(deps[i])
      depModules.push(m)
    };
    module.exports = definition.apply(this, depModules)
  }  

})([

  './Promise'
  
],function(Promise) {
  
  var array;
  
  //##array  
  //_________
  array = { }

  //###array.forEach  
  //Executes a function on/foreach element in collection, then executes callback 
  //@param: collection{Array || object}  
  //@param: fn{function}
  //@param: callback{function}
  array.forEach = function(collection, fn, callback) {
    var i,
        key;
    if(collection instanceof Array) {
      for (i = 0; i < collection.length; i++) {
        fn.apply(this, [collection[i], i, collection])
      }; 
    } else if(typeof collection === 'object') {
      for(key in collection){
        fn.apply(this, [collection[key], key, collection])
      }
    } else {
      throw new Error('collection argument passed to array.forEach must be a instance of Array or an object')
    }
    if(callback && typeof callback === 'function') {
      callback.apply(this, [collection])
    }
  }

  array.forEachSeries = function(collection, fn, callback) {
    var val,
        i,
        iterate,
        keys,
        key;
    if(collection instanceof Array) {
      i = 0
      iterate = function() {
        val = collection.shift()
        if(val){
          fn.call(this, val, i, collection, function(err) {
            i++
            if(err) {
              callback.apply(this, [err])
            } else {
              iterate.apply(this) 
            }
          })
        } else {
          i++
          callback.apply(this)
        }
      }
    } else if(typeof collection === 'object') {
      keys = array.keys(collection)
      iterate = function() {
        key = keys.shift()
        if(key && collection[key]){
          fn.call(this, collection[key], key, collection, function(err) {
            i++
            if(err) {
              callback.apply(this, [err])
            } else {
              iterate.apply(this) 
            }
          })
        } else {
          i++
          callback.apply(this)
        }
      }
    } else {
      throw new Error('collection argument passed to array.forEach must be a instance of Array or an object')
    }
    iterate.apply(this)
  }

  array.map = function(collection, fn) {
    var results;
    if(collection instanceof Array){
      results = [] 
    } else if(typeof collection === 'object') {
      results = {}
    }
    array.forEach(collection, function(val, key, collection) {
      results[key] = fn(val)
    })
    return results
  }

  array.mapSeries = function(collection, fn, callback) {
    var promise,
        results;
    promise = new Promise()
    if(collection instanceof Array){
      results = [] 
    } else if(typeof collection === 'object') {
      results = {}
    }
    array.forEachSeries(collection, function(val, key, collection, callback) {
      fn(val, key, function(err, val) {
        if(!err) {
          results[key] = val
          callback()
        } else {
          callback(err)
        }
      })
    }, function(err){
      if(err) {
        setTimeout(function() {
          promise.fail(err)
        },0)
      } else {
        setTimeout(function() {
          promise.fulfill(results)
        },0)
      }
    })
    return promise;
  }

  array.keys = function(obj) {
    var key,
        out;
    out = []
    for(key in obj){
      out.push(key)
    }
    return out;
  }

  return array;

})