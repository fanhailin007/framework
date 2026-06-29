<template>
  <login-container>
    <div class="login-container">
      <div class="login-form align-center">
        <img alt="" class="left-img" :src="leftImg" />
        <el-form ref="formRef" label-position="left" :model="form" :rules="rules" @submit.prevent>
          <div class="title">hello !</div>
          <div class="title-tips">{{ translate('欢迎来到') }} {{ title }}</div>
          <el-form-item prop="username">
            <el-input v-model.trim="form.username" v-focus clearable :placeholder="translate('请输入用户名')" type="text">
              <template #prefix>
                <vab-icon icon="user-line" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              ref="passwordRef"
              v-model.trim="form.password"
              clearable
              :placeholder="translate('请输入密码')"
              show-password
              :type="passwordType"
            >
              <template #prefix>
                <vab-icon icon="lock-line" />
              </template>
            </el-input>
          </el-form-item>
          <el-button v-throttle="handleLogin" class="login-btn" :loading="loading" type="primary">
            {{ translate('登录') }}
          </el-button>
          <router-link to="/password">
            <el-button style="margin-top: 20px" text type="primary">
              {{ translate('忘记密码') }}
            </el-button>
          </router-link>
        </el-form>
      </div>
    </div>
  </login-container>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules, InputInstance } from 'element-plus'
import leftImg from '/@/assets/login_images/left_img_1.png'
import { translate } from '/@/i18n'
import { useSettingsStore } from '/@/store/modules/settings'
import { useUserStore } from '/@/store/modules/user'
import { isPassword } from '/@/utils/validate'

defineOptions({
  name: 'Login',
})

interface FormType {
  username: string
  password: string
}

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const { title } = storeToRefs(settingsStore)
const login = (form: FormType) => userStore.login(form)
const loading = ref<boolean>(false)
const passwordType = ref<string>('password')
const redirect = ref<any>(undefined)
let timer: ReturnType<typeof setInterval>
const formRef = ref<FormInstance>()
const passwordRef = ref<InputInstance>()

const form = reactive<FormType>({
  username: '',
  password: '',
})

const validateUsername = (rule: any, value: any, callback: any) => {
  if ('' === value) callback(new Error(translate('用户名不能为空')))
  else callback()
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (isPassword(value)) {
    callback()
  } else {
    callback(new Error(translate('密码不能少于6位')))
  }
}

const rules = reactive<FormRules<FormType>>({
  username: [
    {
      required: true,
      trigger: 'blur',
      validator: validateUsername,
    },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePassword,
    },
  ],
})

const handleRoute = () => {
  return redirect.value === '/404' || redirect.value === '/403' ? '/' : redirect.value
}

const handleLogin = async () => {
  if (formRef.value)
    formRef.value?.validate(async (valid: any) => {
      if (valid)
        try {
          loading.value = true
          await login(form).catch(() => {
            loading.value = false
          })
          await router.push(handleRoute())
        } finally {
          loading.value = false
        }
    })
}
onBeforeMount(() => {
  form.username = 'admin'
  form.password = 'Password123!'
  // 为了演示效果，会在官网演示页自动登录到首页，正式开发可删除
  if (location.hostname.includes('vuejs-core')) {
    timer = setTimeout(() => {
      handleLogin()
    }, 1000 * 10)
  }
})

watchEffect(() => {
  redirect.value = (route.query && route.query.redirect) || '/'
})

onBeforeRouteLeave((to, from, next) => {
  try {
    if (timer) clearTimeout(timer)
  } catch {
    /* empty */
  }

  next()
})
</script>
