import { Label } from "@/components/ui/label"

import type { CampoProps } from "./Campo.types"

export const Campo = ({ titulo, controleId, children }: CampoProps) => (
    <div className="flex items-center justify-between gap-3 text-sm">
        <Label
            htmlFor={controleId}
            className="font-normal text-muted-foreground"
        >
            {titulo}
        </Label>
        {children}
    </div>
)
