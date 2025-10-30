export interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    full: string;
    small: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}