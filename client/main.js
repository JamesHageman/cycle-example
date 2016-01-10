import Cycle from '@cycle/core'
import CycleDOM from '@cycle/dom'
import isolate from '@cycle/isolate'
import { makeHTTPDriver } from '@cycle/http'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import { Observable, Subject } from 'rx'
import model from './model'
import view from './view'

const GET_TODOS_URL = `/todos`
const ADD_TODO_URL = `/todo/new`
const DELETE_TODO_URL = `/todo/delete`

function replicate(stream, subject) {
  if (!(subject && subject.onNext)) {
    throw new Error(`'${subject}' is not a subject.`)
  }
  stream.subscribe(x => subject.onNext(x), err => console.error(err))
}

function main(sources) {
  const actions = {
    receiveTodos$: sources.HTTP
      .filter(res => res.request.url === GET_TODOS_URL)
      .mergeAll(),

    newTodo$: sources.HTTP
      .filter(res => res.request.url === ADD_TODO_URL)
      .mergeAll(),

    showCompleted$: sources.DOM.select(`.js-show-completed`).events(`change`)
      .map(ev => ev.target.checked),

    submittedTodo$: new Subject(),

    todoDelete$: new Subject(),
    todoToggle$: new Subject(),
  }

  const newTodoReq$ = actions.submittedTodo$.map(({ model: todo }) => ({
    url: ADD_TODO_URL,
    method: `post`,
    send: {
      text: todo.text,
    },
  }))

  const getTodosReq$ = Observable.just(GET_TODOS_URL)

  const deleteTodoReq$ = actions.todoDelete$.map(id => ({
    url: DELETE_TODO_URL,
    method: `delete`,
    query: {
      id: id,
    },
    // execute even if we don`t need the response
    eager: true,
  }))

  const todoUpdate$ = actions.todoToggle$

  const updateTodoReq$ = todoUpdate$.map(id => function(state) {
    const todos = state.get(`todos`)
    const todo = todos.toArray().filter(t => t.get(`id`) === id)[0]

    if (!todo) {
      throw new Error(`Todo '${id}' not found.`)
    }

    const {
      text,
      completed,
    } = todo.toJS()

    return {
      url: `/todo/update`,
      method: `put`,
      send: {
        id,
        text,
        completed,
      },
      eager: true,
    }
  })

  const state$ = model(actions)

  const todoFilterFn$ = state$.map(state => state.get(`showCompleted`))
    .distinctUntilChanged()
    .map(showCompleted => function(todo) {
      if (showCompleted) {
        return true
      } else if (todo.get(`completed`)) {
        return false
      }
      return true
    })

  const req$ = Observable.merge(
    getTodosReq$,
    newTodoReq$,
    deleteTodoReq$,
    updateTodoReq$.withLatestFrom(state$, (fn, state) => fn(state))
  ).share()

  const form = isolate(TodoForm)({ DOM: sources.DOM })
  const list = isolate(TodoList)({
    DOM: sources.DOM,
    todos$: state$.map(state => state.get(`todos`)).distinctUntilChanged(),
    filterFn$: todoFilterFn$,
  })

  replicate(form.submit$, actions.submittedTodo$)
  replicate(list.removeTodo$, actions.todoDelete$)
  replicate(list.toggleTodo$, actions.todoToggle$)

  const vtree$ = view(state$, form.DOM, list.DOM)

  return {
    DOM: vtree$,
    HTTP: req$,
    log: state$.map(state => state.toJS()),
  }
}

let drivers = {
  DOM: CycleDOM.makeDOMDriver(`#mount`),
  HTTP: makeHTTPDriver(),
  log: (any$) => {
    any$.subscribe(x => console.log(x))
  },
}

Cycle.run(main, drivers)
