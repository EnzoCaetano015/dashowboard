import { ArrowLeft, FolderX } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const ProjetoNaoEncontrado = () => (
    <Card className="border-dashed">
        <CardContent className="py-12 text-center">
            <FolderX className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-3 text-lg font-semibold">Projeto não encontrado</h2>
            <p className="mt-1 text-sm text-muted-foreground">
                O agrupamento local que você buscou não existe mais.
            </p>
            <Button
                render={<Link to="/projetos" />}
                nativeButton={false}
                variant="outline"
                className="mt-4"
            >
                <ArrowLeft />
                Voltar para projetos
            </Button>
        </CardContent>
    </Card>
)
