import { Component, OnInit } from '@angular/core';
import { Routes, Router, RouterModule } from '@angular/router';
import { NotificationService } from './app.notifications.service';
declare var jQuery: any;
@Component({
    selector: 'polling-history',
    templateUrl: './app.pollinghistory.html',
    providers: [NotificationService]
})

export class PollingHistoryComponent implements OnInit {
	isLoading = false;
	userData: any;
	result: any;
    tresult: any;
    error: any;
    searchString: '';

	constructor(private notificationService: NotificationService) {
    }
    ngOnInit() {
        this.isLoading = true;

        if (localStorage.getItem('userInfo') != null && localStorage.getItem('userInfo') != undefined && localStorage.getItem('userInfo') != "undefined") {
            this.userData = JSON.parse(localStorage.getItem('userInfo'));
            console.log(this.userData);
        }
        let body = JSON.stringify({ "college_id": this.userData.college_info.id });
        this.notificationService.fetchPolling(body)
            .subscribe(result => {
                console.log(result);
                this.result = result.polling_data;
                this.tresult = result.polling_data;;
                this.isLoading = false;
            },
            error => this.error = <any>error);
    }

    Search() {
        let title = this.searchString.trim();
        this.result = this.tresult.filter(t => t.title.toLowerCase().includes(title.toLowerCase()));

    }
}