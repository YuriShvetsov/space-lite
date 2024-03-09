import '/node_modules/forerunnerdb/js/dist/fdb-all.js'

import { DB_NAME, DB_DRIVER } from '../config'

const fdb = new ForerunnerDB();
const db = fdb.db(DB_NAME)

db.persist.driver(DB_DRIVER)

export { db }
