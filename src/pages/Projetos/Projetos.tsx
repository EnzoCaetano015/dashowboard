import { AlertTriangle, FolderGit2, Plus } from "lucide-react"

import { ProjectCard } from "@/components/ProjectCard/ProjectCard"
import { TemplateEstado } from "@/components/TemplateEstado"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useProjetos } from "@/pages/Projetos/Projetos.hook"
import { NovoProjeto } from "@/pages/Projetos/modais/NovoProjeto/NovoProjeto"

export const ProjetosPage = () => {
    const { modal, setModal, projetos, isLoading, isError, tentarNovamente } = useProjetos()

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Projetos</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Todos os agrupamentos locais de repositórios e serviços.
                    </p>
                </div>
                <Button onClick={() => setModal("novoProjeto", { open: true })}>
                    <Plus />
                    Novo projeto
                </Button>
            </div>
            {isLoading && (
                <TemplateEstado.Carregando
                    skeleton={{ quantidade: 6, orientacao: "horizontal" }}
                    className="**:data-[slot=skeleton]:h-56"
                />
            )}
            {isError && (
                <TemplateEstado.Erro
                    titulo="Falha ao carregar projetos"
                    subtitulo="Não foi possível consultar os projetos locais."
                    Icon={AlertTriangle}
                    acao={<Button onClick={() => void tentarNovamente()}>Tentar novamente</Button>}
                />
            )}
            {!isLoading && !isError && projetos.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                        <FolderGit2 className="mx-auto size-8 text-muted-foreground" />
                        <h2 className="mt-3 font-medium">Nenhum projeto criado</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Crie seu primeiro agrupamento local para começar.
                        </p>
                    </CardContent>
                </Card>
            )}
            {!isLoading && !isError && projetos.length > 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {projetos.map((projeto) => (
                        <ProjectCard
                            key={projeto.id}
                            projeto={projeto}
                        />
                    ))}
                </div>
            )}
            <NovoProjeto
                open={modal.novoProjeto}
                onClose={() => setModal("novoProjeto", { open: false })}
            />
        </div>
    )
}
