//@flow

import axios from 'axios'

export const httpClient = axios.create()
//$FlowIssue
delete httpClient.defaults.headers.post['Content-Type']
//$FlowIssue
delete httpClient.defaults.headers.common['Accept']

export default httpClient