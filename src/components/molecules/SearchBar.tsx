import React from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import { SearchFilters } from '@/types/property';

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  dict: any;
}

const SearchBar: React.FC<SearchBarProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  dict
}) => {
  const handleInputChange = (field: keyof SearchFilters, value: string | number) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="bg-white rounded-full shadow-lg p-2 flex items-center space-x-2 max-w-4xl mx-auto">
      <Input
        placeholder={dict.home.hero.search_placeholder.location}
        value={filters.location}
        onChange={(e) => handleInputChange('location', e.target.value)}
        className="flex-1 border-0 focus:ring-0"
      />
      <Input
        placeholder={dict.home.hero.search_placeholder.check_in}
        value={filters.checkIn}
        onChange={(e) => handleInputChange('checkIn', e.target.value)}
        className="flex-1 border-0 focus:ring-0"
      />
      <Input
        placeholder={dict.home.hero.search_placeholder.check_out}
        value={filters.checkOut}
        onChange={(e) => handleInputChange('checkOut', e.target.value)}
        className="flex-1 border-0 focus:ring-0"
      />
      <Input
        placeholder={dict.home.hero.search_placeholder.guests}
        value={filters.guests}
        onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 0)}
        className="flex-1 border-0 focus:ring-0"
      />
      <Button
        onClick={onSearch}
        className="rounded-full p-3 bg-gray-900 hover:bg-gray-800"
      >
        <Icon name="search" className="text-white" size="sm" />
      </Button>
    </div>
  );
};

export default SearchBar; 