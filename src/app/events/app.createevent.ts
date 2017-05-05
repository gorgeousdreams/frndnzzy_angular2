import { Component, OnInit, NgZone, ViewChild, AfterViewInit  } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Routes, Router, RouterModule } from '@angular/router';
import { Event } from './Event';
import { EventsService } from './app.events.service';
import { Http, Headers } from '@angular/http';
//import { UPLOAD_DIRECTIVES } from 'ng2-uploader/ng2-uploader';

@Component({
    selector: 'create-events',
    templateUrl: './app.createevent.html',
})

export class CreateEventComponent implements AfterViewInit, OnInit{
    @ViewChild('modal')
    modal: ModalComponent;
    result: any;    
    error : any;
    output :string;
    date: Date;
    private zone: NgZone;
    private basicOptions: Object;
    private progress: number = 0;
    private response: any = {};

    ngAfterViewInit() {
        this.modal.open();
    }

    ngOnInit() {
        this.zone = new NgZone({ enableLongStackTrace: false });
        this.basicOptions = {
        url: 'https://api.frndzzy.com/webservices_cubix/college_portal_api.php?action=upload_my_file'    
        };
    }
    constructor(private eventsService: EventsService,public http: Http) {
        this.date = new Date();
        
    }

    handleUpload(data: any): void {
            debugger;
            this.zone.run(() => {        
            this.response = data;
            this.progress = data.progress.percent / 100;
            });
    }

    arr : any[] = [];
    model = new Event();

     onSubmit(model) {
            debugger;
            model.images=[];
            model.files=[];           
            this.eventsService.createEvents(model)
                           .subscribe(
                            result =>{ this.result = result.data;
                            alert(result.message);
                            },                            
                            error =>  this.error = <any>error);               
     }
               
}
