import Sequelize from 'sequelize'

const db = new Sequelize(`cycle`, `james`, `123`, {
  host: `localhost`,
  dialect: `sqlite`,
  storage: `database.sqlite`,
})

export default db
