import { useEffect, useRef, useState } from "react";
import { evaluate } from "mathjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BolzanoCheckProps {
  func: string;
  xi: number;
  xs: number;
  width?: number;
  height?: number;
}

export function BolzanoCheck({
  func,
  xi,
  xs,
  width = 600,
  height = 300,
}: BolzanoCheckProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [fxi, setFxi] = useState<number | null>(null);
  const [fxs, setFxs] = useState<number | null>(null);
  const [bolzanoSatisfied, setBolzanoSatisfied] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    try {
      // Evaluar la función en los extremos del intervalo
      const fxiValue = evaluate(func, { x: xi });
      const fxsValue = evaluate(func, { x: xs });

      setFxi(fxiValue);
      setFxs(fxsValue);

      // Verificar si se cumple el teorema de Bolzano
      const isBolzanoSatisfied = fxiValue * fxsValue < 0;
      setBolzanoSatisfied(isBolzanoSatisfied);
    } catch (e) {
      console.error("Error al evaluar la función:", e);
      setError("No se pudo evaluar la función. Verifique la sintaxis.");
    }
  }, [func, xi, xs]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limpiar el canvas
    ctx.clearRect(0, 0, width, height);

    try {
      // Configurar el sistema de coordenadas
      const padding = 40;
      const graphWidth = width - 2 * padding;
      const graphHeight = height - 2 * padding;

      // Calcular el rango de x con un margen adicional
      const xRange = xs - xi;
      const margin = xRange * 0.2;
      const xMin = xi - margin;
      const xMax = xs + margin;

      // Calcular valores de la función para encontrar yMin y yMax
      const points = [];
      const numPoints = 200;
      let yMin = Number.POSITIVE_INFINITY;
      let yMax = Number.NEGATIVE_INFINITY;

      for (let i = 0; i < numPoints; i++) {
        const x = xMin + (i / (numPoints - 1)) * (xMax - xMin);
        try {
          const y = evaluate(func, { x });
          points.push({ x, y });
          yMin = Math.min(yMin, y);
          yMax = Math.max(yMax, y);
        } catch (e) {
          console.log(e);
        }
      }

      // Asegurar que el rango de y tenga un margen y que incluya el cero
      const yMargin = Math.max(0.5, (yMax - yMin) * 0.1);
      yMin = Math.min(yMin - yMargin, -0.5);
      yMax = Math.max(yMax + yMargin, 0.5);

      // Función para convertir coordenadas matemáticas a coordenadas del canvas
      const toCanvasX = (x: number) =>
        padding + ((x - xMin) / (xMax - xMin)) * graphWidth;
      const toCanvasY = (y: number) =>
        height - padding - ((y - yMin) / (yMax - yMin)) * graphHeight;

      // Dibujar ejes
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 1;
      ctx.beginPath();

      // Eje X
      ctx.moveTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);

      // Eje Y
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);

      ctx.stroke();

      // Dibujar línea y = 0 si está dentro del rango
      const y0Canvas = toCanvasY(0);
      ctx.strokeStyle = "#aaa";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(padding, y0Canvas);
      ctx.lineTo(width - padding, y0Canvas);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dibujar marcas en los ejes
      ctx.fillStyle = "#666";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";

      // Marcas en X
      const numXTicks = 5;
      for (let i = 0; i <= numXTicks; i++) {
        const x = xMin + (i / numXTicks) * (xMax - xMin);
        const xCanvas = toCanvasX(x);
        ctx.beginPath();
        ctx.moveTo(xCanvas, height - padding - 5);
        ctx.lineTo(xCanvas, height - padding + 5);
        ctx.stroke();
        ctx.fillText(x.toFixed(2), xCanvas, height - padding + 20);
      }

      // Marcas en Y
      ctx.textAlign = "right";
      const numYTicks = 5;
      for (let i = 0; i <= numYTicks; i++) {
        const y = yMin + (i / numYTicks) * (yMax - yMin);
        const yCanvas = toCanvasY(y);
        ctx.beginPath();
        ctx.moveTo(padding - 5, yCanvas);
        ctx.lineTo(padding + 5, yCanvas);
        ctx.stroke();
        ctx.fillText(y.toFixed(2), padding - 10, yCanvas + 4);
      }

      // Dibujar la función
      if (points.length > 0) {
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.beginPath();

        let isFirstPoint = true;
        let prevY = 0;

        for (const point of points) {
          const xCanvas = toCanvasX(point.x);
          const yCanvas = toCanvasY(point.y);

          // Detectar discontinuidades
          if (isFirstPoint) {
            ctx.moveTo(xCanvas, yCanvas);
            isFirstPoint = false;
          } else {
            // Si hay un salto muy grande, es probablemente una discontinuidad
            if (Math.abs(yCanvas - prevY) > graphHeight / 2) {
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(xCanvas, yCanvas);
            } else {
              ctx.lineTo(xCanvas, yCanvas);
            }
          }

          prevY = yCanvas;
        }

        ctx.stroke();
      }

      // Dibujar los límites del intervalo
      const xiCanvas = toCanvasX(xi);
      const xsCanvas = toCanvasX(xs);

      // Dibujar líneas verticales para xi y xs
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      // Línea vertical en xi
      ctx.beginPath();
      ctx.moveTo(xiCanvas, padding);
      ctx.lineTo(xiCanvas, height - padding);
      ctx.stroke();

      // Línea vertical en xs
      ctx.beginPath();
      ctx.moveTo(xsCanvas, padding);
      ctx.lineTo(xsCanvas, height - padding);
      ctx.stroke();

      ctx.setLineDash([]);

      // Etiquetas para xi y xs
      ctx.fillStyle = "#f97316";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText("xi", xiCanvas, padding - 10);
      ctx.fillText("xs", xsCanvas, padding - 10);

      // Dibujar puntos en f(xi) y f(xs)
      if (fxi !== null && fxs !== null) {
        const fxiCanvas = toCanvasY(fxi);
        const fxsCanvas = toCanvasY(fxs);

        // Punto en f(xi)
        ctx.fillStyle = fxi < 0 ? "#e11d48" : "#22c55e";
        ctx.beginPath();
        ctx.arc(xiCanvas, fxiCanvas, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Punto en f(xs)
        ctx.fillStyle = fxs < 0 ? "#e11d48" : "#22c55e";
        ctx.beginPath();
        ctx.arc(xsCanvas, fxsCanvas, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Etiquetas para f(xi) y f(xs)
        ctx.font = "10px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.fillText(`f(xi) = ${fxi.toFixed(4)}`, xiCanvas, fxiCanvas - 10);
        ctx.fillText(`f(xs) = ${fxs.toFixed(4)}`, xsCanvas, fxsCanvas - 10);
      }

      setError(null);
    } catch (e) {
      console.error("Error al dibujar la gráfica:", e);
      setError("No se pudo dibujar la gráfica. Verifique la función.");
    }
  }, [func, xi, xs, width, height, fxi, fxs]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          Verificación del Teorema de Bolzano
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : (
          <>
            <div className="mb-4">
              {bolzanoSatisfied !== null && (
                <Alert variant={bolzanoSatisfied ? "default" : "destructive"}>
                  {bolzanoSatisfied ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {bolzanoSatisfied
                      ? "Se cumple el Teorema de Bolzano"
                      : "No se cumple el Teorema de Bolzano"}
                  </AlertTitle>
                  <AlertDescription>
                    {bolzanoSatisfied
                      ? `f(xi) = ${fxi?.toFixed(4)} y f(xs) = ${fxs?.toFixed(
                          4
                        )} tienen signos opuestos. Existe al menos una raíz en el intervalo [${xi}, ${xs}].`
                      : `f(xi) = ${fxi?.toFixed(4)} y f(xs) = ${fxs?.toFixed(
                          4
                        )} tienen el mismo signo. No se puede garantizar la existencia de una raíz en el intervalo [${xi}, ${xs}].`}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex flex-col items-center">
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="border rounded-md"
              />
              <p className="text-sm text-muted-foreground mt-2">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>{" "}
                Valor positivo
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full ml-4 mr-1"></span>{" "}
                Valor negativo
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
