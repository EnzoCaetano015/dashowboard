import type Database from "@tauri-apps/plugin-sql"

type Migracao = {
    versao: number
    nome: string
    comandos: string[]
}

type MigracaoAplicada = {
    versao: number
}

const MIGRACOES: Migracao[] = [
    {
        versao: 1,
        nome: "criar_preferencias_aplicacao",
        comandos: [
            `
                CREATE TABLE IF NOT EXISTS preferencias_aplicacao (
                    id INTEGER PRIMARY KEY CHECK (id = 1),
                    iniciar_com_sistema INTEGER NOT NULL CHECK (iniciar_com_sistema IN (0, 1)),
                    verificacao_segundo_plano INTEGER NOT NULL CHECK (verificacao_segundo_plano IN (0, 1)),
                    intervalo_padrao_segundos INTEGER NOT NULL CHECK (intervalo_padrao_segundos IN (30, 60, 300)),
                    notificacoes_sistema INTEGER NOT NULL CHECK (notificacoes_sistema IN (0, 1)),
                    som_incidente INTEGER NOT NULL CHECK (som_incidente IN (0, 1)),
                    badge_icone INTEGER NOT NULL CHECK (badge_icone IN (0, 1)),
                    tema TEXT NOT NULL CHECK (tema IN ('dark', 'light', 'system')),
                    densidade TEXT NOT NULL CHECK (densidade IN ('comfortable', 'compact')),
                    nome_desenvolvedor TEXT NOT NULL,
                    atualizado_em TEXT NOT NULL
                )
            `,
            `
                INSERT OR IGNORE INTO preferencias_aplicacao (
                    id,
                    iniciar_com_sistema,
                    verificacao_segundo_plano,
                    intervalo_padrao_segundos,
                    notificacoes_sistema,
                    som_incidente,
                    badge_icone,
                    tema,
                    densidade,
                    nome_desenvolvedor,
                    atualizado_em
                ) VALUES (1, 0, 1, 30, 0, 0, 1, 'dark', 'comfortable', '', CURRENT_TIMESTAMP)
            `,
        ],
    },
]

export const executarMigracoes = async (database: Database) => {
    await database.execute(`
        CREATE TABLE IF NOT EXISTS migracoes (
            versao INTEGER PRIMARY KEY,
            nome TEXT NOT NULL,
            aplicada_em TEXT NOT NULL
        )
    `)

    const aplicadas = await database.select<MigracaoAplicada[]>("SELECT versao FROM migracoes")
    const versoesAplicadas = new Set(aplicadas.map(({ versao }) => versao))

    for (const migracao of MIGRACOES) {
        if (versoesAplicadas.has(migracao.versao)) continue

        for (const comando of migracao.comandos) {
            await database.execute(comando)
        }

        await database.execute("INSERT INTO migracoes (versao, nome, aplicada_em) VALUES ($1, $2, $3)", [
            migracao.versao,
            migracao.nome,
            new Date().toISOString(),
        ])
    }
}
