import { ContentType } from "../enums/content-type"

export interface Content {
    id             : number
    title          : string
    type           : ContentType  // 'movie', 'series'
    synopsis       : string
    poster         : string
    trailer_url    : string
    release_date   : Date         // YYYY-MM-DD
    duration      ?: number       // Duration in minutes
    average_rating : number       // Average rating, 0 to 10
    genre          : string[]     // Array of genres
    keywords       : string[]     // Array of keywords
}