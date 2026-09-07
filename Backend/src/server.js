import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.PORT, () => {
  console.log(`CommerceHub API listening on ${env.APP_URL}`);
});
