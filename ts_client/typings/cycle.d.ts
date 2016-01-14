/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />

interface VNode {
  children: VNode[],
  count: number,
  key: number | string,
  properties: {},
  tagName: string
}

declare type VTree$ = Rx.Observable<VNode>

interface DOMSelection {
  events(eventName: string): Rx.Observable<Event>
}

interface DOMSource {
  select(selector: string): DOMSelection
}

interface HTTPRequest {
  url: string,
  method?: string,
  send?: any,
  eager?: boolean,
  query?: any,
  headers?: {
    [key: string]: string
  },
  accept?: string,
  type?: string,
  user?: string,
  password?: string,
  field?: {},
  attach?: Array<{name: string, path: string, filename: string}>,
  withCredentials?: boolean,
  redirects?: number
}

interface HTTPResponse {
  body: any,
  text: string,
  header: {
    [key: string]: string
  },
  type: string,
  status: number,
  statusType: number
}

interface HTTPRes$ extends Rx.Observable<HTTPResponse> {
  request: HTTPRequest
}

declare type HTTPSource = Rx.Observable<HTTPRes$>;

declare module '@cycle/core' {
  export function run(mainFn: any, drivers: {
    [key: string]: (sink$?: Rx.Observable<any>) => any
  }): any
}

declare module '@cycle/dom' {
  export function makeDOMDriver(selector: string): any;
  export function h(...args: any[]): VNode;
}

declare module '@cycle/http' {
  export function makeHTTPDriver(options?: { eager: boolean}): any;
}
