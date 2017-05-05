import { Component, AfterViewInit, OnInit, Inject } from '@angular/core';
import { Routes, Router, RouterModule } from '@angular/router';
import { NotificationService } from './app.notifications.service';
import { Http, Headers } from '@angular/http';
import { Notification } from './notification';
import { NgUploaderOptions } from 'ngx-uploader';
declare var jQuery: any;
export class Choice {
  id: string;
  name: string;
}
@Component({
    selector: 'notification-poll',
    templateUrl: './app.poll.html'
})

export class PollComponent {
    result: any;
    tresult: any
    error: any;
    userData: any;
    isLoading = false;
    model = new Notification();

    years:any;
    sections:any;
    choices: Choice[];
    choiceNum : number;
    filteredSections:any = [];

    apiurl = '';
    apiurl1:any;
    hasBaseDropZoneOver: boolean;
    private response: any = {};



    constructor(private notificationService: NotificationService, public http: Http) { }
    ngAfterViewInit() {

    }

    ngOnInit() {
        this.choiceNum = 2;
        this.choices = [{id:'action_choice1', name:''},{id:'action_choice2', name:''}];

        this.isLoading = true;
        if (localStorage.getItem('userInfo') != null && localStorage.getItem('userInfo') != undefined && localStorage.getItem('userInfo') != "undefined") {
            this.userData = JSON.parse(localStorage.getItem('userInfo'));
            console.log(this.userData);
            if (this.userData.access_permission_info.can_notify_all_students == 0) {
                this.model.year = -1;
            }
        }
        let body:any = '{"college_id":' + this.userData.college_info.id + '}';
        this.notificationService.getDepartments(body)
            .subscribe(result => {
                console.log(result);
                this.result = result.data;
                this.isLoading = false;
            },
            error => this.error = <any>error);

        
    }


    addChoice(): void {
        let newChoice = new Choice();
        newChoice.id = 'action_choice' + (this.choiceNum + 1);
        newChoice.name = '';
        this.choices.push(newChoice);
        this.choiceNum += 1;
    }

    delete(choice: Choice): void {
        if (this.choices.length > 2) {
            this.choices = this.choices.filter(h => h !== choice);
        }
    }

    onSubmit(model) {
        jQuery("#btnSubmit").html("Sending....").prop('disabled', true);
        
        model.account_id = this.userData.user_account_info.id;
        model.role_id = this.userData.access_permission_info.role_id;
        model.college_id = this.userData.college_info.id;
        model.send_option = 1;
        model.action_required = 1;
        model.action_choices = [];
        model.file_url = '';
        for (var choice of this.choices) {
            model.action_choices.push(choice.name);
            delete(model[choice.id]);
        }

        console.log(model);
        
        this.notificationService.sendNotification(model)
            .subscribe(
            result => {
                // this.result = result.data;
                this.resetModel();
                jQuery("#btnSubmit").html("Send").prop('disabled', false);
            },
            error => this.error = <any>error);
    }

    resetModel() {
        this.model.send_option = 1;
        this.model.dept_id = 0;
        this.model.year = 0;
        this.model.title = '';
        this.model.priority = 0;
        this.model.action_required = 0;
        this.model.action_question = '';
        this.filteredSections = [];
        this.years = [];
        this.choices = [{id:'action_choice1', name:''},{id:'action_choice2', name:''}];

        
    }

    onDepartmentSelect(departmentid:string)
    {
        if(departmentid !== "0")
        {
            let body:any = '{"department_id":' + departmentid + '}';

            //Year population
            this.notificationService.getYears(body)
            .subscribe(result => {
                console.log(result);
                this.years = result.data;
                //this.isLoading = false;
            },
            error => this.error = <any>error);

            //Section population
            body = '{"college_id":' + this.userData.college_info.id + ',"department_id":' + departmentid + '}';

            this.notificationService.getSections(body)
            .subscribe(result => {
                console.log(result);
                this.sections = result.data;
                //this.isLoading = false;
            },
            error => this.error = <any>error);
        }
    }

    onYearSelect(year:string)
    {
        if (year != '') {
            this.filteredSections = [];
            if (this.sections) {
                for (let section of this.sections) {
                    if (section.name.indexOf(year) === 0) {
                        this.filteredSections.push(section);
                    }
                }
            }
            
        }

    }
}
