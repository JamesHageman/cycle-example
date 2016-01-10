import { form, input } from '@cycle/dom'
import serialize from 'form-serialize'
import validate from 'validate.js'
import todoValidations from '../shared/validations/todo'

const initialData = {
  model: {
    text: ``,
    completed: false,
  },
  validations: null,
}

const retInitialData = () => initialData

function intent(DOM) {
  const submitEvent$ = DOM.select(`.todoForm`).events(`submit`, true)
    .doAction(ev => ev.preventDefault())

  const submit$ = submitEvent$.map(ev =>
    Object.assign({}, initialData.model, serialize(ev.target, { hash: true }))
  )

  return {
    submit$,
  }
}

function model(actions) {
  const dataWithValidation$ = actions.submit$.map(todo => ({
    validations: validate(todo, todoValidations),
    model: todo,
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
    form(`.todoForm`, [
      input({
        type: `text`,
        name: `text`,
        value: todo.text,
      }),
      validations && validations.text && validations.text[0],
    ])
  )
}

function TodoForm({ DOM }) {
  const actions = intent(DOM)
  const state = model(actions)
  const view$ = view(state)

  return {
    DOM: view$,
    submit$: state.submit$,
  }
}

export default TodoForm
