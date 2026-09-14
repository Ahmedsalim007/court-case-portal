import axiosInstance from "./axiosIntance";

const getCaseStats = ()=> axiosInstance.get('/cases/stats')


export const statsApi = {
    getCaseStats
}