import { NavLink } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { 
  BarChart2, 
  Home, 
  Settings, 
  Upload,
  FileCheck,
  Database,
  ChevronDown
} from "lucide-react"

function Sidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const headerRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const [isVariablesOpen, setIsVariablesOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard/overview', label: 'Resumen', icon: BarChart2 },
    { path: '/dashboard/surveys', label: 'Encuestas', icon: FileCheck },
    { path: '/dashboard/upload', label: 'Subir Archivos', icon: Upload },
    { path: '/dashboard/settings', label: 'Configuración', icon: Settings },
  ]

  const variables = [
    { path: '/dashboard/variables/1', label: 'Variable 1' },
    { path: '/dashboard/variables/2', label: 'Variable 2' },
    { path: '/dashboard/variables/3', label: 'Variable 3' },
    { path: '/dashboard/variables/4', label: 'Variable 4' },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sidebarRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      })

      gsap.from(headerRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        delay: 0.2,
        ease: "power2.out"
      })

      gsap.from(navItemsRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        delay: 0.4,
        ease: "power2.out"
      })

      gsap.from(footerRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        delay: 0.8,
        ease: "power2.out"
      })
    })

    return () => ctx.revert()
  }, [])

  const handleMouseEnter = (index: number) => {
    gsap.to(navItemsRef.current[index], {
      x: 5,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  const handleMouseLeave = (index: number) => {
    gsap.to(navItemsRef.current[index], {
      x: 0,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  return (
    <aside 
      ref={sidebarRef}
      className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-full"
    >
      <div 
        ref={headerRef}
        className="p-6 border-b border-gray-200"
      >
        <h1 className="text-xl font-semibold text-gray-900 text-center">Sistema Encuestas</h1>
        <img src="/assets/tux.webp" alt="Logo" className="mt-2 w-24 h-24 mx-auto" />
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            ref={(el) => {
              navItemsRef.current[index] = el
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mb-1 ${
                isActive ? 'bg-blue-50 text-blue-600 font-medium' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Variables Dropdown */}
        <div className="mb-1">
          <button
            onClick={() => setIsVariablesOpen(!isVariablesOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5" />
              <span>Variables</span>
            </div>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${
                isVariablesOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Submenu */}
          <div 
            className={`overflow-hidden transition-all duration-300 ${
              isVariablesOpen ? 'max-h-48' : 'max-h-0'
            }`}
          >
            <div className="pl-11 space-y-1 mt-1">
              {variables.map((variable) => (
                <NavLink
                  key={variable.path}
                  to={variable.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors ${
                      isActive ? 'bg-blue-50 text-blue-600 font-medium' : ''
                    }`
                  }
                >
                  {variable.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div 
        ref={footerRef}
        className="p-4 border-t border-gray-200"
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar