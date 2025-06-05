import { ContentType } from "../enums/content-type"
import { WatchStateType } from "../enums/watch-state-type"

export interface Content {
    id            ?: number
    title          : string
    type           : ContentType     // 'movie', 'series'
    synopsis       : string
    poster        ?: string
    posterFile    ?: File            // Optional, for file uploads
    trailer_url   ?: string
    release_date   : Date            // YYYY-MM-DD
    duration      ?: number          // Duration in minutes
    average_rating?: number          // Average rating, 0 to 10
    genre          : string[]        // Array of genres
    keywords       : string[]        // Array of keywords
    watch_state   ?: WatchStateType  // "to_watch", "watched"
    user_rating   ?: number
}