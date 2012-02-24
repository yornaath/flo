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
  return function splat(args, index) {
    var l,
        i,
        splat;
    l = args.length
    splat = new Array(l - index)
    for(i = index; i < l; i++) {
      splat[i-index] = args[i]
    }
    return splat
  }
})