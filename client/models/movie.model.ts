export class MovieModel {
    movieId;
    title: string;
    year;
    genre = [];
    rating;
    image;
    bio?: string;

    constructor(movieId, title: string, year, genre, rating, image, bio?: string){
        this.movieId = movieId;
        this.title = title;
        this.year = year;
        this.genre = genre;
        this.rating = rating;
        this.bio = bio;
    }
}