import axios from 'axios'


export default axios.create({
    baseURL: `/api/`,
    proxy: {
      host: "http://localhost:8080"
    }
  })
