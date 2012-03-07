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

})([], function() {
  var Event;

  //##Event
  //Event is a class mainly used by the EventEmitter class
  Event = (function(){
    
    //###Event Constructor
    //@param: {Object} context  
    //@param: {String} key    
    function Event(context, key){
      this.key = key
      this.context = context || this
      this.handlers = []
    };
    
    //###Event.addHandler
    //@param: {function} handler  
    //Adds a handler to be called on firing
    Event.prototype.addHandler = function(handler) {
      if(!handler) return false
      this.handlers.push(handler)
    };

    //###Event.removeHandler
    //@param: {function} handler  
    //Removes a handler from the handler que
    Event.prototype.removeHandler = function(handler) {
      var i;
      for(i = this.handlers.length-1; i >= 0; i--) {
        if(this.handlers[i] === handler) {
          this.handlers.splice(i, 1)
        }
      }
    }

    //###Event.fire
    //Fires all the handler function associated with the event
    Event.prototype.fire = function() {
      var i, 
          fn,
          context;
      for(i = this.handlers.length-1; i >= 0; i--) {
        fn = this.handlers[i];
        context = this.context || this
        fn.apply(this.context, arguments)
      }
    }

    return Event;
  })();

  return Event;
})
