
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

  './lib/Promise',
  './lib/array',
  './lib/splat'

],function(Promise, array, splat) {
  
  var async;

  //##async  
  //_________
  async = {}

  //###async.parallel  
  //Runs tasks in paralell. Fulfills or fails the returned promise if a task callbacks with error.  
  //@param: tasks {Array[Function] || object[name] = Function}  
  //@returns: Promise  
  async.parallel = function(tasks) {
    var promise,
        index,
        length,
        results,
        error;
    promise = new Promise
    index = 0;
    if(tasks instanceof Array) {
      results = []
      length = tasks.length
    } else if(typeof tasks === 'object') {
      results = {}
      length = array.keys(tasks).length
    }
    array.forEach(tasks, function(task, key) {
      task(function(err, val) {
        if(err){
          error = err
          setTimeout(function() {
            promise.fail(error)
          },0)
        } else {
          results[key] = val
        }
        index++
        if(index === length && !error){
          setTimeout(function() {
            promise.fulfill(results)
          },0)
        }
      })
    })
    return promise    
  }

  //###async.series
  //Runs tasks in a series. Invokes next task only when current has callbacked. Fulfills or fails promise of a task callbacks with error.  
  //@param: tasks {Array[Function] || object[name] = Function}
  //@returns: Promise  
  async.series = function(tasks) {
    var promise,
        results;
    promise = new Promise()
    if(tasks instanceof Array) {
      results = []
    } else if(typeof tasks === 'object') {
      results = {}
    }
    array.forEachSeries(tasks, function(task, key, arr, callback) {
      task(function(err, val) {
        if(err){
          callback(err)
        } else {
          results[key] = val
          callback()
        }
      })
    }, function(err) {
      if(err){
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

  //###async.pipeline  
  //Runs tasks in sequence, same as series. Splat arguments passed to task callback is passed along as arguments to next task.   
  //@param: tasks{Array[function]}    
  //@returns: Promise  
  async.pipeline = function(tasks) {
    var promise,
        args;
    promise = new Promise();
    array.forEachSeries(tasks, function(task, key, arr, callback) {
      if(!args) args = []
      args.push(function(err) {
        if(err) {
          callback(err)
        } else {
          args = splat(arguments, 1)
          callback()
        }
      })
      task.apply(task, args)
    }, function(err) {
      if(err) {
        setTimeout(function() {
          promise.fail(err)
        },0)
      } else {
        setTimeout(function() {
          promise.fulfill.apply(promise, args)
        },0)
      }
    })
    return promise
  }

  //###async.whilst  
  //Runs task while test returns truthy.  
  //@param: test{Function}  
  //@param: task{Function}  
  //@param: cb{Function}  
  async.whilst = function(test, task, cb) {
    if(test()){
      task(function(err) {
        if(err){
          return cb.apply(this, [err])
        }
        setTimeout(function() {
          async.whilst(test, task, cb)
        }, 0)
      })
    } else {
      cb.apply(this)
    }
  };

  //###async.until    
  //Runs task until test returns falsy.  
  //@param: test{Function}  
  //@param: task{Function}  
  //@param: cb{Function}  
  async.until = function(test, task, cb) {
    if(!test()){
      task(function(err) {
        if(err){
          return cb.apply(this, [err])
        } 
        setTimeout(function() {
          async.until(test, task, cb)
        }, 0)
      })
    } else {
      cb.apply(this)
    }
  };

  //###async.apply    
  //Returns a function that runs the passed function with passed arguments splatt as arguments
  //@param: fn{Function}  
  //@param: args{splat Arguments}
  async.apply = function(fn) {
    var self,
        _splat;
    self = this;
    _splat = splat(arguments, 1)
    if(typeof fn !== 'function') {
      throw new Error('async.apply first argument not function')
    }
    return function() {
      return fn.apply(self, _splat)
    }
  }

  return async
})











