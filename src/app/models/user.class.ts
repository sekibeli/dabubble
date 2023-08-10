export class User {
    id?: string;
    username: string;
   
    email: string;
    img?: string;
    active?: boolean;


    constructor(obj?:any){
        this.id = obj ? obj.id: '';
        this.username = obj ? obj.username : '';
        this.email = obj ? obj.email : '';
        this.img = obj? obj.img : '../../assets/img/profile_img/benutzer.svg';
        this.active = obj ? obj.active : false;
      

    }

    public toJSON(){
    return {
        id: this.id,
        username : this.username,
        email : this.email,
        img: this.img,
        active : this.active
       
    }
    
    }

  
    
}