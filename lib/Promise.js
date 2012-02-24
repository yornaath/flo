
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

})([], function(){
  
  var Promise;
  
  //##Promise  
  Promise = (function(){
    
    //###Promise Constructor  
    //Creates a new Promise instance
    function Promise(){
      var self = this
      this.pending = []

      //###Promise.fulfill  
      //Completes the promise in a fulfilled state
      this.fulfill = function(){
        self.complete('fulfilled', arguments)
      }

      //###Promise.fail  
      //Completes the promise in a failed state
      this.fail = function(){
        self.complete('failed', arguments, this)
      }
    };

    //###Promise.then
    //Adds a fullfFilled and/or errorHandler to the promise that wil fire on respective fulfillment or failing  
    //@param: {Function} fulfilledHandler  
    //@param: {Function} errorHandler
    //@return: new Promise
    Promise.prototype.then = function(fulfilledHandler, errorHandler) {
      var promise;
      promise = new Promise()
      this.pending.push({ 
        fulfilled: function() {
          fulfilledHandler.apply(promise, arguments)
        }, 
        failed: function() {
          errorHandler.apply(promise, arguments)
        }  
      })
      return promise
    }

    //###Promise.complete  
    //Completes the promise in a given failed or fullfilled state  
    //@param: {String} type "fulfilled/failed"  
    //@param: {Array} args  
    //@param: {Object} boundto  
    Promise.prototype.complete = function(type, args) {
      var cb;
      while(this.pending[0]) {
        cb = this.pending.shift()[type]
        if(typeof cb == 'function') {
          cb.apply(this, args)
        }
        else throw new Error('Promise.complete called with type '+type+' and no corresponding handler')
      }
    }
        
    return Promise;
  })();


  return Promise;
})