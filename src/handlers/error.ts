import { Handler } from '../models/handler/BaseHandler';

export default new Handler<'error'>(
  async function (error: Error) {
    console.error(error.stack);
    return null;
  },
  {
    event: 'error',
  },
);
