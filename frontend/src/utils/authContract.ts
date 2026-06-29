type LoginPayload = {
  password?: string
  userId?: string
  username?: string
  [key: string]: any
}

type RoleLike = {
  roleCode?: string
  roleName?: string
  name?: string
}

type UserLike = {
  avatar?: string
  displayName?: string
  id?: number
  role?: string
  userId?: string
  username?: string
}

export type NormalizedAuthInfo = {
  avatar?: string
  id?: number
  permissions: string[]
  refreshToken?: string
  roles: string[]
  token?: string
  username?: string
}

const normalizeRoles = (roles: Array<RoleLike | string> | undefined): string[] => {
  if (!Array.isArray(roles)) return []
  return [
    ...new Set(
      roles.flatMap((role) => {
        if (typeof role === 'string') return [role]
        return [role.roleCode, role.roleName, role.name].filter(Boolean)
      })
    ),
  ] as string[]
}

export const normalizeLoginPayload = (data: LoginPayload) => {
  const { username, ...payload } = data
  return {
    ...payload,
    userId: data.userId || username,
  }
}

export const normalizeUserInfo = (data: any): NormalizedAuthInfo => {
  const user: UserLike = data?.user || data || {}
  return {
    id: typeof user.id === 'number' ? user.id : data?.id,
    username: user.displayName || user.username || user.userId || data?.username,
    avatar: user.avatar || data?.avatar,
    roles: normalizeRoles([...(Array.isArray(data?.roles) ? data.roles : []), user.role].filter(Boolean)),
    permissions: Array.isArray(data?.permissions) ? data.permissions : [],
  }
}

export const normalizeLoginResponse = (response: any): NormalizedAuthInfo => {
  const data = response?.data || response
  return {
    ...normalizeUserInfo(data),
    token: data?.token || data?.accessToken,
    refreshToken: data?.refreshToken,
  }
}
