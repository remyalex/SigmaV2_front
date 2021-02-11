export class AuthLoginInfo {
    username: string;
    password: string;
    
    public constructor(init?: Partial<AuthLoginInfo>) {
        Object.assign(this, init);
    }
}
