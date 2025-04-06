import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { X, Delete } from "lucide-react"

interface VirtualKeyboardProps {
  onInsert: (value: string) => void
  onClose: () => void
}

export function VirtualKeyboard({ onInsert, onClose }: VirtualKeyboardProps) {
  const [activeTab, setActiveTab] = useState("basic")

  const basicKeys = [
    ["7", "8", "9", "+"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "*"],
    ["0", ".", "x", "/"],
    ["(", ")", "^", "√"],
  ]

  const functionKeys = [
    ["sin", "cos", "tan", "asin"],
    ["acos", "atan", "sinh", "cosh"],
    ["tanh", "log", "log10", "exp"],
    ["abs", "sqrt", "cbrt", "pi"],
    ["e", "!", "mod", "×10^"],
  ]

  const handleKeyClick = (key: string) => {
    let insertValue = key

    // Transformar algunas teclas a su equivalente en mathjs
    switch (key) {
      case "√":
        insertValue = "sqrt("
        break
      case "×10^":
        insertValue = "*10^"
        break
      case "mod":
        insertValue = " % "
        break
      case "!":
        insertValue = "factorial("
        break
      case "pi":
      case "e":
        // Estos se mantienen igual
        break
      case "sin":
      case "cos":
      case "tan":
      case "asin":
      case "acos":
      case "atan":
      case "sinh":
      case "cosh":
      case "tanh":
      case "log":
      case "log10":
      case "exp":
      case "abs":
      case "sqrt":
      case "cbrt":
        insertValue = `${key}(`
        break
    }

    onInsert(insertValue)
  }

  const handleBackspace = () => {
    onInsert("BACKSPACE")
  }

  const handleClear = () => {
    onInsert("CLEAR")
  }

  return (
    <div className="border rounded-lg shadow-lg bg-white dark:bg-slate-950 p-2 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2 pb-2 border-b">
        <h3 className="font-medium">Teclado Virtual</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="functions">Funciones</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-0">
          <div className="grid grid-cols-4 gap-1">
            {basicKeys.map((row, rowIndex) =>
              row.map((key, keyIndex) => (
                <Button
                  key={`${rowIndex}-${keyIndex}`}
                  variant="outline"
                  className="h-10 text-center"
                  onClick={() => handleKeyClick(key)}
                >
                  {key}
                </Button>
              )),
            )}
            <Button variant="outline" className="h-10 col-span-2" onClick={handleBackspace}>
              <Delete className="h-4 w-4 mr-1" /> Borrar
            </Button>
            <Button variant="outline" className="h-10 col-span-2" onClick={handleClear}>
              Limpiar
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="functions" className="mt-0">
          <div className="grid grid-cols-4 gap-1">
            {functionKeys.map((row, rowIndex) =>
              row.map((key, keyIndex) => (
                <Button
                  key={`${rowIndex}-${keyIndex}`}
                  variant="outline"
                  className="h-10 text-center text-xs sm:text-sm"
                  onClick={() => handleKeyClick(key)}
                >
                  {key}
                </Button>
              )),
            )}
            <Button variant="outline" className="h-10 col-span-2" onClick={handleBackspace}>
              <Delete className="h-4 w-4 mr-1" /> Borrar
            </Button>
            <Button variant="outline" className="h-10 col-span-2" onClick={handleClear}>
              Limpiar
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

