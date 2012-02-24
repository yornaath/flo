
if(typeof module !== 'undefined' && module.exports){
  var array = require('../lib/array')
}

describe('array', function(){
  
  describe('forEach', function(){
    it('Should run iterating function for each value in array and pass the value as parameter to iterator', function(){
      var res;
      res = []
      array.forEach(['a', 'b', 'c'], function(val, i, collection){
        res[i] = val
      })
      expect(res[0]).toEqual('a')
      expect(res[1]).toEqual('b')
      expect(res[2]).toEqual('c')
    })
    it('Should handle objects as well as arrays', function() {
      var res;
      res = {}
      array.forEach({ foo: 'bar', lawl: 'lol'}, function(val, key, collection) {
        res[key] = val
      })
      expect(res['foo']).toEqual('bar')
      expect(res['lawl']).toEqual('lol')
    })
  })

  describe('forEachSeries', function(){
    it('Should do the same as forEach, but wont call next iterator until current one is finisehd processing', function(){
      runs(function() {
        var self
        self = this
        this.res = []
        array.forEachSeries(['a', 'b', 'c'], function(val, i, arr, callback){
          setTimeout(function() {
            self.res.push(val)
            callback()
          }, 25)
        }, function(){ })
      })
      runs(function() {
        expect(this.res.length).toBeLessThan(3)
      })
      waits(120)
      runs(function() {
        expect(this.res.length).toEqual(3)
        expect(this.res[0]).toEqual('a')
        expect(this.res[1]).toEqual('b')
        expect(this.res[2]).toEqual('c')
      })
    })
    it('Should handle objects as well as arrays', function() {
      runs(function() {
        var self
        self = this
        this.res = {}
        array.forEachSeries({ foo: 'bar', lawl: 'lol'}, function(val, key, collection, callback){
          setTimeout(function() {
            self.res[key] = val
            callback()
          }, 25)
        }, function(){ })
      })
      waits(120)
      runs(function() {
        expect(this.res['foo']).toEqual('bar')
        expect(this.res['lawl']).toEqual('lol')
      })
    })
    it('Should should pass the right index to the iterator function', function(){
      runs(function() {
        var self
        self = this
        this.indexes = []
        array.forEachSeries(['a', 'b', 'c'], function(val, i, arr, callback){
          setTimeout(function() {
            self.indexes.push(i)
            callback()
          }, 25)
        }, function(){ })
      })
      runs(function() {
        expect(this.indexes.length).toBeLessThan(3)
      })
      waits(120)
      runs(function() {
        expect(this.indexes.length).toEqual(3)
        expect(this.indexes[0]).toEqual(0)
        expect(this.indexes[1]).toEqual(1)
        expect(this.indexes[2]).toEqual(2)
      })
    })
    it('Should should proceeed directly to callback on error and quit the iteration', function(){
      runs(function() {
        var self,
        self = this
        this.shouldBeFalsy = false
        this.error = false
        array.forEachSeries(['a', 'b', 'c'], function(val, i, arr, callback){
          setTimeout(function() {
            if(val == 'b') {
              callback('ERROR')
            } else if(val == 'c') {
              self.shouldBeFalsy = true
              callback()
            } else {
              callback()
            }
          }, 25)
        }, function(err){
          self.error = err
        })
      })
      waits(120)
      runs(function() {
        expect(this.shouldBeFalsy).toBeFalsy()
        expect(this.error).toEqual('ERROR')
      })
    })
  })

  describe('map', function(){
    it('Should run iterator function for each value in array, put the return value of iterator in a results array and return results array', function(){
      var res;
      res = array.map([1,2,3], function(val){
        return val + 1;
      })
      expect(res[0]).toEqual(2)
      expect(res[1]).toEqual(3)
      expect(res[2]).toEqual(4)
    })
    it('Should handle objects as well as arrays as collection parameter', function() {
      var res;
      res = array.map({foo: 'bar', lorem: 'lipsum'}, function(val) {
        return 'processed_'+val
      })
      expect(res['foo']).toEqual('processed_bar');
      expect(res['lorem']).toEqual('processed_lipsum');
    })
  })

  describe('mapSeries', function(){
    it('Should', function(){
      runs(function() {
        var self = this;
        array.mapSeries([1,2,3], function(val, key, callback) {
          callback(null, val+1)
        }).then(function(res) {
          self.res = res  
        })
      })
      waits(50)
      runs(function() {
        expect(this.res[0]).toEqual(2)
        expect(this.res[1]).toEqual(3)
        expect(this.res[2]).toEqual(4)
      })
    })
  })

})

















