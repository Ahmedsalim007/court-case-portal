import axiosInstance from './axiosIntance';




const getUser = (employeeId) =>
    axiosInstance.get(`/getAccount/${employeeId}`);
const getUsers = () => 
  axiosInstance.get('/user/getUsers');
;
const createUser = ({ employeeId, fullName, password, role }) => 
  axiosInstance.post('/user/createAccount', {
    employeeId,
    fullName,
    password,
    role
  });

  const deleteUser = (employeeId) =>
    axiosInstance.delete(`/user/deleteAccount/${employeeId}`)
;




  export const userApi = {
    getUsers,
    createUser,
    getUser,
    deleteUser
  }