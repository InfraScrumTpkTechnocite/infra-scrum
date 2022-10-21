import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Kanbanstatus } from '../models/kanbanstatus.model';
import { KanbanstatusService } from '../services/kanbanstatus.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
    isSprintsOpen: boolean = false;
    isEditColumn: boolean = false;

    project!: Project;
    sprintList!: Project[];

    display! : Project;

    kanbanStatus!: Kanbanstatus;
    kanbanList!: Kanbanstatus[];

    dateToday: string = "";
    constructor(
        private route : ActivatedRoute,
        private projectService : ProjectService,
        private kanbanstatusService : KanbanstatusService,
        private toastService: HotToastService
    ) {}

    ngOnInit(): void {
        this.dateToday = new Date(new Date().setUTCHours(0,0,0,0)).toISOString();

        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if(id){
                this.projectService.findOne(id).subscribe(
                    (project : Project) => {
                        this.project = project;
                        this.display = project;
                    }
                )
                this.projectService.findSprints(id).subscribe(
                    (sprintList : Project[]) => {
                        this.sprintList =  sprintList.map( sprint => {
                            sprint.enddate = new Date(new Date(sprint.enddate!).setUTCHours(0,0,0,0)).toISOString();
                            return sprint;
                        })
                    }
                )
                this.kanbanstatusService.getKanbansfromProjectId(id).subscribe(
                    ( kanbanList : Kanbanstatus[] ) => this.kanbanList = kanbanList
            );}
        });
    }

    // SPRINTS //

    openSprintBar() {
        this.isSprintsOpen = true;
        if(this.sprintList) this.display = this.sprintList[0]; //--> afficher premier sprint au lieu de global
    }

    closeSprintBar() {
        this.isSprintsOpen = false;
        this.display = this.project; //--> afficher global
    }

    //Afficher Sprint en fonction de celui sélectionner 
    changeSprintDisplay(id? : string){
        this.display = this.sprintList.find(sprint => sprint.id == id) || new Project();  
    }

    addSprint(){
        var newSprint = new Project();
        newSprint.name = "Sprint " + (this.sprintList.length + 1);
        newSprint.project = this.project;
        newSprint.enddate = new Date().toISOString();

        const observer = {
            next : (project: Project) => {
                this.sprintList.push(project);
            },
            error : (err: any) => {
                console.log(`Erreur création sprint : ${err.error['driverError'].detail}`);
                this.toastService.error(`Error during sprint creation<br><br>${err.error.driverError.detail}`);
            },
            complete : () => {
                this.toastService.success("New Sprint Added !");
            }
        }

        this.projectService.create(newSprint).subscribe(observer);
    }

    // KANBANS //

    addnewKanbanStatus(){
        var newKanbanStatus = new Kanbanstatus();
        newKanbanStatus.project.id = this.project.id;

        const kanbanObserver = {
            next : (kanban : Kanbanstatus) => {
                this.kanbanList.push(kanban);
            },
            error : (err: any) => {
                console.log(`Erreur création kanbanstatus : ${err.error['driverError'].detail}`);
                this.toastService.error(`Error during kanban creation<br><br>${err.error.driverError.detail}`);
            },
            complete : () => {
                this.toastService.success("New Column Added !");
            }
        }
        this.kanbanstatusService.create(newKanbanStatus).subscribe(kanbanObserver);
    }

    onKanbanDeleted(kanban: Kanbanstatus) {
        var index = this.kanbanList.findIndex((knb) => (knb === kanban));
        if (index != -1) {
          this.kanbanList.splice(index, 1);
        }
    }
}