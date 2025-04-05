"use client"

import { useState, useEffect } from "react"
import {
  BookOpen,
  Calculator,
  FileText,
  Video,
  ActivityIcon as Function,
  ChevronDown,
  SplitSquareVertical,
  Anchor,
  GitMerge,
  GitFork,
  GitPullRequestDraft,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"
//
import { useAuth } from "@/hooks/auth/useAuth"
import { getCutName } from "@/utils"
//
import { Link } from "react-router-dom"

interface AppSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  activeMethod: string
  setActiveMethod: (method: string) => void
}

export function SideNavBar({ activeSection, setActiveSection, activeMethod, setActiveMethod }: AppSidebarProps) {
  // Hook para manejar el usuario
  const { user, logout } = useAuth()

  // Estado para controlar qué menús están abiertos
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    biseccion: true,
    "regla-falsa": false,
    "punto-fijo": false,
    secante: false,
    "newton-raphson": false,
    "newton-raphson-modificado": false,
  })

  // Estado para controlar si el sidebar está abierto en móvil
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Media query para detectar dispositivos móviles
  const isMobile = useIsMobile()

  // Cerrar sidebar en móvil cuando se cambia de sección
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      // No cerramos automáticamente el sidebar al cambiar de sección
      // para permitir la navegación entre secciones
    }
  }, [activeSection, isMobile, isSidebarOpen])

  // Función para alternar el estado de un menú
  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }))
    // No cerramos el sidebar cuando se expande/colapsa un menú
  }

  // Función para seleccionar un método y abrir su menú
  const selectMethod = (methodId: string) => {
    setActiveMethod(methodId)
    setActiveSection(methodId) // Ir a la página principal del método

    // Abrir el menú del método seleccionado
    setOpenMenus((prev) => {
      const newState = { ...prev }
      Object.keys(newState).forEach((key) => {
        newState[key] = key === methodId
      })
      return newState
    })

    // No cerramos el sidebar cuando se selecciona un método
  }

  // Función para seleccionar una sección dentro de un método
  const selectSection = (methodId: string, sectionId: string) => {
    setActiveMethod(methodId)
    setActiveSection(sectionId)

    // En móvil, cerrar el sidebar SOLO después de seleccionar una sección específica
    // y no cuando se selecciona el método principal
    if (isMobile && sectionId !== methodId) {
      setIsSidebarOpen(false)
    }
  }

  // Configuración de los métodos y sus secciones
  const methods = [
    {
      id: "biseccion",
      title: "Bisección",
      icon: Function,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "regla-falsa",
      title: "Regla Falsa",
      icon: SplitSquareVertical,
      color: "from-cyan-500 to-cyan-600",
    },
    {
      id: "punto-fijo",
      title: "Punto Fijo",
      icon: Anchor,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      id: "secante",
      title: "Secante",
      icon: GitMerge,
      color: "from-amber-500 to-amber-600",
    },
    {
      id: "newton-raphson",
      title: "Newton-Raphson",
      icon: GitFork,
      color: "from-rose-500 to-rose-600",
    },
    {
      id: "newton-raphson-modificado",
      title: "Newton-Raphson Modificado",
      icon: GitPullRequestDraft,
      color: "from-sky-500 to-sky-600",
    },
  ]

  // Secciones comunes para todos los métodos
  const commonSections = [
    {
      id: "introduccion",
      title: "Introducción",
      icon: BookOpen,
    },
    {
      id: "videos",
      title: "Videos Propuestos",
      icon: Video,
    },
    {
      id: "ejemplos",
      title: "Ejemplos Propuestos",
      icon: FileText,
    },
    {
      id: "calculadora",
      title: "Calculadora",
      icon: Calculator,
    },
  ]

  // Variantes de animación para los menús desplegables
  const menuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  // Variantes de animación para los iconos
  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  }

  // Clase condicional para el sidebar en móvil
  const mobileClasses = isMobile
    ? `fixed inset-y-0 left-0 z-50 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`
    : ""

  return (
    <>
      {/* Botón de hamburguesa para móvil */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      )}

      {/* Overlay para cerrar el sidebar en móvil */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <Sidebar
        variant="sidebar"
        collapsible={isMobile ? "none" : "icon"}
        className={`bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 shadow-lg ${mobileClasses}`}
      >
        <SidebarHeader className="pb-0">
          <div className="flex items-center gap-3 px-3 py-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
              <Function className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                MathDash
              </h1>
              <p className="text-xs text-muted-foreground">Métodos Numéricos</p>
            </div>
          </div>
          <Separator className="my-4 opacity-50" />
        </SidebarHeader>
        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {methods.map((method) => (
                  <SidebarMenuItem key={method.id} className="mb-1">
                    <SidebarMenuButton
                      onClick={() => {
                        toggleMenu(method.id)
                        if (!openMenus[method.id]) {
                          selectMethod(method.id)
                        }
                      }}
                      isActive={activeMethod === method.id}
                      tooltip={method.title}
                      className={`transition-all duration-200 text-sm ${
                        activeMethod === method.id
                          ? `bg-gradient-to-r text-white hover:shadow-md`
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div
                        className={`p-1 rounded-md ${
                          activeMethod === method.id ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <method.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{method.title}</span>
                      <motion.div
                        animate={openMenus[method.id] ? "open" : "closed"}
                        variants={iconVariants}
                        transition={{ duration: 0.3 }}
                        className="ml-auto"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </SidebarMenuButton>

                    <AnimatePresence initial={false}>
                      {openMenus[method.id] && (
                        <motion.div initial="hidden" animate="visible" exit="hidden" variants={menuVariants}>
                          <SidebarMenuSub>
                            {commonSections.map((section) => (
                              <SidebarMenuSubItem key={`${method.id}-${section.id}`} className="w-full md:w-[200px]">
                                <SidebarMenuSubButton
                                  isActive={activeMethod === method.id && activeSection === section.id}
                                  onClick={() => selectSection(method.id, section.id)}
                                  className={`transition-all duration-200 ${
                                    activeMethod === method.id && activeSection === section.id
                                      ? `bg-gradient-to-r bg-opacity-20 font-medium`
                                      : ""
                                  }`}
                                >
                                  <section.icon className="h-4 w-4 mr-2" />
                                  {section.title}
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-border/40 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border-2 border-primary/20 shadow-sm">
                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-white">
                  {getCutName(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link
                  onClick={() => {
                    setActiveMethod("")
                    setActiveSection("perfil")
                  }}
                  to={"/app/perfil"}
                >
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-rose-500 dark:text-rose-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  )
}

