declare module 'koa-router' {
  declare export interface ILayerOptions {
    name: string,
    sensitive?: boolean,
    strict?: boolean
  }
  declare export interface IRouterOptions {

    /**
     * Router prefixes
     */
    prefix?: string,

    /**
     * HTTP verbs
     */
    methods?: string[],
    routerPath?: string,
    sensitive?: boolean
  }
  declare export type IRouterContext = {

    /**
     * url params
     */
    params: any
  }
  declare export interface IMiddleware {
    (ctx: IRouterContext, next: () => Promise<any>): any
  }
  declare export interface IParamMiddleware {
    (param: string, ctx: IRouterContext, next: () => Promise<any>): any
  }
  declare export interface IRouterAllowedMethodsOptions {

    /**
     * throw error instead of setting status and header
     */
    throw ?: boolean,

    /**
     * throw the returned value in place of the default NotImplemented error
     */
    notImplemented?: () => any,

    /**
     * throw the returned value in place of the default MethodNotAllowed error
     */
    methodNotAllowed?: () => any
  }
  declare class Layer {
    opts: ILayerOptions;
    name: string;
    methods: string[];
    paramNames: string[];
    stack: IMiddleware[];
    regexp: RegExp;
    path: string;
    constructor(path: string | RegExp, methods: string[], middleware: IMiddleware, opts?: ILayerOptions): this;
    constructor(path: string | RegExp, methods: string[], middleware: Array<IMiddleware>, opts?: ILayerOptions): this;

    /**
     * Returns whether request `path` matches route.
     */
    match(path: string): boolean;

    /**
     * Returns map of URL parameters for given `path` and `paramNames`.
     */
    params(path: string | RegExp, captures: string[], existingParams?: Object): Object;

    /**
     * Returns array of regexp url path captures.
     */
    captures(path: string): string[];

    /**
     * Generate URL for route using given `params`.
     */
    url(params: Object): string;

    /**
     * Run validations on route named parameters.
     */
    param(param: string, fn: IMiddleware): Layer;

    /**
     * Prefix route path.
     */
    setPrefix(prefix: string): Layer
  }
  declare class Router {
    params: Object;
    stack: Array<Layer>;

    /**
     * Create a new router.
     */
    constructor(opt?: IRouterOptions): this;

    /**
     * Use given middleware.
     *
    Middleware run in the order they are defined by `.use()`. They are invoked
    sequentially, requests start at the first middleware and work their way
    "down" the middleware stack.
    */
    use(...middleware: Array<IMiddleware>): Router;
    use(path: string | RegExp, ...middleware: Array<IMiddleware>): Router;

    /**
     * HTTP get method
     */
    get(name: string, path: string | RegExp, ...middleware: Array<IMiddleware>): Router;
    get(path: string | RegExp, ...middleware: Array<IMiddleware>): Router;

    /**
     * HTTP post method
     */
    post(name: string, path: string | RegExp, ...middleware: Array<IMiddleware>): Router;
    post(path: string | RegExp, ...middleware: Array<IMiddleware>): Router;

    /**
     * HTTP put method
     */
    put(name: string, path: string | RegExp, ...middleware: Array<IMiddleware>): Router;
    put(path: string | RegExp, ...middleware: Array<IMiddleware>): Router;

    /**
     * HTTP delete method
     */
    delete(name: string, path: string | RegExp, ...middleware: Array<IMiddleware>): Router;
    delete(path: string | RegExp, ...middleware: Array<IMiddleware>): Router;

    /**
     * Alias for `router.delete()` because delete is a reserved word
     */
    del(name: string, path: string | RegExp, ...middleware: Array<IMiddleware>): Router;
    del(path: string | RegExp, ...middleware: Array<IMiddleware>): Router;

    /**
     * HTTP head method
     */
    head(name: string, path: string | RegExp, ...middleware: Array<IMiddleware>): Router;
    head(path: string | RegExp, ...middleware: Array<IMiddleware>): Router;

    /**
     * HTTP options method
     */
    options(name: string, path: string | RegExp, ...middleware: Array<IMiddleware>): Router;
    options(path: string | RegExp, ...middleware: Array<IMiddleware>): Router;

    /**
     * HTTP path method
     */
    patch(name: string, path: string | RegExp, ...middleware: Array<IMiddleware>): Router;
    patch(path: string | RegExp, ...middleware: Array<IMiddleware>): Router;

    /**
     * Register route with all methods.
     */
    all(name: string, path: string | RegExp, ...middleware: Array<IMiddleware>): Router;
    all(path: string | RegExp, ...middleware: Array<IMiddleware>): Router;

    /**
     * Set the path prefix for a Router instance that was already initialized.
     */
    prefix(prefix: string): Router;

    /**
     * Returns router middleware which dispatches a route matching the request.
     */
    routes(): IMiddleware;

    /**
     * Returns router middleware which dispatches a route matching the request.
     */
    middlewares(): IMiddleware;

    /**
     * Returns separate middleware for responding to `OPTIONS` requests with
     * an `Allow` header containing the allowed methods, as well as responding
    with `405 Method Not Allowed` and `501 Not Implemented` as appropriate.
    */
    allowedMethods(options?: IRouterAllowedMethodsOptions): IMiddleware;

    /**
     * Redirect `source` to `destination` URL with optional 30x status `code`.
     *
    Both `source` and `destination` can be route names.
    */
    redirect(source: string, destination: string, code?: number): Router;

    /**
     * Create and register a route.
     */
    register(
        path: string | RegExp,
        methods: string[],
        middleware: IMiddleware,
        opts?: Object): Layer;

    /**
     * Lookup route with given `name`.
     */
    route(name: string): Layer;
    route(name: string): boolean;

    /**
     * Generate URL for route. Takes either map of named `params` or series of
     * arguments (for regular expression routes)
     */
    url(name: string, params: Object): string;
    url(name: string, params: Object): Error;

    /**
     * Match given `path` and return corresponding routes.
     */
    match(name: string, method: string): Object;

    /**
     * Run middleware for named route parameters. Useful for auto-loading or validation.
     */
    param(param: string, middleware: IParamMiddleware): Router;

    /**
     * Generate URL from url pattern and given `params`.
     */
    url(path: string | RegExp, params: Object): string
  }
  declare export default Router
}