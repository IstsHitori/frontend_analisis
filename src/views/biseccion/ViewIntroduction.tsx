import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  FileText,
  Video,
  ActivityIcon as Function,
} from "lucide-react";
import { MathFormula } from "@/components/biseccion/math-formula";

export function ViewBiseccionIntroduction() {
  return (
    <div className="grid gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Bienvenido a Métodos Numéricos
        </h2>
        <p className="text-muted-foreground">
          Una introducción al método de bisección y su aplicación en la
          resolución de problemas matemáticos
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Function className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Método de Bisección</h3>
                <p className="text-muted-foreground">
                  Fundamentos y aplicaciones
                </p>
              </div>
            </div>
          </div>
          <CardContent className="p-6 pt-6">
            <p className="leading-7">
              El método de bisección es una técnica fundamental en los métodos
              numéricos que permite encontrar raíces de funciones continuas. Se
              basa en el teorema del valor intermedio y utiliza un enfoque de
              "divide y vencerás" para aproximar soluciones.
              <br /><br />
              El método de bisección, también conocido como el método de Bolzano, es un
              método numérico para encontrar raíces de ecuaciones de la forma: <MathFormula formula="f(x) = 0" className="inline" />
            </p><br />

            {/* Sección de fórmulas matemáticas */}
            <Card className="mt-4 border bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                {/*<Info className="h-5 w-5 text-primary" /> */}
                <h4 className="text-lg font-semibold">Fundamento Teórico</h4>
              </div>
              <p className="text-sm mb-3">
                El método se basa en el Teorema de Bolzano, el cual establece que si una función continua{" "}
                <MathFormula formula="f(x)" className="inline" /> tiene signos opuestos en los extremos de un intervalo{" "}
                <MathFormula formula="[a,b]" className="inline" />, es decir:
              </p>
              <div className="bg-card p-4 rounded-md">
                <MathFormula formula="f(a) \cdot f(b) < 0" displayMode={true} className="my-2" />
              </div>
              <p className="text-sm mt-3">
                entonces existe al menos una raíz <MathFormula formula="c" className="inline" /> en dicho intervalo,
                donde <MathFormula formula="f(c) = 0" className="inline" />
              </p>

              <div className="mt-5">
                <h4 className="text-lg font-semibold">Algoritmo del Método de Bisección</h4><br />
                <ol className="list-decimal list-inside space-y-3 text-sm pl-2">
                  <li>
                    Definir el intervalo inicial <MathFormula formula="[a,b]" className="inline" />, donde{" "}
                    <MathFormula formula="f(a) \cdot f(b) < 0" className="inline" />
                  </li>
                  <li>
                    Calcular el punto medio del intervalo:
                    <div className="bg-card p-3 rounded-md my-2">
                      <MathFormula formula="c = \frac{a + b}{2}" displayMode={true} />
                    </div>
                  </li>
                  <li>
                    Evaluar la función en nuestro punto medio <MathFormula formula="c" className="inline" />:
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-2">
                      <li>
                        Si <MathFormula formula="f(c) = 0" className="inline" />, entonces{" "}
                        <MathFormula formula="c" className="inline" /> es la raíz exacta.
                      </li>
                      <li>
                        Si <MathFormula formula="f(a) \cdot f(c) < 0" className="inline" />, entonces la raíz está en{" "}
                        <MathFormula formula="[a,c]" className="inline" /> y se redefine{" "}
                        <MathFormula formula="b = c" className="inline" />.
                      </li>
                      <li>
                        Si <MathFormula formula="f(b) \cdot f(c) < 0" className="inline" />, entonces la raíz está en{" "}
                        <MathFormula formula="[c,b]" className="inline" /> y se redefine{" "}
                        <MathFormula formula="a = c" className="inline" />.
                      </li>
                    </ul>
                  </li>
                  <li>
                    Calcular el error relativo:
                    <div className="bg-card p-3 rounded-md my-2">
                      <MathFormula
                        formula="e_a = \left| \frac{c - c_{anterior}}{c} \right| \cdot 100"
                        displayMode={true}
                      />
                    </div>
                  </li>
                  <li>
                    Repetir el proceso hasta que el intervalo sea lo suficientemente pequeño o se alcance un número
                    máximo de iteraciones.
                  </li>
                </ol>
              </div>

              <div className="mt-5">
                <h4 className="text-lg font-semibold">Criterio de Parada</h4><br />
                <p className="text-sm mb-3">
                  El proceso se detiene cuando se cumple alguna de las siguientes condiciones:
                </p>
                <div className="bg-card p-3 rounded-md">
                  <MathFormula
                    formula="\left| \frac{c - c_{anterior}}{c} \right| \cdot 100 < \varepsilon"
                    displayMode={true}
                    className="my-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Donde <MathFormula formula="\varepsilon" className="inline" /> es una tolerancia pequeña,{" "}
                    <MathFormula formula="c" className="inline" /> es el punto medio actual y{" "}
                    <MathFormula formula="c_{anterior}" className="inline" /> es el punto medio de la iteración
                    anterior.
                  </p>
                </div>
              </div>
            </Card>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-4">
                <h4 className="mb-2 font-medium">Ventajas</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span>Simple de entender e implementar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span>Convergencia garantizada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span>No requiere derivadas</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <h4 className="mb-2 font-medium">Aplicaciones</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span>Resolución de ecuaciones no lineales</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span>Optimización de funciones</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span>Problemas de ingeniería y física</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-4">
            <Button variant="outline" className="gap-1">
              Aprender más sobre bisección <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <h3 className="text-xl font-semibold tracking-tight mt-2">
        Explora el contenido
      </h3>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="group overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="p-4 pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <CardTitle className="text-lg">Introducción</CardTitle>
            <CardDescription className="line-clamp-2 mt-2">
              Fundamentos teóricos y conceptos básicos del método de bisección
            </CardDescription>
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-1 px-2"
            >
              Explorar <ArrowRight className="h-3.5 w-3.5 ml-auto" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="group overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="p-4 pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20">
              <Video className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <CardTitle className="text-lg">Videos</CardTitle>
            <CardDescription className="line-clamp-2 mt-2">
              Material audiovisual explicativo sobre el método de bisección
            </CardDescription>
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-1 px-2"
            >
              Ver videos <ArrowRight className="h-3.5 w-3.5 ml-auto" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="group overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="p-4 pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <CardTitle className="text-lg">Ejemplos</CardTitle>
            <CardDescription className="line-clamp-2 mt-2">
              Casos prácticos resueltos paso a paso con el método de bisección
            </CardDescription>
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-1 px-2"
            >
              Ver ejemplos <ArrowRight className="h-3.5 w-3.5 ml-auto" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="group overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="p-4 pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <CardTitle className="text-lg">Calculadora</CardTitle>
            <CardDescription className="line-clamp-2 mt-2">
              Herramienta interactiva para resolver ecuaciones con el método de
              bisección
            </CardDescription>
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-1 px-2"
            >
              Usar calculadora <ArrowRight className="h-3.5 w-3.5 ml-auto" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-4 border-none bg-muted/50 shadow-sm">
        <CardHeader>
          <CardTitle>Objetivos de Aprendizaje</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            <li className="flex items-start gap-2">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
              <span>
                Comprender los fundamentos teóricos del método de bisección
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
              <span>Aplicar el método para encontrar raíces de funciones</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
              <span>Analizar la convergencia y precisión del método</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
              <span>Implementar el algoritmo en aplicaciones prácticas</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
