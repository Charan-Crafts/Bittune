import axios from "axios"

const authApi = axios.create({
    baseURL : "http://localhost:8001/api/auth",
    headers:{
        "Content-Type":"application/json"
    }
})
authApi.interceptors.request.use((config)=>{

    const token = localStorage.getItem("token");

    if(token){
        config.headers["Authorization"] = `Bearer ${token}`
    }

    return config;
},(error)=>{
    return Promise.reject(error)
})

export default authApi;