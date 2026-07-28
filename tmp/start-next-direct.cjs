const { startServer } = require("../node_modules/next/dist/server/lib/start-server");

process.env.NODE_ENV = "development";
process.env.__NEXT_DEV_SERVER = "1";
process.env.NEXT_PRIVATE_START_TIME = Date.now().toString();
process.env.NEXT_DISABLE_MEM_OVERRIDE = "1";
process.env.__NEXT_DISABLE_MEMORY_WATCHER = "1";

startServer({
  dir: process.cwd(),
  port: Number(process.env.PORT || 3000),
  hostname: undefined,
  isDev: true,
  allowRetry: false,
  keepAliveTimeout: undefined,
  minimalMode: false,
  serverFastRefresh: false,
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
