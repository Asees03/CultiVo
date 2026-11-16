import serverless from 'serverless-http';
import { createApp } from '../../server.ts';

const handlerPromise = createApp().then((app) => serverless(app));

export const handler = async (event: object, context: object) => {
  const handler = await handlerPromise;
  return handler(event, context);
};
