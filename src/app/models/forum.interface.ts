export interface ForumTopic {
    topic_id?: number;
    user_id?: number;
    title: string;
    content: string;
    category?: string;
    created_at?: string;
    first_name?: string;
    last_name?: string;
    profile_picture_url?: string;
    reply_count?: number;
    replies?: ForumReply[];
}

export interface ForumReply {
    reply_id?: number;
    topic_id?: number;
    user_id?: number;
    reply_text: string;
    created_at?: string;
    first_name?: string;
    last_name?: string;
    profile_picture_url?: string;
}
