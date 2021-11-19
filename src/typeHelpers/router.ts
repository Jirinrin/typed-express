/* eslint-disable @typescript-eslint/no-unused-vars */
import { IRouter, RequestHandler, IRouterHandler, Express } from 'express';
import { RouteParameters } from 'express-serve-static-core';
import { GetLast, SimpleRecord, TypeSafeOmit } from '../ts-utils';
import { AnonRequestHandler, GetBodyType, RouteMethod } from './helpers';
import { TypedValidationSchema } from './validation';

// todo: make some 'default' typing for e.g. ReqQuery a bit more meaningful, _without_ some test cases suddenly becoming `unknown`...
export interface RouterLayer<
  M extends RouteMethod = any,
  Path extends string = any,
  RespBody = any,
  ReqBody = unknown,
  ReqQuery = unknown
> {
  route: {
    path: Path;
    stack: any[];
    methods: Record<M, true>;
  };
  // nonexistent properties, just used for easily accessing type info
  _method: M;
  _path: Path;
  _respBody: RespBody;
  _reqBody: ReqBody;
  _reqQuery: ReqQuery;
}

/** Help type to get those extra data from a RouterLayer type */
export type LData<L extends RouterLayer> = L extends RouterLayer<infer M, infer P, infer RSB, infer RQB, infer RQ>
  ? { method: M; path: P; respBody: RSB; reqBody: RQB; reqQuery: RQ; }
  : never;

type Layers<RO extends ITypedRouter<any>> = RO extends ITypedRouter<infer L> ? L : never;

/** Modify a (union of) RouterLayer(s) so that their path is prepended with a certain base path. */
type PrependBasePathToLayers<
  L extends RouterLayer,
  BP extends string
> = L extends RouterLayer<infer M, infer P, infer RSB, infer RQB, infer RQ>
  ? RouterLayer<M, `${BP}${P}`, RSB, RQB, RQ>
  : never;

/** Pass a union type of multiple layers as first arg, and a 'filter' like RouterLayer<'get', any> as second */
export type FilterLayers<T extends RouterLayer, F extends RouterLayer> = T extends F ? T : never;

/**
 * (todo: docs)
 * todo: make this more potent by simply making it 'filter' the handlers that are a TypedRouter and put those to use
 */
interface ITypedUseHandler<TR extends ITypedRouter<any>> extends IRouterHandler<ITypedRouter> {
  <H extends RequestHandler[]>(...handlers: H):
    GetLast<H> extends ITypedRouter<infer L>
    ? Omit<TR, keyof ITypedRouter> & ITypedRouter<Layers<TR> | L>
    : TR;
  <BP extends string, H extends RequestHandler[]>(
    basePath: BP,
    ...handlers: H
  ): GetLast<H> extends ITypedRouter<infer L>
    ? Omit<TR, keyof ITypedRouter> & ITypedRouter<Layers<TR> | PrependBasePathToLayers<L, BP>>
    : TR;
}

// todo: support error request handlers, but now it's messing with the typing.
type TypedRequestHandlerParams<P = any, ReqBody = any, ReqQuery = any, Locals = SimpleRecord> =
  | AnonRequestHandler<any, P, ReqBody, ReqQuery, Locals>
  // | ErrorRequestHandler<P, any, ReqBody, ReqQuery, Locals>
  | Array<AnonRequestHandler<any, P, ReqBody, ReqQuery, Locals>>;
// | ErrorRequestHandler<P, any, ReqBody, ReqQuery, Locals>

// todo: a way to manually pass the type of the req (or even res) body for typescript
export interface ITypedRouterMatcher<
  TR extends ITypedRouter<any>,
  M extends RouteMethod,
  Locals = SimpleRecord
> {
  <
    Route extends string,
    V extends TypedValidationSchema<any>,
    H extends Array<TypedRequestHandlerParams<RouteParameters<Route>, ReqBody, ReqQuery, Locals>>,
    ReqBody = V['_schema']['body'],
    ReqQuery = V['_schema']['query']
  >(
    path: Route,
    validation: V,
    ...handlers: H
  ): // todo: simply filter to get the last non-error handler that returned something sensible
  GetLast<H> extends AnonRequestHandler<infer R>
    ? Omit<TR, keyof ITypedRouter> & ITypedRouter<Layers<TR> | RouterLayer<M, Route, GetBodyType<R>, ReqBody, ReqQuery>>
    : unknown;
  <
    Route extends string,
    H extends Array<TypedRequestHandlerParams<RouteParameters<Route>, any, SimpleRecord, Locals>>
  >(
    path: Route,
    ...handlers: H
  ): GetLast<H> extends AnonRequestHandler<infer R>
    ? Omit<TR, keyof ITypedRouter> & ITypedRouter<Layers<TR> | RouterLayer<M, Route, GetBodyType<R>>>
    : unknown;
}

export interface ITypedRouter<LL extends RouterLayer = never>
  extends RequestHandler,
    TypeSafeOmit<IRouter, RouteMethod | 'use'> {
  stack: LL[];
  get: ITypedRouterMatcher<this, 'get'>;
  all: ITypedRouterMatcher<this, 'all'>;
  post: ITypedRouterMatcher<this, 'post'>;
  put: ITypedRouterMatcher<this, 'put'>;
  delete: ITypedRouterMatcher<this, 'delete'>;
  patch: ITypedRouterMatcher<this, 'patch'>;
  options: ITypedRouterMatcher<this, 'options'>;
  head: ITypedRouterMatcher<this, 'head'>;
  use: ITypedUseHandler<this>;
}

type ExpressProperties = TypeSafeOmit<Express, keyof IRouter>;

export type ITypedExpress = ITypedRouter & ExpressProperties;
