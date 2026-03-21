import serverlessExpress from '@vendia/serverless-express';
import app from './app';

let instance: any;
async function setup(event: any, context: any) {
  instance = serverlessExpress({ app });
  return instance(event, context);
}
export const handler = (event: any, context: any) => {
  if (instance) return instance(event, context);
  return setup(event, context);
};