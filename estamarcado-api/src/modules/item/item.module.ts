import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { ItemController } from './api/item.controller';
import { CreateItemUseCase } from './application/useCase/create-item-usecase';
import { DeleteItemUseCase } from './application/useCase/delete-item-usecase';
import { GetItemByIdUseCase } from './application/useCase/get-item-by-id-usecase';
import { UpdateItemUseCase } from './application/useCase/update-item-usecase';
import { ItemService } from './application/item.service';
import { ItemRepository } from './repository/item.repository';

@Module({
  controllers: [ItemController],
  providers: [
    ItemService,
    PrismaService,
    ItemRepository,
    CreateItemUseCase,
    GetItemByIdUseCase,
    UpdateItemUseCase,
    DeleteItemUseCase,
    PrismaService,
  ],
})
export class ItemModule {}