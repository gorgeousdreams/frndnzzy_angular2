
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Notification } from './notification';
import 'rxjs/add/operator/map'
@Injectable()
export class NotificationService {
  constructor(private http: Http) { }
  private frndzzyUrl = 'https://api.frndzzy.com/webservices_cubix/college_portal_api.php';
  result: any;
  
  fileUpload(url, formData, options) {
    return this.http.post(url, formData, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getDepartments(body) {
    var getDepartmentsUrl = this.frndzzyUrl + "?action=get_departments";
    return this.http.post(getDepartmentsUrl, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getYears(body) {
    var getYearsUrl = this.frndzzyUrl + "?action=get_years_of_department";
    return this.http.post(getYearsUrl, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSections(body) {
    var getSectionsUrl = this.frndzzyUrl + "?action=get_sections";
    return this.http.post(getSectionsUrl, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getStudents(body) {
    var getStudentUrl = this.frndzzyUrl + "?action=get_student_list_for_notification";
    return this.http.post(getStudentUrl, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  fetchNotifications(body) {
    var getNotificationsUrl = this.frndzzyUrl + "?action=read_notification_history";
    return this.http.post(getNotificationsUrl, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  fetchPolling(body) {
    var getNotificationsUrl = this.frndzzyUrl + "?action=read_polling_history";
    return this.http.post(getNotificationsUrl, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  sendNotification(noti: Notification) {
    var notificationUrl = this.frndzzyUrl + "?action=notify_students";
    this.result = this.http.post(notificationUrl, JSON.stringify(noti))
      .map(this.extractData)
      .catch(this.handleError);
    return this.result;
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: any) {
    console.log(error);
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}