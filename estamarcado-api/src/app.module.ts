import { Module } from '@nestjs/common';
import { DatabaseModule } from './core/database/database.module';
import { TenantModule } from './core/tenant/tenant.module';
import { AuthModule } from './core/auth/auth.module';

@Module({
  imports: [DatabaseModule, TenantModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
