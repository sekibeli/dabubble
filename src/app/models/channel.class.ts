export class Channel {

    title: string;
   description?: string;
    createdBy: string;
    members: Array<string>
 


    constructor(obj?:any){
  
        this.title = obj ? obj.title : '';
        this.description = obj ? obj.description : '';
        this.createdBy = obj? obj.createdBy: '';
        this.members = obj? obj.members: [];
       
      

    }

    public toJSON(){
    return {
    
        title : this.title,
        description : this.description,
       createdBy: this.createdBy,
       members: this.members
      
    }
    
    }

  
    
}