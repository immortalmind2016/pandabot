
var jwt = require('jsonwebtoken');
let User = require("../../model/User")
let axios = require("axios")

const path = require("path")
const fs = require("fs")
var Jimp = require("jimp");
var sizeOf = require('image-size');



const uploadImage = (req, res, err) => {
    const filePath = path.resolve( "public", "assets", "images", req.file.filename)
    fs.unlink(path.resolve("public", "assets", "images", req.params.oldimage), (err) => { })
    console.log(req.query, "QUERY")
    if (!req.query["type"]) {
        Jimp.read(
            filePath,
            async (err, lenna) => {
                if (err) throw err;
                const height = sizeOf().height

                await lenna

                    .resize(height * 1.92, height) // resize
                    .write(filePath); // save
                res.json({ img: "https://pandabotbeta2.herokuapp.com/assets/images/" + req.file.filename })
            })
    } else {
        res.json({ img: "https://pandabotbeta2.herokuapp.com/assets/images/" + req.file.filename })

    }


}
module.exports = {
    uploadImage
}