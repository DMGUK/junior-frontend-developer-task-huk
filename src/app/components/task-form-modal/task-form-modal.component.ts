import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './task-form-modal.component.html',
  styleUrls: ['./task-form-modal.component.scss']
})
export class TaskFormModalComponent {
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  newTaskForm: any;

  constructor(private fb: FormBuilder) {
    this.newTaskForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', [Validators.required, this.futureDateValidator]],
      status: ['Pending'],
      description: ['']
    });
  }

  futureDateValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today ? { pastDate: true } : null;
  }

  saveTask() {
    if (this.newTaskForm.invalid) {
      this.newTaskForm.markAllAsTouched();
      return;
    }
    this.save.emit(this.newTaskForm.value);
  }
}
