import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import 'dotenv/config';
import { AppModule } from './app.module';
const myEnv = dotenv.config();
expand(myEnv);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
