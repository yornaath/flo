
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

  './classextends',
  './EventEmitter',
  './nextTick',

], function(classextends, EventEmitter, nextTick){
  
  var Job
  
  Job = (function() {
    
    classextends(Job, EventEmitter)

    function Job(task) {
      Job.__super__.constructor.apply(this, arguments)
      if(typeof task != 'function') {
        throw new Error('Job.constructor got invalid paramter, expected function, got ' + typeof task)
      }
      this.state = Job.INNACTIVE
      this.task = task
    }

    Object.defineProperties(Job, {
      INNACTIVE: {
        value: 0,
        writable: false,
        configurable: false,
        enumerable: false
      },
      RUNNING: {
        value: 1,
        writable: false,
        configurable: false,
        enumerable: false
      },
      FAILED: {
        value: 2,
        writable: false,
        configurable: false,
        enumerable: false
      },
      FULFILLED: {
        value: 3,
        writable: false,
        configurable: false,
        enumerable: false
      }
    })

    Object.defineProperty(Job.prototype, 'state', {
      set: function(val) {
        switch(val) {
        case 0:
          if(this.value > 0) {
            throw new Error('Job.state cannot be set to INNACTIVE when in ' + this.value + ' state')
          }
          this.value = 0
          break;
        case 1:
          if(this.value > 1) {
            throw new Error('Job.state cannot be set to RUNNING when in ' + this.value + ' state')
          }
          this.value = 1
          break;
        case 2:
          if(this.value != 1) {
            throw new Error('Job.state cannot be set to FAILED when in ' + this.value + ' state')
          }
          this.value = 2
          break;
        case 3:
          if(this.value != 1) {
            throw new Error('Job.state cannot be set to FULFILLED when in ' + this.value + ' state')
          }
          this.value = 3
          break;
        default:
          throw new Error('Job.state cannot be set to ' + val + ', invalid state value')
          break;
        }
      },
      get: function() {
        switch(this.value) {
        case 0:
          return 'INNACTIVE'
          break;
        case 1:
          return 'RUNNING'
          break;
        case 2:
          return 'FAILED'
          break;
        case 3:
          return 'FULFILLED'
          break;
        }
      }
    })

    Job.prototype.fail = function(error) {
      this.state = Job.FAILED
      this.emit.apply(this, ['error', error])
    }

    Job.prototype.progress = function(val) {
      if(this.state != 'RUNNING') {
        throw new Error('Job.progress cannot emit unless job is in running state')
      }
      this.emit.apply(this, ['progress', val])
    }

    Job.prototype.fulfill = function(result) {
      this.state = Job.FULFILLED
      this.emit.apply(this, ['fulfilled', result])
    }

    Job.prototype.run = function() {
      var self
      self = this
      self.state = Job.RUNNING
      self.emit.apply(self, ['running'])
      nextTick(function() {
        self.task(self)
      })
    }

    return Job
  })()
  
  return Job
})