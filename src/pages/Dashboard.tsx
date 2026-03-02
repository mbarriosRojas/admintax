import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardStats } from '@/types';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Users, Route, Wrench, UserCircle } from 'lucide-react';

export function Dashboard() {
  const { selectedCityId } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const query = selectedCityId ? `?cityId=${selectedCityId}` : '';
        const data = await api.get<DashboardStats>(`/dashboard/stats${query}`);
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [selectedCityId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Vista general de la flota de taxis
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Vehículos
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalVehicles || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Vehículos en la flota
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Choferes Activos
            </CardTitle>
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeDrivers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Choferes en servicio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rutas Operativas
            </CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRoutes || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Rutas activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En Mantenimiento
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.maintenanceVehicles || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Vehículos en mantenimiento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Activos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Usuarios del sistema
            </p>
          </CardContent>
        </Card>
      </div>

      {stats && (stats.vehiclesByCity.length > 0 || stats.driversByCity.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          {stats.vehiclesByCity.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Vehículos por Ciudad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.vehiclesByCity.map((item) => (
                    <div key={item.city} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.city}</span>
                      <span className="text-sm text-muted-foreground">{item.count} vehículos</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {stats.driversByCity.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Choferes por Ciudad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.driversByCity.map((item) => (
                    <div key={item.city} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.city}</span>
                      <span className="text-sm text-muted-foreground">{item.count} choferes</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
