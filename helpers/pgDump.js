const fs = require('fs')
const util = require('util')
const moment = require('moment')

const writeFile = util.promisify(fs.writeFile)
const execFile = util.promisify(require('child_process').execFile)
const today = new Date()

module.exports = async function pgdump(config, dumpPath, backupName) {
    let now = moment()
    const day = moment(now).format('YYYY-MM-DD')
    let folderPath = `${config.SUB_ROOT}/${day}`
    let content = `cd /tmp
                mkdir -p ${folderPath}
                cd ${folderPath}
                BACKUPNAME="[BACKUP_NAME]"
                PGPASSWORD="[DB_PASS]" [EXE_PATH]/pg_dump -h [DB_ENDPOINT] -p [DB_PORT] -U [DB_USER] --dbname=[DB_NAME] | gzip -c > $BACKUPNAME
                   `
    let command = formCommand(content, config, backupName, day)
    console.log("COMMAND: ", [today, command])
    
    // Generating backupn script
    await writeFile(config.BACKUP_SCRIPT_PATH, command)
    // Adding executalbe permission to file
    fs.chmodSync(config.BACKUP_SCRIPT_PATH, '755')

    // Executing script
    const response = await execFile('/tmp/db_backup.sh');
    console.log("Child Process: STDIN, STDERR: ", [today, response])

    return response
}

function formCommand(content, config, backupName, day) {
    content = content.replace('[BACKUP_NAME]', backupName)
    content = content.replace('[DB_ENDPOINT]', process.env.PGHOST)
    content = content.replace('[DB_PORT]', process.env.PGPORT)
    content = content.replace('[DB_USER]', process.env.PGUSER)
    content = content.replace('[DB_PASS]', process.env.PGPASSWORD)
    content = content.replace('[DB_NAME]', process.env.PGDATABASE)
    content = content.replace('[EXE_PATH]', config.PGDUMP_PATH)
    
    return content
}