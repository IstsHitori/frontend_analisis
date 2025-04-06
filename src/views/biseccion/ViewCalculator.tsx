import { useState, useCallback, useRef, useEffect } from "react";
import { evaluate } from "mathjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Keyboard,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { VirtualKeyboard } from "@/components/biseccion/VirtualKeyboard";
import { useToast } from "@/components/ui/use-toast";
import confetti from "canvas-confetti";

interface BisectionResult {
  iteration: number;
  xi: number;
  xs: number;
  xr: number;
  fxr: number;
  error: number;
  isRoot?: boolean;
}

export function ViewCalculator() {
  const [func, setFunc] = useState("x^3 - x - 2");
  const [xi, setXi] = useState("-2");
  const [xs, setXs] = useState("2");
  const [tolerance, setTolerance] = useState("0.0001");
  const [maxIterations, setMaxIterations] = useState("100");
  const [stoppingCriteria, setStoppingCriteria] = useState("absoluteError");
  const [results, setResults] = useState<BisectionResult[]>([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [rootFound, setRootFound] = useState(false);
  const [rootValue, setRootValue] = useState<number | null>(null);
  const [rootFunctionValue, setRootFunctionValue] = useState<number | null>(
    null
  );
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const funcInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const rowsPerPage = 10;

  const evaluateFunction = useCallback(
    (x: number): number => {
      try {
        return evaluate(func, { x });
      } catch (e) {
        console.log(e);
        throw new Error("Error al evaluar la función");
      }
    },
    [func]
  );

  const validateBolzano = useCallback(
    (xi: number, xs: number): boolean => {
      try {
        const fxi = evaluateFunction(xi);
        const fxs = evaluateFunction(xs);
        return fxi * fxs < 0;
      } catch (e) {
        console.log(e);
        throw new Error("Error al validar el teorema de Bolzano");
      }
    },
    [evaluateFunction]
  );

  const isRootValid = (xr: number, fxr: number, tolerance: number): boolean => {
    return Math.abs(fxr) < tolerance;
  };

  // Función para lanzar confetti
  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const calculateBisection = () => {
    setError("");
    setResults([]);
    setIsCalculating(true);
    setRootFound(false);
    setRootValue(null);
    setRootFunctionValue(null);

    try {
      const numXi = Number.parseFloat(xi);
      const numXs = Number.parseFloat(xs);
      const numTolerance = Number.parseFloat(tolerance);
      const numMaxIterations = Number.parseInt(maxIterations);

      if (isNaN(numXi) || isNaN(numXs)) {
        throw new Error("Los valores de xi y xs deben ser números válidos");
      }

      if (isNaN(numTolerance) || numTolerance <= 0) {
        throw new Error("La tolerancia debe ser un número positivo");
      }

      if (isNaN(numMaxIterations) || numMaxIterations <= 0) {
        throw new Error(
          "El número máximo de iteraciones debe ser un entero positivo"
        );
      }

      if (!validateBolzano(numXi, numXs)) {
        throw new Error(
          "No se cumple el teorema de Bolzano en el intervalo dado. f(xi) y f(xs) deben tener signos opuestos."
        );
      }

      const bisectionResults: BisectionResult[] = [];
      let currentXi = numXi;
      let currentXs = numXs;
      let error = Number.MAX_VALUE;
      let prevXr = 0;
      let foundRoot = false;
      let finalXr = 0;
      let finalFxr = 0;

      for (let i = 0; i < numMaxIterations; i++) {
        const xr = (currentXi + currentXs) / 2;
        const fxr = evaluateFunction(xr);

        if (i > 0) {
          if (stoppingCriteria === "absoluteError") {
            error = Math.abs(xr - prevXr);
          } else if (stoppingCriteria === "relativeError") {
            error = Math.abs((xr - prevXr) / xr);
          }
        }

        // Verificar si es raíz
        const isRoot = i > 0 && isRootValid(xr, fxr, numTolerance);

        bisectionResults.push({
          iteration: i + 1,
          xi: currentXi,
          xs: currentXs,
          xr,
          fxr,
          error,
          isRoot,
        });

        finalXr = xr;
        finalFxr = fxr;

        // Verificar criterio de parada
        if (stoppingCriteria === "tolerance" && Math.abs(fxr) < numTolerance) {
          foundRoot = true;
          break;
        } else if (
          (stoppingCriteria === "absoluteError" ||
            stoppingCriteria === "relativeError") &&
          error < numTolerance
        ) {
          foundRoot = true;
          break;
        } else if (Math.abs(fxr) < 1e-15) {
          // Consideramos que hemos encontrado la raíz exacta
          foundRoot = true;
          break;
        }

        prevXr = xr;
        const fxi = evaluateFunction(currentXi);
        if (fxi * fxr < 0) {
          currentXs = xr;
        } else {
          currentXi = xr;
        }
      }

      setResults(bisectionResults);
      setCurrentPage(1);

      // Validar y guardar la raíz encontrada
      if (foundRoot || bisectionResults.length > 0) {
        setRootFound(foundRoot);
        setRootValue(finalXr);
        setRootFunctionValue(finalFxr);

        // Cambiar a la pestaña de resultados
        setTimeout(() => {
          setActiveTab("results");

          // Mostrar notificación de éxito
          toast({
            variant: "success",
            title: "¡Cálculo completado!",
            description: foundRoot
              ? `Se ha encontrado una raíz en x = ${finalXr.toFixed(6)}`
              : `Cálculo finalizado con ${bisectionResults.length} iteraciones`,
          });

          // Si se encontró una raíz, lanzar confetti
          if (foundRoot) {
            setTimeout(launchConfetti, 300);
          }
        }, 500);
      }
    } catch (e) {
      if (!(e instanceof Error)) return;
      setError(e.message);
      toast({
        variant: "destructive",
        title: "Error en el cálculo",
        description: e.message,
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const totalPages = Math.ceil(results.length / rowsPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleKeyboardInsert = (value: string) => {
    if (!funcInputRef.current) return;

    const input = funcInputRef.current;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;

    if (value === "BACKSPACE") {
      if (start === end && start > 0) {
        // Si no hay texto seleccionado, eliminar un carácter a la izquierda
        const newValue = func.substring(0, start - 1) + func.substring(end);
        setFunc(newValue);
        // Posicionar el cursor correctamente después de borrar
        setTimeout(() => {
          input.selectionStart = start - 1;
          input.selectionEnd = start - 1;
        }, 0);
      } else {
        // Si hay texto seleccionado, eliminarlo
        const newValue = func.substring(0, start) + func.substring(end);
        setFunc(newValue);
        // Posicionar el cursor correctamente después de borrar
        setTimeout(() => {
          input.selectionStart = start;
          input.selectionEnd = start;
        }, 0);
      }
    } else if (value === "CLEAR") {
      setFunc("");
    } else {
      // Insertar el valor en la posición del cursor
      const newValue = func.substring(0, start) + value + func.substring(end);
      setFunc(newValue);
      // Posicionar el cursor después del texto insertado
      const newPosition = start + value.length;
      setTimeout(() => {
        input.selectionStart = newPosition;
        input.selectionEnd = newPosition;
        input.focus();
      }, 0);
    }
  };

  const toggleKeyboard = () => {
    setShowKeyboard(!showKeyboard);
    // Si se muestra el teclado, enfocar el input de la función
    if (!showKeyboard && funcInputRef.current) {
      setTimeout(() => {
        funcInputRef.current?.focus();
      }, 100);
    }
  };

  // Efecto para hacer scroll a los resultados cuando cambian
  useEffect(() => {
    if (results.length > 0 && activeTab === "results" && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [results, activeTab]);

  return (
    <div className="space-y-6 p-10">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Método de Bisección
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="input">Entrada</TabsTrigger>
              <TabsTrigger value="results" disabled={results.length === 0}>
                Resultados
                {results.length > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-800">
                    {results.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="input" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="function" className="text-base font-medium">
                      Función f(x)
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleKeyboard}
                      className="flex items-center gap-1"
                    >
                      <Keyboard className="h-4 w-4" />
                      {showKeyboard ? "Ocultar teclado" : "Mostrar teclado"}
                    </Button>
                  </div>
                  <Input
                    id="function"
                    ref={funcInputRef}
                    value={func}
                    onChange={(e) => setFunc(e.target.value)}
                    placeholder="Ejemplo: x^3 - x - 2"
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Utilice la sintaxis de mathjs: x^2 para x², sin(x), cos(x),
                    etc.
                  </p>
                </div>

                {showKeyboard && (
                  <div className="my-4">
                    <VirtualKeyboard
                      onInsert={handleKeyboardInsert}
                      onClose={() => setShowKeyboard(false)}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="xi" className="text-base font-medium">
                      Límite inferior (xi)
                    </Label>
                    <Input
                      id="xi"
                      value={xi}
                      onChange={(e) => setXi(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="xs" className="text-base font-medium">
                      Límite superior (xs)
                    </Label>
                    <Input
                      id="xs"
                      value={xs}
                      onChange={(e) => setXs(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                  <Label className="block mb-2 text-base font-medium">
                    Criterio de parada
                  </Label>
                  <RadioGroup
                    value={stoppingCriteria}
                    onValueChange={setStoppingCriteria}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="absoluteError"
                        id="absoluteError"
                      />
                      <Label htmlFor="absoluteError">Error absoluto</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tolerance" id="tolerance" />
                      <Label htmlFor="tolerance">
                        Tolerancia (valor de f(x))
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="relativeError"
                        id="relativeError"
                      />
                      <Label htmlFor="relativeError">Error relativo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="iterations" id="iterations" />
                      <Label htmlFor="iterations">Número de iteraciones</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="tolerance"
                      className="text-base font-medium"
                    >
                      {stoppingCriteria === "tolerance"
                        ? "Tolerancia (para f(x))"
                        : stoppingCriteria === "absoluteError"
                        ? "Error absoluto máximo"
                        : "Error relativo máximo"}
                    </Label>
                    <Input
                      id="tolerance"
                      value={tolerance}
                      onChange={(e) => setTolerance(e.target.value)}
                      disabled={stoppingCriteria === "iterations"}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="maxIterations"
                      className="text-base font-medium"
                    >
                      Máximo de iteraciones
                    </Label>
                    <Input
                      id="maxIterations"
                      value={maxIterations}
                      onChange={(e) => setMaxIterations(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={calculateBisection}
                  disabled={isCalculating}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                  size="lg"
                >
                  {isCalculating ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Calculando...
                    </div>
                  ) : (
                    "Calcular"
                  )}
                </Button>
              </div>
            </TabsContent>
            <TabsContent
              value="results"
              className="space-y-4 pt-4"
              ref={resultRef}
            >
              {rootFound && rootValue !== null && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4 flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-green-800 dark:text-green-400">
                      ¡Raíz encontrada!
                    </h3>
                    <p className="text-green-700 dark:text-green-300">
                      Se ha encontrado una raíz en x = {rootValue.toFixed(8)}{" "}
                      con f(x) = {rootFunctionValue?.toFixed(8)}
                    </p>
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-100 dark:bg-slate-800">
                        <TableRow>
                          <TableHead>Iteración</TableHead>
                          <TableHead>xi</TableHead>
                          <TableHead>xs</TableHead>
                          <TableHead>xr</TableHead>
                          <TableHead>f(xr)</TableHead>
                          <TableHead>Error</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedResults.map((result) => (
                          <TableRow
                            key={result.iteration}
                            className={
                              result.isRoot
                                ? "bg-green-50 dark:bg-green-900/20"
                                : result.iteration % 2 === 0
                                ? "bg-slate-50 dark:bg-slate-900/50"
                                : ""
                            }
                          >
                            <TableCell>{result.iteration}</TableCell>
                            <TableCell>{result.xi.toFixed(6)}</TableCell>
                            <TableCell>{result.xs.toFixed(6)}</TableCell>
                            <TableCell
                              className={result.isRoot ? "font-bold" : ""}
                            >
                              {result.xr.toFixed(6)}
                            </TableCell>
                            <TableCell>{result.fxr.toFixed(6)}</TableCell>
                            <TableCell>
                              {result.iteration === 1
                                ? "-"
                                : result.error.toExponential(4)}
                            </TableCell>
                            <TableCell>
                              {result.isRoot && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
                                >
                                  Raíz
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Anterior
                      </Button>
                      <span className="text-sm">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}

                  <Card className="bg-slate-50 dark:bg-slate-900 border">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-bold mb-2">
                        Resultado final:
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="flex justify-between">
                            <span className="font-medium">
                              Raíz aproximada:
                            </span>
                            <span className="font-mono">
                              {results[results.length - 1].xr.toFixed(8)}
                            </span>
                          </p>
                          <p className="flex justify-between">
                            <span className="font-medium">Valor de f(xr):</span>
                            <span className="font-mono">
                              {results[results.length - 1].fxr.toFixed(8)}
                            </span>
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="flex justify-between">
                            <span className="font-medium">Error final:</span>
                            <span className="font-mono">
                              {results[results.length - 1].error.toExponential(
                                4
                              )}
                            </span>
                          </p>
                          <p className="flex justify-between">
                            <span className="font-medium">Iteraciones:</span>
                            <span className="font-mono">{results.length}</span>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
