import Immutable from 'immutable'
import { Observable } from 'rx'

const invert = x => !x

export default function model({
  receiveTodos$,
  newTodo$,
  todoDelete$,
  todoToggle$,
  showCompleted$,
  updateTodoFromServer$,
}) {
  const initial = Immutable.fromJS({
    todos: [],
    showCompleted: true,
  })

  const getTodosMod$ = receiveTodos$.map(res => function(state) {
    return state.set(`todos`, Immutable.fromJS(res.body))
  })

  const addTodoMod$ = newTodo$.map(res => function(state) {
    return state.updateIn([`todos`], todos =>
      todos.push(Immutable.fromJS(res.body)))
  })

  const removeTodoMod$ = todoDelete$.map(id => function(state) {
    return state.updateIn([`todos`],
      todos => todos.filter(todo => todo.get(`id`) !== id))
  })

  const toggleTodoMod$ = todoToggle$.map(id => function(state) {
    return state.updateIn([`todos`],
      todos =>
        todos.map(todo => {
          if (todo.get(`id`) === id) {
            return todo.updateIn([`completed`], invert)
          }
          return todo
        }))
  })

  const serverUpdateMod$ = updateTodoFromServer$.map(todo => function(state) {
    return state.set(`todos`,
      state.get(`todos`).map(t => {
        if (t.get(`id`) === todo.id) {
          return t.merge(todo)
        }
        return t
      })
    )
  })

  const showCompletedMod$ = showCompleted$.map(show => function(state) {
    return state.set(`showCompleted`, !!show)
  })

  const modification$ = Observable.merge(
    getTodosMod$,
    addTodoMod$,
    removeTodoMod$,
    toggleTodoMod$,
    showCompletedMod$,
    serverUpdateMod$
  )

  return Observable.just(initial)
    .merge(modification$)
    .scan((state, modFn) => modFn(state))
    .shareReplay(1)
}
