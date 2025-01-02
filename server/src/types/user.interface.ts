export interface User {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
}

export interface UserDocument extends User, Document {
    validatePassword(param1: string): string;
}
