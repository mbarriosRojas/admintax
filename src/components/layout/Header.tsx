import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { City } from '@/types';
import { api } from '@/lib/api';
import { Select } from '@/components/ui/select';
import { MapPin, User } from 'lucide-react';

export function Header() {
  const { user, selectedCityId, setSelectedCityId } = useAuth();
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await api.get<City[]>('/cities');
        setCities(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    if (user) {
      fetchCities();
    }
  }, [user]);

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <Select
              value={selectedCityId || ''}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="w-48"
            >
              <option value="">Todas las ciudades</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-muted-foreground" />
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
