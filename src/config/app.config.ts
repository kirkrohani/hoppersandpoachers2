import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.STAGE || 'prod',
}));
