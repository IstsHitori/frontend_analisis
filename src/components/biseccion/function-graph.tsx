
import { useEffect, useRef, useState } from "react";
import { evaluate } from "mathjs";
import { Card, CardContent } from "@/components/ui/card";

interface FunctionGraphProps {
  func: string;
  xi: number;
  xs: number;
  root?: number | null;
  width?: number;
  height?: number;
}

export function FunctionGraph({
  func,
  xi,
  xs,
  root,
  width = 600,
  height = 300,
}: FunctionGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

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
      const margin = (xs - xi) * 0.1;
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

      // Asegurar que el rango de y tenga un margen
      const yMargin = Math.max(0.5, (yMax - yMin) * 0.1);
      yMin = yMin - yMargin;
      yMax = yMax + yMargin;

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
      if (yMin <= 0 && yMax >= 0) {
        const y0Canvas = toCanvasY(0);
        ctx.strokeStyle = "#aaa";
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(padding, y0Canvas);
        ctx.lineTo(width - padding, y0Canvas);
        ctx.stroke();
        ctx.setLineDash([]);
      }

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

      // Dibujar la raíz si existe
      if (root !== null && root !== undefined) {
        const rootCanvas = toCanvasX(root);
        const rootY = evaluate(func, { x: root });
        const rootYCanvas = toCanvasY(rootY);

        // Línea vertical en la raíz
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rootCanvas, padding);
        ctx.lineTo(rootCanvas, height - padding);
        ctx.stroke();

        // Punto en la raíz
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(rootCanvas, rootYCanvas, 6, 0, 2 * Math.PI);
        ctx.fill();

        // Etiqueta para la raíz
        ctx.fillStyle = "#10b981";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Raíz", rootCanvas, padding - 10);
      }

      setError(null);
    } catch (e) {
      console.error("Error al dibujar la gráfica:", e);
      setError("No se pudo dibujar la gráfica. Verifique la función.");
    }
  }, [func, xi, xs, root, width, height]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Gráfica de la función</h3>
          {error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : (
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="border rounded-md"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
