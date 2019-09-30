const fs = require('fs')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

module.exports = async function uploadS3(filePath, fileName) {
    var response = {err: ''}
    let fileBuffer = fs.readFileSync(filePath);
    const params = getParams(fileBuffer, fileName)

    let s3UploadPromise = new Promise(function(resolve, reject) {
        s3.putObject(params, function(s3Err, data) {
            if(s3Err) {
                response.err = s3Err
                resolve(response)
            }else {
                console.log(`File uploaded successfully at ${data.Location}`)
                resolve(response)
            }
        })
    })
    
    let s3Response = await s3UploadPromise
    return s3Response
}

function getParams(fileBuffer, fileName) {
    return {
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: fileBuffer
    }
}