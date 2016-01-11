import { div, input, label } from '@cycle/dom'

function view(state$, formView$, listView$) {
  return state$.combineLatest(formView$, listView$)
    .map(([state, formView, listView]) =>
      div([
        formView,
        state.get(`todos`).size,
        label([
          input(`.js-show-completed`, {
            type: `checkbox`,
            checked: state.get(`showCompleted`),
          }),
          `Show Completed`,
        ]),
        listView,
      ])
    )
}

export default view
