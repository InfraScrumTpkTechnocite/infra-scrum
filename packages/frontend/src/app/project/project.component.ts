import {
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {
    CdkDragDrop,
    CdkDragEnter,
    CdkDragMove,
    moveItemInArray,
    transferArrayItem
} from '@angular/cdk/drag-drop';
import { Kanbanstatus } from '../models/kanbanstatus.model';
import { KanbanstatusService } from '../services/kanbanstatus.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { HotToastService } from '@ngneat/hot-toast';
import { UserprojectService } from '../services/userproject.service';
import { UserProject } from '../models/userproject.model';
import { HeaderTitleService } from '../services/header-title.service';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { webSocket } from 'rxjs/webSocket';
import { User } from '../models/user.model';
import { TasktypeService } from '../services/tasktype.service';
import { TaskType } from '../models/tasktype.model';
import { MatDialog } from '@angular/material/dialog';
import { EditNewTasksComponent } from '../form/edit-new-tasks/edit-new-tasks.component';
import { EditProjectComponent } from '../form/edit-project/edit-project.component';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

interface KanbanList {
    kanban: Kanbanstatus;
    tasks: Task[];
}
@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, OnDestroy {
    isSprintsOpen: boolean = false;
    isEditColumn: boolean = false;
    isBottom: boolean = false;

    projectid: string = '';
    parentProject: any;

    project!: Project;
    sprintList!: Project[];

    kanbanStatus!: Kanbanstatus;
    kanbanList: KanbanList[] = [];

    userProjects!: UserProject[];
    user!: User;
    isUserProjectadmin: boolean = false;
    userList!: User[];

    dateToday: string = '';

    taskTypeList: TaskType[] = [];

    hideChart: boolean = true;

    //https://rxjs.dev/api/webSocket/webSocket
    subject = webSocket('');

    subscription!: Subscription;

    constructor(
        private route: ActivatedRoute,
        private projectService: ProjectService,
        private kanbanstatusService: KanbanstatusService,
        private toastService: HotToastService,
        private userProjectService: UserprojectService,
        private headerTitleService: HeaderTitleService,
        private taskService: TaskService,
        private taskTypeService: TasktypeService,
        private userService: UserService,
        private router: Router,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        let use: any = localStorage.getItem('user');
        if (use) this.user = JSON.parse(use);
        // console.log(
        //     'project.component - ngOnInit - localstorage user = ' +
        //         this.user.role.id
        // );

        //messages received from webSocket server are processed here
        const subjectObserver = {
            next: (message: any) => {
                const method = message.method;
                console.log(message);
                switch (method) {
                    case 'edit':
                        //console.log('edit', message.task);
                        //console.log(message.projectid);
                        if (message.projectid == this.project.id) {
                            if (message.kanban) {
                                //console.log(message.kanban.id);
                                let kanban = this.kanbanList.find(
                                    (kanbans) =>
                                        kanbans.kanban.order ==
                                        message.kanban.order
                                );

                                kanban!.kanban = message.kanban;
                                kanban!.tasks = message.tasks;
                            }
                            if (message.task) {
                                console.log('in if');
                                let sourceIndex: number = this.kanbanList[
                                    message.sourceKanbanOrder
                                ].tasks.findIndex(
                                    (task) => task.id == message.task.id
                                );
                                this.kanbanList[
                                    message.sourceKanbanOrder
                                ].tasks.splice(sourceIndex, 1);
                                this.kanbanList[
                                    message.targetKanbanOrder
                                ].tasks.push(message.task);
                            }
                        }
                        break;
                    case 'delete':
                        if (message.kanban)
                            this.kanbanList.splice(message.kanban.order, 1);
                        if (message.task)
                            this.kanbanList.find((kanbans) => {
                                kanbans.tasks?.splice(
                                    kanbans.tasks?.findIndex(
                                        (tasks) => tasks.id == message.task.id
                                    ),
                                    1
                                );
                            });
                        break;
                    case 'add':
                        if (message.kanban) {
                            const kanbanList: KanbanList = {
                                kanban: message.kanban,
                                tasks: []
                            };
                            this.kanbanList.push(kanbanList);
                        }
                        if (message.task) {
                            this.kanbanList.find((kanbans) => {
                                kanbans.tasks?.push(message.task);
                            });
                        }
                }
            }
        };

        this.dateToday = new Date(
            new Date().setUTCHours(0, 0, 0, 0)
        ).toISOString();

        this.route.queryParamMap.subscribe((params) => {
            let paramsObject: any = { ...params.keys, ...params };
            this.projectid = paramsObject.params.projectid;

            // console.log(
            //     `project.component - ngOnInit - projectid = ${this.projectid}`
            // );

            if (this.projectid) {
                //message 'connection' to backend (main.ts)...
                this.subject = webSocket(
                    `ws://localhost:8080?projectid=${this.projectid}`
                );
                //...and subscription (if user is on project page)
                this.subscription = this.subject.subscribe(subjectObserver);

                const userProjectsObserver = {
                    next: (userProjects: UserProject[]) => {
                        this.userProjects = userProjects;
                        // console.log(this.userProjects);
                        // console.log(this.user.id);
                        // this.userProjects.forEach((up) => {
                        //     console.log(up.user.id);
                        //     if (up.user.id == this.user.id)
                        //         this.isUserProjectadmin = true;
                        // });
                        const userproject: any = this.userProjects.find(
                            (userproject) => {
                                return userproject.user.id == this.user.id;
                            }
                        );
                        // console.log('userproject = ' + userproject);
                        if (userproject)
                            this.isUserProjectadmin =
                                userproject.isprojectadmin;
                        // console.log(
                        //     `project.component - ngOnInit - logged in user project admin ? ${this.isUserProjectadmin} `
                        // );
                    },
                    error: () => {},
                    complete: () => {}
                };

                const kanbanstatusObserver = {
                    next: (kanban: Kanbanstatus[]) => {
                        let projectid: string = <string>(
                            localStorage.getItem('projectid')
                        );
                        kanban.map((kanbanstatus) => {
                            this.kanbanList.push({
                                kanban: kanbanstatus,
                                tasks: []
                            } as KanbanList);
                            this.taskService
                                .findAllOfKanbanstatus(kanbanstatus.id!)
                                .subscribe((taskList: Task[]) => {
                                    this.kanbanList.find(
                                        (kanbanlist) =>
                                            kanbanlist.kanban.id ==
                                            kanbanstatus.id
                                    )!.tasks = taskList;
                                });
                        });
                        this.userProjectService
                            .findCurrentProjectUsers(projectid)
                            .subscribe(userProjectsObserver);
                    },
                    error: () => {},
                    complete: () => {}
                };

                const sprintObserver = {
                    next: (sprintList: Project[]) => {
                        this.sprintList = sprintList.map((sprint) => {
                            //sprint.enddate = new Date(new Date(sprint.enddate!).setUTCHours(0,0,0,0)).toISOString();
                            return sprint;
                        });
                        this.kanbanstatusService
                            .findAllOfProject(
                                <string>localStorage.getItem('projectid')
                            )
                            .subscribe(kanbanstatusObserver);
                    },
                    error: () => {},
                    complete: () => {}
                };

                const projectObserver = {
                    next: (project: Project) => {
                        if (!project.project) {
                            //on est dans le projet global
                            localStorage.setItem(
                                'projectid',
                                <string>project.id
                            );
                            this.project = project;
                            this.parentProject = project.project;
                        } else {
                            //on est dans un sprint
                            this.parentProject = project.project;
                            this.project = this.parentProject;
                        }
                        this.headerTitleService.setTitle(this.project.name);
                        // console.log(
                        //     `project.component - ngOnInit - parentProject = ${this.parentProject}`
                        // );
                        this.projectService
                            .findSprintsOnly(
                                <string>localStorage.getItem('projectid')
                            )
                            .subscribe(sprintObserver);
                    },
                    error: () => {},
                    complete: () => {
                        delete this.project.picture;
                        // console.log(
                        //     `projectObserver : ${JSON.stringify(this.project)}`
                        // );
                    }
                };

                this.projectService
                    .findOne(this.projectid)
                    .subscribe(projectObserver);
            }
        });

        this.taskTypeService
            .getAll()
            .subscribe(
                (taskTypeList: TaskType[]) => (this.taskTypeList = taskTypeList)
            );

        this.userService
            .getAllUsers()
            .subscribe((userList: User[]) => (this.userList = userList));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    //Boutons modales
    editProject() {
        this.dialog.open(EditProjectComponent, {
            data: {
                project: this.project,
                userProjectList: this.userProjects,
                userList: this.userList
            }
        });
    }

    addTask() {
        this.dialog.open(EditNewTasksComponent, {
            data: {
                task: new Task(),
                taskTypeList: this.taskTypeList,
                sprintList: this.sprintList,
                edition: false
            }
        });
    }

    // SPRINTS //

    openSprintBar() {
        this.isSprintsOpen = true;
        if (this.sprintList) this.project = this.sprintList[0]; //--> afficher premier sprint au lieu de global
    }

    closeSprintBar() {
        this.isSprintsOpen = false;
        this.router.navigate([], {
            skipLocationChange: true,
            queryParamsHandling: 'merge', //== if you need to keep queryParams
            queryParams: { projectid: this.parentProject.id }
        });
    }

    //Afficher Sprint en fonction de celui sélectionné
    changeSprintDisplay(id?: string) {
        //console.log(`project.component - changeSprintDisplay - id = ${id}`);
        const sprint: Project =
            this.sprintList.find((sprint) => sprint.id == id) || new Project();
        // console.log(
        //     `project.component - changeSprintDisplay - ${JSON.stringify(
        //         sprint
        //     )}`
        // );
        this.router.navigate([], {
            skipLocationChange: true,
            queryParamsHandling: 'merge', //== if you need to keep queryParams
            queryParams: { projectid: sprint.id }
        });
    }

    addSprint() {
        var newSprint = new Project();
        newSprint.name = 'Sprint ' + (this.sprintList.length + 1);
        newSprint.project = this.project;

        const sprintObserver = {
            next: (sprint: Project) => {
                // console.log(
                //     `project.component - addSprint - new sprint = ${JSON.stringify(
                //         sprint
                //     )}`
                // );
                this.sprintList.push(sprint);
            },
            error: (err: any) => {
                console.log(
                    `Erreur création sprint : ${err.error['driverError'].detail}`
                );
                this.toastService.error(
                    `Error during sprint creation<br><br>${err.error.driverError.detail}`
                );
            },
            complete: () => {
                this.toastService.success('New Sprint Added !');
            }
        };

        this.projectService.create(newSprint).subscribe(sprintObserver);
    }

    // KANBANS //

    addnewKanbanStatus() {
        var newKanbanStatus = new Kanbanstatus();
        newKanbanStatus.project.id = this.project.id;
        newKanbanStatus.order = this.kanbanList.length + 1;

        const kanbanObserver = {
            next: (kanban: Kanbanstatus) => {
                this.kanbanList.push({ kanban: kanban } as KanbanList);

                // 'next' will send a message to the server once a connection is made
                // and all subscribed client will receive message right away
                //Remember value is serialized with JSON.stringify by default!
                this.subject.next({ method: 'add', kanban: kanban });
            },
            error: (err: any) => {
                console.log(
                    `Erreur création kanbanstatus : ${err.error['driverError'].detail}`
                );
                this.toastService.error(
                    `Error during kanban creation<br><br>${err.error.driverError.detail}`
                );
            },
            complete: () => {
                this.toastService.success('New Column Added !');
            }
        };
        this.kanbanstatusService
            .create(newKanbanStatus)
            .subscribe(kanbanObserver);
    }

    onKanbanDeleted(kanban: Kanbanstatus) {
        var index = this.kanbanList.findIndex((knb) => knb.kanban === kanban);
        if (index != -1) {
            this.kanbanList.splice(index, 1);
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                                DRAG AND DROP                               */
    /* -------------------------------------------------------------------------- */

    @ViewChild('dropListContainer') dropListContainer?: ElementRef;

    dropListReceiverElement?: HTMLElement;
    dragDropInfo?: {
        dragIndex: number;
        dropIndex: number;
    };

    // Méthode invoquée à chaque mouvement d'un item
    dragEntered(event: CdkDragEnter<number>) {
        const drag = event.item;
        const dropList = event.container;
        const dragIndex = drag.data;
        const dropIndex = dropList.data;

        this.dragDropInfo = { dragIndex, dropIndex };

        const phContainer = dropList.element.nativeElement;
        const phElement = phContainer.querySelector('.cdk-drag-placeholder');
        if (phElement) {
            phContainer.removeChild(phElement);
            phContainer.parentElement?.insertBefore(phElement, phContainer);

            moveItemInArray(this.kanbanList, dragIndex, dropIndex);
        }
    }

    // Méthode invoquée à chaque item bougé dans un container différent, qui est un autre element 'cdkDropList'
    dragMoved(event: CdkDragMove<number>) {
        if (!this.dropListContainer || !this.dragDropInfo) return;

        const placeholderElement =
            this.dropListContainer.nativeElement.querySelector(
                '.cdk-drag-placeholder'
            );

        const receiverElement =
            this.dragDropInfo.dragIndex > this.dragDropInfo.dropIndex
                ? placeholderElement?.nextElementSibling
                : placeholderElement?.previousElementSibling;

        if (!receiverElement) {
            return;
        }

        receiverElement.style.display = 'none';
        this.dropListReceiverElement = receiverElement;
    }

    // Méthode invoquée quand l'utilisateur lache l'item dans un element cdkDropList
    dragDropped(event: CdkDragDrop<number>) {
        this.kanbanList.forEach((kanban, index) => {
            kanban.kanban.order = index;
            this.kanbanstatusService.edit(kanban.kanban).subscribe({
                next: (kanban) => {
                    //console.log(kanban);
                },
                error: (err) => {
                    console.log(err);
                },
                complete: () => {
                    this.subject.next({ method: 'edit', kanban: kanban });
                }
            });
        });

        if (!this.dropListReceiverElement) {
            return;
        }

        this.dropListReceiverElement.style.removeProperty('display');
        this.dropListReceiverElement = undefined;
        this.dragDropInfo = undefined;
    }

    dropColumns(event: CdkDragDrop<Kanbanstatus>) {
        console.log(event.previousIndex, event.currentIndex);
        moveItemInArray(
            this.kanbanList,
            event.previousIndex,
            event.currentIndex
        );

        this.kanbanList.forEach((kanban, index) => {
            kanban.kanban.order = index;
            this.kanbanstatusService.edit(kanban.kanban).subscribe({
                next: (kanban) => {
                    //console.log(kanban);
                },
                error: (err) => {
                    console.log(err);
                },
                complete: () => {
                    this.subject.next({
                        method: 'edit',
                        kanban: kanban.kanban,
                        projectid: this.project.id,
                        tasks: kanban.tasks
                    });
                }
            });
        });
    }

    drop(event: CdkDragDrop<Task[]>) {
        if (event.previousContainer === event.container) {
            console.log(`Même colonne`);
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            console.log(`Changement colonne`);
            console.log(
                `previous kanban: ${event.previousContainer.id}, current kanban: ${event.container.id}`
            );
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );

            let kanbanIndex: number = parseInt(event.container.id); //kanban = event.container = div contenant la liste des tâches
            //console.log(this.kanbanList[kanbanIndex]);
            let kanbanTarget: Kanbanstatus =
                this.kanbanList[kanbanIndex].kanban;
            let task: Task = event.container.data[event.currentIndex];
            if (task.id) {
                task.kanbanstatus = kanbanTarget;
                this.taskService.edit(task.id, task).subscribe({
                    next: () => {},
                    error: () => {},
                    complete: () => {
                        this.subject.next({
                            method: 'edit',
                            task: task,
                            projectid: this.project.id,
                            sourceKanbanOrder: event.previousContainer.id,
                            targetKanbanOrder: event.container.id
                        });
                    }
                });
            }
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                              Scroll top button                             */
    /* -------------------------------------------------------------------------- */

    onScroll(event: any) {
        event.target.offsetHeight + event.target.scrollTop >=
        event.target.scrollHeight - 1
            ? (this.isBottom = true)
            : (this.isBottom = false);
    }

    scrollTop() {
        document.getElementById('kanbanDashboard')!.scrollTop = 0;
    }
}
