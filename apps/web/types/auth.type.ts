export interface UserType {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    token?: string | null;
};

export interface CustomSession {
    user?: UserType;
    expires: ISODateString;
};