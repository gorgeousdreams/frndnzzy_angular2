import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Routes, Router, RouterModule } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'my-events',
    templateUrl: './app.myevents.html',
})

export class MyEventsComponent implements AfterViewInit{
	@ViewChild('modal')
    modal: ModalComponent;
	ngAfterViewInit() {
        this.modal.open();
    }
}
