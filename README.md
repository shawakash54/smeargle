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
