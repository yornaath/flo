if(typeof module !== 'undefined' && module.exports){
  var splat = require('../lib/splat')
}

describe('Helpers spec', function() {
  
  describe('mapSplat', function() {
    it('should return rest of the arguments starting on index of agument index', function() {
      var args;
      function test(zero, one, two, three, four) {
        return splat(arguments, 1)
      }
      args = test(1,2,3,4,5)
      expect(args.length).toEqual(4)
      expect(args[0]).toEqual(2)
      expect(args[1]).toEqual(3)
      expect(args[2]).toEqual(4)
      expect(args[3]).toEqual(5)
    })
  })

})