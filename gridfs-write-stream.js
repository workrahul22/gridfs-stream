const assert = require("assert");
const fs = require("fs");
const mongodb = require("mongodb");

const uri = "mongodb://localhost:31001";
const dbName = "eigen_files";

var handleConnect = (error, client) => {
    console.log("working");
    console.log(error);
    console.log(client);
    assert.ifError(error);
    
    const db = client.db(dbName);

    var bucket = new mongodb.GridFSBucket(db);

    fs.createReadStream('./rahul.mp4').pipe(bucket.openUploadStream("rahul.mp4"))
    .on('error',(error) => {
        assert.ifError(error);
        console.log(error);
        process.exit(1);
    })
    .on("data",(error,chunk) => {
        console.log(error);
        console.log(chunk);
    })
    .on('finish',() => {
        console.log('done');
        process.exit(0);
    });
}

mongodb.MongoClient.connect(uri,handleConnect);