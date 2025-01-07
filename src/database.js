require('../settings');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mongoose = require('mongoose');
let DataBase;

// Fallback if tempatDB is not set
if (!global.tempatDB) {
    global.tempatDB = 'database.json';  // Default to json if not specified
}

if (/mongo/.test(global.tempatDB)) {
    DataBase = class mongoDB {
        constructor(url = 'mongodb://localhost:27017/mydb', options = { useNewUrlParser: true, useUnifiedTopology: true }) {
            this.url = url;
            this.data = {};
            this._model = null;
            this.options = options;
        }

        read = async () => {
            await mongoose.connect(this.url, this.options);
            this.connection = mongoose.connection;
            
            if (!this._model) {
                const schema = new mongoose.Schema({
                    data: { type: Object, required: true, default: {} }
                });
                this._model = mongoose.models['data'] || mongoose.model('data', schema);
            }
            
            this.data = await this._model.findOne({});
            if (!this.data) {
                this.data = await new this._model({ data: {} }).save();
            }
            return this.data.data || {};
        }

        write = async (data) => {
            if (!this.data) return;
            
            if (!this.data.data) {
                this.data = await new this._model({ data }).save();
            } else {
                this.data.data = data;
                await this.data.save();
            }
        }
    }
} else if (/json/.test(global.tempatDB)) {
    DataBase = class dataBase {
        constructor() {
            this.data = {};
            this.file = path.join(process.cwd(), 'database', global.tempatDB);
        }

        read = async () => {
            if (fs.existsSync(this.file)) {
                this.data = JSON.parse(fs.readFileSync(this.file, 'utf-8'));
            } else {
                fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
            }
            return this.data;
        }

        write = async (data) => {
            this.data = data || global.db;
            const dirname = path.dirname(this.file);
            
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname, { recursive: true });
            }
            
            fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
        }
    }
} else {
    throw new Error('Unsupported database type. Set global.tempatDB to "mongo" or "json".');
}

module.exports = DataBase;

// Hot reload to track updates in the code
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update detected in ${__filename}`));
    delete require.cache[file];
    require(file);
});
