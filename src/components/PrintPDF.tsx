import { Button } from "./ui/button";

export default function PrintPDF() {
    return <Button onClick={() => window.print()}>Imprimir</Button>
}