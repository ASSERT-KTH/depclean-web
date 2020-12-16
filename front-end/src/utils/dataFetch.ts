

import axios from 'axios';

const CORS_URL = "https://cors-anywhere.herokuapp.com/";
const BASE_URL = "http://51.145.133.202:8081/project/";
const nAxios = axios.create({
    baseURL: `${CORS_URL}${BASE_URL}`,
    timeout: 0,
});

export const getData = (user: string, project: string) => {
    const url = `${user}/${project}`
    return nAxios.get(url)
}