import axios from "axios";
import { API_BASE_URL, USE_AXIOS } from "../config/config";

export async function myFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  if (USE_AXIOS) {
    const response = await axios({
      url, 
      ...options,
      withCredentials: true // Important pour les sessions
    });
    return response.data;
  } else {
    // Ajouter credentials pour fetch
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Important pour les sessions
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
}