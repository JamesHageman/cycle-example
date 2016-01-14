/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />

interface Actions {
  increment$: Rx.Observable<Event>,
  decrement$: Rx.Observable<Event>,
  getTodos$: Rx.Observable<Todo[]>
}

interface Todo {
  id: number
  text: string
  completed: boolean
}

interface State {
  count: number
  todos: {
    [id: number]: Todo
  }
}

interface TodoFormData {
  model: {
    text: string,
    completed: boolean
  },
  validations: string[]
}

interface TodoFormActions {
  submit$: Rx.Observable<TodoFormData>
}