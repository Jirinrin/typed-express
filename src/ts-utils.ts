/** Like {@link Omit} but with errors when the property should not exist. */
export type TypeSafeOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type Prev<T extends number> = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62][T];
type GetLength<T extends any[]> = T extends { length: infer L } ? L : never;
export type GetLast<T extends any[]> = T[Prev<GetLength<T>>];

export type SimpleRecord = Record<string, any>;

/** Helper type used to keep the keys and values in a record very closely linked in a union type of a key+value per entry */
export type KVTuples<T extends Record<string, any>, K extends keyof T = keyof T> = K extends any
  ? { k: K; v: T[K] }
  : never;

/**
 * Interprets given key-value tuple to make it deep if the key is a nested path.
 * e.g. given {k: 'a.b.c', v: 'test'} returns {a: {b: {c: 'test'}}}
 * todo: try to just make this accept a record and transform it into KVTuple in the second generic arg?
 */
type MakeDeep<KV extends KVTuples<any>> = KV extends any
  ? KV['k'] extends `${string}*${string}` // Wildcards are impossible to parse to specific body field
    ? never
    : KV['k'] extends `${infer A}.${infer B}`
      ? { [a in A]: MakeDeep<{ k: B; v: KV['v'] }> }
      : { [k in KV['k']]: KV['v'] }
  : never;

/**
 * Union to intersection converter by `@jcalz`.
 * e.g. Intersect<{ a: 1 } | { b: 2 }> = { a: 1 } & { b: 2 }
 */
type Intersect<T> = (T extends any ? (x: T) => 0 : never) extends (x: infer R) => 0 ? R : never;

export type Unflatten<T extends Record<string, any>> = Intersect<MakeDeep<KVTuples<T>>>;

// type TR = { a: 1; 'b.c': 23; 'b.d': 24; 'e.f.g': 567 };
// type TRUnfl = Unflatten<TR>;

export type UnknownIsOptional<R extends Record<any, any>> = {
  [K in keyof R as unknown extends R[K] ? K : never]?: R[K];
} & {
  [K in keyof R as unknown extends R[K] ? never : K]: R[K];
}
