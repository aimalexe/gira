export interface User {
    Id: string;
    name?: string;
    email?: string;
    role: {
        name: string
    };
}

// export type UserWithUnderscoreId = Omit<User, 'id'> & { _id: string };