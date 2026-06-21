import { NavLink } from 'react-router-dom'
import { TreePine, Users, Map, Heart, Flower2 } from 'lucide-react'
import { useGardenStore } from '@/store/gardenStore'

const navItems = [
  { to: '/', icon: Flower2, label: '花园' },
  { to: '/plant', icon: TreePine, label: '种树' },
  { to: '/faces', icon: Users, label: '面孔' },
  { to: '/route', icon: Map, label: '路线' },
  { to: '/family', icon: Heart, label: '家人' },
]

export default function Navigation() {
  const fontSize = useGardenStore((s) => s.fontSize)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-forest-100 shadow-soft z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-garden transition-all duration-300 min-w-[64px] ${
                isActive
                  ? 'text-forest-500 bg-forest-50'
                  : 'text-soil-400 hover:text-forest-400 hover:bg-forest-50/50'
              }`
            }
          >
            <Icon
              size={fontSize === 'xlarge' ? 28 : fontSize === 'large' ? 26 : 24}
              strokeWidth={2}
            />
            <span
              className={`font-body font-medium ${
                fontSize === 'xlarge' ? 'text-sm' : fontSize === 'large' ? 'text-xs' : 'text-[11px]'
              }`}
            >
              {label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
