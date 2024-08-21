// do not remove
export type PermissionType = {
  action: string
  resource: string
  belongs_to?: any
}
export const Permissions = Object.freeze({
  // Dashboard
  dashboardBrowse: {
    action: 'dashboard-browse',
    resource: 'dashboard',
    belongs_to: 3
  },
  // User //
  userBrowse: {
    action: 'user-browse',
    resource: 'user',
    belongs_to: 3
  },
  userRead: {
    action: 'user-read',
    resource: 'user',
    belongs_to: 3
  },
  userEdit: {
    action: 'user-edit',
    resource: 'user',
    belongs_to: 3
  },
  userCreate: {
    action: 'user-add',
    resource: 'user',
    belongs_to: 3
  },
  userDelete: {
    action: 'user-delete',
    resource: 'user',
    belongs_to: 3
  },
  // Role //
  roleBrowse: {
    action: 'role-browse',
    resource: 'role',
    belongs_to: 3
  },
  roleRead: {
    action: 'role-read',
    resource: 'role',
    belongs_to: 3
  },
  roleEdit: {
    action: 'role-edit',
    resource: 'role',
    belongs_to: 3
  },
  roleCreate: {
    action: 'role-add',
    resource: 'role',
    belongs_to: 3
  },
  roleDelete: {
    action: 'role-delete',
    resource: 'role',
    belongs_to: 3
  },
  // Notification
  notificationsBrowse: {
    action: 'notifications-browse',
    resource: 'notifications',
    belongs_to: 3
  },
  notificationsRead: {
    action: 'notifications-read',
    resource: 'notifications',
    belongs_to: 3
  },
  notificationsEdit: {
    action: 'notifications-edit',
    resource: 'notifications',
    belongs_to: 3
  },
  notificationsCreate: {
    action: 'notifications-add',
    resource: 'notifications',
    belongs_to: 3
  },
  notificationsDelete: {
    action: 'notifications-delete',
    resource: 'notifications',
    belongs_to: 3
  },
  // Organization //
  organizationsBrowse: {
    action: 'organizations-browse',
    resource: 'organizations',
    belongs_to: 3
  },
  organizationsRead: {
    action: 'organizations-read',
    resource: 'organizations',
    belongs_to: 3
  },
  organizationsEdit: {
    action: 'organizations-edit',
    resource: 'organizations',
    belongs_to: 3
  },
  organizationsCreate: {
    action: 'organizations-add',
    resource: 'organizations',
    belongs_to: 3
  },
  organizationsDelete: {
    action: 'organizations-delete',
    resource: 'organizations',
    belongs_to: 3
  },
  // Project //
  projectBrowse: {
    action: 'project-browse',
    resource: 'project',
    belongs_to: 3
  },
  projectRead: {
    action: 'project-read',
    resource: 'project',
    belongs_to: 3
  },
  projectEdit: {
    action: 'project-edit',
    resource: 'project',
    belongs_to: 3
  },
  projectCreate: {
    action: 'project-add',
    resource: 'project',
    belongs_to: 3
  },
  projectDelete: {
    action: 'project-delete',
    resource: 'project',
    belongs_to: 3
  },
  // Vendor //
  vendorBrowse: {
    action: 'vendor-browse',
    resource: 'vendor',
    belongs_to: 3
  },
  vendorRead: {
    action: 'vendor-read',
    resource: 'vendor',
    belongs_to: 3
  },
  vendorEdit: {
    action: 'vendor-edit',
    resource: 'vendor',
    belongs_to: 3
  },
  vendorCreate: {
    action: 'vendor-add',
    resource: 'vendor',
    belongs_to: 3
  },
  vendorDelete: {
    action: 'vendor-delete',
    resource: 'vendor',
    belongs_to: 3
  },
  // WorkPack //
  workpackBrowse: {
    action: 'workpack-browse',
    resource: 'workpack',
    belongs_to: 3
  },
  workpackRead: {
    action: 'workpack-read',
    resource: 'workpack',
    belongs_to: 3
  },
  workpackEdit: {
    action: 'workpack-edit',
    resource: 'workpack',
    belongs_to: 3
  },
  workpackCreate: {
    action: 'workpack-add',
    resource: 'workpack',
    belongs_to: 3
  },
  workpackDelete: {
    action: 'workpack-delete',
    resource: 'workpack',
    belongs_to: 3
  },
  // Interface //
  interfaceBrowse: {
    action: 'interface-browse',
    resource: 'interface',
    belongs_to: 3
  },

  // DPR Management //
  configBrowseAdmin: {
    action: 'dpr-config-browse',
    resource: 'dpr-management',
    belongs_to: 3
  },
  dprConfig: {
    action: 'dpr-config',
    resource: 'dpr-management',
    belongs_to: 3
  },
  //   dprConfig: {
  //     action: 'dpr-config',
  //     resource: 'dpr-management',
  //     belongs_to: 3
  //   },
  //   dprConfig: {
  //     action: 'dpr-config',
  //     resource: 'dpr-management',
  //     belongs_to: 3
  //   },
  //   dprConfig: {
  //     action: 'dpr-config',
  //     resource: 'dpr-management',
  //     belongs_to: 3
  //   },
  // Report //
  reportBrowse: {
    action: 'report-browse',
    resource: 'report',
    belongs_to: 3
  },
  // Profile //
  profileBrowse: {
    action: 'profile-browse',
    resource: 'profile',
    belongs_to: 3
  },
  profileRead: {
    action: 'profile-read',
    resource: 'profile',
    belongs_to: 3
  },
  profileEdit: {
    action: 'profile-edit',
    resource: 'profile',
    belongs_to: 3
  },
  profileCreate: {
    action: 'profile-add',
    resource: 'profile',
    belongs_to: 3
  },
  // App Setting //
  settingBrowse: {
    action: 'app-setting-browse',
    resource: 'app-setting',
    belongs_to: 3
  },
  // StandAlone Permission //
  mapEdit: {
    action: 'dpr-map',
    resource: 'dpr-management',
    belongs_to: 3
  },
  logEdit: {
    action: 'dpr-log',
    resource: 'dpr-management',
    belongs_to: 3
  },
  directEdit: {
    action: 'dpr-direct',
    resource: 'interface',
    belongs_to: 3
  },
  importEdit: {
    action: 'dpr-import',
    resource: 'interface',
    belongs_to: 3
  },

  // Audit logs
  logsBrowse: {
    action: 'dpr-audit-browse',
    resource: 'dpr-audit',
    belongs_to: 1
  },

  // Item Description
  itemDescriptionBrowse: {
    action: 'item-desc-browse',
    resource: 'item-desc',
    belongs_to: 3
  },
  itemDescriptionRead: {
    action: 'item-desc-read',
    resource: 'item-desc',
    belongs_to: 3
  },
  itemDescriptionEdit: {
    action: 'item-desc-edit',
    resource: 'item-desc',
    belongs_to: 3
  },
  itemDescriptionCreate: {
    action: 'item-desc-add',
    resource: 'item-desc',
    belongs_to: 3
  },
  itemDescriptionDelete: {
    action: 'item-desc-delete',
    resource: 'item-desc',
    belongs_to: 3
  }
})
