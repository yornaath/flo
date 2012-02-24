
if(typeof module !== 'undefined' && module.exports){
  var async = require('../flo')
}

describe('async', function(){

  describe('paralell', function(){
    it('Should run parallel taks asynchronous', function(){
      runs(function(){
        var self,
            i;
        self = this
        i = 0
        this.arr = []
        async
          .parallel([
            function(callback){
              setTimeout(function(){
                i++
                callback(null, i)
              }, 10)
            },
            function(callback){
              setTimeout(function(){
                i++
                callback(null, i)
              }, 120)
            },
            function(callback){
              setTimeout(function(){
                i++
                callback(null, i)
              }, 60)
            }
          ])
          .then(function(results){
            self.arr = results
          })
      })
      waits(230)
      runs(function(){
        expect(this.arr[0]).toEqual(1)
        expect(this.arr[1]).toEqual(3)
        expect(this.arr[2]).toEqual(2)
      })
    })
    it('Should execute errorhandler on recieving error to callback and never fire success callback', function() {
      runs(function(){
        var self;
        self = this
        self.err = false
        self.success = false
        async
          .parallel([
            function(callback){
              setTimeout(function() {
                callback(null, 'SUCCESS')
              }, 10)
            },
            function(callback){
              setTimeout(function() {
                callback('ERROR', null)
              }, 5)
            },
            function(callback) {
              callback(null, 'SUCCESS')
            }
          ])
          .then(
            function(successResults){
              self.success = successResults
            },
            function(err){
              self.err = err
            }
          )
      })
      waits(40)
      runs(function(){
        expect(this.err).toEqual('ERROR')
        expect(this.success).toBeFalsy()
      })
    })
    it('Should recieve same order in results array passed to callback as order of function stack, if tasks is array', function() {
      runs(function() {
        var self;
        self = this;
        async
          .parallel([
            function(callback) {
              setTimeout(function() {
                callback(null, 1)
              }, 30)
            },
            function(callback) {
              setTimeout(function() {
                callback(null, 2)
              }, 50)
            },
            function(callback) {
              setTimeout(function() {
                callback(null, 3)
              }, 10)
            },
          ])
          .then(function(results) {
            self.arr = results
          })
      })
      waits(150)
      runs(function() {
        expect(this.arr[0]).toEqual(1)
        expect(this.arr[1]).toEqual(2)
        expect(this.arr[2]).toEqual(3)
      })
    })
    it('should receive results object with same keys as task keys in tasks object', function() {
      runs(function() {
        var self = this;
        async
          .parallel({
            'foo': function(callback) {
              setTimeout(function() {
                callback(null, 'bar')
              },0)
            },
            'lorem': function(callback) {
              setTimeout(function() {
                callback(null, 'lipsum')
              },0)
            }
          })
          .then(function(results) {
            self.res = results
          })
      })
      waits(10)
      runs(function() {
        expect(this.res['foo']).toEqual('bar')
        expect(this.res['lorem']).toEqual('lipsum')
      })
    })
    it('should work with all sync tasks that doesnt rely an async tasks', function() {
      runs(function() {
        var self = this
        async
          .parallel([
            function(callback) {
              callback(null, 'someval')
            },
            function(callback) {
              callback(null, 'someval')
            },function(callback) {
              callback(null, 'someval')
            }

          ])
          .then(function(results) {
            self.res = 'YAY'
          }, function(err) {
            self.res = 'RUROH'
          })
      })
      waits(10)
      runs(function() {
        expect(this.res).toEqual('YAY')
      })
    })
  })

  describe('series', function(){
    it('should run tasks in succession and only call next task when current is finished', function() {
      runs(function() {
        var self;
        self = this;
        async.
          series([
            function(callback) {
              setTimeout(function() {
                callback(null, 1)
              }, 20)
            },
            function(callback) {
              setTimeout(function() {
                callback(null, 2)
              }, 50)
            },
            function(callback) {
              setTimeout(function() {
                callback(null, 3)
              }, 10)
            },
          ])
          .then(function(results) {
            self.arr = results
          })
      })
      runs(function() {
        expect(this.arr).toBeFalsy()
      })
      waits(120)
      runs(function() {
        expect(this.arr[0]).toEqual(1)
        expect(this.arr[1]).toEqual(2)
        expect(this.arr[2]).toEqual(3)
      })
    })
    it('should receive results object with same keys as task keys in tasks object', function() {
      runs(function() {
        var self = this;
        async
          .series({
            'foo': function(callback) {
              setTimeout(function() {
                callback(null, 'bar')
              },0)
            },
            'lorem': function(callback) {
              setTimeout(function() {
                callback(null, 'lipsum')
              },0)
            }
          })
          .then(function(results) {
            self.res = results
          })
      })
      waits(30)
      runs(function() {
        expect(this.res['foo']).toEqual('bar')
        expect(this.res['lorem']).toEqual('lipsum')
      })
    })
  })


  describe('Pipeline', function() {
    it('Should pass splat argument down the pipeline', function() {
      runs(function() {
        var self = this;
        async
          .pipeline([
            function(callback) {
              var obj = {}
              obj['foo'] = 'bar'
              callback(null, obj)
            },
            function(obj, callback) {
              obj['lorem'] = 'lipsum'
              callback(null, obj)
            },
            function(obj, callback) {
              obj['lol'] = true
              callback(null, obj)
            },
          ])
          .then(function(obj) {
            self.obj = obj
          })
      })
      waits(20)
      runs(function() {
        expect(this.obj['foo']).toEqual('bar')
        expect(this.obj['lorem']).toEqual('lipsum')
        expect(this.obj['lol']).toBeTruthy()
      })
    })

    it('Should be able to pass multiple arguments down the pipeline', function() {
      runs(function() {
        var self = this;
        async
          .pipeline([
            function(callback) {
              var arr = []
              callback(null, arr, 1, 2)
            },
            function(arr, one, two, callback) {
              arr.push(one)
              arr.push(two)
              callback(null, arr, 3, 4, 5)
            },
            function(arr, three, four, five, callback) {
              arr.push(three)
              arr.push(four)
              arr.push(five)
              callback(null, arr)
            }
          ]).then(function(arr) {
            self.arr = arr
          })
      })
      waits(20)
      runs(function() {
        expect(this.arr.length).toEqual(5)
        expect(this.arr[0]).toEqual(1)
        expect(this.arr[4]).toEqual(5)
      })
    })
    it('Should work with async tasks, and only proceed to next task when current is finished', function() {
      runs(function() {
        var self = this;
        async
          .pipeline([
            function(callback) {
              setTimeout(function() {
                callback(null, 'foo')
              }, 20)
            },
            function(foo, callback) {
              setTimeout(function() {
                self.first = true
                callback(null, foo, 'bar')
              }, 5)
            }
          ])
          .then(function(foo, bar) {
            self.foo = foo
            self.bar = bar
          })
      })
      runs(function() {
        expect(this.foo).toBeFalsy()
        expect(this.bar).toBeFalsy()
      })
      waits(10)
      runs(function() {
        expect(this.first).toBeFalsy()
      })
      waits(30)
      runs(function(){
        expect(this.foo).toEqual('foo')
        expect(this.bar).toEqual('bar')
      })
    })
  })

  describe('whilst', function() {
    it('should run function until test returns false', function() {
      runs(function() {
        var i,
            self;
        self = this
        i = 0;
        function lowerThanFive () {
          return i < 5
        }
        function incrementIt(cb){
          i++
          cb()
        }
        async
          .whilst(lowerThanFive, incrementIt, function done() {
            self.res = i
          })
      })
      waits(30)
      runs(function() {
        expect(this.res).toEqual(5)
      })
    })
  })

  describe('apply', function() {
    it('should return a function', function() {
      var fn;
      fn = async.apply(function() {}, 1, 2 ,3)
    })
    it('should return a function that runs the first parameter function with the rest of the argumentsplat as arguments', function() {
      var ori,
          applied,
          res;
      ori = function(a,b,c) {
        return a+b+c;
      }
      applied = async.apply(ori, 'a', 'b', 'c')
      res = applied()
      expect(res).toEqual('abc');
    })
    it('should throw error if first parameter isnt function', function() {
      var exception;
      try{
        async.apply(undefined, 1,2,3)
      } catch(e) {
        exception = e
      }
      expect(exception).toBeTruthy();
    })
  })


})

































