import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MyJwtModule } from './jwt.module';
import { AppConfig } from '../../config/app.config';
import { TokenService } from '../services/token.service';

const providers: Provider[] = [AppConfig, MyJwtModule, TokenService];

@Global()
@Module({
  providers,
  imports: [CqrsModule, MyJwtModule.register()],
  exports: [...providers, CqrsModule],
})
export class SharedModule {}
