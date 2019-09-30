const path = require('path')

module.exports = {
    PGDUMP_PATH: path.join( __dirname, '../bin/postgres-11.3' ),
    BACKUP_SCRIPT_PATH: '/tmp/db_backup.sh',
    ROOT: '/tmp',
    SUB_ROOT: 'daily-backups'
}