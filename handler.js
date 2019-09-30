'use strict'
const uploadS3 = require('./helpers/s3-upload')
const pgDump = require('./helpers/pgDump')
const utils = require('./helpers/utils')
const today = new Date()
const defaultConfig = require('./helpers/config')

/*
    TODO:
      1. child_process.exec has a buffer limit
         Replace with child_process.spawn method and make it a streaming process.
        
      2. Encrypt the stream and forward to S3 stream uploader.

      3. Make a streaming upload to S3, with display of percentage upload.

      4. Change LD_LIBRARY_PATH to pg_dump executable directory.

      5. Check for pg_dump errors
*/


module.exports.snap = async event => {
  const config  = Object.assign({}, defaultConfig, event)

  let {status, message} = safeCheck(config)
  console.log("Step 1: Safety check: ", [today, status, message])
  if(status == 1) // safe check failed
    throw new Error(message)

  // Path for the DB dump
  const { pathName: path, fileName } = utils.backupPath(process.env.PGDATABASE, config.ROOT, config.SUB_ROOT)
  console.log("Step 2: Generating backup path: ", [today, path, fileName])
  const pgDumpResponse = await pgDump(config, path, fileName)

  if(pgDumpResponse.stderr) {
    console.log("Error happened during pg_dump: ", [today, pgDumpResponse])
    throw new Error(pgDumpResponse.stderr)
  }

  console.log("Step 3: pg_dump successfully done: ", [today])

  // upload to S3
  console.log("Attempting S3 upload", [today])
  const s3uploadResponse = await uploadS3(path, fileName)
  if(s3uploadResponse.err) {
    console.log("Error happened during s3 upload: ", [today, s3uploadResponse])
    throw new Error(s3uploadResponse.err)
  }

  console.log("Step 4: S3 upload completed: ", [today])

  // clean up local backup
  const cleanupResponse = await utils.cleanupLocalBackup(path)
  if(cleanupResponse.stderr) {
    console.log("Error happened during local backup clean: ", [today, cleanupResponse])
    throw new Error(cleanupResponse.stderr)
  }
  console.log("Step 5: Local backup cleaned: ", [today, fileName, cleanupResponse])

};

function safeCheck() {
  let status = 0, message = ""

  if(!process.env.PGDATABASE) {
    status = 1
    message = 'PGDATABASE not provided in the event data'
  }
  if(!process.env.S3_BUCKET) {
    status = 1
    message = 'S3_BUCKET not provided in the event data'
  }

  return {status, message}
}
