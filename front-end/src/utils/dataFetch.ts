

import axios from 'axios';

const CORS_URL = "https://cors-anywhere.herokuapp.com/";
const BASE_URL = "http://localhost:8000/project/";
const nAxios = axios.create({
    baseURL: `${BASE_URL}`,
    timeout: 0,
});

export const getData = (user: string, project: string) => {
    const url = `${user}/${project}`
    console.log(url)
    return nAxios.get(url)
}