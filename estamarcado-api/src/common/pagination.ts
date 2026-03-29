export class PaginationDto {
  page?: number = 1;
  limit?: number = 10;
  search?: string;
  sort?: string; // Nome do campo (ex: 'name', 'email')
  order?: 'asc' | 'desc'; // Direção
}

export function getPaginationParams(pagination: PaginationDto) {
  const page = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || 10;
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}
