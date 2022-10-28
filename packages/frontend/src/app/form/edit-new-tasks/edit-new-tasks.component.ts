import { Component, Input, OnInit} from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { TasktypeService } from 'src/app/services/tasktype.service';
import { TaskassignmentService } from 'src/app/services/taskassignment.service';
import { TaskAssignment } from 'src/app/models/taskassignment.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { TaskType } from 'src/app/models/tasktype.model';

@Component({
  selector: 'app-edit-new-tasks',
  templateUrl: './edit-new-tasks.component.html',
  styleUrls: ['./edit-new-tasks.component.css']
})
export class EditNewTasksComponent implements OnInit {
  @Input() taskAssignment!: TaskAssignment


  task: Task = new Task(); 
  user: User = new User();
  dateToday: number = Date.now();

  selectedType = '';
  selectedSprint= '';
  

  constructor(
    private taskService: TaskService, 
    private tasktypeService: TasktypeService,
    private taskassignementService: TaskassignmentService,
    private userService: UserService
  ){}

    ngOnInit(): void {
      let user: any = localStorage.getItem('user');
        this.user = JSON.parse(user);
    }
  
  onSubmit() {
    if (this.isValid()) {
      this.task.tasktype = {
        label: this.selectedType
      } as TaskType;
    console.log(this.task);
    // console.log(formEditTask.valid);
    
    }
  }

  isValid(): boolean {
    return true;
  }
}
