import { AlertCircle } from "lucide-react"

import { IntegrationCard } from "@/components/IntegrationCard/IntegrationCard"
import { TemplateEstado } from "@/components/TemplateEstado"
import { Button } from "@/components/ui/button"
import { useIntegracoes } from "@/pages/Integracoes/Integracoes.hook"
import { GitHubIntegrationDialog } from "@/pages/Integracoes/modais/GitHubIntegrationDialog/GitHubIntegrationDialog"
import { SupabaseIntegrationDialog } from "@/pages/Integracoes/modais/SupabaseIntegrationDialog/SupabaseIntegrationDialog"
import { VercelIntegrationDialog } from "@/pages/Integracoes/modais/VercelIntegrationDialog/VercelIntegrationDialog"

export const IntegracoesPage = () => {
    const { modal, setModal, integracoes, isLoading, isError, abrirDialogo, tentarNovamente } =
        useIntegracoes()

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Integrações</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Conecte contas e tokens para o DashwoBoard ler o estado dos seus recursos.
                </p>
            </div>
            {isLoading ? (
                <TemplateEstado.Carregando
                    skeleton={{ quantidade: 4, orientacao: "horizontal" }}
                    className="**:data-[slot=skeleton]:h-56 **:data-[slot=template-estado-skeletons]:md:grid-cols-2"
                />
            ) : isError ? (
                <TemplateEstado.Erro
                    titulo="Falha ao carregar integrações"
                    subtitulo="Não foi possível consultar as integrações configuradas."
                    Icon={AlertCircle}
                    acao={<Button onClick={() => void tentarNovamente()}>Tentar novamente</Button>}
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {integracoes.map((integracao) => (
                        <IntegrationCard
                            key={integracao.provider}
                            integracao={integracao}
                            onTestar={() => abrirDialogo(integracao.provider)}
                            onConfigurar={() => abrirDialogo(integracao.provider)}
                        />
                    ))}
                </div>
            )}
            <GitHubIntegrationDialog
                open={modal.integracaoGitHub}
                onClose={() => setModal("integracaoGitHub", { open: false })}
            />
            <VercelIntegrationDialog
                open={modal.integracaoVercel}
                onClose={() => setModal("integracaoVercel", { open: false })}
            />
            <SupabaseIntegrationDialog
                open={modal.integracaoSupabase}
                onClose={() => setModal("integracaoSupabase", { open: false })}
            />
        </div>
    )
}
