import { RouteParameters } from 'express-serve-static-core';
import { UnknownIsOptional } from '../ts-utils';
import { RouteMethod } from "./helpers";
import { FilterLayers, LData, RouterLayer } from "./router";

type FilterRoutes<L extends RouterLayer, M extends RouteMethod, P extends LData<FilterRoutes<L, M>>['path'] = any> =
  FilterLayers<L, RouterLayer<M, P>>;

export type CallApi<L extends RouterLayer> = <M extends RouteMethod, P extends LData<L>['path'] & LData<FilterRoutes<L, M>>['path']>(
  method: M,
  path: P,
  opts: UnknownIsOptional<{
    params: RouteParameters<P>;
    body: LData<FilterRoutes<L, M, P>>['reqBody'];
    query: LData<FilterRoutes<L, M, P>>['reqQuery'];
  }>
) => Promise<LData<FilterRoutes<L, M, P>>['respBody']>;
