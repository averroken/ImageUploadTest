var fs = require('fs');

var express = require('express');
var app = express();

var multer = require('multer');
var upload = multer(
    {
        limits: {
            fieldNameSize: 999999999,
            fieldSize: 999999999
        },
        dest: 'uploads/' }
    );

app.get('/', function(req, res){
    res.send(
        '<form action="/upload" method="post" enctype="multipart/form-data">'+
        '<input type="file" name="source">'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
});

app.post('/upload', upload.any(), function(req, res){

    console.log("file: " + req.files);

    var tmp_path = req.files[0].path;

    var target_path = 'uploads/' + req.files[0].originalname;

    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function() { res.send("ok: " + target_path); });
    src.on('error', function(err) { res.send({error: "upload failed"}); });
});

app.get('/info', function(req, res){
    console.log(__dirname);
    res.send("image upload server: post /upload");
});

app.use('/uploads', express.static('uploads'));

var port = process.env.PORT || 8080;
app.listen(port);
console.log('listening on: ' + port);
