<template>
  <div class="login-container no-background-container">
    <div class="login-wrapper">
      <div class="login-box">
        <div class="login-left">
          <div class="brand">
            <div class="logo">
              <vab-icon icon="shopping-bag-line" />
            </div>
            <h2>Vue-Shop-Vite</h2>
          </div>

          <div class="welcome">
            <h1>欢迎回来</h1>
            <p>请登录您的账户以继续使用</p>
          </div>

          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" class="custom-input" clearable placeholder="用户名或邮箱地址" :prefix-icon="User" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                class="custom-input"
                placeholder="密码"
                :prefix-icon="Lock"
                show-password
                type="password"
                @keyup.enter="handleLogin"
              />
            </el-form-item>

            <div class="login-options">
              <el-checkbox v-model="rememberMe" size="small">记住我</el-checkbox>
              <el-link type="primary" :underline="false" @click="handleForgotPassword">忘记密码？</el-link>
            </div>

            <el-form-item>
              <el-button class="login-button" :loading="loading" size="large" type="primary" @click="handleLogin">登录账户</el-button>
            </el-form-item>
          </el-form>

          <div class="divider">
            <span>其他登录方式</span>
          </div>

          <div class="social-login">
            <el-tooltip content="微信登录" placement="top">
              <div class="social-btn wechat" @click="socialLogin('wechat')">
                <vab-icon icon="wechat-line" />
              </div>
            </el-tooltip>

            <el-tooltip content="QQ登录" placement="top">
              <div class="social-btn qq" @click="socialLogin('qq')">
                <vab-icon icon="qq-line" />
              </div>
            </el-tooltip>

            <el-tooltip content="GitHub登录" placement="top">
              <div class="social-btn github" @click="socialLogin('github')">
                <vab-icon icon="github-line" />
              </div>
            </el-tooltip>

            <el-tooltip content="微博登录" placement="top">
              <div class="social-btn weibo" @click="socialLogin('weibo')">
                <vab-icon icon="weibo-line" />
              </div>
            </el-tooltip>
          </div>
        </div>

        <div class="login-right">
          <div class="overlay">
            <div class="overlay-content">
              <div class="animation-content">
                <vab-icon icon="vite" :is-custom-svg="true" />
              </div>
              <h2>Vue-Shop-Vite</h2>
              <p>新一代高性能、高可用中后台解决方案</p>
              <div class="features">
                <div class="feature-item">
                  <vab-icon class="feature-icon" icon="check-line" />
                  <span>高效性能，极速响应</span>
                </div>
                <div class="feature-item">
                  <vab-icon class="feature-icon" icon="check-line" />
                  <span>安全可靠，易于扩展</span>
                </div>
                <div class="feature-item">
                  <vab-icon class="feature-icon" icon="check-line" />
                  <span>多层保障，灵活适配</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="register-section">
        <span>还没有账户？</span>
        <el-link type="primary" :underline="false" @click="handleRegister">立即注册</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const loginForm = reactive({
  username: 'admin',
  password: '123456',
})

const loginRules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
})

const loading = ref(false)
const loginFormRef = ref<FormInstance>()
const router = useRouter()
const rememberMe = ref(false)

const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      // 模拟登录
      setTimeout(() => {
        loading.value = false
        $baseMessage('登录成功', 'success', 'hey')
        router.push('/')
      }, 1000)
    }
  })
}

const handleForgotPassword = () => {
  $baseMessage('忘记密码功能', 'success', 'hey')
}

const handleRegister = () => {
  $baseMessage('注册功能', 'success', 'hey')
}

