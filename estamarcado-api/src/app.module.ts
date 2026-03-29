import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { AuthModule } from './core/auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { PrismaService } from './core/database/prisma/prisma.service';
import { TenantModule } from './core/tenant/tenant.module';
import { ItemModule } from './modules/item/item.module';
import { PerfilModule } from './modules/perfil/perfil.module';
import { UserModule } from './modules/user/user.module';
import { FichaTecnicaModule } from './modules/ficha-tecnica/ficha-tecnica.module';
import { MovimentacaoEstoqueModule } from './modules/movimentacao-estoque/movimentacao-estoque.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TenantModule,
    AuthModule,
    UserModule,
    ItemModule,
    PerfilModule,
    FichaTecnicaModule,
    MovimentacaoEstoqueModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
