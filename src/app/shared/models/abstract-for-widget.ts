export class AbstractForWidget {
    public actions: boolean;
    public filter: boolean;
    public list: boolean;
    public content: boolean;

    constructor() {
        this.actions = false;
        this.filter = false;
        this.list = false;
        this.content = false;
    }
}
