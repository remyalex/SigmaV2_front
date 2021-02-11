export class Menu {
    constructor(public id: number,
                public titulo: string,
                public routerLink: string,
                public href: string,
                public icon: string,
                public target: string,
                public hasSubMenu: boolean,
                public parentId: number) { }
}