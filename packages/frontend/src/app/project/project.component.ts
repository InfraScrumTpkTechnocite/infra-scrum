import {
    Component,
    ElementRef,
    Input,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {
    CdkDragDrop,
    CdkDragEnter,
    CdkDragMove,
    moveItemInArray
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

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
    isSprintsOpen: boolean = false;
    isEditColumn: boolean = false;

    projectid: string = '';
    parentProject: any;

    project!: Project;
    sprintList!: Project[];

    kanbanStatus!: Kanbanstatus;
    kanbanList!: Kanbanstatus[];

    userProjects!: UserProject[];

    dateToday: string = '';

    taskList: Task[] = [];

    constructor(
        private route: ActivatedRoute,
        private projectService: ProjectService,
        private kanbanstatusService: KanbanstatusService,
        private toastService: HotToastService,
        private userProjectService: UserprojectService,
        private headerTitleService: HeaderTitleService,
        private taskService: TaskService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.dateToday = new Date(
            new Date().setUTCHours(0, 0, 0, 0)
        ).toISOString();

        this.route.queryParamMap.subscribe((params) => {
            let paramsObject: any = { ...params.keys, ...params };
            this.projectid = paramsObject.params.projectid;

            console.log(
                `project.component - ngOnInit - projectid = ${this.projectid}`
            );

            if (this.projectid) {
                const tasksObserver = {
                    next: (taskList: Task[]) => {
                        taskList.map((task) => this.taskList.push(task));
                    },
                    error: () => {},
                    complete: () => {}
                };

                const userProjectsObserver = {
                    next: (userProjects: UserProject[]) =>
                        (this.userProjects = userProjects),
                    error: () => {},
                    complete: () => {}
                };

                const kanbanstatusObserver = {
                    next: (kanbanList: Kanbanstatus[]) => {
                        this.kanbanList = kanbanList;
                        let projectid: string = <string>(
                            localStorage.getItem('projectid')
                        );

                        this.userProjectService
                            .findCurrentProjectUsers(projectid)
                            .subscribe(userProjectsObserver);
                        kanbanList.map((kanbanstatus) => {
                            this.taskService
                                .findAllOfKanbanstatus(kanbanstatus.id!)
                                .subscribe(tasksObserver);
                        });
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
                        console.log(
                            `project.component - ngOnInit - parentProject = ${this.parentProject}`
                        );
                        this.projectService
                            .findSprints(
                                <string>localStorage.getItem('projectid')
                            )
                            .subscribe(sprintObserver);
                    },
                    error: () => {},
                    complete: () => {}
                };

                this.projectService
                    .findOne(this.projectid)
                    .subscribe(projectObserver);
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

    //Afficher Sprint en fonction de celui sélectionner
    changeSprintDisplay(id?: string) {
        console.log(`project.component - changeSprintDisplay - id = ${id}`);
        const sprint: Project =
            this.sprintList.find((sprint) => sprint.id == id) || new Project();
        console.log(
            `project.component - changeSprintDisplay - ${JSON.stringify(
                sprint
            )}`
        );
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
                console.log(
                    `project.component - addSprint - new sprint = ${JSON.stringify(
                        sprint
                    )}`
                );
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
                this.kanbanList.push(kanban);
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
        var index = this.kanbanList.findIndex((knb) => knb === kanban);
        if (index != -1) {
            this.kanbanList.splice(index, 1);
        }
    }

    /* -------------------------------------------------------------------------- */
    /*    DRAG AND DROP KANBANSTATUS   */
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
            kanban.order = index + 1;
            this.kanbanstatusService.edit(kanban).subscribe({
                next: (kanban) => {
                    console.log(kanban);
                },
                error: (err) => {
                    console.log(err);
                },
                complete: () => {}
            });
        });

        if (!this.dropListReceiverElement) {
            return;
        }

        this.dropListReceiverElement.style.removeProperty('display');
        this.dropListReceiverElement = undefined;
        this.dragDropInfo = undefined;
    }
}
