export interface Blog {
    _id: string;
    topic_id: string;
    title: string;
    featuredImage: string;
    content: { _id: number, key: string, value: string[] }[];
    published: boolean;
    date: string;
    comments: { user_id: string, content: string }[];
}