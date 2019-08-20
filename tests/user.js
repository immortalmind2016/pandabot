let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
var assert = require('assert');

chai.use(chaiHttp);
const server="http://localhost:8000"

describe("#signup",()=>{
    it("should return ",(done)=>{
        chai.request(server)
        .get("/api/user/signup")
        .send({data:{name:"mohamed Salah"}})
        .end((err,res)=>{
            res.body.should.have.a("object")
           // res.body.should.have.property("success")
            done()
        })
    })
})
