import { Button } from "@/components/ui/button"
import { Download, FileCode } from "lucide-react"
import { exportToPDF, exportToLatex } from "@/lib/biseccion/export-utils"
import type { ExportData } from "@/types/Biseccion"

interface ExportButtonsProps {
  exportData: ExportData
}

export function ExportButtons({ exportData }: ExportButtonsProps) {
  const handleExportToPDF = async () => {
    await exportToPDF(exportData)
  }

  const handleExportToLatex = async () => {
    await exportToLatex(exportData)
  }

  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={handleExportToPDF} className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Exportar a PDF
      </Button>
      <Button variant="outline" onClick={handleExportToLatex} className="flex items-center gap-2">
        <FileCode className="h-4 w-4" />
        Exportar a LaTeX
      </Button>
    </div>
  )
}
