export class User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    img: string;
    active: boolean;


    constructor(obj?:any){
        this.id = obj ? obj.id: '';
        this.firstName = obj ? obj.firstName : '';
        this.lastName = obj ? obj.lastName : '';
        this.email = obj ? obj.email : '';
        this.img = obj ?  obj.img : '';
        this.active = obj ? obj.active : true;
      

    }

    public toJSON(){
    return {
        id: this.id,
        firstName : this.firstName,
        lastName : this.lastName ,
        email : this.email,
        img: this.img,
        active : this.active
       
    }
    
    }

  
    
}