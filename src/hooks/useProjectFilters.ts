import { useMemo, useState } from 'react';
import { matchesKeyword } from '@/db/projectRepository';
import type { Project, DeveloperCode, DistrictCode } from '@/types/project';

export function useProjectFilters(projects: Project[]) {
  const [keyword, setKeyword] = useState('');
  const [developer, setDeveloper] = useState<DeveloperCode | 'all'>('all');
  const [district, setDistrict] = useState<DistrictCode | 'all'>('all');
  const [districtDetail, setDistrictDetail] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (!matchesKeyword(p, keyword)) return false;
      if (developer !== 'all' && p.developer !== developer) return false;
      if (district !== 'all' && p.district !== district) return false;
      if (districtDetail.trim()) {
        if (!(p.districtDetail || '').toLowerCase().includes(districtDetail.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [projects, keyword, developer, district, districtDetail]);

  return {
    keyword,
    setKeyword,
    developer,
    setDeveloper,
    district,
    setDistrict,
    districtDetail,
    setDistrictDetail,
    filteredProjects,
  };
}
