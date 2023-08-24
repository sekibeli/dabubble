export class Channel {
    id?: string;
    title: string;
   description?: string;
    createdBy: string;
    members: Array<string>
 


    constructor(obj?:any){
        this.id = obj ? obj.id: '';
        this.title = obj ? obj.title : '';
        this.description = obj ? obj.description : '';
        this.createdBy = obj? obj.createdBy: '';
        this.members = obj? obj.members: [];
       
      

    }

    public toJSON(){
    return {
        id: this.id,
        title : this.title,
        description : this.description,
       createdBy: this.createdBy,
       members: this.members
      
    }
    
    }

  
    
}