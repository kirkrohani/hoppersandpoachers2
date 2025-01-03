import * as Joi from 'joi';

export default Joi.object({
  STAGE: Joi.string().valid('dev', 'test', 'stage', 'prod').default('dev'),
  DB_PORT: Joi.number().port().default(5432),
  DB_HOST: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  PROFILE_API_KEY: Joi.string().required(),
});
