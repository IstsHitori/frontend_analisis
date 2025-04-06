import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ViewVideos() {
  const videos = [
    {
      id: 1,
      title: "Introducción a los Métodos Numéricos",
      description:
        "Una visión general de los métodos numéricos y su importancia en la resolución de problemas matemáticos.",
      duration: "15:30",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 2,
      title: "Método de Bisección Explicado",
      description: "Explicación detallada del método de bisección con ejemplos paso a paso.",
      duration: "22:45",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 3,
      title: "Aplicaciones Prácticas de la Bisección",
      description: "Casos reales donde el método de bisección es utilizado para resolver problemas de ingeniería.",
      duration: "18:20",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 4,
      title: "Comparación de Métodos Numéricos",
      description: "Análisis comparativo entre el método de bisección y otros métodos como Newton-Raphson y secante.",
      duration: "25:10",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 5,
      title: "Implementación Computacional",
      description: "Cómo implementar el método de bisección en diferentes lenguajes de programación.",
      duration: "20:15",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 6,
      title: "Errores y Precisión en Métodos Numéricos",
      description: "Análisis de errores y consideraciones sobre la precisión en los métodos numéricos.",
      duration: "17:40",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
  ]

  return (
    <div className="space-y-6 p-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Videos Propuestos</CardTitle>
          <CardDescription>
            Material audiovisual para complementar tu aprendizaje sobre métodos numéricos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Estos videos te ayudarán a comprender mejor los conceptos teóricos y prácticos relacionados con los métodos
            numéricos, especialmente el método de bisección.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative">
              <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="rounded-full">
                  <Play className="h-6 w-6" />
                </Button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{video.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground mb-4">{video.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Video
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

