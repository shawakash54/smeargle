const moment = require('moment')
const path = require('path')
var util = require('util')
const exec = util.promisify(require('child_process').exec)
const today = new Date()

module.exports = {
    backupPath: function(dbName, rootPath, subRoot) {
        let now = moment()
        const timestamp = moment(now).format('DD-MM-YYYY@HH-mm-ss')
        const day = moment(now).format('YYYY-MM-DD')

        const fileName = `${dbName}-${timestamp}.backup.gz`
        const pathName = path.join(rootPath || '', subRoot || '', day, fileName)
        console.log([today, fileName, pathName])
        return { pathName, fileName }
    },
    cleanupLocalBackup: async function(backupPath) {
        console.log("Attempting to clean up local backup: ", [today, backupPath])
        return await exec(`rm ${backupPath}`);
    }
}
