import { Injectable } from '@angular/core';
import { Content } from '../../interfaces/content';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  
  constructor() { }

  // Get random contents from the API. It returns a Promise of an array of Content objects
  async getRandomContents(n: number, genres: string[], keywords: string[]): Promise<Content[]> 
  {
    let url = `https://api.fliverse.es/contents/random`
    
    // If n is greater than 0, add it to the url
    if (n > 0) 
    {
      url += `?n=${n}`
    }

    // If genres is not empty, add it to the url
    if (genres.length > 0 && url.includes('?')) 
    {
      url += `&genres=${genres.join(',')}`
    }
    else if (genres.length > 0) 
    {
      url += `?genres=${genres.join(',')}`
    }

    // If keywords is not empty, add it to the url
    if (keywords.length > 0 && url.includes('?')) 
    {
      url += `&keywords=${keywords.join(',')}`
    }
    else if (keywords.length > 0) 
    {
      url += `?keywords=${keywords.join(',')}`
    }

    // Get the contents from the API
    try {
      const response = await axios.get(url)

      if (response.status === 200) 
      {
        const response = await axios.get(url)

        let contentsArray: any[] = []

        if (Array.isArray(response.data)) 
        {
          contentsArray = response.data
        } 
        else if (Array.isArray(response.data.contents)) 
        {
          contentsArray = response.data.contents
        }

        const contents: Content[] = contentsArray.map((content: any) => ({
          id: content.id,
          title: content.title,
          type: content.type,
          synopsis: content.synopsis,
          poster: content.poster,
          trailer_url: content.trailer_url,
          release_date: new Date(content.release_date),
          duration: content.duration,
          average_rating: content.average_rating,
          genre: content.genre,
          keywords: content.keywords
        }))

        return contents
      } 
      else 
      {
        return []
      }
    } catch (error) {
      // If there is an error, log it to the console
      console.error('Error fetching random contents:', error)
      return []
    }
  }

  // Get the latest contents from the API. It returns a Promise of an array of Content objects
  async getLatestContents(n: number): Promise<Content[]>
  {
    let url = `https://api.fliverse.es/contents/latest`

    // If n is greater than 0, add it to the url
    if (n > 0) 
    {
      url += `?n=${n}`
    }

    // Get the contents from the API
    try {
      const response = await axios.get(url)

      if (response.status === 200) 
      {
        const response = await axios.get(url)

        let contentsArray: any[] = []

        if (Array.isArray(response.data)) 
        {
          contentsArray = response.data
        } 
        else if (Array.isArray(response.data.contents)) 
        {
          contentsArray = response.data.contents
        }

        const contents: Content[] = contentsArray.map((content: any) => ({
          id: content.id,
          title: content.title,
          type: content.type,
          synopsis: content.synopsis,
          poster: content.poster,
          trailer_url: content.trailer_url,
          release_date: new Date(content.release_date),
          duration: content.duration,
          average_rating: content.average_rating,
          genre: content.genre,
          keywords: content.keywords
        }))

        return contents
      } 
      else 
      {
        return []
      }
    } catch (error) {
      // If there is an error, log it to the console
      console.error('Error fetching latest contents:', error)
      return []
    }
  }

  // Get content by ID from the API. It returns a Promise of a Content object
  async getContentById(id: string): Promise<Content> 
  {
    const url = `https://api.fliverse.es/contents/searchById?id=${id}`

    try {
      const response = await axios.get(url)

      if (response.status === 200 && response.data) 
      {
        let averageRating = 0
        try {
          averageRating = await this.getContentAverageRatingById(id)
        } 
        catch (ratingError) {
          console.error('Error fetching content rating:', ratingError)
          averageRating = 0
        }

        response.data.average_rating = averageRating ?? 0

        const content = response.data
        return {
          id: content.id,
          title: content.title,
          type: content.type,
          synopsis: content.synopsis,
          poster: content.poster,
          trailer_url: content.trailer_url,
          release_date: content.release_date,
          duration: content.duration,
          average_rating: content.average_rating,
          genre: content.genre,
          keywords: content.keywords
        }
      }
      throw new Error('Content not found')
    } 
    catch (error) {
      console.error('Error fetching content by id:', error)
      throw error
    }
  }

  // Get content rating by ID from the API. It returns a Promise of a number
  async getContentAverageRatingById(contentId: string): Promise<number>
  {
    const url = `https://api.fliverse.es/ratings/average/${contentId}`

    // Get the rating from the API
    try {
      const response = await axios.get(url)

      if (response.status === 200) 
      {
        return response.data.averageRating
      }
      
      return 0
    } 
    catch (error) {
      console.error('Error fetching content rating:', error)
      return 0
    }
  }

  // Add a rating to content. It takes contentId, rating and token as parameters. It returns a Promise of a number (the rating added)
  async addRatingToContent(contentId: string, rating: number, token: string): Promise<number>
  {
    const url = "https://api.fliverse.es/ratings"

    const data = {
      content_id: contentId,
      rating: rating
    }

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.rating || 0
    } catch (error:any) {
      if (error.response) 
      {
        if (error.response.status === 400) 
        {
          console.error('Invalid input or user has already rated:', error.response.data?.error)
          throw new Error('Invalid input or you have already rated this content.')
        }
        if (error.response.status === 404) 
        {
          console.error('Content not found:', error.response.data?.error)
          throw new Error('Content not found.')
        }
        if (error.response.status === 500) 
        {
          console.error('Internal server error:', error.response.data?.error)
          throw new Error('Internal server error. Please try again later.')
        }
        console.error('Unknown error when adding rating:', error.response.data?.error)
        throw new Error('Unknown error when adding rating.')
      } 
      else 
      {
        console.error('Network or unexpected error:', error)
        throw new Error('Network or unexpected error.')
      }
    }
  }

  // Get user rating for content. It takes contentId and token as parameters. It returns a Promise of a number (the user's rating)
  async getUserRatingForContent(contentId: string, token: string): Promise<number>
  {
    const url = `https://api.fliverse.es/ratings/${contentId}`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 200 && response.data && typeof response.data.rating === 'number') 
      {
        return response.data.rating
      }

      // If the backend returns the full object, try to extract the rating field
      if (response.status === 200 && response.data && response.data.rating !== undefined) 
      {
        return response.data.rating
      }

      return 0
    } catch (error: any) {
      if (error.response && error.response.status === 404) // If the user has not rated the content, return 0
      {
        return 0
      }
      console.error('Error fetching user rating:', error)
      return 0
    }

  }

}
