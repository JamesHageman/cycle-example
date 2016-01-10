import { ul, li, div, span, button } from '@cycle/dom'

function intent(DOM) {
  const removeTodo$ = DOM.select(`.js-remove-todo`).events(`click`)
    .map(ev => parseInt(ev.target.getAttribute(`data-todo-id`), 10))

  const toggleTodo$ = DOM.select(`.js-toggle-todo`).events(`click`)
    .map(ev => parseInt(ev.target.getAttribute(`data-todo-id`), 10))

  return {
    removeTodo$,
    toggleTodo$,
  }
}

function model(actions, todos$, filterFn$) {
  return todos$.combineLatest(filterFn$,
    (todos, filterFn) => ({ todos, filterFn }))
}

function renderTodo(todo) {
  const id = todo.get(`id`)

  return li({ key: id }, [
    span(`.js-toggle-todo`, {
      attributes: {
        'data-todo-id': id,
      },
    },
      [todo.get(`completed`) ? `! ` : ``, todo.get(`text`)]
    ),
    button(`.js-remove-todo`, {
      attributes: {
        'data-todo-id': id,
      },
    }, `x`),
  ])
}

function view(state$) {
  return state$.map(({ todos, filterFn }) =>
    div([
      ul(todos.filter(filterFn).map(renderTodo).toArray()),
    ])
  )
}

function TodoList({ DOM, todos$, filterFn$ }) {
  const actions = intent(DOM)
  const state$ = model(actions, todos$, filterFn$)
  const vtree$ = view(state$)

  return {
    DOM: vtree$,
    removeTodo$: actions.removeTodo$,
    toggleTodo$: actions.toggleTodo$,
  }
}

export default TodoList
