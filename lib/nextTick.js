
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
  if(typeof process != 'undefined' && process.nextTick) {
    return function(fn) {
      process.nextTick(fn)
    }
  }
  return function(fn) {
    setTimeout(fn, 0)
  }  
})
