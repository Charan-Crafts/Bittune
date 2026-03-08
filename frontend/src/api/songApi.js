import axios from 'axios'

const songApi = axios.create({
    baseURL:"http://localhost:8003/api/songs",
    headers:{
        "Content-Type":"application/json"
    }
})

songApi.interceptors.request.use((config)=>{
    let token = localStorage.getItem("token")

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
},(error)=>{
    return Promise.reject(error)
})

export default songApi;