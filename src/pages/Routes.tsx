import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Route, City } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function Routes() {
  const { selectedCityId } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    destination: '',
    distance: 0,
    estimatedTime: 0,
    cityId: '',
    active: true,
  });

  useEffect(() => {
    fetchRoutes();
    fetchCities();
  }, [selectedCityId]);

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const query = selectedCityId ? `?cityId=${selectedCityId}` : '';
      const data = await api.get<Route[]>(`/routes${query}`);
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const data = await api.get<City[]>('/cities');
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await api.put(`/routes/${editingRoute._id}`, formData);
      } else {
        await api.post('/routes', formData);
      }
      setIsDialogOpen(false);
      resetForm();
      fetchRoutes();
    } catch (error) {
      console.error('Error saving route:', error);
    }
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      origin: route.origin,
      destination: route.destination,
      distance: route.distance,
      estimatedTime: route.estimatedTime,
      cityId: route.cityId,
      active: route.active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta ruta?')) {
      try {
        await api.delete(`/routes/${id}`);
        fetchRoutes();
      } catch (error) {
        console.error('Error deleting route:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingRoute(null);
    setFormData({
      name: '',
      origin: '',
      destination: '',
      distance: 0,
      estimatedTime: 0,
      cityId: '',
      active: true,
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rutas</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de rutas operativas
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Ruta
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Cargando rutas...</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Distancia (km)</TableHead>
                <TableHead>Tiempo Est. (min)</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No hay rutas registradas
                  </TableCell>
                </TableRow>
              ) : (
                routes.map((route) => (
                  <TableRow key={route._id}>
                    <TableCell className="font-medium">{route.name}</TableCell>
                    <TableCell>{route.origin}</TableCell>
                    <TableCell>{route.destination}</TableCell>
                    <TableCell>{route.distance}</TableCell>
                    <TableCell>{route.estimatedTime}</TableCell>
                    <TableCell>{route.city?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={route.active ? 'success' : 'destructive'}>
                        {route.active ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(route)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(route._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRoute ? 'Editar Ruta' : 'Nueva Ruta'}
            </DialogTitle>
            <DialogClose onClose={() => setIsDialogOpen(false)} />
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Ruta Centro-Aeropuerto"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin">Origen</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destino</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distance">Distancia (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Tiempo Est. (min)</Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cityId">Ciudad</Label>
              <Select
                id="cityId"
                value={formData.cityId}
                onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                required
              >
                <option value="">Seleccionar ciudad</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="active">Activa</Label>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingRoute ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
