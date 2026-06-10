import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { HistoryFilters as Filters } from '../../types/prediction';
interface HistoryFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}
export function HistoryFilters({
  filters,
  onFiltersChange
}: HistoryFiltersProps) {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Search Customer ID
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
              onFiltersChange({
                ...filters,
                search: e.target.value
              })
              }
              placeholder="Search by customer ID..."
              className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-600/50 focus:border-cyan-600" />
            
          </div>
        </div>

        {/* Risk Level Filter */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Risk Level
          </label>
          <select
            value={filters.riskLevel}
            onChange={(e) =>
            onFiltersChange({
              ...filters,
              riskLevel: e.target.value as any
            })
            }
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-600/50 focus:border-cyan-600">
            
            <option value="all">All Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>

        {/* Decision Hint Filter */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Decision
          </label>
          <select
            value={filters.decisionHint}
            onChange={(e) =>
            onFiltersChange({
              ...filters,
              decisionHint: e.target.value as any
            })
            }
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-600/50 focus:border-cyan-600">
            
            <option value="all">All Decisions</option>
            <option value="Approve">Approve</option>
            <option value="Review">Review</option>
            <option value="Escalate">Escalate</option>
            <option value="Decline">Decline</option>
          </select>
        </div>

        {/* Date From */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
              onFiltersChange({
                ...filters,
                dateFrom: e.target.value
              })
              }
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-600/50 focus:border-cyan-600"
              placeholder="From" />
            
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
              onFiltersChange({
                ...filters,
                dateTo: e.target.value
              })
              }
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-600/50 focus:border-cyan-600"
              placeholder="To" />
            
          </div>
        </div>
      </div>
    </div>);

}