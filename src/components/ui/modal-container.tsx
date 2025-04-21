"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ModalContainerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  maxWidth?: string
}

export function ModalContainer({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-4xl",
}: ModalContainerProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Efecto para manejar el clic fuera del modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Efecto para bloquear el scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        ref={modalRef}
        className={`bg-white dark:bg-slate-950 rounded-lg shadow-lg ${maxWidth} max-h-[90vh] overflow-y-auto w-full`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8" aria-label="Cerrar">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4 py-4">{children}</div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose}>Entendido</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
