import axios from 'axios'

export const httpClient = axios.create()
delete httpClient.defaults.headers.post['Content-Type']
delete httpClient.defaults.headers.common['Accept']

export default httpClient