// Definición de tipos para el método de bisección

export interface BisectionResult {
    iteration: number
    xi: number
    xs: number
    xr: number
    fxr: number
    error: number
    isRoot?: boolean
    fxi?: number
    fxs?: number
  }
  
  export interface DetailedBisectionStep {
    iteration: number
    xi: number
    xs: number
    xr: number
    fxi: number
    fxs: number
    fxr: number
    error: number
    newInterval: string
    isRoot?: boolean
  }
  
  export interface BisectionParameters {
    func: string
    xi: number
    xs: number
    tolerance: number
    maxIterations: number
    decimals: number
    stoppingCriteria: StoppingCriteria
  }
  
  export type StoppingCriteria = "tolerance" | "relativeError" | "iterations"
  
  export interface ExportData {
    results: BisectionResult[]
    func: string
    xi: number
    xs: number
    rootValue: number | null
    rootFunctionValue: number | null
    decimals: number
    stoppingCriteria: string
    tolerance: string
  }
  