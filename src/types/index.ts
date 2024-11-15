export interface IOffering {
    title: string;
    description: string;
    price: number;
    image: string;
}

export interface IBusiness {
    id: string;
    name: string;
    category: string;
    location: string;
    description: string;
    rating: number;
    reviews: { user: string; review: string; rating: number }[];
    offerings: IOffering[];
}
