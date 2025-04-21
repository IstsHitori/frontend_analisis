import { evaluate } from "mathjs";

export function useBolzanoCalculation() {
  /**
   * Evalúa una función matemática para un valor x dado
   */
  const evaluateFunction = (func: string, x: number): number => {
    try {
      return evaluate(func, { x });
    } catch (e) {
      console.error(`Error al evaluar la función en x = ${x}:`, e);
      throw new Error(`Error al evaluar la función en x = ${x}`);
    }
  };

  /**
   * Verifica si se cumple el teorema de Bolzano
   * (si los valores tienen signos opuestos)
   */
  const checkBolzanoTheorem = (fa: number, fb: number): boolean => {
    return fa * fb < 0;
  };

  return {
    evaluateFunction,
    checkBolzanoTheorem,
  };
}
