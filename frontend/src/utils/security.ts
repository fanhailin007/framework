const _0x4f2a = (str: string): number => str.length
const _0x7b3c = (val: any): boolean => typeof val === 'string'
const _0x9d1e = (env: string): any => import.meta.env[env]

const _0x2e8f = (condition: boolean): void => {
  if (!condition) {
    const _0x5a4b = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: Arial, sans-serif;
        background: linear-gradient(135deg, #46CCFF 0%, #BD34FE 100%);
        color: #333;
      ">
        <div style="
          text-align: center;
          padding: 40px;
          background: rgba(255,255,255,0.95);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        ">
          <div style="
            width: 60px;
            height: 60px;
            margin: 0 auto 20px;
            background: #e74c3c;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
          ">⚠️</div>
          <div style="
            margin-top: 20px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
            font-size: 12px;
            color: #6c757d;
          ">
            非法破解: ${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(Math.random() * 999) + 1}<br>
            时间: ${new Date().toLocaleString()}
          </div>
        </div>
      </div>
    `

    document.body.innerHTML = _0x5a4b

    let _0x9f2d = false
    let _0x4c7e: any = 0

    const _0x8b3a = () => {
      if (_0x9f2d) {
        location.reload()
        return
      }

      const _0x2d1f = new Date()
      const _0x7e4c = _0x2d1f.getTime()

      const _0x5f8a = new Date()
      const _0x3b9c = _0x5f8a.getTime()

      if (_0x3b9c - _0x7e4c > 100) {
        _0x9f2d = true
        _0x4c7e = setInterval(() => {
          location.reload()
        }, 100)
      }
    }

    const _0x6d2e = () => {
      if (_0x9f2d) {
        clearInterval(_0x4c7e)
        _0x9f2d = false
      }
    }

    setInterval(_0x8b3a, 1000)

    window.addEventListener('resize', _0x6d2e)
    window.addEventListener('focus', _0x6d2e)
    window.addEventListener('blur', _0x6d2e)

    const _0x1a4b = () => {
      _0x9f2d = true
      _0x4c7e = setInterval(() => {
        location.reload()
      }, 100)
    }

    const _0x5e7c = () => {
      if (_0x9f2d) {
        clearInterval(_0x4c7e)
        _0x9f2d = false
      }
    }

    let _0x3f8d = 0
    const _0x9b2a = () => {
      _0x3f8d++
      if (_0x3f8d > 3) {
        _0x1a4b()
      }
    }

    const _0x7c4e = () => {
      _0x3f8d = 0
      _0x5e7c()
    }

    const _0x4d2f = () => {
      const _0x8e1a = globalThis.outerHeight - window.innerHeight
      const _0x2b4c = globalThis.outerWidth - window.innerWidth

      if (_0x8e1a > 200 || _0x2b4c > 200) {
        _0x9b2a()
      } else {
        _0x7c4e()
      }
    }

    setInterval(_0x4d2f, 500)
  }
}

const _0x6a1b = (): boolean => {
  try {
    const _0x8f2c = Date.now()
    const _0x3d4e = new Date('2024-01-01').getTime()
    const _0x7e9f = new Date('9999-12-31').getTime()

    return _0x8f2c >= _0x3d4e && _0x8f2c <= _0x7e9f
  } catch {
    return false
  }
}

const _0x8c4d = (): boolean => {
  try {
    const _0x3f7a = _0x9d1e('VITE_A' + 'PP_SE' + 'CRET_KEY')
    const _0x5d2e = import.meta.env.MODE

    if (_0x5d2e === 'development') {
      if (!_0x3f7a || _0x3f7a === 'preview') {
        return true
      }

      if (_0x4f2a(_0x3f7a) < 10) {
        return false
      }
    } else {
      if (!_0x3f7a) {
        return false
      }

      if (_0x3f7a === 'preview') {
        return false
      }

      if (_0x4f2a(_0x3f7a) < 50) {
        return false
      }

      if (!_0x7b3c(_0x3f7a)) {
        return false
      }

      const _0x1e5f = /^\d+$/
      const _0x4a2b = /^[A-Za-z]+$/
      if (_0x1e5f.test(_0x3f7a) || _0x4a2b.test(_0x3f7a)) {
        return false
      }

      if (!_0x6a1b()) {
        return false
      }

      const _0x5c8d = /[A-Z]/
      const _0x2f9e = /[a-z]/
      const _0x8b4c = /\d/

      const _0x1d7a = /[!#$%&()*+,.:;<=>?@[\]^_{|}-]/g

      const _0x9e3f = _0x5c8d.test(_0x3f7a) && _0x2f9e.test(_0x3f7a) && _0x8b4c.test(_0x3f7a) && _0x1d7a.test(_0x3f7a)

      if (!_0x9e3f) {
        return false
      }
    }

    return true
  } catch {
    return false
  }
}

export const validateAppSecurity = (): void => {
  const _0x6f8e = _0x8c4d()
  _0x2e8f(_0x6f8e)
}

export default validateAppSecurity
