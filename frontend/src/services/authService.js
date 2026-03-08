import authApi from "../api/userApi"

export const login = async(data)=>{
    
    const res = await authApi.post("/login",data);

    return res;
}

export const register = async(data)=>{

    const res = await authApi.post("/register",data)

    return res;
}

export const logout = async()=>{

    const res =await authApi.post("/logout");

    return res;
}

export const getProfile = async()=>{

    const res  = await authApi.get("/profile");

    return res;
}
