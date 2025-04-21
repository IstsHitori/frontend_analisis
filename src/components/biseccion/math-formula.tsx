"use client"

import { useEffect, useState } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

interface MathFormulaProps {
    formula: string
    displayMode?: boolean
    className?: string
}

export function MathFormula({ formula, displayMode = false, className = "" }: MathFormulaProps) {
    const [html, setHtml] = useState<string>("")
  
    useEffect(() => {
      try {
        const renderedFormula = katex.renderToString(formula, {
          displayMode: displayMode,
          throwOnError: false,
          trust: true,
        })
        setHtml(renderedFormula)
      } catch (error) {
        console.error("Error al renderizar fórmula:", error)
        setHtml(`Error: ${error instanceof Error ? error.message : String(error)}`)
      }
    }, [formula, displayMode])
  
    return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  }
    