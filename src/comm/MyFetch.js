import axios from "axios";
import { API_BASE_URL,USE_AXIOS } from "../config/config";


export async function myFetch(endpoint, options={}){
 const url =`${API_BASE_URL}${endpoint}`;
 if(USE_AXIOS){
    const reponse = await axios({url, ...options});
    return reponse.data;
 }else{
    const response = await fetch(url, options);
    return await response.json();
 }

}
