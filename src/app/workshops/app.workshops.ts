import { Component, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { Routes, Router, RouterModule } from '@angular/router';
import { Workshop } from './Workshop';
import { WorkshopService } from './app.workshop.service';
import { Http, Headers } from '@angular/http';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
@Component({
    selector: 'workshops',
    templateUrl: './app.workshops.html',
})

export class WorkshopsComponent implements AfterViewInit, OnInit {
    result: any;
    tresult: any
    error: any;
    isLoading = false;
    searchString = '';
    @ViewChild('modal')
    modal: ModalComponent;
    constructor(private workshopService: WorkshopService, public http: Http) {
    }

    ngAfterViewInit() {
        this.modal.open();
    }

    ngOnInit() {
        this.isLoading = true;
        this.workshopService.readWorkshopReqs("51")
            .subscribe(result => {
                console.log(result);
                this.result = result.data;
                this.tresult = result.data;
                this.isLoading = false;
            },
            error => this.error = <any>error);
    }

    Search() {
        let title = this.searchString.trim();
        debugger;
        this.result = this.tresult.filter(t => t.title.toLowerCase().includes(title.toLowerCase()));

    }
}