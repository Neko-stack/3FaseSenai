export interface PaginationParams {
    pagina?: number | undefined;
    limite?: number | undefined;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    totalPaginas: number;
}

export function buildPaginationArgs(params: PaginationParams) {
    const { pagina, limite } = params;
    if (!pagina || !limite) return null;
    return {
        skip: (pagina - 1) * limite,
        take: limite,
    };
}

export function buildPaginatedResponse<T>(data: T[], total: number, limite: number): PaginatedResult<T> {
    return {
        data,
        total,
        totalPaginas: Math.ceil(total / limite),
    };
}
