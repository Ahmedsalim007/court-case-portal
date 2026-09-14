import axiosInstance from './axiosIntance';


const login = ({ employeeId, password }) =>
  axiosInstance.post('/auth/login', { employeeId, password });

export const authApi = {
  login,
};