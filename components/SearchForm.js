'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function SearchForm({ 
  initialFilters, 
  authors, 
  categories, 
  sectors, 
  characters, 
  topics, 
  activeFiltersCount 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build query string
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    // Navigate without scrolling to top
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      q: '',
      title: '',
      author: '',
      category: '',
      sector: '',
      character: '',
      topic: '',
      publishedFrom: '',
      publishedTo: ''
    });
    router.push('/search', { scroll: false });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Search Bar */}
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          name="q"
          placeholder="Search posts, authors, or categories..."
          value={filters.q}
          onChange={(e) => handleFilterChange('q', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search posts, authors, or categories"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center gap-4 mb-4">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <FunnelIcon className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
              {activeFiltersCount}
            </span>
          )}
        </button>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <select
                name="author"
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Authors</option>
                {authors?.map(author => (
                  <option key={author._id} value={author.slug?.current}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories?.map(category => (
                  <option key={category._id} value={category.slug?.current}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Sector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
              <select
                name="sector"
                value={filters.sector}
                onChange={(e) => handleFilterChange('sector', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Sectors</option>
                {sectors?.map(sector => (
                  <option key={sector._id} value={sector.slug?.current}>
                    {sector.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Character */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Character</label>
              <select
                name="character"
                value={filters.character}
                onChange={(e) => handleFilterChange('character', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Characters</option>
                {characters?.map(character => (
                  <option key={character._id} value={character.slug?.current}>
                    {character.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <select
                name="topic"
                value={filters.topic}
                onChange={(e) => handleFilterChange('topic', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Topics</option>
                {topics?.map(topic => (
                  <option key={topic._id} value={topic.slug?.current}>
                    {topic.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Published From</label>
              <input
                type="date"
                name="publishedFrom"
                value={filters.publishedFrom}
                onChange={(e) => handleFilterChange('publishedFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Published To</label>
              <input
                type="date"
                name="publishedTo"
                value={filters.publishedTo}
                onChange={(e) => handleFilterChange('publishedTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
} 