import { Component, OnInit} from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { TasktypeService } from 'src/app/services/tasktype.service';
import { TaskassignmentService } from 'src/app/services/taskassignment.service';

@Component({
  selector: 'app-edit-new-tasks',
  templateUrl: './edit-new-tasks.component.html',
  styleUrls: ['./edit-new-tasks.component.css']
})
export class EditNewTasksComponent implements OnInit {
  task: Task = new Task(); 

  constructor(
    private taskService: TaskService, 
    private tasktypeService: TasktypeService,
    private taskassignementService: TaskassignmentService 
  ){}

    ngOnInit(): void {
      
    }
  onSubmit() {
    console.log("hello");
    // console.log(formEditTask.valid);
    
    
  }
}
