// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: {
      data: []
    },
    latestNotification: {
      data: []
    },
    unreadNotification: 0
  },
  reducers: {
    notificationLoad: (state, action) => {
      state.notifications = action?.data
    },
    latestNotificationLoad: (state, action) => {
      state.latestNotification = action?.data
    },
    notificationSave: (state, action) => {
      state.notifications.data = [...action?.data, ...state?.notifications?.data]
    },
    notificationDelete: (state, action) => {
      const index = state.notifications.data.findIndex((x) => x.id === action.data)
      state.notifications.data.splice(index, 1)
    },
    notificationUpdate: (state, action) => {
      const index = state.notifications.data.findIndex((x) => x.id === action.data.id)
      state.notifications.data[index] = {
        ...state.notifications.data[index],
        ...action.data
      }
    },
    notificationUpdateLatest: (state, action) => {
      const index = state.latestNotification.data.findIndex((x) => x.id === action.data.id)
      state.latestNotification.data[index] = {
        ...state.latestNotification.data[index],
        ...action.data
      }
    },
    increaseUnreadNotification: (state, action) => {
      state.unreadNotification++
    },
    decreaseUnreadNotification: (state, action) => {
      state.unreadNotification--
    },
    setUnreadNotification: (state, action) => {
      state.unreadNotification = action?.data
    }
  }
})

export const {
  setUnreadNotification,
  decreaseUnreadNotification,
  increaseUnreadNotification,
  notificationDelete,
  notificationLoad,
  notificationSave,
  notificationUpdateLatest,
  notificationUpdate,
  latestNotificationLoad
} = notificationSlice.actions

export default notificationSlice.reducer
