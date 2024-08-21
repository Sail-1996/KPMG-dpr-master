// ** Reducers Imports
import { MeetingExampleRTK } from './RTKQuery/Example'

const meetingReducers = {
  // RTK
  [MeetingExampleRTK.reducerPath]: MeetingExampleRTK.reducer
}
const meetingMiddleware = [MeetingExampleRTK.middleware]

export { meetingReducers, meetingMiddleware }
