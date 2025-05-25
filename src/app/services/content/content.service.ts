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
        const averageRating = await this.getContentAverageRatingById(id) // Fetch the average rating

        if(averageRating !== undefined)
        {
          response.data.average_rating = averageRating
        }
        else
        {
          response.data.average_rating = 0 // Default to 0 if no rating is found
        }

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
  async getContentAverageRatingById(id: string): Promise<number>
  {
    const url = `https://api.fliverse.es/ratings/average/${id}`

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

}
