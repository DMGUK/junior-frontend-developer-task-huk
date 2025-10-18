import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './task-filters.component.html',
  styleUrls: ['./task-filters.component.scss']
})
export class TaskFiltersComponent {
  filters = { name: '', date: '', status: '' };
  @Output() filtersChanged = new EventEmitter<typeof this.filters>();

  updateFilters() {
    this.filtersChanged.emit(this.filters);
  }
}
