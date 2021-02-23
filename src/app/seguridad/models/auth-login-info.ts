export class AuthLoginInfo {
    usuario: string;
    username: string;
    password: string;

    public constructor(init?: Partial<AuthLoginInfo>) {
        Object.assign(this, init);
        this.usuario = this.username;
    }
}
