import axios from 'axios';
import Cookies from 'js-cookie'


//localhost
const Url = {
    Url0: "http://localhost:8080/api/userService",

    Url1: axios.create({ //userService
        baseURL: 'http://localhost:8080/api/userService/',
        headers: {"x-auth":Cookies.get('token')}
    }),
    
    Url2: axios.create({ //productService
        baseURL: 'http://localhost:8081/api/productService/',
        headers: {"x-auth":Cookies.get('token')}
    }),

    Url3: axios.create({ //orderService
        baseURL: 'http://localhost:8082/api/orderService/',
        headers: {"x-auth":Cookies.get('token')}
    }),
}
// axios.defaults.headers.common['x-auth'] = 

export default Url;
