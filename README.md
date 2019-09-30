# Smeargle

#### AWS only allows 100 manual snapshot of RDS. To bypass the limit of the snapshots, the service has been created.

1. It connects to your postgres db
2. It gzips the snapshot of the db and stores it locally
3. It then pushes the gzip snapshot to s3
4. It cleans up the local backup


### Steps to deployment:

- mv env.sample env.yml
- Fill the data in env.yml
- Please make sure the aws user has access to s3
- `sls deploy`


- `sls invoke local -f snap`   || To run it locally



## TODO:
- child_process.exec has a buffer limit
  Replace with child_process.spawn method and make it a streaming process.
        
- Encrypt the stream and forward to S3 stream uploader.

- Make a streaming upload to S3, with display of percentage upload.

- Change LD_LIBRARY_PATH to pg_dump executable directory.

- Check for pg_dump errors