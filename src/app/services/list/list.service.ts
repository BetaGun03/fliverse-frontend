import { Injectable } from '@angular/core';
import axios from 'axios';
import { List } from '../../interfaces/list';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  private userLists: List[] = []

  constructor() { }

  // Function to get the current user lists. Returns an array of List objects
  getLists(): List[]
  {
    return this.userLists
  }

  // Function to set user lists. Accepts an array of List objects
  setLists(lists: List[]): void
  {
    this.userLists = lists
  }

  // Function to get user lists from the API. Returns an array of List objects
  async getUserLists(token: string): Promise<List[]> 
  {
    const url = `https://api.fliverse.es/lists`

    if (!token) 
    {
      return []
    }

    try{
      const response = await axios.get<any[]>(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const lists: List[] = response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
      }))

      this.setLists(lists)
      return lists
    }
    catch (error) {
      return []
    }
  }

  // Function to create a new list. Returns the created List object or null if the creation fails
  async createList(token: string, name: string, description: string): Promise<List | null>
  {
    const url = `https://api.fliverse.es/lists`

    if (!token) 
    {
      return null
    }

    try{
      const response = await axios.post<any>(url, {
        name: name,
        description: description
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      let list: List = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        creation_date: new Date(response.data.creation_date)
      }

      this.userLists.push(list)
      return list
    }
    catch (error) {
      return null
    }
  }

  // Function to add content to a user's list. Returns true if successful, false otherwise
  async addContentToList(token: string, listId: number, contentId: number): Promise<boolean>
  {
    const url = `https://api.fliverse.es/lists/${listId}/contents`

    if (!token) 
    {
      return false
    }

    try{
      const response = await axios.post(url, {
        contentId: contentId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if(response.status === 200 || response.status === 201)
      {
        return true
      }
      else
      {
        return false
      }
    }
    catch (error) {
      return false
    }
  }
}
