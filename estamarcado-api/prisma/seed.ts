import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Note: Ensure connection details are provided since adapter requires it if generated so
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL not set');
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados...');

  // Criar empresa principal
  const empresa = await prisma.empresa.upsert({
    where: { id: 'empresa-admin' },
    update: {},
    create: {
      id: 'empresa-admin',
      nomeFantasia: 'Estamarcado Admin',
      ativo: true,
    },
  });

  // Criar grupo de permissões Admin
  const adminGroup = await prisma.perfil.upsert({
    where: { id: 'admin-group-id' },
    update: {},
    create: {
      id: 'admin-group-id',
      empresa: { connect: { id: empresa.id } },
      nome: 'admin',
    },
  });

  console.log(`✅ Grupo Admin garantido: ${adminGroup.id}`);

  // Hash da senha padrão
  const senhaPadrao = 'admin123';
  const senhaHash = await bcrypt.hash(senhaPadrao, 10);

  // Criar usuário admin
  const email = 'admin@estamarcado.com';

  let usuarioAdmin = await prisma.usuario.findUnique({
    where: { email },
    include: {
      perfis: true,
    },
  });

  if (!usuarioAdmin) {
    // Criar usuário admin
    usuarioAdmin = await prisma.usuario.create({
      data: {
        email: email,
        senhaHash: senhaHash,
        ativo: true,
        nome: 'Administrador',
        empresa: { connect: { id: empresa.id } },
        perfis: {
          create: {
            perfil: { connect: { id: adminGroup.id } },
          },
        },
      },
      include: {
        perfis: true,
      },
    });

    console.log(`✅ Usuário admin criado: ${usuarioAdmin.email}`);
  } else {
    // Atualizar senha se o usuário já existir
    usuarioAdmin = await prisma.usuario.update({
      where: { email },
      data: { senhaHash: senhaHash },
      include: { perfis: true },
    });

    // Garantir que o vínculo com o grupo admin exista
    const temGrupoAdmin = usuarioAdmin.perfis.some(
      (g) => g.perfilId === adminGroup.id,
    );
    if (!temGrupoAdmin) {
      await prisma.usuarioPerfil.create({
        data: {
          usuarioId: usuarioAdmin.id,
          perfilId: adminGroup.id,
        },
      });
      console.log(`✅ Adicionado admin ao grupo admin`);
    } else {
      console.log(`✅ Usuário admin já existe e está no grupo admin`);
    }
  }

  console.log('✅ Seed concluído! Você pode logar com:');
  console.log('   Email: admin@estamarcado.com');
  console.log('   Senha: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
