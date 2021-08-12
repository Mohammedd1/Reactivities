export interface Activity {//no convenbtion to prefixing the interface name with I like we used to did in C#
    id: string;
    title: string;
     date: Date | null;
    //date: string;
    description: string;
    category: string;
    city: string;
    venue: string;
}