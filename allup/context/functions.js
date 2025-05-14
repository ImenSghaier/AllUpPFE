import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const url = "http://192.168.126.205:4000";

export async function refreshToken() {
  
    const token = await AsyncStorage.getItem('token');
  return  axios.create({
      baseURL: url,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }, 
    }); 
}