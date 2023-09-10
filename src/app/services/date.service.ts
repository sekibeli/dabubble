import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  lastDate;


  constructor() { }

  getFormatedDateFromTimestamp(timestamp) {
    let date = new Date(timestamp);
    return new Date(timestamp).toLocaleString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' });
  }

  setLastDate(date: string) {
    this.lastDate = date;
  }

  getLastDate(): string {
    return this.lastDate;
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Führende Nullen hinzufügen, falls nötig
    let strHours = (hours < 10 ? '0' : '') + hours.toString();
    let strMinutes = (minutes < 10 ? '0' : '') + minutes.toString();
    return strHours + ':' + strMinutes;
  }
}
