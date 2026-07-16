export type FiltroSelectProps = {
    value: string
    placeholder: string
    onValueChange: (valor: string) => void
    opcoes: ReadonlyArray<readonly [string, string]>
}
