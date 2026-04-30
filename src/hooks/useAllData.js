import { useState, useEffect } from 'react';
import { destinations as staticDestinations, packages as staticPackages } from '../data/travelData';
import { getAdminDestinations, getAdminPackages } from '../firebase/config';

export function useAllDestinations() {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const adminDests = await getAdminDestinations();
      const mapped = adminDests.map(d => ({
        ...d,
        id: `admin_${d.id}`,
        isNew: true,
        reviews: d.reviews || 0,
        highlights: Array.isArray(d.highlights) ? d.highlights : (d.highlights || '').split(',').map(h => h.trim()).filter(Boolean),
        _sortTime: d.createdAt?.seconds || Date.now() / 1000,
      }));
      const sorted = [...mapped].sort((a, b) => b._sortTime - a._sortTime);

      // ── Goa-first sort: Goa category always at the top ──
      const goaStatic = staticDestinations.filter(d => d.category === 'Goa');
      const otherStatic = staticDestinations.filter(d => d.category !== 'Goa');

      setAll([...sorted, ...goaStatic, ...otherStatic]);
      setLoading(false);
    };
    fetch();
  }, []);

  return { destinations: all, loading };
}

export function useAllPackages() {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const adminPkgs = await getAdminPackages();
      const mapped = adminPkgs.map(p => ({
        ...p,
        id: `admin_${p.id}`,
        isNew: true,
        destinations: Array.isArray(p.destinations) ? p.destinations : (p.destinations || '').split(',').map(d => d.trim()).filter(Boolean),
        includes: Array.isArray(p.includes) ? p.includes : (p.includes || '').split(',').map(i => i.trim()).filter(Boolean),
        _sortTime: p.createdAt?.seconds || Date.now() / 1000,
      }));
      const sorted = [...mapped].sort((a, b) => b._sortTime - a._sortTime);

      // ── Goa-first sort: Goa packages always at the top ──
      const goaStatic = staticPackages.filter(p => p.tag?.toLowerCase().includes('goa') || p.destinations?.some(d => d.toLowerCase().includes('goa')));
      const otherStatic = staticPackages.filter(p => !p.tag?.toLowerCase().includes('goa') && !p.destinations?.some(d => d.toLowerCase().includes('goa')));

      setAll([...sorted, ...goaStatic, ...otherStatic]);
      setLoading(false);
    };
    fetch();
  }, []);

  return { packages: all, loading };
}
