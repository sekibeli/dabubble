export class Post {
    id: string;
    author: string;
    description: string;
    timestamp: number;
    

    constructor(obj?:any){
        this.id = obj ? obj.id: '';
        this.author = obj ? obj.author : '';
        this.description = obj ? obj.description : '';
        this.timestamp = obj? obj.timestamp : '';
      
      

    }

    public toJSON(){
        return {
            id: this.id,
            author : this.author,
          
            description: this.description,
            timestamp : this.timestamp
           
        }
        
        }

}