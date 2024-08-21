import DprNavigation from '@src/modules/dpr/navigation'
// import MeetingNavigation from '@src/modules/meeting/navigation'

// ** Merge & Export
export default [
  // {
  //   header: 'Meeting Module'
  // },
  // ...MeetingNavigation,

  {
    header: 'dpr-connect'
  },
  // Dpr navigation integration
  ...DprNavigation
]
