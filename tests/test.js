var assert = require('assert');
var path=require("path")
let {batching,sendToAll}=require(path.resolve("helpers","broadcast"))
describe('helpers', function() {
 describe("#broadcast",()=>{

  describe('-batching', function() {
    it('should return 1 batch with 3 elements', function() {
      assert.equal(batching([1,2,3]).length,1);
    });
    it('should return 3 elements', function() {
      assert.equal(batching([1,2,3])[0].length,3);
    });
    
   
  });
   describe('-sendToAll', function() {
    it('should return empty char', function(done) {
            sendToAll([],"{text:Mohamed}",{access_token:"ABCD515D"}).then((data)=>{
            assert.equal(data,"");
            done()
            })
    });

    
   
  });
   })
});


