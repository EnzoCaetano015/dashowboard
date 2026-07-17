import { ArrowLeft, FolderX } from "lucide-react"
import { Link } from "react-router-dom"

import { TemplateEstado } from "@/components/TemplateEstado"
import { Button } from "@/components/ui/button"

export const ProjetoNaoEncontrado = () => (
    <TemplateEstado.Vazio
        titulo="Projeto não encontrado"
        subtitulo="O agrupamento local que você buscou não existe mais."
        Icon={FolderX}
        acao={
            <Button
                render={<Link to="/projetos" />}
                nativeButton={false}
                variant="outline"
            >
                <ArrowLeft />
                Voltar para projetos
            </Button>
        }
    />
)
