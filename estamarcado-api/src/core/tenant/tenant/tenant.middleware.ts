import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = this.jwtService.verify(token);
        req.empresaId = decoded.empresaId; // Injeta o empresaId no contexto da requisição
        console.log('TenantMiddleware: empresaId injetado:', req.empresaId);
      } catch (error) {
        console.log(
          'TenantMiddleware: Erro ao verificar token:',
          error.message,
        );
      }
    } else {
      console.log('TenantMiddleware: Nenhum token Bearer encontrado');
    }
    next();
  }
}
