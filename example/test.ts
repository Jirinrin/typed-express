import { typedCheckSchema, TypedRouter } from "../src/wrappers";

const tt = typedCheckSchema({
  abc: { in: 'query', isInt: true },
  bla: { in: 'body', isNumeric: true },
  efg: { isString: true },
  'aaa.ooo': {},
  'aaa.ooe': {},
  'woe*': {},
});
const tt2 = typedCheckSchema({});
// type testaseofij = { a: 3 }['35'];
const ttb = tt2._schema.body;
const ttq = tt._schema.query;

const test = TypedRouter().get(
  '/woeiof/:oiefjio/oe',
  typedCheckSchema({ bla: { in: 'body', isUUID: true }, xx: { in: 'query' } }),
  async (req, res) => {
    // req.body; req.query;
    return res.json({ a: 3 });
  }
);
