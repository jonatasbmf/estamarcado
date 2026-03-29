export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    nome: string;
    email: string;
    empresaId: string;
  };
}
