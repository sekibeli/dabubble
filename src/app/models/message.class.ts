export class Message {
    id: string;
    fromID: string;
    toID: string;
    description: string;
    timestamp: number;
    file: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id: '';
        this.fromID = obj ? obj.fromID : '';
        this.toID = obj ? obj.toID : '';
        this.description = obj ? obj.description : '';
        this.timestamp = obj ? obj.timestamp : '';
        this.file = obj? obj.file : '';


    }

    public toJSON() {
        return {
            id: this.id,
            fromID: this.fromID,
            toID: this.toID,
            description: this.description,
            timestamp: this.timestamp,
            file: this.file
        }

    }

}