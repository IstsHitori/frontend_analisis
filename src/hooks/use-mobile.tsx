import { useState, useEffect } from "react"

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if screen width is mobile size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is standard md breakpoint in Tailwind
    }

    // Check on initial load
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

