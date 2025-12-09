import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as runtime from '@prisma/client/runtime/client';
import { b as private_env } from './shared-server-DaWdgxVh.js';
import { PrismaPg } from '@prisma/adapter-pg';

const config = {
  "previewFeatures": [],
  "clientVersion": "7.0.0",
  "engineVersion": "0c19ccc313cf9911a90d99d2ac2eb0280c76c513",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Report {\n  id        Int                                   @id @default(autoincrement())\n  deviceId  String\n  timestamp DateTime                              @default(now())\n  latitude  Float\n  longitude Float\n  location  Unsupported("geography(Point,4326)")?\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Report":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"deviceId","kind":"scalar","type":"String"},{"name":"timestamp","kind":"scalar","type":"DateTime"},{"name":"latitude","kind":"scalar","type":"Float"},{"name":"longitude","kind":"scalar","type":"Float"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import('node:buffer');
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import('@prisma/client/runtime/query_compiler_bg.postgresql.mjs'),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import('@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.mjs');
    return await decodeBase64AsWasm(wasm);
  }
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}
runtime.Extensions.getExtensionContext;
({
  DbNull: runtime.NullTypes.DbNull,
  JsonNull: runtime.NullTypes.JsonNull,
  AnyNull: runtime.NullTypes.AnyNull
});
runtime.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
runtime.Extensions.defineExtension;
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
const PrismaClient = getPrismaClientClass();
const DATABASE_URL = private_env.DATABASE_URL ?? process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env or set the environment variable before starting the app."
  );
}
const adapter = new PrismaPg({
  connectionString: DATABASE_URL
});
const prisma = new PrismaClient({
  adapter
});

export { prisma as p };
//# sourceMappingURL=prisma-BDFzP59l.js.map
