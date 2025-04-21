"use client"

import { ModalContainer } from "@/components/ui/modal-container"

interface InstructionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Instrucciones de uso"
      description="Aprende a utilizar la calculadora del método de bisección"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">¿Qué es el método de bisección?</h3>
        <p>
          El método de bisección es una técnica numérica para encontrar raíces de una función continua. Funciona
          dividiendo repetidamente un intervalo y seleccionando el subintervalo donde la función cambia de signo.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Paso 1: Ingresar la función</h3>
        <p>Escribe la función matemática en el campo "Función f(x)" utilizando la sintaxis de mathjs:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Potencias: <code>x^2</code> para x²
          </li>
          <li>
            Funciones trigonométricas: <code>sin(x)</code>, <code>cos(x)</code>, <code>tan(x)</code>
          </li>
          <li>
            Logaritmos: <code>log(x)</code> (base 10), <code>ln(x)</code> (base e)
          </li>
          <li>
            Exponenciales: <code>exp(x)</code> para e^x
          </li>
          <li>
            Constantes: <code>pi</code>, <code>e</code>
          </li>
        </ul>
        <p>
          Ejemplo: <code>x^3 - x - 2</code>
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Paso 2: Definir el intervalo</h3>
        <p>
          Ingresa los límites inferior (xi) y superior (xs) del intervalo donde crees que se encuentra la raíz. Para que
          el método funcione, la función debe cambiar de signo en este intervalo.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Paso 3: Configurar parámetros</h3>
        <p>Configura los siguientes parámetros según tus necesidades:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Decimales:</strong> Número de decimales a mostrar en los resultados
          </li>
          <li>
            <strong>Criterio de parada:</strong> Selecciona cómo determinar cuándo detener las iteraciones
          </li>
          <li>
            <strong>Tolerancia:</strong> Precisión deseada para el resultado
          </li>
          <li>
            <strong>Máximo de iteraciones:</strong> Límite de iteraciones para evitar bucles infinitos
          </li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Paso 4: Calcular</h3>
        <p>
          Haz clic en el botón "Calcular" para iniciar el proceso. La calculadora realizará las iteraciones necesarias y
          mostrará los resultados en la pestaña "Resultados".
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Interpretación de resultados</h3>
        <p>En la pestaña de resultados encontrarás:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Tabla de iteraciones con valores intermedios</li>
          <li>Gráfica de la función con la raíz marcada</li>
          <li>Explicación paso a paso del proceso</li>
          <li>Opciones para exportar los resultados</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Consejos útiles</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Utiliza el teclado virtual para funciones complejas</li>
          <li>Asegúrate de que la función cambie de signo en el intervalo seleccionado</li>
          <li>Si el método no converge, intenta con un intervalo más pequeño o diferente</li>
          <li>Para funciones con múltiples raíces, debes elegir un intervalo que contenga solo una raíz</li>
        </ul>
      </div>
    </ModalContainer>
  )
}
