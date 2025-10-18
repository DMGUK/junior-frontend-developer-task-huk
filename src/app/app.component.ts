import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFiltersComponent } from './components/task-filters/task-filters.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormModalComponent } from './components/task-form-modal/task-form-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskFiltersComponent, TaskListComponent, TaskFormModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  tasks = [
    { name: 'Zrobić zakupy spożywcze', status: 'Completed', date: '2025-05-01', description: 'Muszę kupić mleko, mąkę i jajka.' },
    { name: 'Opłacić rachunki', status: 'Pending', date: '2025-05-10', description: 'Tylko nie odkładaj tego na inny dzień!' },
    { name: 'Urodziny mamy', status: 'Planned', date: '2025-05-15', description: 'Kupić kwiaty i tort.' }
  ];

  filteredTasks = this.tasks;
  showModal = false;

  applyFilters(filters: any) {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesName = filters.name ? task.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
      const matchesDate = filters.date ? task.date === filters.date : true;
      const matchesStatus = filters.status ? task.status === filters.status : true;
      return matchesName && matchesDate && matchesStatus;
    });
  }

  toggleCompleted(task: any) {
    task.status = task.status === 'Completed' ? 'Planned' : 'Completed';
  }

  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }

  addTask(task: any) {
    this.tasks.push(task);
    this.applyFilters({});
    this.closeModal();
  }
}
