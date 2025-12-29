import {create} from 'zustand'
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';


const BaseURL = "http://localhost:5000"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    sockek: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check-auth")

            console.log("Refresh authCheck: ", res.data)

            set({authUser: res.data})

            get().connectSocket()
        } catch (error) {
            console.log("this is there error: ", error)
        } finally {
            set({isCheckingAuth: false})
        }
    },

    signup: async (data) => {
        set({isSigningUp: true})
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({authUser: res.data})
            toast.success("Successfully signed up")

            get().connectSocket()
        } catch (error) {
            console.log("this is there error: ", error)
            toast.error(error.response.data.message)
        } finally {
            set({isSigningUp: false})
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser: null})
            toast.success("Successfully logged out")

            get().disconnectSocket()
        } catch (error) { 
            toast.error(error.response.data.message)
        }
    },

    login: async (data) => {
        set({isLoggingIn: true})
        try {
            const res = await axiosInstance.post("/auth/login", data)
            console.log("Login Response Data:", res.data);
            set({authUser: res.data})
            toast.success("Successfully logged in")

            get().connectSocket()
        } catch (error) {
            console.log("error ", error)
            toast.error(error.response.data.message)
        } finally {
            set({isLoggingIn: false})
        }
    },

    updateProfile: async (data) => {
        set({isUpdatingProfile: true})
        try {
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({authUser: res.data})
            toast.success("Successfully updated profile")
        } catch (error) {
            console.log("error ", error)
            toast.error(error.response.data.message)
        } finally {
            set({isUpdatingProfile: false})
        }
    },
    
    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().sockek?.connected) return;

        const socket = io(BaseURL, {
            query: {
                userId: authUser._id
            }
        })
        socket.connect()
        set({ socket: socket})

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds})
        })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }

}))