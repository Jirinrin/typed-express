import { RouteParameters } from 'express-serve-static-core';
import { UnknownIsOptional } from '../src/ts-utils';
import { OnlyPathWithParams, OnlySimplePath, RouteMethod } from "../src/typeHelpers/helpers";
import { FilterLayers, LData, RouterLayer } from "../src/typeHelpers/router";
import { typedCheckSchema, typedExpress, TypedRouter } from "../src/wrappers";

const someRouter = () => TypedRouter()
  .get(
    '/woeiof/:oiefjio/oe',
    // typedCheckSchema({}),
    async (req, res) => {
      req.body;
      return res.json({ a: 3 });
    }
  )
  .post(
    '/woeiof/:id/oe',
    typedCheckSchema({ blu: { in: 'body', isString: true }, yy: { in: 'query', isNumeric: true } }),
    async (req, res) => {
      // req.body; req.query;
      return res.json({ a: 3 });
    }
  );

const someRouter2 = () => TypedRouter()
  .post(
    '/asdf',
    typedCheckSchema({ bla: { in: 'body', isUUID: true }, xx: { in: 'query' } }),
    async (req, res) => res.json({ i: '' })
  );

const higherRouter = () => TypedRouter()
  .use('/1-1', someRouter())
  .use('/2-2', someRouter2());

const app = () => typedExpress()
  .use('/nested', higherRouter())

////////////////////////
// Router typing stuff
////////////////////////

type AllRoutes = ReturnType<typeof app>['stack'][number];

type FilterRoutes<M extends RouteMethod, P extends LData<FilterRoutes<M>>['path'] = any> =
  FilterLayers<AllRoutes, RouterLayer<M, P>>;

// type test = FilterRoutes<'post'>['_path'];
// type testR = LData<FilterRoutes<'post', '/2-2/asdf'>>['path'];
// type aaaaa = OnlySimplePath<test['_path']>;
// type bbbbb = OnlyPathWithParams<test['_path']>;

// todo: make this generic where you pass in your total RouterLayers union
type CallMethod = <M extends RouteMethod, P extends LData<AllRoutes>['path'] & LData<FilterRoutes<M>>['path']>(
  method: M,
  path: P,
  opts: UnknownIsOptional<{
    params: RouteParameters<P>;
    body: LData<FilterRoutes<M, P>>['reqBody'];
    query: LData<FilterRoutes<M, P>>['reqQuery'];
  }>
) => Promise<LData<FilterRoutes<M, P>>['respBody']>;

// todo: query typing / insert query and stuff.
const call: CallMethod = (m, p, o) => {
  return Promise.resolve(null as any);
};

// type xoijwseo = UnknownIsOptional<{ params: { oiefjio: string; }; body: {}; query: unknown; }>

// const a = call('get', '/1-1/woeiof/:oiefjio/oe', { oiefjio: 'iweo' });
const a = call('get', '/nested/1-1/woeiof/:oiefjio/oe', {
  params: {oiefjio: ''},
  // body: {},
  // query: {}
});
const b = call('post', '/nested/1-1/woeiof/:id/oe', {
  params: {id: ''},
  body: {blu: ''},
  query: {yy: 34}
  // body: {}
});
