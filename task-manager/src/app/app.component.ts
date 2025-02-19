import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'Task Manager';
  tasks: Task[] = [];
  showTasks = true;
  newTask: Task = this.getEmptyTask();

  ngOnInit() {
    this.loadTasks();
  }

  private getEmptyTask(): Task {
    return {
      id: 0,
      title: '',
      description: '',
      completed: false,
      priority: 'medium',
      createdAt: new Date()
    };
  }

  private loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks).map((task: Task) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
    }
  }

  addTask() {
    if (this.newTask.title.trim()) {
      const task = {
        ...this.newTask,
        id: Date.now(),
        createdAt: new Date()
      };
      this.tasks = [...this.tasks, task];
      this.saveTasks();
      this.newTask = this.getEmptyTask();
    }
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
  }
    toggleComplete(task: Task) {
      const taskIndex = this.tasks.findIndex(t => t.id === task.id);
      if (taskIndex !== -1) {
        this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
      
        // Add visual feedback
        const taskElement = document.getElementById(`task-${task.id}`);
        if (taskElement) {
          if (this.tasks[taskIndex].completed) {
            taskElement.classList.add('task-completed-animation');
          } else {
            taskElement.classList.remove('task-completed-animation');
          }
        }
      
        this.saveTasks();
      }
    }
  toggleTaskList() {
    this.showTasks = !this.showTasks;
  }

  private saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}