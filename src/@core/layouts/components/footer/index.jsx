// ** Icons Import
import useUser from '@hooks/useUser'
import themeConfig from '@src/configs/themeConfig'

const Footer = () => {
  const appData = useUser()
  return (
    <p className='clearfix mb-0'>
      <span
        className='float-md-start d-block d-md-inline-block mt-25'
        style={{
          fontSize: '0.8rem'
        }}
      >
        {/* <BsPopover
          content={themeConfig.app.copyrightFull}
          trigger='hover'
          placement='top'
          popperClassName='long-popup'
        > */}
        {appData?.disclaimer_text}
        {/* {appData?.disclaimer_text ?? (
          <span className=''>
            © {new Date().getFullYear()} KPMG Assurance and Consulting Services LLP, an Indian
            Limited Liability Partnership and a member firm of the KPMG global organization of
            independent member firms affiliated with KPMG International Limited, a private English
            company limited by guarantee.
            <span className='d-none d-sm-inline-block'> All rights Reserved</span>
          </span>
        )} */}
        {/* </BsPopover> */}
      </span>
      {/* <span className='float-md-end d-none d-md-block'>
        Hand-crafted & Made with
        <Heart size={14} />
      </span> */}
    </p>
  )
}

export default Footer
