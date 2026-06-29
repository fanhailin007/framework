/**
 * @description 登录、获取用户信息、退出登录、清除token逻辑，不建议修改
 */
import { useAclStore } from './acl'
import { useSettingsStore } from './settings'
import { useTabsStore } from './tabs'
import { getUserInfo, login, logout } from '/@/api/user'
import { storage, tokenName, tokenTableName } from '/@/config'
import { normalizeLoginResponse, normalizeUserInfo, type NormalizedAuthInfo } from '/@/utils/authContract'
import { getToken, removeToken, setToken } from '/@/utils/token'
import { isArray, isString } from '/@/utils/validate'
import { gp } from '/@vab/plugins/vab'

const authInfoTableName = `${tokenTableName}-auth-info`
const getAuthStorage = () => (storage === 'sessionStorage' ? sessionStorage : localStorage)

export const useUserStore = defineStore('user', {
  state: (): UserModuleType => ({
    token: getToken() as string,
    username: '游客',
    avatar: './static/svg/avatar.svg',
  }),
  getters: {
    getToken: (state) => state.token,
    getUsername: (state) => state.username,
    getAvatar: (state) => state.avatar,
  },
  actions: {
    /**
     * @description 设置token
     * @param {*} token
     */
    setToken(token: string) {
      this.token = token
      setToken(token)
    },
    /**
     * @description 设置用户名
     * @param {*} username
     */
    setUsername(username: string) {
      this.username = username
    },
    /**
     * @description 设置头像
     * @param {*} avatar
     */
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    setCachedAuthInfo(authInfo: NormalizedAuthInfo) {
      getAuthStorage().setItem(authInfoTableName, JSON.stringify(authInfo))
    },
    getCachedAuthInfo() {
      const authInfo = getAuthStorage().getItem(authInfoTableName)
      return authInfo ? (JSON.parse(authInfo) as NormalizedAuthInfo) : null
    },
    removeCachedAuthInfo() {
      getAuthStorage().removeItem(authInfoTableName)
    },
    applyAuthInfo(authInfo: NormalizedAuthInfo) {
      const aclStore = useAclStore()
      const { username, avatar, roles, permissions } = authInfo
      if (username) this.setUsername(username)
      if (avatar) this.setAvatar(avatar)
      aclStore.setRole(roles)
      aclStore.setPermission(permissions)
    },
    /**
     * @description 登录拦截放行时，设置虚拟角色
     */
    setVirtualRoles() {
      const aclStore = useAclStore()
      aclStore.setFull(true)
      this.setUsername('admin(未开启登录拦截)')
      this.setAvatar('./static/svg/avatar.svg')
    },
    /**
     * @description 设置token并发送提醒
     * @param {string} token 更新令牌
     * @param {string} tokenName 令牌名称
     */
    afterLogin(token: string, tokenName: string) {
      const settingsStore = useSettingsStore()
      if (token) {
        this.setToken(token)
        const hour = new Date().getHours()
        const thisTime = hour < 8 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 18 ? '下午好' : '晚上好'
        gp.$baseNotify(`欢迎登录${settingsStore.title}`, `${thisTime}！`)
      } else {
        const err = `登录接口异常，未正确返回${tokenName}...`
        gp.$baseMessage(err, 'error', 'hey')
        throw err
      }
    },
    /**
     * @description 登录
     * @param {*} userInfo
     */
    async login(userInfo: any) {
      const response = await login(userInfo)
      const authInfo = normalizeLoginResponse(response)
      const token = authInfo.token || ''
      this.afterLogin(token, tokenName)
      if (authInfo.username || authInfo.avatar || authInfo.roles.length > 0 || authInfo.permissions.length > 0) {
        this.applyAuthInfo(authInfo)
        this.setCachedAuthInfo(authInfo)
      } else {
        // 兼容旧 mock 登录接口：/login 只返回 token，用户信息仍从 /userInfo 获取。
        await this.getUserInfo()
      }
    },
    /**
     * @description 获取用户信息接口 这个接口非常非常重要，如果没有明确底层前逻辑禁止修改此方法，错误的修改可能造成整个框架无法正常使用
     * @returns
     */
    async getUserInfo() {
      let authInfo: NormalizedAuthInfo | null = null
      try {
        const response = await getUserInfo()
        authInfo = response?.data ? normalizeUserInfo(response.data) : this.getCachedAuthInfo()
      } catch (error) {
        authInfo = this.getCachedAuthInfo()
        if (!authInfo) throw error
      }
      if (!authInfo) {
        const err = 'getUserInfo核心接口异常，请检查返回JSON格式是否正确'
        gp.$baseMessage(err, 'error', 'hey')
        throw err
      }
      const { username, avatar, roles, permissions } = authInfo
      /**
       * 检验返回数据是否正常，无对应参数，将使用默认用户名,头像,Roles和Permissions
       * username {String}
       * avatar {String}
       * roles {List}
       * ability {List}
       */
      if (
        (username && !isString(username)) ||
        (avatar && !isString(avatar)) ||
        (roles && !isArray(roles)) ||
        (permissions && !isArray(permissions))
      ) {
        const err = 'getUserInfo核心接口异常，请检查返回JSON格式是否正确'
        gp.$baseMessage(err, 'error', 'hey')
        throw err
      } else {
        this.applyAuthInfo(authInfo)
        this.setCachedAuthInfo(authInfo)
      }
    },
    /**
     * @description 退出登录
     */
    async logout() {
      await logout()
      await this.resetAll()
    },
    /**
     * @description 重置token、roles、permission、router、tabsBar等
     */
    async resetAll() {
      const aclStore = useAclStore()
      const tabsStore = useTabsStore()

      // 清除token
      await removeToken(storage)
      this.setToken('')

      // 清空权限和角色
      await aclStore.setPermission([])
      await aclStore.setFull(false)
      await aclStore.setRole([])

      // 清除tabs
      await tabsStore.delAllVisitedRoutes()

      // 清除localStorage中的相关缓存
      if (storage === 'localStorage') {
        // 只移除用户相关数据，不影响主题等设置
        localStorage.removeItem('caughtRoutes')
      }
      this.removeCachedAuthInfo()

      // 重置用户信息
      this.setUsername('游客')
      this.setAvatar('./static/svg/avatar.svg')
    },
  },
})
