import { Component, AfterViewInit, OnInit, NgZone, Inject } from '@angular/core';
import { Routes, Router, RouterModule } from '@angular/router';
import { NotificationService } from './app.notifications.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Notification } from './notification';
import {Observable} from 'rxjs/Rx';
import { NgUploaderOptions } from 'ngx-uploader';

declare var jQuery: any;
@Component({
    selector: 'notification',
    templateUrl: './app.notifications.html',
})
export class NotificationComponent implements AfterViewInit, OnInit {
    result: any;
    tresult: any
    error: any;
    userData: any;
    isLoading = false;
    model = new Notification();

    private basicOptions: Object;
    private response: any = {};
    apiurl = '';
    apiurl1:any = '';

    years:any;
    sections:any;
    filteredSections:any = [];
    students:any;
    selectedStudents:any;
    options: NgUploaderOptions;
    hasBaseDropZoneOver: boolean;



    constructor(private notificationService: NotificationService, public http: Http, @Inject(NgZone) private zone: NgZone) {
        this.options = new NgUploaderOptions({
          url: 'https://api.frndzzy.com/webservices_cubix/college_portal_api.php?action=upload_my_file',
          autoUpload: true,
          calculateSpeed: true,
          fieldReset: true,
          allowedExtensions: ['xls', 'xlsx', 'pdf', 'doc', 'docx', 'jpg', 'png', 'jpeg', 'gif', 'ppt', 'gif', 'pptx', 'csv']
        });
    }

    ngAfterViewInit() {
        jQuery('#characterLeft').text('300 characters left');
        jQuery('#message').keyup(function () {
            var max = 300;
            var len = jQuery(this).val().length;
            if (len >= max) {
                jQuery('#characterLeft').text('You have reached the limit');
                jQuery('#characterLeft').addClass('red');
                jQuery('#btnSubmit').prop('disabled', true);
            }
            else {
                var ch = max - len;
                jQuery('#characterLeft').text(ch + ' characters left');
                jQuery('#btnSubmit').prop('disabled', false);
                jQuery('#characterLeft').removeClass('red');
            }
        });
    }

    ngOnInit() {
        this.model.priority = 0;
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


    handleUpload(data: any) {
        jQuery('#btnSubmit').prop('disabled', true).html('File uploading...').css({'background-color': '#5cb85c'});
        setTimeout(() => {
          this.zone.run(() => {
            this.response = data;
            if (data && data.response) {
              this.response = JSON.parse(data.response);
              console.log(this.response);
              this.apiurl = this.response.api_url
              this.apiurl1 = this.response.file_full_url;
              this.options = new NgUploaderOptions({
                  url: 'https://api.frndzzy.com/webservices_cubix/college_portal_api.php?action=upload_my_file',
                  autoUpload: true,
                  calculateSpeed: true,
                  fieldReset: true,
                  allowedExtensions: ['xls', 'xlsx', 'pdf', 'doc', 'docx', 'jpg', 'png', 'jpeg', 'gif', 'ppt', 'gif', 'pptx', 'csv']
                });
              jQuery('#btnSubmit').prop('disabled', false).html('Send');

            }
          });
        });
      }

    fileOverBase(e: boolean) {
        this.hasBaseDropZoneOver = e;
    }

    onSubmit(model) {
        jQuery("#btnSubmit").html("Sending....").prop('disabled', true);
      
        model.account_id = this.userData.user_account_info.id;
        model.role_id = this.userData.access_permission_info.role_id;
        model.college_id = this.userData.college_info.id;
        model.file_url = this.apiurl1;
        model.send_option = 1;
        model.action_required = 0;
        model.action_question = '';
        model.action_choices = [];
        if (model.dept_id != '0' && model.year != '0' && model.section_id != '0') {
            model.student_data = [];
            if (model.student) {
                for (let student of model.student) {
                    if (student === '0') {
                        if (this.students) {
                            for (let student of this.students) {
                               model.student_data.push({"student_id": student.id, "department_id": model.dept_id, "college_id":model.college_id});
                            }
                        }
                        
                        break;
                    }
                    else {
                           model.student_data.push({"student_id": student, "department_id": model.dept_id, "college_id":model.college_id});
                    }
                }
            }
            else {
                if (this.students) {
                    for (let student of this.students) {
                       model.student_data.push({"student_id": student.id, "department_id": model.dept_id, "college_id":model.college_id});
                    }
                }
            }
            
        }
        
        delete(model['student']);
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
        this.model.message = '';
        this.model.priority = 0;
        this.model.action_required = 0;
        this.model.action_question = '';
        this.apiurl = '';
        this.apiurl1 = '';
        this.filteredSections = [];
        this.response = '';
        this.students = [];
        this.years = [];
        jQuery('#uploadCaptureInputFile').val('');

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
            console.log(body);

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

    onSectionSelect(departmentid:string,sectionid:string,year:string)
    {
        console.log(sectionid);
        if(departmentid !== "0" && sectionid !== "0" && year !== "0")
        {
            let body:any = '{"college_id":' + this.userData.college_info.id + ',"department_id":' + departmentid + 
                            ',"section_id":' + sectionid + ',"year":' + year + '}';
                            console.log(body);

            //Year population
            this.notificationService.getStudents(body)
            .subscribe(result => {
                console.log(result);
                this.students = result.data;
                //this.isLoading = false;
            },
            error => this.error = <any>error);
        }
    }
}
