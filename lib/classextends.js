
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
  
  var __hasProp = Object.prototype.hasOwnProperty, 
      classextends;

  classextends = function(child, parent) { 
    for (var key in parent) { 
      if (__hasProp.call(parent, key)) child[key] = parent[key]; 
    } 
    function ctor() { 
      this.constructor = child; 
    } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; return child; 
  };

  return classextends;
})