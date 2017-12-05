import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.API_URL,
  headers: {'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY}
});

export default instance;
