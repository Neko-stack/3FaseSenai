if (!process.env.CHAVE_ACESSO || !process.env.CHAVE_REFRESH) {
    console.warn("[SECURITY] CHAVE_ACESSO and CHAVE_REFRESH must be set via environment variables.")
}

export const env = {
    chaveAcesso: process.env.CHAVE_ACESSO || "",
    chaveRefresh: process.env.CHAVE_REFRESH || ""
}