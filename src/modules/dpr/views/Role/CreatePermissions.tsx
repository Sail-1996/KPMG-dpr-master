import { useEffect, useState } from 'react'
import { Permissions } from '@src/utility/Permissions'

const CreatePermissions = () => {
  const [per, setPer] = useState<any>(null)
  useEffect(() => {
    const re: any[] = []
    for (const key in Permissions) {
      type OnlyKeys = keyof typeof Permissions
      const k = key as OnlyKeys
      if (Object.prototype.hasOwnProperty.call(Permissions, key)) {
        const element = Permissions[k]
        re.push(
          <>
            {`Permission::create(['name' => '${element?.action}', 'guard_name' => 'api', 'group_name' => '${element?.resource}', 'se_name' => '${element?.action}', 'belongs_to' => '${element?.belongs_to}']);`}
            {'\n'}
          </>
        )
      }
    }
    setPer(re)
  }, [])

  return (
    <pre>
      <code>{per}</code>
    </pre>
  )
}
export default CreatePermissions
