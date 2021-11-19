import { Routes } from "../src/typeHelpers/router";
import { typedCheckSchema, typedExpress, TypedRouter } from "../src/wrappers";
import { CallApi } from '../src/typeHelpers/client';

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

type AllRoutes = Routes<ReturnType<typeof app>>;

/////////////////////
// ↓ CLIENT SIDE ↓ //
/////////////////////

const call: CallApi<AllRoutes> = (m, p, o) => {
  // todo: implementation / insert query and stuff.
  return Promise.resolve(null as any);
};

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
