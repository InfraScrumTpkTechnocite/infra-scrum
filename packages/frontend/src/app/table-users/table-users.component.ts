import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { UserProject } from 'src/app/models/userproject.model';
import { UserprojectService } from '../services/userproject.service';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from '../services/project.service';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { TaskAssignment } from '../models/taskassignment.model';
import { TaskassignmentService } from '../services/taskassignment.service';


@Component({
  selector: 'app-table-users',
  templateUrl: './table-users.component.html',
  styleUrls: ['./table-users.component.css']
})
export class TableUsersComponent implements OnInit {
  @Input() task!: Task;
  @Input() taskTypeList!: TaskType[];
  @Input() userProjectList!: UserProject[];
  @Input() projectid!: string | undefined | null;
  @Input() project!: Project;
  
  taskassignmentList!: TaskAssignment[];
  userProjects!: UserProject[];
  userList!: User[];
  user!: User;

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private taskAssignmentService: TaskassignmentService,
    private userProjectService: UserprojectService,
    private userService: UserService,


    
  ) { }

  ngOnInit(): void {
    let use: any = localStorage.getItem('user');
        if (use) this.user = JSON.parse(use);
  }
  

}
