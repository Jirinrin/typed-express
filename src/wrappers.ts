import express, { RequestHandler, Router, RouterOptions } from "express";
import { checkSchema, Schema } from "express-validator";
import cloneDeep from "lodash.clonedeep";
import { ITypedRouter, ITypedRouterMatcher } from "./typeHelpers/router";
import { routeMethods } from "./typeHelpers/helpers";
import { TypedValidationSchema } from "./typeHelpers/validation";

export function typedExpress() {
  return express();
}

export function TypedRouter(options?: RouterOptions): ITypedRouter {
  const r = Router(options);
  // todo: maybe the clone is unnecessary?
  const typedRouter = cloneDeep(r) as unknown as ITypedRouter;
  routeMethods.forEach((method) => {
    typedRouter[method] = ((path: string, ...handlers: RequestHandler[]) => {
      // todo: parse queries & put in URL
      return r[method](path, ...handlers);
    }) as ITypedRouterMatcher<any, typeof method> as any;
  });
  return typedRouter;
}

export const typedCheckSchema = <S extends Schema>(schema: S): TypedValidationSchema<S> =>
  checkSchema(schema, ['body']) as any;
