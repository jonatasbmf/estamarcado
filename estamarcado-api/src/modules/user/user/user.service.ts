import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class UserService {
  @Inject()
  private readonly primaService: PrismaService;

  async getAll() {
    return this.primaService.user.findMany();
  }
}
