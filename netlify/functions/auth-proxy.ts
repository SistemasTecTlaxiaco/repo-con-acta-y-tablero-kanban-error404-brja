import type { Handler } from '@netlify/functions';
import axios from 'axios';

const API_URL = 'https://greentech-hub1-2.onrender.com/api';

export const handler: Handler = async (event) => {
  try {
    const url = `${API_URL}${event.path.replace('/.netlify/functions/auth', '')}`;

    const method = event.httpMethod.toLowerCase() as 'get' | 'post' | 'put' | 'delete';
    const headers = { ...event.headers };
    delete headers.host; // Elimina host para evitar problemas

    let data = event.body ? JSON.parse(event.body) : undefined;

    const response = await axios({
      url,
      method,
      headers,
      data
    });

    return {
      statusCode: response.status,
      body: JSON.stringify(response.data)
    };
  } catch (error: any) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ message: error.message })
    };
  }
};
