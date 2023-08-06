export class Message {
   
    fromID: string;
    toID: string;
    description: string;
    timestamp: number;


    constructor(obj?: any) {
       
        this.fromID = obj ? obj.fromID : '';
        this.toID = obj ? obj.toID : '';
        this.description = obj ? obj.description : '';
        this.timestamp = obj ? obj.timestamp : '';



    }

    public toJSON() {
        return {
          
            fromID: this.fromID,
            toID: this.toID,
            description: this.description,
            timestamp: this.timestamp

        }

    }

}