import { Injectable } from '@angular/core';
import { Content } from '../../interfaces/content';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private watchedContents: Content[] = []
  
  constructor() { }

  // Get watched contents from the service. It returns an array of Content objects
  getWatchedContents(): Content[]
  {
    return this.watchedContents
  }

  // Set watched contents in the service. It takes an array of Content objects as parameter
  setWatchedContents(contents: Content[]): void
  {
    this.watchedContents = contents
  }

  // Add a watched content to the service. It takes a Content object as parameter
  addWatchedContent(content: Content): void
  {
    this.watchedContents.unshift(content)
  }

  // Remove a watched content from the service. It takes a Content object as parameter
  removeWatchedContent(content: Content): void
  {
    this.watchedContents = this.watchedContents.filter(c => c.id !== content.id)
  }

  // Add new content to the backend. It takes a Content object as parameter and returns a Promise of the added Content object
  async addNewContentToBackend(content: Content, token: string): Promise<Content>
  {
    const url = `https://api.fliverse.es/contents`
    const formData = new FormData()

    formData.append('title', content.title)
    formData.append('type', content.type)
    formData.append('synopsis', content.synopsis)
    formData.append('release_date', content.release_date instanceof Date ? content.release_date.toISOString().split('T')[0] : String(content.release_date))
    
    if (content.duration !== undefined) 
    {
      formData.append('duration', String(content.duration))
    }

    if(content.trailer_url && content.trailer_url.trim() !== '')
    {
      formData.append('trailer_url', content.trailer_url)
    }

    // Send each genre and keyword as a separate field
    if (Array.isArray(content.genre)) 
    {
      content.genre.forEach(g => formData.append('genre', g))
    }

    if (Array.isArray(content.keywords)) 
    {
      content.keywords.forEach(k => formData.append('keywords', k))
    }

    // If posterFile exists, append it to the formData
    if (content.posterFile) 
    {
      formData.append('poster', content.posterFile)
    }

    try {

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 201) 
      {
        return response.data
      } 
      else 
      {
        throw new Error('Failed to add new content')
      }

    } catch (error: any) {
      if (error.response) 
      {
        if (error.response.status === 400) 
        {
          throw new Error('Invalid input. Please check the content data.')
        }
        if (error.response.status === 401) 
        {
          throw new Error('Unauthorized. Please check your authentication token.')
        }
        if (error.response.status === 409) 
        {
          throw new Error('Content title already in use. Please choose a different title.')
        }
        if (error.response.status === 500) 
        {
          throw new Error('Internal server error. Please try again later.')
        }
      }
      throw error
    }
  }

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

  // Search contents by title from the API. It returns a Promise of an array of Content objects. It uses filtering to match the title
  async searchContentsByTitle(token: string, title: string, genre?: string[], keywords?: string[], release_date?: Date, release_date_from?: Date, release_date_to?: Date, type?: string, duration?: number, duration_min?: number, duration_max?: number, page?: number, limit?: number): Promise<{ contents: Content[], total: number, page: number, limit: number }>
  {
    let url = `https://api.fliverse.es/contents/searchByTitle`

    // If the token is not provided, throw an error
    if (!token || token.trim() === '') 
    {
      throw new Error('Token is required to search contents by title.')
    }

    // Add the title to the url
    if (title && title.trim() !== '') 
    {
      url += `?title=${encodeURIComponent(title.trim())}`
    } 
    else 
    {
      return { contents: [], total: 0, page: 0, limit: 0 }
    }

    // Add genre to the url if provided
    if (genre && genre.length > 0) 
    {
      url += `&genre=${genre.join(',')}`
    }

    // Add keywords to the url if provided
    if (keywords && keywords.length > 0) 
    {
      url += `&keywords=${keywords.join(',')}`
    }

    // Add release_date to the url if provided
    if (release_date && release_date !== undefined) 
    {
      url += `&release_date=${release_date.toISOString().split('T')[0]}`
    }

    // Add release_date_from to the url if provided
    if (release_date_from && release_date_from !== undefined) 
    {
      url += `&release_date_from=${release_date_from.toISOString().split('T')[0]}`
    }

    // Add release_date_to to the url if provided
    if (release_date_to && release_date_to !== undefined) 
    {
      url += `&release_date_to=${release_date_to.toISOString().split('T')[0]}`
    }

    // Add type to the url if provided
    if (type && (type.toLowerCase() == 'series' || type.toLowerCase() == 'movie') && type.trim() !== '')
    {
      url += `&type=${encodeURIComponent(type.toLowerCase())}`
    }

    // Add duration to the url if provided
    if (duration !== undefined && duration !== null) 
    {
      url += `&duration=${duration}`
    }

    // Add duration_min to the url if provided
    if (duration_min !== undefined && duration_min !== null) 
    {
      url += `&duration_min=${duration_min}`
    }

    // Add duration_max to the url if provided
    if (duration_max !== undefined && duration_max !== null) 
    {
      url += `&duration_max=${duration_max}`
    }

    // Add page to the url if provided
    if (page !== undefined && page !== null) 
    {
      url += `&page=${page}`
    }

    // Add limit to the url if provided
    if (limit !== undefined && limit !== null) 
    {
      url += `&limit=${limit}`
    }

    // Get the contents from the API
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 200 && response.data && Array.isArray(response.data.results)) 
      {
        const contents: Content[] = response.data.results.map((content: any) => ({
          id: content.id,
          title: content.title,
          type: content.type,
          synopsis: content.synopsis,
          poster: content.poster,
          trailer_url: content.trailer_url,
          release_date: new Date(content.release_date),
          duration: content.duration,
          genre: content.genre,
          keywords: content.keywords
        }))
        return {
          contents,
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit
        }
      } 
      else 
      {
        return { contents: [], total: 0, page: 1, limit: 10 }
      }
    } 
    catch (error: any) {
      // If the API returns a 404 error, return an empty array and total of 0
      if (error.response && error.response.status === 404) 
      {
        return { contents: [], total: 0, page: page || 1, limit: limit || 10 }
      }

      // If there is any other error, log it to the console and return an empty array and total of 0
      console.error('Error fetching contents by title:', error)
      return { contents: [], total: 0, page: page || 1, limit: limit || 10 }
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

  // Change rating for content. It takes contentId, rating and token as parameters. It returns a Promise of a number (the updated rating)
  async changeRatingForContent(contentId: string, rating: number, token: string): Promise<number>
  {
    const url = `https://api.fliverse.es/ratings/${contentId}`

    const data = { 
      rating 
    }

    try {
      const response = await axios.patch(url, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // The backend responds with the updated rating object
      if (response.status === 200 && response.data && response.data.rating !== undefined) 
      {
        return response.data.rating
      }

      // If the response is not as expected, throw a clear error
      throw new Error('Unexpected response from server.')
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) 
        {
          throw new Error(error.response.data?.error || 'Invalid input or user has not rated this content.')
        }
        if (error.response.status === 404) 
        {
          throw new Error(error.response.data?.error || 'Content not found or user has not rated this content.')
        }
      }
      // If there is no response or it's another error
      throw new Error('Error changing rating for content.')
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

  // Get user watched status for content. It takes contentId and token as parameters. It returns a Promise of a string (the user's watched status)
  async getUserWatchedStatus(contentId: string, token: string): Promise<string>
  {
    const url = `https://api.fliverse.es/contents_user/${contentId}`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 200 && response.data && response.data.status) 
      {
        return response.data.status
      }

      return 'to_watch' // Default status if not found
    } catch (error: any) {
      if (error.response && error.response.status === 404) 
      {
        // If the user has not watched the content, return 'to_watch'
        return 'to_watch'
      }
      console.error('Error fetching user watched status:', error)
      return 'to_watch' // Default status in case of error
    }
  }

  // Set user watched status for content. It takes contentId, status and token as parameters. It returns a Promise of a string (the updated status)
  async setUserWatchedStatus(contentId: string, status: string, token: string): Promise<string>
  {
    if (status !== 'to_watch' && status !== 'watched') 
    {
      return "Invalid status"
    }

    const url = `https://api.fliverse.es/contents_user/${contentId}`

    try {
      const response = await axios.patch(url, { status }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 200 && response.data && response.data.status) 
      {
        return response.data.status
      }

      throw new Error('Unexpected response from server.')
    } catch (error: any) {
      if (error.response) 
      {
        if (error.response.status === 400) 
        {
          throw new Error(error.response.data?.error || 'Invalid request.')
        }
        if (error.response.status === 404) 
        {
          throw new Error('Association not found.')
        }
      }
      console.error('Error setting user watched status:', error)
      throw new Error('Error setting user watched status.')
    }
  }

  // Add user watched status for content. It takes token and contentId as parameters. It returns a Promise of a string (the status of the association)
  async createUserContentAssociation(token: string, contentId: string): Promise<string>
  {
    const url = `https://api.fliverse.es/contents_user`

    try {
      const response = await axios.post(url, { contentId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 201 && response.data) 
      {
        return response.data.status || 'to_watch' // Default to 'to_watch' if status is not provided
      }

      throw new Error('Unexpected response from server.')
    } catch (error: any) {
      if (error.response) 
      {
        if (error.response.status === 400) 
        {
          throw new Error(error.response.data?.error || 'Invalid request.')
        }
        if (error.response.status === 404) 
        {
          throw new Error(error.response.data?.error || 'Content not found.')
        }
      }
      throw new Error('Error creating user-content association.')
    }
  }

  // Get user watched contents. It takes token as parameter. It returns a Promise of an array of Content objects
  async getUserWatchedContents(token: string): Promise<Content[]>
  {
    const url = `https://api.fliverse.es/contents_user/watched`

    try{
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      let watchedContents: Content[] = []

      if (response.status === 200 && Array.isArray(response.data)) 
      {
        watchedContents = response.data.map((content: any) => ({
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
          keywords: content.keywords,
          watch_state: content.watch_state,
          user_rating: content.user_rating
        }))

        this.setWatchedContents(watchedContents)
      }

      return watchedContents
    }
    catch (error: any) {
      // No watched contents found
      if (error.response && error.response.status === 404)
      {
        this.setWatchedContents([])
      }

      console.error('Error fetching user watched contents:', error)
      this.setWatchedContents([])
      return []
    }
  }

}
