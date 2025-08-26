
export interface User {
    id: number;
    // Certains endpoints renvoient "username", d'autres "name"
    username?: string;
    name?: string;
    email?: string;
    createdAt?: Date;   // Changé de created_At à createdAt
}



