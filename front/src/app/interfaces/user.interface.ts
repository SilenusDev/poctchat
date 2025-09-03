
import { Role } from './role.interface';

export interface User {
    id: number;
    // Certains endpoints renvoient "username", d'autres "name"
    username?: string;
    name?: string;
    email?: string;
    role?: Role;  // Ajout du champ role
    createdAt?: Date;   // Changé de created_At à createdAt
}



