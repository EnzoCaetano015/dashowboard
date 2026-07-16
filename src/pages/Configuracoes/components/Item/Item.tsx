import type { ItemProps } from "./Item.types"

export const Item = ({ titulo, valor }: ItemProps) => (
    <div className="flex justify-between">
        <dt className="text-muted-foreground">{titulo}</dt>
        <dd className="font-mono">{valor}</dd>
    </div>
)
