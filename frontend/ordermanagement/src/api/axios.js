import axios from 'axios';

const  baseURL = "http://localhost:7070/";

const instance = axios.create({baseURL});

export default instance;
