
export class CollectionResponse<T>{
    public content: T[];
    public totalPages: number;
    public totalElements: number;
    public last: boolean;
    public size: number;
    public number: number;
    public first: boolean;
    public numberOfElements: number;
    public empty: boolean;
    public pageable: Pageable;
}


export class Pageable {
    public offset: number;
    public pageSize: number;
    public pageNumber: number;
}
