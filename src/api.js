import axios from 'axios'


export default axios.create({
    baseURL: `/api/`,
    proxy: {
      host: "http://3.15.173.137:8080"
    }
  })
