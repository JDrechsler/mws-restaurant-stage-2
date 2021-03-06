interface Restaurant {
  address: string;
  cuisine_type: string;
  id: number;
  imgAlt: string;
  latlng: object;
  name: string;
  neighborhood: string;
  operating_hours: object;
  photograph: string;
  reviews: Array<Review>;
}

interface Review {
  comments: string;
  date: string;
  name: string;
  rating: number;
}
