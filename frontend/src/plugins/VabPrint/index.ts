interface PrintOptions {
  noPrint?: string
  pageSize?: string
  orientation?: string
  margin?: string
  title?: string
  footer?: string
  customStyle?: string
  beforePrint?: () => void
  afterPrint?: () => void
  onError?: (error: any) => void
}

const Print: any = function (this: any, dom: any, options: PrintOptions = {}) {
  if (!(this instanceof Print)) return new Print(dom, options)

  this.options = this.extend(
    {
      noPrint: '.no-print',
      pageSize: 'A4',
      orientation: 'portrait',
      margin: '10mm',
      title: '',
      footer: '',
      customStyle: '',
    },
    options
  )

  if (typeof dom === 'string') {
    try {
      this.dom = document.querySelector(dom)
    } catch {
      const createDom = document.createElement('div')
      createDom.innerHTML = dom
      this.dom = createDom
    }
  } else {
    this.isDOM(dom)
    this.dom = this.isDOM(dom) ? dom : dom.$el
  }

  this.init()
}

Print.prototype = {
  init() {
    try {
      if (this.options.beforePrint) {
        this.options.beforePrint()
      }

      const content = this.getStyle() + this.getHtml()
      this.writeIframe(content)
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error)
      } else {
        console.error('打印初始化失败:', error)
      }
    }
  },

  extend(obj: { [x: string]: any }, obj2: { [x: string]: any }) {
    for (const k in obj2) {
      obj[k] = obj2[k]
    }
    return obj
  },

  getStyle() {
    let str = ''
    const styles = document.querySelectorAll('style,link')
    for (const style of styles) {
      str += style.outerHTML
    }

    // 基础打印样式
    str += `<style>${this.options.noPrint ? this.options.noPrint : '.no-print'}{display:none;}</style>`
    str += '<style>html,body{background-color:#fff;}</style>'

    // 页面设置样式
    str += `<style>
            @page {
                size: ${this.options.pageSize} ${this.options.orientation};
                margin: ${this.options.margin};
            }
            @media print {
                body { margin: 0; padding: 0; }
                .print-container { background: white !important; }
                .el-card { box-shadow: none !important; border: none !important; }
                .el-button { display: none !important; }
                .image-overlay { display: none !important; }
            }
        </style>`

    // 自定义样式
    if (this.options.customStyle) {
      str += `<style>${this.options.customStyle}</style>`
    }

    return str
  },

  getHtml() {
    const inputs = document.querySelectorAll('input')
    const textareas = document.querySelectorAll('textarea')
    const selects = document.querySelectorAll('select')

    // 处理表单元素
    for (const input of inputs) {
      if (input.type == 'checkbox' || input.type == 'radio') {
        if (input.checked) {
          input.setAttribute('checked', 'checked')
        } else {
          input.removeAttribute('checked')
        }
      } else if (input.type == 'text') {
        input.setAttribute('value', input.value)
      } else {
        input.setAttribute('value', input.value)
      }
    }

    for (const textarea of textareas) {
      if (textarea.type == 'textarea') textarea.innerHTML = textarea.value
    }

    for (const select of selects) {
      if (select.type == 'select-one') {
        const child: any = select.children
        for (const i in child) {
          if (child[i].tagName == 'OPTION') {
            if (child[i].selected == true) child[i].setAttribute('selected', 'selected')
            else child[i].removeAttribute('selected')
          }
        }
      }
    }

    let html = this.dom.outerHTML

    // 添加标题和页脚
    if (this.options.title || this.options.footer) {
      html = `
                <div class="print-wrapper">
                    ${this.options.title ? `<div class="print-title">${this.options.title}</div>` : ''}
                    <div class="print-content">${html}</div>
                    ${this.options.footer ? `<div class="print-footer">${this.options.footer}</div>` : ''}
                </div>
            `
    }

    return html
  },

  writeIframe(content: string) {
    const iframe: any = document.createElement('iframe')
    const f: any = document.body.appendChild(iframe)
    iframe.id = 'myIframe'
    iframe.setAttribute('style', 'position:absolute;width:0;height:0;top:-10px;left:-10px;')
    const w: any = f.contentWindow || f.contentDocument
    const doc: any = f.contentDocument || f.contentWindow.document
    doc.open()
    doc.write(content)
    doc.close()
    iframe.addEventListener('load', () => {
      this.toPrint(w)
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 100)
    })
  },

  toPrint(frameWindow: {
    focus: () => void
    document: { execCommand: (arg0: string, arg1: boolean, arg2: null) => any }
    print: () => void
    close: () => void
  }) {
    try {
      setTimeout(() => {
        frameWindow.focus()
        try {
          if (!frameWindow.document.execCommand('print', false, null)) frameWindow.print()
        } catch {
          frameWindow.print()
        }
        frameWindow.close()

        if (this.options.afterPrint) {
          this.options.afterPrint()
        }
      }, 10)
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error)
      } else {
        console.error('打印执行失败:', error)
      }
    }
  },

  isDOM:
    typeof HTMLElement === 'object'
      ? function (obj: any) {
          return obj instanceof HTMLElement
        }
      : function (obj: { nodeType: number; nodeName: any }) {
          return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'
        },
}

// 创建便捷的打印函数
const createPrint = (options: PrintOptions = {}) => {
  return (dom: any) => {
    return new Print(dom, options)
  }
}

// 导出默认打印函数和便捷函数
export default Print
export { createPrint }
export type { PrintOptions }
