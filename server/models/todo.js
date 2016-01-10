import db from '../db'
import { TEXT, BOOLEAN } from 'sequelize'
import todoValidations from '../../shared/validations/todo'
import createModelValidator from '../createModelValidator'

const Todo = db.define(`todo`, {
  text: {
    type: TEXT,
  },
  completed: {
    type: BOOLEAN,
  },
}, {
  validate: createModelValidator(todoValidations),
})

export default Todo
