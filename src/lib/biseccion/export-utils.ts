// Utilidades para exportación de resultados
import { jsPDF } from "jspdf"
import type { ExportData } from "@/types/Biseccion"

/**
 * Obtiene el texto descriptivo del criterio de parada
 */
export function getStoppingCriteriaText(criteria: string): string {
  switch (criteria) {
    case "tolerance":
      return "Tolerancia (valor de f(x))"
    case "relativeError":
      return "Error relativo"
    case "iterations":
      return "Número de iteraciones"
    default:
      return criteria
  }
}

/**
 * Formatea una función matemática para LaTeX
 */
export function formatFunctionForLatex(func: string): string {
  return func
    .replace(/\^/g, "^{") // Inicio de exponente
    .replace(/(\d+|\))(\^{)(\d+)/g, "$1$2$3}") // Cierre de exponente para números
    .replace(/x(\^{)(\d+)/g, "x$1$2}") // Cierre de exponente para x
    .replace(/\*/g, " \\cdot ") // Multiplicación
    .replace(/sqrt/g, "\\sqrt") // Raíz cuadrada
    .replace(/sin/g, "\\sin") // Seno
    .replace(/cos/g, "\\cos") // Coseno
    .replace(/tan/g, "\\tan") // Tangente
    .replace(/log/g, "\\log") // Logaritmo
}

/**
 * Genera el código LaTeX para el documento
 */
export function generateLatexCode(data: ExportData): string {
  const { results, func, xi, xs, rootValue, rootFunctionValue, decimals, stoppingCriteria, tolerance } = data

  let latexCode = `
\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{booktabs}
\\usepackage{graphicx}
\\usepackage{pgfplots}
\\usepackage{longtable}
\\usepackage{geometry}
\\usepackage{xcolor}
\\geometry{a4paper, margin=2.5cm}

\\title{Método de Bisección}
\\author{}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Datos del problema}

\\begin{itemize}
  \\item Función: $f(x) = ${formatFunctionForLatex(func)}$
  \\item Intervalo: $[${xi}, ${xs}]$
  \\item Criterio de parada: ${getStoppingCriteriaText(stoppingCriteria)}
  \\item Tolerancia: ${tolerance}
  \\item Decimales utilizados: ${decimals}
\\end{itemize}

\\section{Proceso paso a paso}

`

  // Añadir el proceso paso a paso
  results.forEach((result) => {
    latexCode += `
\\subsection*{Iteración ${result.iteration}}

\\begin{enumerate}
  \\item Cálculo del punto medio:
  \\begin{align}
    x_r &= \\frac{x_i + x_s}{2} \\\\
    x_r &= \\frac{${result.xi.toFixed(decimals)} + ${result.xs.toFixed(decimals)}}{2} = ${result.xr.toFixed(decimals)}
  \\end{align}

  \\item Evaluación de la función:
  \\begin{align}
    f(x_i) &= ${result.fxi?.toFixed(decimals) || "?"} \\\\
    f(x_r) &= ${result.fxr.toFixed(decimals)} \\\\
    f(x_s) &= ${result.fxs?.toFixed(decimals) || "?"}
  \\end{align}

  \\item Decisión del nuevo intervalo:
  \\begin{align}
    f(x_i) \\times f(x_r) &= ${((result.fxi || 0) * result.fxr).toFixed(decimals)}
  \\end{align}
  
  Nuevo intervalo: [${result.xi.toFixed(decimals)}, ${result.xs.toFixed(decimals)}]
`

    if (result.iteration > 1) {
      latexCode += `
  \\item Cálculo del error:
  \\begin{align}
    Error &= ${result.error.toExponential(4)}
  \\end{align}
`
    }

    if (result.isRoot) {
      latexCode += `
  \\item \\textbf{¡Se ha encontrado una raíz en $x = ${result.xr.toFixed(decimals)}$!}
  \\begin{align}
    f(${result.xr.toFixed(decimals)}) &= ${result.fxr.toFixed(decimals)}
  \\end{align}
`
    }

    latexCode += `\\end{enumerate}\n`
  })

  latexCode += `
\\section{Resultado final}

\\begin{itemize}
  \\item Raíz aproximada: ${rootValue?.toFixed(decimals)}
  \\item Valor de la función en la raíz: ${rootFunctionValue?.toFixed(decimals)}
  \\item Error final: ${results[results.length - 1].error.toExponential(4)}
  \\item Número de iteraciones: ${results.length}
\\end{itemize}

\\section{Tabla de resultados}

\\begin{longtable}{ccccccc}
\\toprule
Iteración & $x_i$ & $x_s$ & $x_r$ & $f(x_r)$ & Error & Estado \\\\
\\midrule
`

  // Añadir filas de la tabla
  results.forEach((result) => {
    latexCode += `${result.iteration} & ${result.xi.toFixed(decimals)} & ${result.xs.toFixed(decimals)} & ${result.xr.toFixed(decimals)} & ${result.fxr.toFixed(decimals)} & ${result.iteration === 1 ? "-" : result.error.toExponential(4)} & ${result.isRoot ? "Raíz" : ""} \\\\\n`
  })

  latexCode += `\\bottomrule
\\end{longtable}

\\section{Gráfica de la función}

% Aquí se puede incluir una gráfica generada con pgfplots
\\begin{center}
\\begin{tikzpicture}
\\begin{axis}[
    xlabel={$x$},
    ylabel={$f(x)$},
    xmin=${xi - (xs - xi) * 0.1},
    xmax=${xs + (xs - xi) * 0.1},
    grid=both,
    legend pos=north west,
]

% Función
\\addplot[blue, domain=${xi - (xs - xi) * 0.1}:${xs + (xs - xi) * 0.1}, samples=100] {${formatFunctionForLatex(func)}};

% Raíz
\\addplot[green, mark=*, only marks] coordinates {(${rootValue}, 0)};
\\legend{$f(x)$, Raíz}

\\end{axis}
\\end{tikzpicture}
\\end{center}

\\end{document}
`

  return latexCode
}

/**
 * Exporta los resultados a un archivo LaTeX
 */
export async function exportToLatex(data: ExportData): Promise<void> {
  const latexCode = generateLatexCode(data)

  // Crear un blob y descargar el archivo
  const blob = new Blob([latexCode], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "metodo-biseccion.tex"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Genera una tabla directamente en el PDF sin usar html2canvas
 */
function generateTableInPDF(pdf: jsPDF, results: ExportData["results"], decimals: number): void {
  // Configuración de la tabla
  const startY = 25
  const cellPadding = 3
  const fontSize = 8
  const headerFontSize = 9

  // Ancho de columnas (en mm)
  const colWidths = [15, 20, 20, 20, 20, 25, 20]
  const tableWidth = colWidths.reduce((sum, width) => sum + width, 0)

  // Posición X inicial (centrada)
  const startX = (210 - tableWidth) / 2

  // Altura de fila
  const rowHeight = 8

  // Configurar fuente
  pdf.setFontSize(headerFontSize)
  pdf.setFont("helvetica", "bold")

  // Dibujar encabezados
  const headers = ["Iteración", "xi", "xs", "xr", "f(xr)", "Error", "Estado"]
  let currentX = startX
  let currentY = startY

  // Dibujar fondo del encabezado
  pdf.setFillColor(240, 240, 240)
  pdf.rect(startX, currentY, tableWidth, rowHeight, "F")

  // Dibujar textos del encabezado
  headers.forEach((header, i) => {
    pdf.text(header, currentX + cellPadding, currentY + rowHeight - cellPadding)
    currentX += colWidths[i]
  })

  currentY += rowHeight

  // Configurar fuente para datos
  pdf.setFontSize(fontSize)
  pdf.setFont("helvetica", "normal")

  // Número máximo de filas por página
  const maxRowsPerPage = 30
  let rowCount = 0

  // Dibujar filas de datos
  for (let i = 0; i < results.length; i++) {
    const result = results[i]

    // Verificar si necesitamos una nueva página
    if (rowCount >= maxRowsPerPage) {
      pdf.addPage()
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Tabla de resultados (continuación)", 105, 15, { align: "center" })

      // Reiniciar posición Y y contador de filas
      currentY = startY
      rowCount = 0

      // Dibujar encabezados en la nueva página
      currentX = startX
      pdf.setFontSize(headerFontSize)
      pdf.setFillColor(240, 240, 240)
      pdf.rect(startX, currentY, tableWidth, rowHeight, "F")

      headers.forEach((header, i) => {
        pdf.text(header, currentX + cellPadding, currentY + rowHeight - cellPadding)
        currentX += colWidths[i]
      })

      currentY += rowHeight
      pdf.setFontSize(fontSize)
      pdf.setFont("helvetica", "normal")
    }

    // Alternar color de fondo para filas
    if (i % 2 === 1) {
      pdf.setFillColor(248, 248, 248)
      pdf.rect(startX, currentY, tableWidth, rowHeight, "F")
    }

    // Si es una raíz, usar color verde claro
    if (result.isRoot) {
      pdf.setFillColor(230, 247, 230)
      pdf.rect(startX, currentY, tableWidth, rowHeight, "F")
    }

    // Dibujar datos de la fila
    currentX = startX

    // Iteración
    pdf.text(result.iteration.toString(), currentX + cellPadding, currentY + rowHeight - cellPadding)
    currentX += colWidths[0]

    // xi
    pdf.text(result.xi.toFixed(decimals), currentX + cellPadding, currentY + rowHeight - cellPadding)
    currentX += colWidths[1]

    // xs
    pdf.text(result.xs.toFixed(decimals), currentX + cellPadding, currentY + rowHeight - cellPadding)
    currentX += colWidths[2]

    // xr (en negrita si es raíz)
    if (result.isRoot) {
      pdf.setFont("helvetica", "bold")
    }
    pdf.text(result.xr.toFixed(decimals), currentX + cellPadding, currentY + rowHeight - cellPadding)
    if (result.isRoot) {
      pdf.setFont("helvetica", "normal")
    }
    currentX += colWidths[3]

    // f(xr)
    pdf.text(result.fxr.toFixed(decimals), currentX + cellPadding, currentY + rowHeight - cellPadding)
    currentX += colWidths[4]

    // Error
    pdf.text(
      result.iteration === 1 ? "-" : result.error.toExponential(4),
      currentX + cellPadding,
      currentY + rowHeight - cellPadding,
    )
    currentX += colWidths[5]

    // Estado
    if (result.isRoot) {
      pdf.setTextColor(0, 128, 0)
      pdf.text("Raíz", currentX + cellPadding, currentY + rowHeight - cellPadding)
      pdf.setTextColor(0, 0, 0)
    }

    currentY += rowHeight
    rowCount++
  }

  // Dibujar borde de la tabla
  pdf.setDrawColor(200, 200, 200)
  pdf.rect(startX, startY, tableWidth, rowHeight * (Math.min(results.length, maxRowsPerPage) + 1), "S")
}

/**
 * Genera una gráfica simple directamente en el PDF
 */
function generateGraphInPDF(pdf: jsPDF, data: ExportData): void {
  const { func, xi, xs, rootValue, decimals } = data

  // Configuración de la gráfica
  const width = 170
  const height = 120
  const startX = (210 - width) / 2
  const startY = 25

  // Dibujar ejes
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(0.3)

  // Eje X
  pdf.line(startX, startY + height, startX + width, startY + height)

  // Eje Y
  pdf.line(startX, startY, startX, startY + height)

  // Calcular escala y origen
  const xRange = xs - xi
  const xMin = xi - xRange * 0.1
  const xMax = xs + xRange * 0.1
  const xScale = width / (xMax - xMin)

  // Dibujar marcas en eje X
  const numXTicks = 5
  pdf.setFontSize(8)
  for (let i = 0; i <= numXTicks; i++) {
    const x = xMin + (i / numXTicks) * (xMax - xMin)
    const xPos = startX + (x - xMin) * xScale

    // Marca
    pdf.line(xPos, startY + height, xPos, startY + height + 3)

    // Etiqueta
    pdf.text(x.toFixed(2), xPos, startY + height + 8, { align: "center" })
  }

  // Dibujar líneas verticales para xi, xs y raíz
  pdf.setDrawColor(255, 150, 0) // Naranja para xi y xs
  pdf.setLineWidth(0.5)

  // Línea para xi
  const xiPos = startX + (xi - xMin) * xScale
  pdf.setLineDashPattern([3, 3], 0)
  pdf.line(xiPos, startY, xiPos, startY + height)
  pdf.text("xi", xiPos, startY - 5, { align: "center" })

  // Línea para xs
  const xsPos = startX + (xs - xMin) * xScale
  pdf.line(xsPos, startY, xsPos, startY + height)
  pdf.text("xs", xsPos, startY - 5, { align: "center" })

  // Línea para la raíz (si existe)
  if (rootValue !== null) {
    pdf.setDrawColor(0, 150, 0) // Verde para la raíz
    const rootPos = startX + (rootValue - xMin) * xScale
    pdf.setLineDashPattern([1, 0], 0) // Línea sólida
    pdf.line(rootPos, startY, rootPos, startY + height)
    pdf.text("Raíz", rootPos, startY - 5, { align: "center" })

    // Dibujar un círculo en la raíz
    pdf.setFillColor(0, 150, 0)
    pdf.circle(rootPos, startY + height / 2, 2, "F")
  }

  // Añadir leyenda
  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)
  pdf.text(`Función: f(x) = ${func}`, startX, startY + height + 20)
  if (rootValue !== null) {
    pdf.text(`Raíz encontrada en x = ${rootValue.toFixed(decimals)}`, startX, startY + height + 30)
  }
}

/**
 * Exporta los resultados a un archivo PDF
 */
export async function exportToPDF(data: ExportData): Promise<void> {
  const { results, func, xi, xs, rootValue, rootFunctionValue, decimals, stoppingCriteria, tolerance } = data

  // Crear un nuevo documento PDF
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  try {
    // Título y encabezado
    pdf.setFontSize(18)
    pdf.text("Método de Bisección - Resultados", 105, 15, { align: "center" })

    pdf.setFontSize(12)
    pdf.text(`Función: ${func}`, 20, 25)
    pdf.text(`Intervalo: [${xi}, ${xs}]`, 20, 32)
    pdf.text(`Criterio de parada: ${getStoppingCriteriaText(stoppingCriteria)}`, 20, 39)
    pdf.text(`Tolerancia: ${tolerance}`, 20, 46)
    pdf.text(`Decimales: ${decimals}`, 20, 53)

    // Paso a paso (primero)
    pdf.setFontSize(14)
    pdf.text("Proceso paso a paso", 20, 65)

    let yPosition = 75
    const lineHeight = 7

    // Iterar a través de cada paso
    for (let i = 0; i < results.length; i++) {
      const result = results[i]

      // Verificar si necesitamos una nueva página
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 20
      }

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text(`Iteración ${result.iteration}${result.isRoot ? " (Raíz encontrada)" : ""}`, 20, yPosition)
      yPosition += lineHeight

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)

      pdf.text(`1. Cálculo del punto medio:`, 25, yPosition)
      yPosition += lineHeight - 2
      pdf.text(
        `   xr = (xi + xs) / 2 = (${result.xi.toFixed(decimals)} + ${result.xs.toFixed(decimals)}) / 2 = ${result.xr.toFixed(decimals)}`,
        25,
        yPosition,
      )
      yPosition += lineHeight

      pdf.text(`2. Evaluación de la función:`, 25, yPosition)
      yPosition += lineHeight - 2
      pdf.text(`   f(xr) = ${result.fxr.toFixed(decimals)}`, 25, yPosition)
      yPosition += lineHeight

      pdf.text(`3. Decisión del nuevo intervalo:`, 25, yPosition)
      yPosition += lineHeight - 2

      // Aquí necesitaríamos la información de fxi para calcular fxi * fxr
      pdf.text(`   Nuevo intervalo: [${result.xi.toFixed(decimals)}, ${result.xs.toFixed(decimals)}]`, 25, yPosition)
      yPosition += lineHeight

      if (result.iteration > 1) {
        pdf.text(`4. Cálculo del error:`, 25, yPosition)
        yPosition += lineHeight - 2
        pdf.text(`   Error = ${result.error.toExponential(4)}`, 25, yPosition)
        yPosition += lineHeight
      }

      if (result.isRoot) {
        pdf.setTextColor(0, 128, 0) // Color verde para la raíz
        pdf.text(`¡Se ha encontrado una raíz en x = ${result.xr.toFixed(decimals)}!`, 25, yPosition)
        pdf.text(`f(${result.xr.toFixed(decimals)}) = ${result.fxr.toFixed(decimals)}`, 25, yPosition + lineHeight - 2)
        pdf.setTextColor(0, 0, 0) // Volver al color negro
        yPosition += lineHeight * 2
      }

      yPosition += lineHeight // Espacio entre iteraciones
    }

    // Resultados finales (raíz)
    pdf.addPage()
    pdf.setFontSize(16)
    pdf.text("Resultados finales", 105, 15, { align: "center" })

    pdf.setFontSize(12)
    if (rootValue !== null) {
      pdf.text(`Raíz encontrada: ${rootValue.toFixed(decimals)}`, 20, 30)
      pdf.text(`Valor de la función en la raíz: ${rootFunctionValue?.toFixed(decimals)}`, 20, 40)
      pdf.text(`Error final: ${results[results.length - 1].error.toExponential(4)}`, 20, 50)
      pdf.text(`Número de iteraciones: ${results.length}`, 20, 60)
    }

    // Tabla de resultados
    pdf.addPage()
    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text("Tabla de resultados", 105, 15, { align: "center" })

    // Generar tabla directamente en el PDF
    generateTableInPDF(pdf, results, decimals)

    // Gráfica de la función
    pdf.addPage()
    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text("Gráfica de la función", 105, 15, { align: "center" })

    // Generar gráfica directamente en el PDF
    generateGraphInPDF(pdf, data)

    // Guardar el PDF
    pdf.save("metodo-biseccion.pdf")
  } catch (error) {
    console.error("Error al exportar a PDF:", error)
    alert("Ocurrió un error al exportar a PDF. Por favor, inténtelo de nuevo.")
  }
}
