import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private httpClient: HttpClient) {}


  postFile (file: File) {
    const endpoint = 'https://my-dabubble.web.app/assets/img/profile_img/';
    const formData: FormData = new FormData();
    formData.append('image', file, file.name);
    return this.httpClient.post(endpoint,formData)
     
}
}
