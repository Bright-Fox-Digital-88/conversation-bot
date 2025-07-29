export interface Fields {
    fields: Record<string, any>;
    tags?: string[];
}

export enum MessageType {
    TEXT = "text",
    PHONE_CALL = "phone call",
    EMAIL = "email"
} 