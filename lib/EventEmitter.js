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

  './Event'
  
],function(Event){
  
  var EventEmitter

  EventEmitter = (function(){
    
    function EventEmitter(){ 
      this.eventRegister = { }
    };

    EventEmitter.prototype.event = function(key) {
      var event, 
          key;
      key = key.toLowerCase();
      if(this.eventRegister[key]) event = this.eventRegister[key]
      else {
        event = new Event(this, key) 
        this.eventRegister[key] = event
      }
      return event;
    }

    EventEmitter.prototype.emit = function(key) {
      var event, 
          args, 
          slice, 
          key;
      if(typeof key == 'string') {
        key = key.toLowerCase() 
      } else if (typeof key == 'object') {
        key = key.join('.').toLowerCase()
      }
      slice = Array.prototype.slice;
      event = this.eventRegister[key]
      args = []
      if(arguments.length > 1) args = slice.call(arguments, 1)
      if(event) event.fire.apply(event, args)
      return this
    }

    EventEmitter.prototype.on = function(key, handler) {
      var event,
          key;
      if(typeof key == 'string') {
        key = key.toLowerCase() 
      } else if (typeof key == 'object') {
        key = key.join('.').toLowerCase()
      }
      event = this.event(key)
      event.addHandler(handler)
      return this
    }

    EventEmitter.prototype.addListener = function(key, handler) {
      this.on.apply(this, arguments)
    }

    EventEmitter.prototype.removeListener = function(key, handler) {
      var event, 
          key;
      key = key.toLowerCase()
      event = this.event(key)
      event.removeHandler(handler);
      return this;
    }

    EventEmitter.prototype.removeAllListeners = function(key) {
      var event, 
          key, 
          i, 
          handler;
      key = key.toLowerCase()
      if(this.eventRegister[key]){
        delete this.eventRegister[key]
      } 
      return this
    }

    EventEmitter.prototype.once = function(key, handler) {
      var event, 
          key, 
          fireOnce
      if(typeof key == 'string') {
        key = key.toLowerCase() 
      } else if (typeof key == 'object') {
        key = key.join('.').toLowerCase()
      }
      event = this.event(key)
      fireOnce = function(){
        handler()
        setTimeout(function() {
          event.removeHandler(fireOnce)
        },0)
      }
      event.addHandler(fireOnce)
      return this 
    }
        
    return EventEmitter;
  })();

  return EventEmitter;
})






