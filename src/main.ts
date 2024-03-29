import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
