import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { FiltroSelectProps } from "./FiltroSelect.types"

export const FiltroSelect = ({ value, placeholder, onValueChange, opcoes }: FiltroSelectProps) => (
    <Select
        value={value}
        onValueChange={(valor) => valor && onValueChange(valor)}
    >
        <SelectTrigger className="h-9 min-w-36 bg-surface-2">
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            {opcoes.map(([valor, titulo]) => (
                <SelectItem
                    key={valor}
                    value={valor}
                >
                    {titulo}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
)
