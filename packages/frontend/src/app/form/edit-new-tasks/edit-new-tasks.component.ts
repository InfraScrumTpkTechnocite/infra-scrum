import { Component} from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-edit-new-tasks',
  templateUrl: './edit-new-tasks.component.html',
  styleUrls: ['./edit-new-tasks.component.css']
})
export class EditNewTasksComponent {
  task: Task = new Task(); 

  onSubmit() {
    // console.log(formEditTask.value);
    // console.log(formEditTask.valid);
    
    
  }
}
