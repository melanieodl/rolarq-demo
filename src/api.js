import axios from 'axios'


export default axios.create({
    baseURL: `http://3.15.173.137:8080/api/`
    // proxy: {
    //   host: "http://3.15.173.137:8080"
    // }
  })
