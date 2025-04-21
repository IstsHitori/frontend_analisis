// Lógica del método de bisección
import { evaluate } from "mathjs";
import type {
  BisectionParameters,
  BisectionResult,
  DetailedBisectionStep,
  StoppingCriteria,
} from "@/types/Biseccion";

/**
 * Evalúa una función matemática para un valor x dado
 */
export function evaluateFunction(func: string, x: number) {
  try {
    return evaluate(func, { x });
  } catch (e) {
    console.log(e);
  }
}

/**
 * Verifica si se cumple el teorema de Bolzano en el intervalo [xi, xs]
 */
export function validateBolzano(func: string, xi: number, xs: number) {
  try {
    const fxi = evaluateFunction(func, xi);
    const fxs = evaluateFunction(func, xs);
    return fxi * fxs < 0;
  } catch (e) {
    console.log(e);
  }
}

/**
 * Verifica si un valor es una raíz válida según la tolerancia
 */
export function isRootValid(fxr: number, tolerance: number): boolean {
  return Math.abs(fxr) < tolerance;
}

/**
 * Calcula el error según el criterio de parada
 */
export function calculateError(
  stoppingCriteria: StoppingCriteria,
  currentXr: number,
  prevXr: number
): number {
  if (stoppingCriteria === "relativeError") {
    return Math.abs((currentXr - prevXr) / currentXr);
  }
  return Math.abs(currentXr - prevXr);
}


/**
 * Determina si se debe detener la iteración según el criterio de parada
 */
export function shouldStopIteration(
  stoppingCriteria: StoppingCriteria,
  error: number,
  fxr: number,
  tolerance: number,
  iteration: number,
  maxIterations: number
): boolean {
  if (Math.abs(fxr) < 1e-15) {
    return true; // Raíz exacta encontrada
  }

  switch (stoppingCriteria) {
    case "tolerance":
      return Math.abs(fxr) < tolerance;
    case "relativeError":
      return error < tolerance;
    case "iterations":
      return iteration >= maxIterations;
    default:
      return false;
  }
}


/**
 * Implementación del método de bisección
 */
export function calculateBisection(params: BisectionParameters): {
  results: BisectionResult[];
  detailedSteps: DetailedBisectionStep[];
  rootValue: number | null;
  rootFunctionValue: number | null;
  rootFound: boolean;
} {
  const {
    func,
    xi: initialXi,
    xs: initialXs,
    tolerance,
    maxIterations,
    decimals,
    stoppingCriteria,
  } = params;

  // Validar parámetros
  if (isNaN(initialXi) || isNaN(initialXs)) {
    throw new Error("Los valores de xi y xs deben ser números válidos");
  }

  if (isNaN(tolerance) || tolerance <= 0) {
    throw new Error("La tolerancia debe ser un número positivo");
  }

  if (isNaN(maxIterations) || maxIterations <= 0) {
    throw new Error(
      "El número máximo de iteraciones debe ser un entero positivo"
    );
  }

  if (isNaN(decimals) || decimals < 0 || decimals > 15) {
    throw new Error("El número de decimales debe estar entre 0 y 15");
  }

  if (!validateBolzano(func, initialXi, initialXs)) {
    throw new Error(
      "No se cumple el teorema de Bolzano en el intervalo dado. f(xi) y f(xs) deben tener signos opuestos."
    );
  }

  const bisectionResults: BisectionResult[] = [];
  const bisectionDetailedSteps: DetailedBisectionStep[] = [];
  let currentXi = initialXi;
  let currentXs = initialXs;
  let error = Number.MAX_VALUE;
  let prevXr = 0;
  let foundRoot = false;
  let finalXr = 0;
  let finalFxr = 0;

  for (let i = 0; i < maxIterations; i++) {
    const xr = (currentXi + currentXs) / 2;
    const fxi = evaluateFunction(func, currentXi);
    const fxs = evaluateFunction(func, currentXs);
    const fxr = evaluateFunction(func, xr);

    if (i > 0) {
      error = calculateError(stoppingCriteria, xr, prevXr);
    }

    // Verificar si es raíz
    const isRoot = i > 0 && isRootValid(fxr, tolerance);

    // Determinar el nuevo intervalo para el paso a paso
    let newInterval = "";
    if (fxi * fxr < 0) {
      newInterval = `[${currentXi.toFixed(decimals)}, ${xr.toFixed(decimals)}]`;
    } else {
      newInterval = `[${xr.toFixed(decimals)}, ${currentXs.toFixed(decimals)}]`;
    }

    bisectionResults.push({
      iteration: i + 1,
      xi: currentXi,
      xs: currentXs,
      xr,
      fxr,
      error,
      isRoot,
      fxi,
      fxs,
    });

    bisectionDetailedSteps.push({
      iteration: i + 1,
      xi: currentXi,
      xs: currentXs,
      xr,
      fxi,
      fxs,
      fxr,
      error,
      newInterval,
      isRoot,
    });

    finalXr = xr;
    finalFxr = fxr;

    // Verificar criterio de parada
    if (
      shouldStopIteration(
        stoppingCriteria,
        error,
        fxr,
        tolerance,
        i + 1,
        maxIterations
      )
    ) {
      foundRoot = true;
      break;
    }

    prevXr = xr;
    if (fxi * fxr < 0) {
      currentXs = xr;
    } else {
      currentXi = xr;
    }
  }

  return {
    results: bisectionResults,
    detailedSteps: bisectionDetailedSteps,
    rootValue: finalXr,
    rootFunctionValue: finalFxr,
    rootFound: foundRoot,
  };
}
