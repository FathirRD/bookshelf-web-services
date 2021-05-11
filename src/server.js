const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: process.env.NODE_ENV !== 'production' ? 5000 : process.env.PORT || 3000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : process.env.HOST || '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
