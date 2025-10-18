import { Component, LOCALE_ID } from '@angular/core';
import { NgClass, NgIf, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgClass, NgIf, DatePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    { provide: LOCALE_ID, useValue: 'pl' },
    DatePipe               // ✅ register DatePipe here
  ]
})

export class AppComponent {
  title = 'junior-frontend-developer-task';

  protected tasks = [
    { name: 'Zrobić zakupy spożywcze', status: 'Completed', date: '2025-05-01', description: 'Muszę kupić mleko, mąkę i jajka.' },
    { name: 'Opłacić rachunki', status: 'Pending', date: '2025-05-10', description: 'Tylko nie odkładaj tego na inny dzień!' },
    { name: 'Urodziny mamy', status: 'Planned', date: '2025-05-15', description: 'Kupić kwiaty i tort.' }
  ];

  filters = { name: '', date: '', status: '' };
  filteredTasks = this.tasks ?? [];

  showModal = false;
  newTaskForm: any;

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    this.newTaskForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', [Validators.required, this.futureDateValidator]],
      status: ['Pending'],
      description: ['']
    });

    this.applyFilters();
  }

  // --- Custom validator: date not in the past ---
  futureDateValidator(control: any) {
    const value = control.value;
    if (!value) return null;

    const parsedIso = typeof value === 'string' && value.includes('.')
      ? AppComponent.parseDisplayToIso(value)
      : value;

    const selectedDate = new Date(parsedIso);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate < today ? { pastDate: true } : null;
  }

  // --- Modal open/close ---
  openModal() {
    this.showModal = true;
    this.newTaskForm.reset({
      name: '',
      date: '',
      status: 'Pending',
      description: ''
    });
  }

  closeModal() {
    this.showModal = false;
  }

  // --- Save new task ---
  saveTask() {
    if (this.newTaskForm.invalid) {
      this.newTaskForm.markAllAsTouched();
      return;
    }

    const newTask = this.newTaskForm.value as any;

    // Convert to ISO if user typed dd.mm.yyyy
    const normalizedDate = newTask.date.includes('.')
      ? AppComponent.parseDisplayToIso(newTask.date)
      : newTask.date;

    this.tasks.push({
      name: newTask.name!,
      status: newTask.status!,
      date: normalizedDate!,
      description: newTask.description || ''
    });

    this.applyFilters();
    this.closeModal();
  }

  // --- Filters ---
  applyFilters() {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesName = this.filters.name
        ? task.name.toLowerCase().includes(this.filters.name.toLowerCase())
        : true;

      const matchesDate = this.filters.date
        ? this.isSameDate(task.date, this.filters.date)
        : true;

      const matchesStatus = this.filters.status
        ? task.status === this.filters.status
        : true;

      return matchesName && matchesDate && matchesStatus;
    });
  }

  // --- Compare two dates ignoring time ---
  isSameDate(taskDate: string, filterDate: string): boolean {
    const d1 = new Date(taskDate);
    const d2 = new Date(filterDate);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  // --- Checkbox toggle ---
  toggleCompleted(task: any) {
    task.status = task.status === 'Completed' ? 'Planned' : 'Completed';
  }

  // --- Display date for text filter ---
  getFilterDateDisplay(): string {
    return this.filters.date
      ? this.datePipe.transform(this.filters.date, 'dd.MM.yyyy') ?? ''
      : '';
  }

  // --- When user types date (dd.mm.yyyy) ---
  onFilterDateInput(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();
    this.filters.date = AppComponent.parseDisplayToIso(value);
    this.applyFilters();
  }

  // --- Static helper: convert dd.mm.yyyy -> yyyy-MM-dd ---
  private static parseDisplayToIso(display: string): string {
    const m = display.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (!m) return '';
    const d = +m[1], mo = +m[2], y = +m[3];
    const dt = new Date(y, mo - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return '';
    return dt.toISOString().slice(0, 10);
  }
}
