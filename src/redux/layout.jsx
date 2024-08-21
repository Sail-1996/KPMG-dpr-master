// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** ThemeConfig Import
import themeConfig from '@configs/themeConfig'

const initialMenuCollapsed = () => {
  const item = window.localStorage.getItem('menuCollapsed')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.menu.isCollapsed
}

const initialDirection = () => {
  const item = window.localStorage.getItem('direction')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.isRTL
}

const initialSkin = () => {
  const item = window.localStorage.getItem('skin')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.skin
}

const initialFooterType = () => {
  const item = window.localStorage.getItem('footerType')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.footer.type
}

const initialNavbarType = () => {
  const item = window.localStorage.getItem('navbarType')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.navbar.type
}

const initialNavbarColor = () => {
  const item = window.localStorage.getItem('navbarColor')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.navbar.backgroundColor
}

const initialContentWidth = () => {
  const item = window.localStorage.getItem('contentWidth')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.contentWidth
}

const initialMenuHidden = () => {
  const item = window.localStorage.getItem('menuHidden')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.menu.isHidden
}

export const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    skin: initialSkin(),
    isRTL: initialDirection(),
    layout: themeConfig.layout.type,
    lastLayout: themeConfig.layout.type,
    menuCollapsed: initialMenuCollapsed(),
    footerType: initialFooterType(),
    navbarType: initialNavbarType(),
    menuHidden: initialMenuHidden(),
    navbarColor: initialNavbarColor(),
    contentWidth: initialContentWidth()
  },
  reducers: {
    handleRTL: (state, action) => {
      state.isRTL = action.payload
      window.localStorage.setItem('direction', JSON.stringify(action.payload))
    },
    handleSkin: (state, action) => {
      state.skin = action.payload
      window.localStorage.setItem('skin', JSON.stringify(action.payload))
    },
    handleLayout: (state, action) => {
      state.layout = action.payload
    },
    handleFooterType: (state, action) => {
      state.footerType = action.payload
      window.localStorage.setItem('footerType', JSON.stringify(action.payload))
    },
    handleNavbarType: (state, action) => {
      state.navbarType = action.payload
      window.localStorage.setItem('navbarType', JSON.stringify(action.payload))
    },
    handleMenuHidden: (state, action) => {
      state.menuHidden = action.payload
      window.localStorage.setItem('menuHidden', JSON.stringify(action.payload))
    },
    handleLastLayout: (state, action) => {
      state.lastLayout = action.payload
    },
    handleNavbarColor: (state, action) => {
      state.navbarColor = action.payload
      window.localStorage.setItem('navbarColor', JSON.stringify(action.payload))
    },
    handleContentWidth: (state, action) => {
      state.contentWidth = action.payload
      window.localStorage.setItem('contentWidth', JSON.stringify(action.payload))
    },
    handleMenuCollapsed: (state, action) => {
      state.menuCollapsed = action.payload
      window.localStorage.setItem('menuCollapsed', JSON.stringify(action.payload))
    }
  }
})

export const {
  handleRTL,
  handleSkin,
  handleLayout,
  handleLastLayout,
  handleMenuHidden,
  handleNavbarType,
  handleFooterType,
  handleNavbarColor,
  handleContentWidth,
  handleMenuCollapsed
} = layoutSlice.actions

export default layoutSlice.reducer
