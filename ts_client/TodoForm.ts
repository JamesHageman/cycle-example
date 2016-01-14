/// <reference path="./typings/types" />

import { h } from '@cycle/dom'
import serialize from 'form-serialize'
import { update } from './update'
import validate from 'validate.js'
const todoValidations = require('../shared/validations/todo').default

const initialData: TodoFormData = {
  model: {
    text: ``,
    completed: false,
  },
  validations: null,
}

const retInitialData = () => initialData

function intent(DOM: DOMSource): TodoFormActions {
  const submitEvent$ = DOM.select(`.todoForm`).events(`submit`)
    .do(ev => ev.preventDefault())

  const submit$ = submitEvent$.map(ev =>
    update(initialData, {
      $set: {
        model: serialize<Todo>(ev.target as HTMLFormElement, { hash: true })
      }
    })
  )

  return {
    submit$,
  }
}

function model(actions: TodoFormActions): {
  formData$: Rx.Observable<TodoFormData>,
  submit$: Rx.Observable<TodoFormData>
} {
  const dataWithValidation$ = actions.submit$.map<TodoFormData>(todo => ({
    validations: validate(todo.model, todoValidations),
    model: todo.model,
  }))

  const validData$ = dataWithValidation$.filter(data => !data.validations)
  const invalidData$ = dataWithValidation$.filter(data => !!data.validations)

  const formData$ = invalidData$
    .merge(validData$.map(retInitialData))
    .startWith(initialData)

  return {
    formData$,
    submit$: validData$,
  }
}

function view({ formData$ }) {
  return formData$.map(({ model: todo, validations }) =>
    h(`form.todoForm`, [
      h(`input`, {
        type: `text`,
        name: `text`,
        value: todo.text,
      }),
      validations && validations.text && validations.text[0],
    ])
  )
}

export default function TodoForm(sources: { DOM: DOMSource }): { 
  DOM: VTree$, 
  submit$: Rx.Observable<TodoFormData>
} {
  const actions = intent(sources.DOM)
  const state = model(actions)
  const view$ = view(state)

  return {
    DOM: view$,
    submit$: state.submit$,
  }
}
