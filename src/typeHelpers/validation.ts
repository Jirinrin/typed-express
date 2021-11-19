import { Schema, ValidationChain } from "express-validator";
import { ResultWithContext } from "express-validator/src/chain";
import { SanitizersSchema, ValidatorsSchema } from "express-validator/src/middlewares/schema";
import { Unflatten } from "../ts-utils";

/**
 * 
 * todo: check that this handles optional properties well
 */
 type SchemaFieldType<F extends ValidatorsSchema & SanitizersSchema, Default = unknown, K = keyof F> =
 F extends Record<string, never>
   ? Default
   // todo: this list of properties is not exhaustive (yet)
   : K & ('toDate') extends never
     ? K & ('isInt' | 'isNumeric' | 'toInt' | 'toFloat') extends never
       ? K & ('isString' | 'isUUID' | 'isURL' | 'isLowercase' | 'isUppercase' | 'toLowerCase' | 'toUpperCase' | 'trim') extends never
         ? K & ('isBoolean' | 'toBoolean') extends never
           ? K & ('isArray' | 'toArray') extends never
             ? Default
             : any[]
           : boolean
         : string
       : number
     : Date;

type SchemaInterp<S extends Schema> = {
 query: Unflatten<{
   [K in keyof S as S[K]['in'] extends 'query' ? K : never]: SchemaFieldType<S[K], string>;
 }>;
 body: Unflatten<{
   [K in keyof S as S[K]['in'] extends 'body'
     ? K
     : unknown extends S[K]['in']
     ? K
     : never]: SchemaFieldType<S[K]>;
 }>;
 // todo: maybe also take in params validations / match them with the params actually in the URL?
};

export type TypedValidationSchema<S extends Schema> = ValidationChain[] & {
 run: (req: Request) => Promise<ResultWithContext[]>;
 _schema: SchemaInterp<S>;
};
