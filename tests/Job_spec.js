if(typeof module !== 'undefined' && module.exports){
  var Job = require('../lib/Job')
  var EventEmitter = require('../lib/EventEmitter')
}


describe('Job', function() {
  
  describe('constructor', function() {
    var job
    it('should throw error if argument isnt a function', function() {
      var obj = {},
          bool = true,
          num = 12,
          str = "lol"
      expect( function(){ new Job(obj) } ).toThrow(new Error("Job.constructor got invalid paramter, expected function, got object"))
      expect( function(){ new Job(bool) } ).toThrow(new Error("Job.constructor got invalid paramter, expected function, got boolean"))
      expect( function(){ new Job(num) } ).toThrow(new Error("Job.constructor got invalid paramter, expected function, got number"))
      expect( function(){ new Job(str) } ).toThrow(new Error("Job.constructor got invalid paramter, expected function, got string"))
    })
    it('should set job.task to supplied function argument and job.state to Job.INNACTIVE', function() {
      var fn
      fn = function(){}
      job = new Job(fn)
      expect(job.state).toEqual('INNACTIVE')
      expect(job.task).toEqual(fn)
    })
  })

  describe('Job.fail, Job.fulfill and Job.progress', function() {
    var job
    it('should set the job state to failed and emmit an error event', function() {
      runs(function() {
        var test = this
        job = new Job(function(job) {
          job.fail('error msg')
        })
        expect(job.state).toEqual('INNACTIVE')
        job.run()
        expect(job.state).toEqual('RUNNING')
        job.on('error', function(error) {
          test.error = error
          test.finalstate = job.state
        })
      })
      waits(10)
      runs(function() {
        var test = this
        expect(test.error).toEqual('error msg')
        expect(test.finalstate).toEqual('FAILED')
      })
    })
    it('Should throw state exception on fulfilling failed job', function() {
      runs(function() {
        var test = this
        job = new Job(function(job) {
          job.fail('error msg')
          try {
            job.fulfill('OMG') 
          } catch(e) {
            test.exception = e
          }
        })
        expect(job.state).toEqual('INNACTIVE')
        job.run()
        expect(job.state).toEqual('RUNNING')
        job.on('fulfilled', function(omg) {
          test.fulfilled = omg
        })
        job.on('error', function(error) {
          test.error = error
          test.finalstate = job.state
        })
      })
      waits(10)
      runs(function() {
        var test = this
        expect(test.error).toEqual('error msg')
        expect(test.finalstate).toEqual('FAILED')
        expect(test.omg).toBeFalsy()
        expect(test.exception).toEqual(new Error('Job.state cannot be set to FULFILLED when in 2 state'))
      })
    })
    it('should throw state exception on trying to fail fulfilled job', function() {
      runs(function() {
        var test = this
        job = new Job(function(job) {
          job.fulfill('yaay')
          try {
            job.fail('ohnoes') 
          } catch(exc) {
            test.exception = exc
          }
        })
        job.run()
      })
      waits(10)
      runs(function() {
        expect(this.exception).toEqual(new Error('Job.state cannot be set to FAILED when in 3 state'))
      })
    })
    it('should be able to emmit progress events if in running state', function() {
      runs(function() {
        var test = this
        test.progressValues = []
        job = new Job(function(job) {
          job.progress('1/4')
          job.progress('2/4')
          job.progress('3/4')
          job.progress('4/4')
          job.fulfill('completed')
        })
        job.on('progress', function(progressValue) {
          test.progressValues.push(progressValue)
        })
        job.on('fulfilled', function(data) {
          test.data = data
        })
        job.run()
        waits(15)
        runs(function() {
          expect(this.progressValues[0]).toEqual('1/4')
          expect(this.progressValues[1]).toEqual('2/4')
          expect(this.progressValues[2]).toEqual('3/4')
          expect(this.progressValues[3]).toEqual('4/4')
          expect(this.data).toEqual('completed')
        })
      })
    })
    it('should throw state exception om emitting progress event allready fulfilled', function() {
      runs(function() {
        var test = this
        job = new Job(function(job) {
          job.fulfill('yaay')
          try {
            job.progress('progress1')
            job.progress('progress2')
          } catch(exc) {
            test.exception = exc
          }
        })
        job.on('progress', function() {
          test.emittedProgress = true
        })
        job.run()
      })
      waits(15)
      runs(function() {
        expect(this.emittedProgress).toBeFalsy()
        expect(this.exception).toBeTruthy()
        expect(this.exception).toEqual(new Error('Job.progress cannot emit unless job is in running state'))
      })
    })
  })

  describe('Job.run', function() {
    var job
    it('should run the task given as argument to the constructor', function() {
      runs(function() {
        var test = this
        job = new Job(function(job) {
          job.fulfill([1,2,3])
        })
        expect(job.state).toEqual('INNACTIVE')
        job.run()
        expect(job.state).toEqual('RUNNING')
        job.on('fulfilled', function(data) {
          test.finalstate = job.state
          test.data = data
        })
      })
      waits(10)
      runs(function() {
        var test = this
        expect(test.data.length).toEqual(3)
        expect(test.data[0]).toEqual(1)
        expect(test.data[1]).toEqual(2)
        expect(test.data[2]).toEqual(3)
        expect(test.finalstate).toEqual('FULFILLED')
      })
    })
  })

  /*
  describe('states', function() {
    var job
    beforeEach(function() {
      job = new Job(function(){})
    })
    
    it('can progress from INNACTIVE to RUNNING', function() {
      expect(job.state).toEqual('INNACTIVE')
      job.state = 'RUNNING'
      expect(job.state).toEqual('RUNNING')
    })
    it('can progress from RUNNING to FULLFILLED', function() {
      expect(job.state).toEqual('INNACTIVE')
      job.state = 'RUNNING'
      expect(job.state).toEqual('RUNNING')
      job.state = 'FULFILLED'
      expect(job.state).toEqual('FULFILLED')
    })
    it('can progress from RUNNING to FAILED', function() {
      expect(job.state).toEqual('INNACTIVE')
      job.state = 'RUNNING'
      expect(job.state).toEqual('RUNNING')
      job.state = 'FAILED'
      expect(job.state).toEqual('FAILED')
    })
    //it('cannot progress from INNACTIVE to FULFILLED')
    //it('cannot progress from INNACTIVE to FAILED')
    //it('cannot progress from FULFILLED TO FAILED')

  })*/

})



