import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { AuthModule } from './core/auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { PrismaService } from './core/database/prisma/prisma.service';
import { TenantModule } from './core/tenant/tenant.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TenantModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
