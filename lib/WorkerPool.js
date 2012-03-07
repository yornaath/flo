
;(function(deps, definition) {

  var depModules = []
  if(typeof define != 'undefined') {
    define(deps, definition)
  } 
  else if(typeof module != 'undefined' && module.exports) {
    for (var i = 0; i < deps.length; i++) {
      var m = require(deps[i])
      depModules.push(m)
    };
    module.exports = definition.apply(this, depModules)
  }  

})([

  './classextends',
  './EventEmitter',
  './Job'

], function(classextends, EventEmitter, Job){
  
  var WorkerPool

  WorkerPool = (function() {

    classextends(WorkerPool, EventEmitter)

    function WorkerPool(concurency, threadcount, tasks) {
      WorkerPool.__super__.constructor.apply(this, arguments)
      this.pool = []
      this.concurency = concurency || 1
      this.threadcount = threadcount || 1
      if(tasks)
        this.push(tasks)
    }

    WorkerPool.prototype.push = function(tasks) {
      if(typeof tasks != 'function' && !(tasks instanceof Array)) {
        throw new Error('WorkerPool.push received invalid parameter, expected function or object with instanceof Array, got ' + typeof tasks)
      }
      if(tasks instanceof Array) {
        for (var i = 0; i < tasks.length; i++) {
          this.pool.push(new Job(tasks[i]))
        }
      } 
      else {
        this.pool.push(new Job(tasks)) 
      }
    }

    WorkerPool.prototype.pop = function() {
      return this.pool.pop()
    }

    return WorkerPool  
  })()

  return WorkerPool  
})