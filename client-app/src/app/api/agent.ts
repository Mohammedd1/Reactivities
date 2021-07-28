import axios, { AxiosResponse } from 'axios';
import { Activity } from '../models/activity';

//Method to add some sleep to show loading
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

//axios feature, every time we recieve a response come from our api we can do something with the response.
axios.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response;
    }
    catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})
// const responseBody = (response: AxiosResponse)=> response.data;
//make response a generic type
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

//object to store a common requests we gonna to make against axios
const requests = {
    //body:{} --> body with type object
    // get: (url: string) => axios.get(url).then(responseBody),
    // post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    // put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    // del: (url: string) => axios.delete(url).then(responseBody),

    //Generic type
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),

}

//object to store a requests of our activities
const Activities = {
    // list: () => requests.get('/activities')
    //specifying the type
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => axios.post<void>('/activities',activity),
    update: (activity: Activity) => axios.put<void>(`/activities/${activity.id}`,activity),
    delete: (id: string) => axios.delete<void>(`/activities/${id}`),
}

const agent = {
    Activities
}

//using this to access our activities request
export default agent;
