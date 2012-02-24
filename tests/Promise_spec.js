
if(typeof module !== 'undefined' && module.exports){
  var Promise = require('../lib/Promise')
}

describe('Promise', function(){

  var promise;

  beforeEach(function(){
    promise = new Promise()
  })

  it('Should should set out to "SUCCESS" on fulfilling promise', function(){
    var out;
    promise
      .then(function( success ){
        out = success
      }, function( error ){
        out = error
      })
    promise.fulfill("SUCCESS")
    expect(out).toEqual("SUCCESS")
  })

  it('Should should set out to "ERROR" on failing promise', function(){
    var out;
    promise
      .then(function( success ){
        out = success
      }, function( error ){
        out = error
      })
    promise.fail("ERROR")
    expect(out).toEqual('ERROR')
  })

  it('Should pass fulfilled arguments on to next then calls fulfilled handler on fulfilling promise', function(){
    var val,
        array;
    promise
      .then(function( fortytwo, fortythree ){
        this.fulfill(fortytwo + 2, fortythree)
      })
      .then(function( fortyfour, fortythree){
        val = fortyfour
        argumentsLength = arguments.length
      })
    promise.fulfill(42, 43)
    expect(val).toEqual(44)
    expect(argumentsLength).toEqual(2)
  })

  it('Should pass fail arguments on to next then calls failed handler on failinf promise', function(){
    var val,
        array,
        falsy;
    falsy = false
    promise
      .then(function( fortytwo, fortythree ){
        this.fail(fortytwo + 2, fortythree)
      })
      .then(function( sucess ){
        //SHould be ignored
        falys = true
      },
      function( fortyfour, fortythree){
        val = fortyfour
        argumentsLength = arguments.length
      })
    promise.fulfill(42, 43)
    expect(val).toEqual(44)
    expect(argumentsLength).toEqual(2)
    expect(falsy).toBeFalsy()
  })

  it('Should wait for preceding promise to fulfill before executing next .then() call', function(){
    runs(function(){
      this.arr = []
      var test = this
      promise
        .then(function(){
          var self = this;
          setTimeout(function(){
            test.arr.push(1)
            self.fulfill()
          },150)
        })
        .then(function(){
          setTimeout(function(){
            test.arr.push(2)
          },50)
        })
      promise.fulfill()
    })
    waits(300)
    runs(function(){
      expect(this.arr[0]).toEqual(1)
      expect(this.arr[1]).toEqual(2)
    })
  })

})












