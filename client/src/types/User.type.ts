export interface User {
    id: string;
    name?: string;
    email?: string;
    role: 'admin' | 'user';
}

export type UserWithUnderscoreId = Omit<User, 'id'> & { _id: string };