import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BisectionStep {
  iteration: number;
  xi: number;
  xs: number;
  xr: number;
  fxi: number;
  fxs: number;
  fxr: number;
  error: number;
  newInterval: string;
  isRoot?: boolean;
}

interface StepByStepProps {
  steps: BisectionStep[];
  decimals: number;
}

export function StepByStep({ steps, decimals }: StepByStepProps) {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1]); // Por defecto, expandir solo la primera iteración

  const toggleStep = (iteration: number) => {
    if (expandedSteps.includes(iteration)) {
      setExpandedSteps(expandedSteps.filter((step) => step !== iteration));
    } else {
      setExpandedSteps([...expandedSteps, iteration]);
    }
  };

  const expandAll = () => {
    setExpandedSteps(steps.map((step) => step.iteration));
  };

  const collapseAll = () => {
    setExpandedSteps([]);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Proceso paso a paso</h3>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              Expandir todo
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              Colapsar todo
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.iteration}
              className={`border rounded-md ${
                step.isRoot
                  ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                  : ""
              }`}
            >
              <div
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => toggleStep(step.iteration)}
              >
                <div className="flex items-center">
                  {expandedSteps.includes(step.iteration) ? (
                    <ChevronDown className="h-5 w-5 mr-2" />
                  ) : (
                    <ChevronRight className="h-5 w-5 mr-2" />
                  )}
                  <span className="font-medium">
                    Iteración {step.iteration}
                    {step.isRoot && (
                      <span className="ml-2 text-green-600 dark:text-green-400">
                        (Raíz encontrada)
                      </span>
                    )}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  xr = {step.xr.toFixed(decimals)}
                </div>
              </div>

              {expandedSteps.includes(step.iteration) && (
                <div className="p-3 pt-0 border-t">
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium mb-1">
                        1. Cálculo del punto medio:
                      </p>
                      <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                        <p>xr = (xi + xs) / 2</p>
                        <p>
                          xr = ({step.xi.toFixed(decimals)} +{" "}
                          {step.xs.toFixed(decimals)}) / 2 ={" "}
                          {step.xr.toFixed(decimals)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium mb-1">
                        2. Evaluación de la función:
                      </p>
                      <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                        <p>f(xi) = {step.fxi.toFixed(decimals)}</p>
                        <p>f(xr) = {step.fxr.toFixed(decimals)}</p>
                        <p>f(xs) = {step.fxs.toFixed(decimals)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium mb-1">
                        3. Decisión del nuevo intervalo:
                      </p>
                      <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                        <p>
                          Si f(xi) × f(xr) &lt; 0, entonces la raíz está en [xi,
                          xr]
                        </p>
                        <p>
                          Si f(xi) × f(xr) &gt; 0, entonces la raíz está en [xr,
                          xs]
                        </p>
                        <p className="mt-1">
                          {step.fxi.toFixed(decimals)} ×{" "}
                          {step.fxr.toFixed(decimals)} ={" "}
                          {(step.fxi * step.fxr).toFixed(decimals)}
                          {step.fxi * step.fxr < 0 ? " < 0" : " > 0"}
                        </p>
                        <p className="font-medium mt-1">
                          Nuevo intervalo: {step.newInterval}
                        </p>
                      </div>
                    </div>

                    {step.iteration > 1 && (
                      <div>
                        <p className="font-medium mb-1">
                          4. Cálculo del error:
                        </p>
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                          <p>Error = {step.error.toExponential(4)}</p>
                        </div>
                      </div>
                    )}

                    {step.isRoot && (
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded border border-green-200 dark:border-green-800">
                        <p className="font-medium text-green-800 dark:text-green-300">
                          ¡Se ha encontrado una raíz en x ={" "}
                          {step.xr.toFixed(decimals)}!
                        </p>
                        <p className="text-green-700 dark:text-green-400">
                          f(x) = {step.fxr.toFixed(decimals)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
