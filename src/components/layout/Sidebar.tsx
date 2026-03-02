import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Car,
  UserCircle,
  Route,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Usuarios', path: '/users', icon: Users },
  { name: 'Vehículos', path: '/vehicles', icon: Car },
  { name: 'Choferes', path: '/drivers', icon: UserCircle },
  { name: 'Rutas', path: '/routes', icon: Route },
  { name: 'Configuración', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">AdminTax</h1>
        <p className="text-sm text-muted-foreground mt-1">Panel de Administración</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
