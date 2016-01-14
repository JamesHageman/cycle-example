/// <reference path="./typings/types" />

import { run } from '@cycle/core'
import { h, makeDOMDriver } from '@cycle/dom'
import { makeHTTPDriver } from '@cycle/http'
import * as Rx from 'rx'
import { update } from './update' 
import TodoForm from './TodoForm'

function identity<T>(x: T): T {
  return x;
}

function intent(sources: { DOM: DOMSource, HTTP: HTTPSource }): Actions {
  const { DOM, HTTP } = sources;

  return {
    increment$: DOM.select('.inc').events('click'),
    decrement$: DOM.select('.dec').events('click'),
    getTodos$: HTTP.filter(res => res.request.url === '/todos').mergeAll()
      .map(res => res.body as Todo[])
  }
}

function model(actions: Actions): Rx.Observable<State> {
  const initial: State = {
    count: 0,
    todos: {}
  }

  const incMod$ = actions.increment$.map(() => function (state: State) {
    return update(state, {
      $merge: {
        count: state.count + 1
      }
    })
  })

  const decMod$ = actions.decrement$.map(() => function(state: State) {
    return update(state, {
      $merge: {
        count: state.count - 1
      }
    })
  })

  const getTodosMod$ = actions.getTodos$.map(todos => function(state: State) {
      let todoMap: {[id: number]: Todo} = {};
      todos.forEach((todo: Todo) => {
        todoMap[todo.id] = todo
      })

      return update(state, {
        $merge: {
          todos: todoMap
        }
      })
    })

  type StateReducer = (s: State) => State

  const mod$: Rx.Observable<StateReducer> = Rx.Observable.merge(
    incMod$, decMod$, getTodosMod$
  ).startWith(identity);

  const state$ = mod$.scan(
    (state: State, fn: StateReducer) => fn(state)
    , initial
  )

  return state$.distinctUntilChanged().shareReplay(1)
}

type Req$ = Rx.Observable<HTTPRequest>

function requests(actions: Actions, state$: Rx.Observable<State>): Req$ {
  // immediately fetch todos
  const getTodosReq$ = Rx.Observable.of({
    url: '/todos',
    method: 'get'
  });

  return Rx.Observable.merge(getTodosReq$);
}

function view(
  state$: Rx.Observable<State>,
  formView$: VTree$
): VTree$ {
  return state$.combineLatest(formView$, (state, formView) =>
    h('div', [
      'hello, ts',
      h('button.inc', '+'),
      h('button.dec', '-'),
      state.count,
      formView
    ])
  )
}

function main(sources: { DOM: DOMSource, HTTP: HTTPSource }) {
  const proxyActions = {
    todoSubmit$: new Rx.Subject<TodoFormData>()
  }
  const actions = intent(sources)
  const state$ = model(actions)
  const req$ = requests(actions, state$)
  
  const form = TodoForm({ DOM: sources.DOM })
  const vtree$ = view(state$, form.DOM)

  return {
    DOM: vtree$,
    HTTP: req$,
    log: state$.map(x => ['State: ', x])
  }
}

run(main, {
  DOM: makeDOMDriver('#mount'),
  HTTP: makeHTTPDriver(),
  log: function (s$: Rx.Observable<any[]>) {
    s$.subscribe(x => console.log.apply(console, x))
  }
})
