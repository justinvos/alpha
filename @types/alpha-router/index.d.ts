declare module 'alpha-router' {
  class Router {
    route(method: string, path: string, func: Function): void
    any(path: string, func: Function): void
    get(path: string, func: Function): void
    post(path: string, func: Function): void
    put(path: string, func: Function): void
    del(path: string, func: Function): void
    handle(event: any): Promise<any>
  }

  class Alpha extends Router {}
}
