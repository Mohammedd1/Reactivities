import axios, { AxiosError, AxiosResponse } from 'axios';
// import { request } from 'http';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Activity, ActivityFormValues } from '../models/activity';
import { store } from '../stores/store';
import { User, UserFormValues } from '../models/user';
import { Photo, Profile } from '../models/profile';


//Method to add some sleep to show loading
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

//Sending up the token with request
axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config;
})
//axios feature, every time we recieve a response come from our api we can do something with the response.
axios.interceptors.response.use(async response => {
    // try {
    //     await sleep(1000);
    //     return response;
    // }
    // catch (error) {
    //     console.log(error);
    //     return await Promise.reject(error);
    // }
    await sleep(1000);
    return response;
}, (error: AxiosError) => {
    const { data, status, config } = error.response!;

    switch (status) {
        case 400:
            //showing toastify notes label
            //toast.error('bad request');
            if (typeof data === 'string') {
                toast.error(data);
            }
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {

                history.push('/not-found');
            }

            if (data.errors) {
                //variable to store the different errors
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                //flat:to flatten the array
                throw modalStateErrors.flat();
            }
            // else{
            //     toast.error(data);
            // }
            break;
        case 401:
            toast.error('unauthorzied');
            break;
        case 404:
            //toast.error('not found');
            //make sure you bring the history from  index.tsx
            history.push('/not-found');
            break;
        case 500:
            // toast.error('server error');
            store.commonStore.setServerError(data);
            history.push('/server-error');
            break;
    }
    return Promise.reject(error);
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
    create: (activity: ActivityFormValues) => requests.post<void>('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

//195
const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    //203
    uploadPhoto:(file:Blob)=>{
        let formData= new FormData();
        formData.append('File',file);
        return axios.post<Photo>('photos',formData,{
            headers:{'Content-type':'multipart/form-data'}
        })
    },
    //204
    setMainPhoto:(id:string) => requests.post(`/photos/${id}/setMain`,{}),
    deletePhoto:(id:string) => requests.del(`/photos/${id}`),
    updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`,profile)//207
}

const agent = {
    Activities,
    Account,
    Profiles //195
}

//using this to access our activities request
export default agent;
