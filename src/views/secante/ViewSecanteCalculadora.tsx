import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMathfield } from "@/hooks/use-mathfield";
import { ToastContainer, Bounce, toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { secante } from "@/services/secante/secante";
import PrintPDF from "@/components/PrintPDF";

const regex = /^-?\d*\.?\d+(?:[eE][-+]?\d+)?$/;
const regexNoNegative = /^[0-9]+(?:\.[0-9]+)?(?:e[0-9]+)?$/;

const ViewSecanteCalculadora = () => {
  const X0 = useRef<HTMLInputElement>(null);
  const X1 = useRef<HTMLInputElement>(null);
  const error = useRef<HTMLInputElement>(null);
  const maxI = useRef<HTMLInputElement>(null);
  const maxD = useRef<HTMLInputElement>(null);
  const [validation, setValidation] = useState({
    X0: "default",
    X1: "default",
    error: "default",
    maxI: "default",
    maxD: "default",
  });
  const [result, setResult] = useState<{
    columns: string[];
    rows: (string | number)[][];
    steps: { f: string; label: string }[];
  }>({
    columns: [
      "Iteración",
      "X_i",
      "X_i-1",
      "X_i+1",
      "f(X_i-1)",
      "f(X_i)",
      "Error",
    ],
    rows: [],
    steps: [],
  });
  const [activeTab, setActiveTab] = useState("input");
  const [resultsReady, setResultsReady] = useState(false);
  const { renderMathField, value } = useMathfield();

  useEffect(() => {
    if (maxI.current) {
      maxI.current.value = "20";
    }
    if (maxD.current) {
      maxD.current.value = "9";
    }
  }, []);

  const handleCalculate = () => {
    if (
      X0.current &&
      X1.current &&
      error.current &&
      maxI.current &&
      maxD.current
    ) {
      const x0 = parseFloat(X0.current.value);
      const x1 = parseFloat(X1.current.value);
      const tolerance = error.current.value;
      const maxIterations = parseInt(maxI.current.value, 10);
      const maxDecimals = parseInt(maxD.current.value, 10);

      if (
        isNaN(x0) ||
        isNaN(x1) ||
        isNaN(maxIterations) ||
        isNaN(maxDecimals)
      ) {
        toast.error("Por favor, ingrese valores válidos.");
        return;
      }

      try {
        const { rows, fList } = secante({
          maxD: maxDecimals,
          Xi: x0,
          Xs: x1,
          f: value,
          error: tolerance,
          maxI: maxIterations,
          isPercentage: false, // Add the required property
        });

        setResult({ ...result, rows, steps: fList });
        toast.success("¡Cálculo completado!");
        setResultsReady(true);
        setTimeout(() => setActiveTab("results"), 500);
      } catch {
        toast.error("Error al calcular. Verifique la función y los valores.");
      }
    }
  };

  return (
    <div className="space-y-6 p-4 ">
      <Card>
        <CardHeader className="flex justify-between items-center ">
          <CardTitle className="text-2xl font-bold">
            Método de la Secante
          </CardTitle>
          <PrintPDF />
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="input">Entrada</TabsTrigger>
              <TabsTrigger value="results" disabled={!resultsReady}>
                Resultados
              </TabsTrigger>
            </TabsList>
            <TabsContent value="input" className="space-y-4 pt-4">
              <div>{renderMathField()}</div>
              <div className="flex items-start justify-between space-x-4">
                <div className="flex flex-col gap-4 w-full">
                  <div>
                    <Label htmlFor="x0" className="text-base font-medium">
                      Valor inicial x0
                    </Label>
                    <Input
                      id="x0"
                      required
                      ref={X0}
                      className={`mt-1 focus-visible:ring-0 ${
                        validation.X0 === "danger"
                          ? "border-red-500 focus-visible:border-red-500"
                          : ""
                      }`}
                      onChange={(e) => {
                        if (
                          !regex.test(e.target.value) &&
                          e.target.value !== ""
                        ) {
                          setValidation({ ...validation, X0: "danger" });
                        } else {
                          setValidation({ ...validation, X0: "default" });
                        }
                      }}
                      placeholder="X0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="x1" className="text-base font-medium">
                      Valor inicial x1
                    </Label>
                    <Input
                      id="x1"
                      required
                      ref={X1}
                      className={`mt-1 focus-visible:ring-0 ${
                        validation.X1 === "danger"
                          ? "border-red-500 focus-visible:border-red-500"
                          : ""
                      }`}
                      onChange={(e) => {
                        if (
                          !regex.test(e.target.value) &&
                          e.target.value !== ""
                        ) {
                          setValidation({ ...validation, X1: "danger" });
                        } else {
                          setValidation({ ...validation, X1: "default" });
                        }
                      }}
                      placeholder="X1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="tolerance"
                      className="text-base font-medium"
                    >
                      Tolerancia
                    </Label>
                    <Input
                      id="tolerance"
                      required
                      ref={error}
                      className={`mt-1 focus-visible:ring-0 ${
                        validation.error === "danger"
                          ? "border-red-500 focus-visible:border-red-500"
                          : ""
                      }`}
                      onChange={(e) => {
                        if (
                          !regex.test(e.target.value) &&
                          e.target.value !== ""
                        ) {
                          setValidation({ ...validation, error: "danger" });
                        } else {
                          setValidation({ ...validation, error: "default" });
                        }
                      }}
                      placeholder="Tolerancia"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-full">
                  <div>
                    <Label
                      htmlFor="maxIterations"
                      className="text-base font-medium"
                    >
                      Máximo de iteraciones
                    </Label>
                    <Input
                      id="maxIterations"
                      required
                      ref={maxI}
                      className={`mt-1 focus-visible:ring-0 ${
                        validation.maxI === "danger"
                          ? "border-red-500 focus-visible:border-red-500"
                          : ""
                      }`}
                      onChange={(e) => {
                        if (
                          !regexNoNegative.test(e.target.value) &&
                          e.target.value !== ""
                        ) {
                          setValidation({ ...validation, maxI: "danger" });
                        } else {
                          setValidation({ ...validation, maxI: "default" });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="maxDecimals"
                      className="text-base font-medium"
                    >
                      Máximo de decimales
                    </Label>
                    <Input
                      id="maxDecimals"
                      ref={maxD}
                      className={`mt-1 focus-visible:ring-0 ${
                        validation.maxD === "danger"
                          ? "border-red-500 focus-visible:border-red-500"
                          : ""
                      }`}
                      onChange={(e) => {
                        if (
                          !regexNoNegative.test(e.target.value) &&
                          e.target.value !== ""
                        ) {
                          setValidation({ ...validation, maxD: "danger" });
                        } else {
                          setValidation({ ...validation, maxD: "default" });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={handleCalculate}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white"
              >
                Calcular
              </Button>
            </TabsContent>
            <TabsContent value="results" className="space-y-4 pt-4">
              <div className="text-center text-lg font-medium">
                Resultados del cálculo
              </div>
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      {result.columns.map((col, index) => (
                        <th
                          key={index}
                          className="border border-gray-300 px-4 py-2 text-left"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="border border-gray-300 px-4 py-2"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-2">
                {result.steps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="font-bold">{step.label}</span>
                    <span>{step.f}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default ViewSecanteCalculadora;
