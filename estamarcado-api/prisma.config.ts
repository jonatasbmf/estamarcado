import { expand } from 'dotenv-expand';
import 'dotenv/config';

expand({ parsed: process.env as any });

export default {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
