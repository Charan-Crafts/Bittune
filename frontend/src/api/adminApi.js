import axios from "axios"

const adminApi = axios.create({
    baseURL :"http://localhost:8002/api/admin",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})

adminApi.interceptors.request.use((config)=>{
    let token = localStorage.getItem("token")

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
},(error)=>{
    return Promise.reject(error)
})

export default adminApi;