// src/app/interfaces/post.interface.ts
import { Subject } from "src/app/interfaces/subject.interface";
import { User } from "src/app/interfaces/user.interface";

export interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    subject: Subject;
    author: User;  // Changé de Author à author

}