export type JwtPayload = {
    id: string;
    // name: string;
    // username: string;
    email:string;
    role: string;
    [key: string]: any;
}