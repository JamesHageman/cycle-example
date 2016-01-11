import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import methodOverride from 'method-override'
import Todo from './models/todo'
import { resolve } from 'path'

const app = express()
app.use(bodyParser.json())
app.use(methodOverride())
app.use(compression())
app.use(express.static(resolve(__dirname + `/../public`)))

app.get(`/todos`, (req, res, next) => {
  Todo.findAll({
    order: [
      [`createdAt`, `ASC`],
    ],
  }).then(todos => res.json(todos)).catch(next)
})

app.post(`/todo/new`, (req, res, next) => {
  Todo.create({
    text: req.body.text,
    completed: false,
  }).then(todo => res.json(todo)).catch(next)
})

app.put(`/todo/update`, (req, res, next) => {
  const {
    text,
    completed,
    id,
  } = req.body

  Todo.findById(id)
    .then(todo => todo.update({ text, completed }))
    .then(todo => res.json(todo)).catch(next)
})

app.delete(`/todo/delete`, (req, res, next) => {
  const { id } = req.query
  Todo.destroy({
    where: { id: id },
  }).then(() => res.json({ id: id })).catch(next)
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    status: 1,
    data: null,
    error: err.message,
  })
})

export default app
