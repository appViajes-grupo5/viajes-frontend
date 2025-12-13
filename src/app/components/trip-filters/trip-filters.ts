import { Component, EventEmitter, Output, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TripFilters {
  destination?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  minCost?: number;
  maxCost?: number;
  sortBy?: string;
  sortOrder?: string;
}

@Component({
  selector: 'app-trip-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-filters.html',
  styleUrls: ['./trip-filters.css']
})
export class TripFiltersComponent {
  showFilters = signal<boolean>(false);
  @Output() filtersChange = new EventEmitter<TripFilters>();
  @Output() clearFilters = new EventEmitter<void>();

  filters: TripFilters = {
    destination: '',
    startDateFrom: '',
    startDateTo: '',
    endDateFrom: '',
    endDateTo: '',
    minCost: undefined,
    maxCost: undefined,
    sortBy: 'created',
    sortOrder: 'desc'
  };

  toggleFilters() {
    this.showFilters.update(val => !val);
  }

  applyFilters() {
    const activeFilters: TripFilters = {};
    
    if (this.filters.destination?.trim()) {
      activeFilters.destination = this.filters.destination.trim();
    }
    if (this.filters.startDateFrom) {
      activeFilters.startDateFrom = this.filters.startDateFrom;
    }
    if (this.filters.startDateTo) {
      activeFilters.startDateTo = this.filters.startDateTo;
    }
    if (this.filters.endDateFrom) {
      activeFilters.endDateFrom = this.filters.endDateFrom;
    }
    if (this.filters.endDateTo) {
      activeFilters.endDateTo = this.filters.endDateTo;
    }
    if (this.filters.minCost) {
      activeFilters.minCost = this.filters.minCost;
    }
    if (this.filters.maxCost) {
      activeFilters.maxCost = this.filters.maxCost;
    }
    if (this.filters.sortBy) {
      activeFilters.sortBy = this.filters.sortBy;
      activeFilters.sortOrder = this.filters.sortOrder || 'desc';
    }

    this.filtersChange.emit(activeFilters);
  }

  clear() {
    this.filters = {
      destination: '',
      startDateFrom: '',
      startDateTo: '',
      endDateFrom: '',
      endDateTo: '',
      minCost: undefined,
      maxCost: undefined,
      sortBy: 'created',
      sortOrder: 'desc'
    };
    this.clearFilters.emit();
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filters.destination?.trim() ||
      this.filters.startDateFrom ||
      this.filters.startDateTo ||
      this.filters.endDateFrom ||
      this.filters.endDateTo ||
      this.filters.minCost ||
      this.filters.maxCost
    );
  }
}

