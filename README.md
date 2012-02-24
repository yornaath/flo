#flo
flo is a library for managing the flow of your code and application. It has functions for performing varius async tasks in parallel or series.

## Installing
For use with nodejs just use npm

```
$ npm install flo
```

```javascript
var flo = require('flo')
```

For use in the browser, the library can be required by a AMD module loader, for example requirejs  

```javascript
require([
  'flo/flo.j'  
], function(flo){
  flo.parallel...
})
```

###flo.parallel
Run several async tasks in paralell and execute a callback when everyone of them is finished. The callback recieves a results array or object depending on the tasks collection type.
Returns a promise object that is either failed if a callback receives error, or fulfilled if all passes. Se /classes/Promise docs for reference.

```javascript
flo.
  parallel([
    function(callback) {
      callback(null, "foo") //when some async task is finished
    },
    function(callback) {
      callback(null, "bar") //when some async task is finished
    },
    function(callback) {
      callback(null, "lol") //when some async task is finished
    }
  ])
  .then(
    function(results) {
      results[0] == "foo" // TRUE
      results[1] == "bar" // TRUE
      results[2] == "lol" // TRUE
    }, 
    function(err) { 
      /* this wont get called since all callbacks got null as error param */
    })
```
Or passing an object as tasks collection:

```javascript
flo.
  parallel({
    foo: function(callback) {
      callback(null, "bar") //when some async task is finished
    },
    lawl: function(callback) {
      callback(null, "lol") //when some async task is finished
    },
    lorem: function(callback) {
      callback(null, "lipsum") //when some async task is finished
    }
  })
  .then(
    function(results) {
      results['foo']    == "bar"    // TRUE
      results['lawl']   == "lol"    // TRUE
      results['lorem']  == "lipsum" // TRUE
    }, 
    function(err) { 
      /* this wont get called since all callbacks got null as error param */
    })
```
###flo.series
Runs a set of tasks in series/sequence. Next task wont execute until current task callbacks without error. Largely the same as paralell but in series.

```javascript
flo
  .series([
    function(callback) {
      setTimeout(function() {
        callback(null, 1)
      },100)
    },
    function(callback) {
      setTimeout(function() {
        callback(null, 2)
      },300)
    },
    function(callback) {
      setTimeout(function() {
        callback(null, 3)
      },200)
    }
  ])
  .then(
    function(results) {
      results[0] == 1 // TRUE
      results[1] == 2 // TRUE
      results[2] == 3 // TRUE
    }, 
    function(error) {
      /* this wont get called since all callbacks got null as error param */
    })
```

###flo.pipeline
Runs a set of tasks in series like async.series. But passes arguments received by callback on to the next task.

```javascript
flo
  .pipeline([
    function(pipe) {
      User.getById(1, pipe)
    },
    function(user, pipe) {
      user.getSubusers(function(err, subusers) {
        if(err) pipe(err)
        else {
          user.subUsers.add(subusers)
          pipe(null, user)
        }
      })
    },
    function(user, pipe) {
      user.getPosts(function(err, posts) {
        if(err) pipe(err)
        else {
          user.posts.add(posts)
          pipe(null, user)
        }
      })
    },
  ])
  .then(
    function(user) {
      //Now user instance has loaded subusers and posts.
      user.subUsers.render('listview', '#subusers') //Rendering is beyond scope of this lib
      user.posts.render('listview', '#posts')
    }, 
    function(error) {
      /* this wont get called since all pipe callbacks got null as error param */
    })
```

##Tests
The jasmine test framework is ised to test the code. To run the tests do one of the following:

```
$ cd flo
$ npm test
```