const socialLogin = (type: string) => {
  $baseMessage(`使用 ${type} 登录`, 'success', 'hey')
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;

  .login-wrapper {
    width: 100%;
    max-width: 1200px;

    .login-box {
      display: flex;
      min-height: 600px;
      overflow: hidden;
      border: 1px solid var(--el-border-color);
      border-radius: 20px;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);

      .login-left {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 60px 50px;

        .brand {
          display: flex;
          align-items: center;
          margin-bottom: 40px;

          .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            margin-right: 15px;
            background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-dark-2) 100%);
            border-radius: 12px;

            [class*='ri-'] {
              font-size: 24px;
              color: white;
            }
          }

          h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-dark-2) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }

        .welcome {
          margin-bottom: 40px;

          h1 {
            margin: 0 0 10px 0;
            font-size: 32px;
            font-weight: 700;
            color: var(--el-color-black);
          }

          p {
            margin: 0;
            font-size: 16px;
            color: var(--el-color-grey);
          }
        }

        .custom-input {
          :deep(.el-input__wrapper) {
            padding: 10px 15px;
            border-radius: 12px;
          }
        }

        .login-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 15px 0 25px;

          :deep(.el-checkbox__label) {
            color: var(--el-color-grey);
          }

          .el-link {
            font-size: 14px;
          }
        }

        .login-button {
          width: 100%;
          height: 50px;
          margin-top: 10px;
          font-size: 16px;
          font-weight: 500;
          background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-dark-2) 100%);
          border: none;
          border-radius: 12px;
        }

        .divider {
          position: relative;
          display: flex;
          align-items: center;
          margin: 30px 0;
          color: var(--el-color-grey);
          text-align: center;

          &::before,
          &::after {
            flex: 1;
            content: '';
            border-bottom: 1px solid #eee;
          }

          span {
            padding: 0 15px;
            font-size: 14px;
          }
        }

        .social-login {
          display: flex;
          gap: 25px;
          justify-content: center;

          .social-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            cursor: pointer;
            border-radius: 50%;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;

            .vab-icon {
              font-size: 20px;
            }

            &.wechat {
              color: white;
              background-color: #07c160;

              &:hover {
                background-color: #06ad56;
                box-shadow: 0 6px 15px rgba(7, 193, 96, 0.3);
                transform: translateY(-3px);
              }
            }

            &.qq {
              color: white;
              background-color: #12b7f5;

              &:hover {
                background-color: #0ea5db;
                box-shadow: 0 6px 15px rgba(18, 183, 245, 0.3);
                transform: translateY(-3px);
              }
            }

            &.github {
              color: white;
              background-color: #333;

              &:hover {
                background-color: #222;
                box-shadow: 0 6px 15px rgba(51, 51, 51, 0.3);
                transform: translateY(-3px);
              }
            }

            &.weibo {
              color: white;
              background-color: #e6162d;

              &:hover {
                background-color: #cd132d;
                box-shadow: 0 6px 15px rgba(230, 22, 45, 0.3);
                transform: translateY(-3px);
              }
            }
          }
        }
      }

      .login-right {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40%;
        background: linear-gradient(to top, var(--el-color-primary), var(--el-color-primary-light-3));

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding: 40px;

          .overlay-content {
            color: white;
            text-align: center;

            .animation-content {
              display: flex;
              justify-content: center;
              margin-bottom: 20px;

              svg {
                width: 120px;
                height: 120px;
              }
            }

            h2 {
              margin-bottom: 15px;
              font-size: 28px;
              font-weight: 700;
            }

            p {
              margin-bottom: 30px;
              font-size: 16px;
              opacity: 0.9;
            }

            .features {
              text-align: center;

              .feature-item {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 15px;
                font-size: 15px;

                .feature-icon {
                  margin-right: 10px;
                  font-size: 18px;
                  color: #6affa8;
                }
              }
            }
          }
        }
      }
    }

    .register-section {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 25px;
      font-size: 15px;
      color: #666;
      text-align: center;

      .el-link {
        margin-left: 10px;
      }
    }
  }
}

@media (max-width: 992px) {
  .login-container {
    .login-wrapper {
      .login-box {
        .login-right {
          display: none;
        }

        .login-left {
          padding: 40px 30px;
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes drawPath {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes twinkle {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 576px) {
  .login-container {
    padding: 10px;

    .login-wrapper {
      .login-box {
        .login-left {
          padding: 30px 20px;

          .brand {
            margin-bottom: 30px;
          }

          .welcome {
            margin-bottom: 30px;

            h1 {
              font-size: 26px;
            }
          }

          .social-login {
            gap: 15px;

            .social-btn {
              width: 45px;
              height: 45px;
            }
          }
        }
      }

      .register-section {
        margin-top: 20px;
      }
    }
  }
}
</style>
