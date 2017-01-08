import {Injectable} from "@angular/core";
import {Subject} from 'rxjs/Subject';

@Injectable()
export class Base64ImageService{
    private fileReader: FileReader;
    private base64Encoded: string;
    private base64Observable = new Subject<string>();
    base64Observant = this.base64Observable.asObservable();

    constructor() {
        this.fileReader = new FileReader();
        this.fileReader.onload = (file) => {
            this.base64Encoded = this.fileReader.result;
            console.log(this.base64Encoded);
            console.log("Encoded file!");
            this.base64Observable.next(this.base64Encoded);
        }
    }

    encodeFile(file : File) {
        this.fileReader.readAsDataURL(file);
    }
}