import { useEffect, useRef } from "react";
import { evaluate } from "mathjs";
import type { BolzanoResult } from "@/types/Bolzano";

interface BolzanoGraphProps {
  result: BolzanoResult;
  width?: number;
  height?: number;
  decimals?: number;
}

export function BolzanoGraph({
  result,
  width = 600,
  height = 300,
  decimals = 4,
}: BolzanoGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Función para evaluar la función en un punto
  const evaluateFunction = (funcStr: string, x: number): number => {
    try {
      return evaluate(funcStr, { x });
    } catch (e) {
      console.error(`Error evaluando la función en x = ${x}:`, e);
      return 0;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;

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
      const xRange = result.b - result.a;
      const margin = xRange * 0.2;
      const xMin = result.a - margin;
      const xMax = result.b + margin;

      // Calcular valores de la función para encontrar yMin y yMax
      const points = [];
      const numPoints = 200;
      let yMin = Number.POSITIVE_INFINITY;
      let yMax = Number.NEGATIVE_INFINITY;

      for (let i = 0; i < numPoints; i++) {
        const x = xMin + (i / (numPoints - 1)) * (xMax - xMin);
        try {
          const y = evaluateFunction(result.func, x);
          points.push({ x, y });
          yMin = Math.min(yMin, y);
          yMax = Math.max(yMax, y);
        } catch (e) {
          console.error("Error al evaluar punto:", e);
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
      const aCanvas = toCanvasX(result.a);
      const bCanvas = toCanvasX(result.b);

      // Dibujar líneas verticales para a y b
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      // Línea vertical en a
      ctx.beginPath();
      ctx.moveTo(aCanvas, padding);
      ctx.lineTo(aCanvas, height - padding);
      ctx.stroke();

      // Línea vertical en b
      ctx.beginPath();
      ctx.moveTo(bCanvas, padding);
      ctx.lineTo(bCanvas, height - padding);
      ctx.stroke();

      ctx.setLineDash([]);

      // Etiquetas para a y b
      ctx.fillStyle = "#f97316";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText("a", aCanvas, padding - 10);
      ctx.fillText("b", bCanvas, padding - 10);

      // Dibujar puntos en f(a) y f(b)
      const faCanvas = toCanvasY(result.fa);
      const fbCanvas = toCanvasY(result.fb);

      // Punto en f(a)
      ctx.fillStyle = result.fa < 0 ? "#e11d48" : "#22c55e";
      ctx.beginPath();
      ctx.arc(aCanvas, faCanvas, 6, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Punto en f(b)
      ctx.fillStyle = result.fb < 0 ? "#e11d48" : "#22c55e";
      ctx.beginPath();
      ctx.arc(bCanvas, fbCanvas, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Etiquetas para f(a) y f(b)
      ctx.font = "10px Arial";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.fillText(
        `f(a) = ${result.fa.toFixed(decimals)}`,
        aCanvas,
        faCanvas - 10
      );
      ctx.fillText(
        `f(b) = ${result.fb.toFixed(decimals)}`,
        bCanvas,
        fbCanvas - 10
      );

      // Dibujar una línea entre los puntos f(a) y f(b) para visualizar mejor
      ctx.strokeStyle = result.isBolzanoSatisfied ? "#22c55e" : "#e11d48";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(aCanvas, faCanvas);
      ctx.lineTo(bCanvas, fbCanvas);
      ctx.stroke();
      ctx.setLineDash([]);
    } catch (e) {
      console.error("Error al dibujar la gráfica:", e);
    }
  }, [result, width, height, decimals]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border rounded-md"
    />
  );
}
