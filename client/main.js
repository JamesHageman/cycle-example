import { makeHTTPDriver } from '@cycle/http'
import Cycle from '@cycle/core'
import CycleDOM from '@cycle/dom'
import TodoAppMain from './TodoApp'
import { Observable } from 'rx'

let drivers = {
  DOM: CycleDOM.makeDOMDriver(`#mount`),
  HTTP: makeHTTPDriver(),
  log: (any$) => {
    any$.subscribe(x => console.log(x))
  },
}

// const main = (sources) => {
//   const _sinks = TodoAppMain(sources)
//   _sinks.HTTP = Observable.empty()
//   return _sinks
// }

Cycle.run(TodoAppMain, drivers)
