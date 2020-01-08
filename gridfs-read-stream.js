const assert = require("assert");
const fs = require("fs");
const mongodb = require("mongodb");
const express = require("express");
const uri = "mongodb://localhost:31001";
const dbName = "eigen_files";

var handleConnect = (error, client) => {
    console.log("working");
    console.log(error);
    console.log(client);
    assert.ifError(error);
    
    const db = client.db(dbName);

    var bucket = new mongodb.GridFSBucket(db);

    bucket.openDownloadStreamByName("rahul.mp4").pipe(fs.createWriteStream("./output.mp4"))
    .on("error",(error) => {
        assert.ifError(error);
        process.exit(0);
    })
    .on("finish",()=>{
        console.log("done");
        process.exit(0);
    })
}

mongodb.MongoClient.connect(uri,handleConnect);