import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle, Keyboard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { VirtualKeyboard } from "@/components/bolzano/VirtualKeyBoard";
import confetti from "canvas-confetti";
import { BolzanoGraph } from "@/components/bolzano/BolzanoGraph";
import { useBolzanoCalculation } from "@/hooks/bolzano/useBolzanoCalculation";
import type { BolzanoResult } from "@/types/Bolzano";

export function ViewBolzanoCalculator() {
  // Estado para los parámetros de entrada
  const [func, setFunc] = useState("x^3 - x - 2");
  const [a, setA] = useState("-2");
  const [b, setB] = useState("2");
  const [decimals, setDecimals] = useState("4");

  // Estado para los resultados
  const [result, setResult] = useState<BolzanoResult | null>(null);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  // Estado para la UI
  const [showKeyboard, setShowKeyboard] = useState(false);

  // Referencias
  const funcInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { toast } = useToast();
  const { evaluateFunction, checkBolzanoTheorem } = useBolzanoCalculation();

  // Constantes
  const numDecimals = Number.parseInt(decimals) || 4;

  // Función para lanzar confetti cuando se cumple el teorema
  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Función para verificar el teorema de Bolzano
  const handleCheckBolzano = () => {
    setError("");
    setResult(null);
    setIsCalculating(true);

    try {
      const numA = Number.parseFloat(a);
      const numB = Number.parseFloat(b);

      if (isNaN(numA) || isNaN(numB)) {
        throw new Error("Los valores de a y b deben ser números válidos");
      }

      if (numA >= numB) {
        throw new Error("El valor de a debe ser menor que b");
      }

      // Evaluar la función en los extremos del intervalo
      const fa = evaluateFunction(func, numA);
      const fb = evaluateFunction(func, numB);

      // Verificar si se cumple el teorema de Bolzano
      const isBolzanoSatisfied = checkBolzanoTheorem(fa, fb);

      const newResult: BolzanoResult = {
        func,
        a: numA,
        b: numB,
        fa,
        fb,
        isBolzanoSatisfied,
      };

      setResult(newResult);

      // Mostrar notificación según el resultado
      if (isBolzanoSatisfied) {
        toast({
          variant: "success",
          title: "¡Se cumple el Teorema de Bolzano!",
          description: `f(${numA}) y f(${numB}) tienen signos opuestos. Existe al menos una raíz en el intervalo [${numA}, ${numB}].`,
        });
        setTimeout(launchConfetti, 300);
      } else {
        toast({
          variant: "default",
          title: "No se cumple el Teorema de Bolzano",
          description: `f(${numA}) y f(${numB}) tienen el mismo signo. No se puede garantizar la existencia de una raíz en el intervalo [${numA}, ${numB}].`,
        });
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

  // Manejo del teclado virtual
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

  // Ejemplos predefinidos
  const examples = [
    { name: "Ejemplo 1 (Cumple)", func: "x^3 - x - 2", a: "-2", b: "2" },
    { name: "Ejemplo 2 (Cumple)", func: "sin(x)", a: "0", b: "4" },
    { name: "Ejemplo 3 (No cumple)", func: "x^2 + 1", a: "-3", b: "3" },
    { name: "Ejemplo 4 (No cumple)", func: "exp(x)", a: "0", b: "5" },
  ];

  const loadExample = (example: { func: string; a: string; b: string }) => {
    setFunc(example.func);
    setA(example.a);
    setB(example.b);
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-6 p-2">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardTitle className="text-2xl font-bold">
            Calculadora del Teorema de Bolzano
          </CardTitle>
          <CardDescription>
            Verifica si una función cumple con el teorema de Bolzano en un
            intervalo dado
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Explicación del teorema */}
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4">
                <h3 className="text-lg font-semibold mb-2">
                  ¿Qué es el Teorema de Bolzano?
                </h3>
                <p className="text-sm">
                  El Teorema de Bolzano establece que si una función f(x) es
                  continua en un intervalo cerrado [a, b], y f(a) y f(b) tienen
                  signos opuestos (es decir, f(a) · f(b) &lt; 0), entonces
                  existe al menos un punto c en el intervalo (a, b) tal que f(c)
                  = 0.
                </p>
                <p className="text-sm mt-2">
                  En términos simples, si una función continua cambia de signo
                  en un intervalo, entonces debe cruzar el eje x al menos una
                  vez en ese intervalo.
                </p>
              </CardContent>
            </Card>

            {/* Ejemplos predefinidos */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Ejemplos predefinidos:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => loadExample(example)}
                    className="text-sm"
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Entrada de función */}
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
                Utilice la sintaxis de mathjs: x^2 para x², sin(x), cos(x), etc.
              </p>
            </div>

            {/* Teclado virtual */}
            {showKeyboard && (
              <div className="my-4">
                <VirtualKeyboard
                  onInsert={handleKeyboardInsert}
                  onClose={() => setShowKeyboard(false)}
                />
              </div>
            )}

            {/* Entrada de intervalo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="a" className="text-base font-medium">
                  Límite inferior (a)
                </Label>
                <Input
                  id="a"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="b" className="text-base font-medium">
                  Límite superior (b)
                </Label>
                <Input
                  id="b"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="decimals" className="text-base font-medium">
                  Decimales
                </Label>
                <Input
                  id="decimals"
                  value={decimals}
                  onChange={(e) => setDecimals(e.target.value)}
                  className="mt-1"
                  type="number"
                  min="0"
                  max="15"
                />
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Botón de cálculo */}
            <Button
              onClick={handleCheckBolzano}
              disabled={isCalculating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
                  Verificando...
                </div>
              ) : (
                "Verificar Teorema de Bolzano"
              )}
            </Button>

            {/* Resultados */}
            {result && (
              <div className="space-y-6 mt-6">
                {/* Resumen del resultado */}
                <Alert
                  variant={
                    result.isBolzanoSatisfied ? "default" : "destructive"
                  }
                  className={
                    result.isBolzanoSatisfied
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                  }
                >
                  {result.isBolzanoSatisfied ? (
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  )}
                  <AlertDescription>
                    <div className="font-bold">
                      {result.isBolzanoSatisfied
                        ? "¡Se cumple el Teorema de Bolzano!"
                        : "No se cumple el Teorema de Bolzano"}
                    </div>
                    <div className="mt-1">
                      {result.isBolzanoSatisfied
                        ? `f(${result.a}) = ${result.fa.toFixed(
                            numDecimals
                          )} y f(${result.b}) = ${result.fb.toFixed(
                            numDecimals
                          )} tienen signos opuestos. Existe al menos una raíz en el intervalo [${
                            result.a
                          }, ${result.b}].`
                        : `f(${result.a}) = ${result.fa.toFixed(
                            numDecimals
                          )} y f(${result.b}) = ${result.fb.toFixed(
                            numDecimals
                          )} tienen el mismo signo. No se puede garantizar la existencia de una raíz en el intervalo [${
                            result.a
                          }, ${result.b}].`}
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Detalles numéricos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Detalles del cálculo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Función:</span>
                          <span className="font-mono">
                            f(x) = {result.func}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Intervalo:</span>
                          <span className="font-mono">
                            [{result.a}, {result.b}]
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">f(a):</span>
                          <span className="font-mono">
                            {result.fa.toFixed(numDecimals)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">f(b):</span>
                          <span className="font-mono">
                            {result.fb.toFixed(numDecimals)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">f(a) · f(b):</span>
                          <span className="font-mono">
                            {(result.fa * result.fb).toFixed(numDecimals)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">
                            Condición f(a) · f(b) &lt; 0:
                          </span>
                          <span
                            className={
                              result.isBolzanoSatisfied
                                ? "font-mono text-green-600 dark:text-green-400"
                                : "font-mono text-red-600 dark:text-red-400"
                            }
                          >
                            {result.isBolzanoSatisfied
                              ? "Cumplida"
                              : "No cumplida"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Gráfica */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Visualización gráfica
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <BolzanoGraph
                        result={result}
                        width={600}
                        height={350}
                        decimals={numDecimals}
                      />
                      <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>{" "}
                        Valor positivo
                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full ml-4 mr-1"></span>{" "}
                        Valor negativo
                        <span className="inline-block w-20 h-0 border-t-2 border-dashed border-green-500 ml-4 mr-1"></span>{" "}
                        Cambio de signo
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Conclusión */}
                <Card
                  className={
                    result.isBolzanoSatisfied
                      ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                      : "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
                  }
                >
                  <CardHeader>
                    <CardTitle className="text-lg">Conclusión</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.isBolzanoSatisfied ? (
                      <div className="space-y-2">
                        <p>
                          Según el Teorema de Bolzano, existe al menos un valor
                          c en el intervalo ({result.a}, {result.b}) tal que
                          f(c) = 0.
                        </p>
                        <p>
                          Esto significa que la función f(x) = {result.func}{" "}
                          tiene al menos una raíz en el intervalo [{result.a},{" "}
                          {result.b}].
                        </p>
                        <p>
                          Para encontrar el valor exacto de esta raíz, se pueden
                          utilizar métodos numéricos como el método de
                          bisección, el método de Newton-Raphson o el método de
                          la secante.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p>
                          El Teorema de Bolzano no se cumple para la función
                          f(x) = {result.func} en el intervalo [{result.a},{" "}
                          {result.b}] porque f(a) y f(b) tienen el mismo signo.
                        </p>
                        <p>
                          Esto no significa que no exista una raíz en el
                          intervalo, sino que no podemos garantizar su
                          existencia basándonos únicamente en el Teorema de
                          Bolzano.
                        </p>
                        <p>
                          Si la función cruza el eje x un número par de veces en
                          el intervalo, el teorema no detectará estas raíces
                          porque los valores en los extremos tendrán el mismo
                          signo.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
