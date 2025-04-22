import axios from "axios"
import { AiFillOpenAI } from "react-icons/ai"
const BASE_URL='https://places.googleapis.com/v1/places:searchText'

const config={
    headers:{
        'Content-type':'application/json',
        'X-Goog-Api-Key':import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
        'X-Goog-FieldMask':[
            'places.photos',
            'places.displayName',
            'places.id'
        ]
    }
}


export const GetPlaceDetails=(data)=>axios.post(BASE_URL,data,config);
const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
export const PHOTO_URL = `https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=600&&maxWidthPx=800&key=${apiKey}`;
