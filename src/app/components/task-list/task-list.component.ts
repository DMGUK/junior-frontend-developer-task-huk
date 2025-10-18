import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [NgClass, DatePipe],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  @Input() tasks: any[] = [];
  @Output() toggleCompleted = new EventEmitter<any>();
}
