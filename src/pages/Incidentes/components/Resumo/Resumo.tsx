import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import type { ResumoProps } from "./Resumo.types"

export const Resumo = ({ titulo, valor, classe }: ResumoProps) => (
    <Card className="border-border py-4 shadow-none">
        <CardContent className="px-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{titulo}</div>
            <div className={cn("mt-2 text-3xl font-semibold tabular-nums", classe)}>{valor}</div>
        </CardContent>
    </Card>
)
