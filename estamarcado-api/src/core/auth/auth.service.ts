import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.usuario.findUnique({
      where: { email },
      include: { empresa: true },
    });
    if (user && (await bcrypt.compare(password, user.senhaHash))) {
      const { senhaHash: _senhaHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<AuthResponseDto> {
    const payload = {
      email: user.email,
      sub: user.id,
      empresaId: user.empresaId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        empresaId: user.empresaId,
      },
    };
  }
}
