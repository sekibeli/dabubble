import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, endAt, getDocs, limit, orderBy, query, startAt } from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { Subject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit{
firestore: Firestore = inject(Firestore);
searchterm: string;
startAt = new Subject();
endAt = new Subject();
startobs = this.startAt.asObservable();
endobs = this.endAt.asObservable();
notChosen = true;
chosenUser;
search = false;
users;
result;

ngOnInit() {
  // combineLatest([this.startobs, this.endobs]).subscribe((value)=> {
  //   this.searchUserInFirestore(value[0], value[1]).then((user)=>{
  //     this.users = user.docs.map(doc => doc.data());
  //   })
  //   console.log(this.users);
  // })
  combineLatest([this.startobs, this.endobs]).subscribe((value)=> {
    this.searchInFirestore(value[0], value[1]).then((items)=>{
      this.users = items;
      console.log(items);
      this.result = this.separateUsersAndChannels(items);
      console.log('USER',this.result.users);
      console.log('CHANNEL',this.result.channels, this.result.channels.length);
    })
    .catch(error => {
      console.error("Error fetching data: ", error);
    });
  })
  
  // console.log(this.result.users);   
  // console.log(this.result.channels);
}

  searchMember($event) {
    this.search = true;
    let q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + "\uf8ff")
  }

  // addNewMember() { }

  chooseNewMember(user:User){
    this.chosenUser = user;
    console.log(user);
    this.notChosen = false;
    this.chosenUser = user;
  }

  searchUserInFirestore(start, end) {
    const collRef = collection(this.firestore, 'users');
    const queryRef = query(collRef, orderBy('username'), limit(10), startAt(start), endAt(end));
    const docRef = getDocs(queryRef);
    return docRef;
   

  }

  async searchInFirestore(start, end) {
    // Suche in der 'users' Collection
    const usersCollRef = collection(this.firestore, 'users');
    const usersQueryRef = query(usersCollRef, orderBy('username'), limit(10), startAt(start), endAt(end));
     const usersDocRef = await getDocs(usersQueryRef);
    
    // Suche in der 'channels' Collection
    const channelsCollRef = collection(this.firestore, 'channels');
    const channelsQueryRef = query(channelsCollRef, orderBy('title'), limit(10), startAt(start), endAt(end));
    const channelsDocRef = await getDocs(channelsQueryRef);
  
    // Kombiniere die Ergebnisse der beiden Queries
    const combinedResults = [];
    usersDocRef.forEach(doc => {
      combinedResults.push(doc.data());
    });
    
    channelsDocRef.forEach(doc => {
      combinedResults.push(doc.data());
    });
  
    return combinedResults;
  }

separateUsersAndChannels(jsonArray) {
    // Filtert die JSON-Objekte, die ein 'username'-Feld haben, und schiebt sie in das 'users'-Array
    const users = jsonArray.filter((jsonObject) => 'username' in jsonObject);
  
    // Filtert die JSON-Objekte, die ein 'title'-Feld haben, und schiebt sie in das 'channels'-Array
    const channels = jsonArray.filter((jsonObject) => 'title' in jsonObject);
  
    // Gibt ein Objekt zurück, das die beiden separaten Arrays enthält
    return { users, channels };
  }
  
 }
