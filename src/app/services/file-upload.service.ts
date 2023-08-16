import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private httpClient: HttpClient) {}


//   postFile (file: File) {
//    console.log('imageurl:', file);
 
//     const endpoint = 'gs://my-dabubble.appspot.com/img';
//     const formData: FormData = new FormData();
//     formData.append('img', file, file.name);
//     console.log('file:', file, file.name);
//     console.log('formData:',formData);
//     console.log(this.httpClient.post(endpoint,formData))
//     return this.httpClient.post(endpoint,formData);
     
// }
}
