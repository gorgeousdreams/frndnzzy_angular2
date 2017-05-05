import { Component, OnInit, NgZone } from '@angular/core';
import { Routes, Router, RouterModule } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { UPLOAD_DIRECTIVES } from 'ng2-uploader/ng2-uploader';
import { SMService } from './sm.service';
declare var jQuery: any;
@Component({
    selector: 'student-management',
    templateUrl: './sm.html',
})

export class SMComponent {
    result: any;
    finalResult: any;
    error: any;
    output: string;
    date: Date;
    userData: any;
    apiurl: string;
    isUploading = false;
    isLoaded = false;
    isFinal = false;
    private zone: NgZone;
    private basicOptions: Object;
    private progress: number = 0;
    private response: any = {};

    //cds_hier_link & student_data_template
    cdsHierLink:string = "";
    studentDataTemplate:string = "";

    constructor(private service: SMService) {
    }

    ngOnInit() {
        this.zone = new NgZone({ enableLongStackTrace: false });
        this.basicOptions = {
            url: 'https://api.frndzzy.com/webservices_cubix/college_portal_api.php?action=upload_my_file',
            fieldReset: true,
            allowedExtensions: ['xls', 'xlsx']
        };
        this.cdsHierLink = JSON.parse(localStorage.getItem("userInfo")).cds_hier_link;
        this.studentDataTemplate = JSON.parse(localStorage.getItem("userInfo")).student_data_template;
    }


    handleUpload(data: any): void {
        jQuery("#uploader").hide();
        this.isUploading = true;
        this.isFinal = false;
        debugger;
        this.zone.run(() => {
            this.isLoaded = false;
            if (data && data.response) {
                data = JSON.parse(data.response);
                this.response = data;
                this.apiurl = this.response.api_url
                this.uploadNow(this.apiurl);
            }
        });

    }

    uploadNow(apiurl) {

        if (localStorage.getItem('userInfo') != null && localStorage.getItem('userInfo') != undefined && localStorage.getItem('userInfo') != "undefined") {
            this.userData = JSON.parse(localStorage.getItem('userInfo'));
            console.log(this.userData);
        }

        
        this.service.uploadStudents(this.userData.user_account_info.id, this.userData.college_info.id, "94", apiurl)
            .subscribe(result => {
                debugger;
                console.log(result);
                this.result = result.data;
                this.isLoaded = true;
                this.isUploading = false;
                jQuery("#uploader").show();
            },
            error => this.error = <any>error);
    }

onClick="this.form.submit(); this.disabled=true; this.value='Sending…'; "
    acknowledgeNow() {
        debugger;
        jQuery("#btnSubmit").attr('disabled','disabled');
        jQuery("#btnSubmit").html("Processing....");
        this.service.acknowledgeStudents(this.userData.user_account_info.id, this.userData.college_info.id, "94", this.apiurl)
            .subscribe(result => {
                debugger;
                console.log(result);
                this.finalResult = result;
                jQuery("#btnSubmit").html("Acknowledge").removeAttr('disabled');
                this.isFinal = true;
                this.isLoaded = false;
                //alert(this.finalResult.message);
            },
            error => this.error = <any>error);
    }

}
