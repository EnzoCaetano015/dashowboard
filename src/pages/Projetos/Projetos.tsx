import { FolderGit2, Plus } from "lucide-react"

import { ProjectCard } from "@/components/ProjectCard/ProjectCard"
import { TemplateEstado } from "@/components/TemplateEstado"
import { Button } from "@/components/ui/button"
import { useProjetos } from "@/pages/Projetos/Projetos.hook"
import { NovoProjeto } from "@/pages/Projetos/modais/NovoProjeto/NovoProjeto"

export const ProjetosPage = () => {
    const { modal, setModal, projetos, isLoading } = useProjetos()

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
            {isLoading ? (
                <TemplateEstado.Carregando
                    skeleton={{ quantidade: 6, orientacao: "horizontal" }}
                    className="**:data-[slot=skeleton]:h-56"
                />
            ) : projetos.length === 0 ? (
                <TemplateEstado.Vazio
                    titulo="Nenhum projeto criado"
                    subtitulo="Crie seu primeiro agrupamento local para começar."
                    Icon={FolderGit2}
                    acao={
                        <Button onClick={() => setModal("novoProjeto", { open: true })}>
                            <Plus />
                            Novo projeto
                        </Button>
                    }
                />
            ) : (
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
