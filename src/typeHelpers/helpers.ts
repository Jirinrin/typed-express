import { Response, Request, NextFunction } from 'express';
import { SimpleRecord, TypeSafeOmit } from '../ts-utils';

export const routeMethods = ['all', 'get', 'post', 'put', 'delete', 'patch', 'options', 'head'] as const;
export type RouteMethod = typeof routeMethods[number];

type ResponseBody<T> = T extends Response<infer U> ? U : T;
export type GetBodyType<R> = ResponseBody<Awaited<R>>;

export type HandlerReturnType = Response<any, Record<string, any>> | undefined | void;

/** A variation on the express Response type, in which return type info via `res.json()` is preserved */
interface AnonResponse<Locals = SimpleRecord> extends TypeSafeOmit<Response<any, Locals>, 'json'> {
  json<R>(body: R): Response<R, Locals>;
}

export type AnonRequestHandler<
  TReturn = any,
  P = any,
  ReqBody = any,
  ReqQuery = any,
  Locals = SimpleRecord
> = (
  req: Request<P, any, ReqBody, ReqQuery, Locals>,
  res: AnonResponse<Locals>,
  next: NextFunction
) => TReturn;

export type OnlyPathWithParams<P extends string> = P extends `${string}:${string}` ? P : never;
export type OnlySimplePath<P extends string> = P extends `${string}:${string}` ? never : P;
