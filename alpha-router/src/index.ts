import { HttpError, InternalServerError, NotFound } from 'http-errors'

interface Route {
  method: string
  path: string
  func: Function
}

export class Router {
  routes: Route[]

  constructor () {
    this.routes = []
  }

  route = (method: string, path: string, func: Function) => {
    const route = {
      method,
      path,
      func
    }
    this.routes.push(route)
    console.log('this.routes', this.routes)
  }

  any = (path: string, func: Function) => this.route('ANY', path, func)
  get = (path: string, func: Function) => this.route('GET', path, func)
  post = (path: string, func: Function) => this.route('POST', path, func)
  put = (path: string, func: Function) => this.route('PUT', path, func)
  del = (path: string, func: Function) => this.route('DELETE', path, func)

  async handle (event: any): Promise<any> {
    console.log('router.handle', this.routes)
    const route = this.routes.find(matchesRoute(event))
    const result = await callRoute(route, event)
      .catch(handleError)

    console.log('result', result)
    return result
  }
}

export class Alpha extends Router {
  async handle (event: any): Promise<any> {
    console.log('alpha.handle')
    const { body, statusCode } = await super.handle(event)
    
    return {
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json'
      },
      statusCode
    }
  }
}

function matchesRoute (event: any) {
  return (route: Route) => {
    if (route.method !== 'ANY' && event.httpMethod !== route.method) {
      return false
    }

    if (event.path.startsWith(route.path)) {
      return true
    }
  }
}

async function callRoute (route: Route, event: any) {
  if (route == null) {
    throw new NotFound()
  }

  return route.func(event)
}

function handleError (err: Error) {
  if (err instanceof HttpError) {
    return formatError(err)
  } else {
    return formatError(new InternalServerError())
  }
}

function formatError (error: HttpError) {
  return {
    body: { error: error.message },
    statusCode: error.statusCode
  }
}
