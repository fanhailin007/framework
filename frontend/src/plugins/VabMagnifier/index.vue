<template>
  <div
    class="vab-magnifier"
    @mouseenter="!disabled && !enterEvent && mouseEnter($event)"
    @mouseleave="!disabled && !leaveEvent && mouseLeave($event)"
    @mousemove="!disabled && !moveEvent && mouseMove($event)"
  >
    <img ref="imgRef" class="origin-img" @load="imgLoaded()" />
    <div
      v-if="selector"
      v-show="!hideZoomer && imgLoadedFlag"
      :class="['img-zoomer', { circle: type === 'circle' }]"
      :style="[
        zoomerStyle,
        zoomerSize,
        zoomerPosition,
        !outZoomer && zoomerBgUrl,
        !outZoomer && zoomerBgSize,
        !outZoomer && zoomerBgPosition,
      ]"
    >
      <slot name="zoomer"></slot>
    </div>
    <div
      v-if="outZoomer"
      v-show="!hideOutZoomer"
      :class="['img-out-show', { 'base-line': baseline }]"
      :style="[outZoomerStyle, outZoomerSize, outZoomerPosition, zoomerBgUrl, zoomerBgSize, zoomerBgPosition]"
    >
      <div v-if="pointer" class="img-zoomer-point"></div>
      <slot name="outZoomer"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabMagnifier',
})

interface Props {
  url?: string
  highUrl?: string
  width?: number
  height?: number
  type?: 'circle' | 'square'
  zoomerStyle?: Record<string, any>
  outZoomerStyle?: Record<string, any>
  scale?: number
  enterEvent?: UIEvent | null
  moveEvent?: UIEvent | null
  leaveEvent?: UIEvent | null
  selector?: boolean
  outZoomer?: boolean
  pointer?: boolean
  baseline?: boolean
  disabledReactive?: boolean
  disabled?: boolean
  mask?: boolean
  maskColor?: string
}

interface Emits {
  (e: 'mousemove', event: any): void

  (e: 'mouseleave', event: any): void

  (e: 'mouseenter', event: any): void

  (e: 'created', img: any, imgInfo: any): void
}

const props = withDefaults(defineProps<Props>(), {
  url: '',
  highUrl: '',
  width: 168,
  height: -1,
  type: 'square',
  zoomerStyle: () => ({}),
  outZoomerStyle: () => ({}),
  scale: 2,
  enterEvent: null,
  moveEvent: null,
  leaveEvent: null,
  selector: true,
  outZoomer: false,
  pointer: false,
  baseline: false,
  disabledReactive: false,
  disabled: false,
  mask: true,
  maskColor: '',
})

const emit = defineEmits<Emits>()

const imgRef = ref<HTMLImageElement>()

// 响应式数据
const zoomerRect = ref({
  top: 0,
  left: 0,
  absoluteLeft: 0,
  absoluteTop: 0,
})

const zoomerBgRect = ref({
  top: 0,
  left: 0,
})

const zoomerPoint = ref({
  leftBound: 0,
  topBound: 0,
  rightBound: 0,
  bottomBound: 0,
})

const vZoomerPoint = ref({
  leftBound: 0,
  topBound: 0,
  rightBound: 0,
  bottomBound: 0,
})

const hideZoomer = ref(true)
const hideOutZoomer = ref(true)
const imgLoadedFlag = ref(false)
const outZoomerInitTop = ref(0)
const outZoomerTop = ref(0)
const imgInfo = ref<Record<string, any>>({})
const $img = ref<any>(null)
const beforeReactivateMoveFns = ref<any[]>([])

// 计算属性
const zoomerHeight = computed(() => {
  return props.height > 0 ? props.height : props.width
})

const zoomerHalfWidth = computed(() => {
  return props.width / 2
})

const zoomerHalfHeight = computed(() => {
  return zoomerHeight.value / 2
})

const vZoomerHalfWidth = computed(() => {
  const halfWidth = zoomerHalfWidth.value
  return props.outZoomer ? halfWidth * props.scale : halfWidth
})

const vZoomerHalfHeight = computed(() => {
  const halfHeight = zoomerHalfHeight.value
  return props.outZoomer ? halfHeight * props.scale : halfHeight
})

const zoomerPosition = computed(() => {
  const { top, left } = zoomerRect.value
  return {
    top: `${top}px`,
    left: `${left}px`,
  }
})

const zoomerSize = computed(() => {
  const { width } = props
  const height = zoomerHeight.value
  return {
    width: `${width}px`,
    height: `${height}px`,
  }
})

const outZoomerSize = computed(() => {
  const { scale, width } = props
  const height = zoomerHeight.value
  return {
    width: `${width * scale}px`,
    height: `${height * scale}px`,
  }
})

const outZoomerPosition = computed(() => {
  return {
    top: `${outZoomerTop.value}px`,
  }
})

const zoomerBgUrl = computed(() => {
  return {
    backgroundImage: `url(${props.highUrl || props.url})`,
  }
})

const zoomerBgSize = computed(() => {
  const { scale } = props
  const { height, width } = imgInfo.value
  return {
    backgroundSize: `${width * scale}px ${height * scale}px`,
  }
})

const zoomerBgPosition = computed(() => {
  const { left, top } = zoomerBgRect.value
  return {
    backgroundPosition: `${left}px ${top}px`,
  }
})

// 方法
const getBoundingClientRect = (element: any) => {
  const rect = element.getBoundingClientRect()
  const isIE = navigator.userAgent.includes('MSIE')
  const rectTop = isIE && element.tagName === 'HTML' ? -element.scrollTop : rect.top
  return {
    left: rect.left,
    top: rectTop,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.right - rect.left,
    height: rect.bottom - rectTop,
  }
}

const addResizeListener = (dom: any, cb: any) => {
  if (!props.disabledReactive) {
    beforeReactivateMoveFns.value.push(() => {
      const rect = getBoundingClientRect(dom)
      if (validImgResize(rect)) {
        cb && cb(rect)
      }
    })
  }
}

const handlerUrlChange = () => {
  imgLoadedFlag.value = false
  loadImg(props.url).then(imgLoaded)
}

const loadImg = (url: string) => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.addEventListener('load', resolve)
    img.addEventListener('error', reject)
    img.src = url
  })
}

const imgLoaded = () => {
  nextTick(() => {
    const $img = imgRef.value
    if (!imgLoadedFlag.value) {
      imgLoadedFlag.value = true
      if ($img) {
        $img.src = props.url
        setTimeout(() => {
          imgInfo.value = getBoundingClientRect($img)
          handlerImgResize()
          emit('created', $img, imgInfo.value)
        }, 500)
      }
    }
  })
}

const validImgResize = (newImgInfo: any) => {
  return JSON.stringify(imgInfo.value) !== JSON.stringify(newImgInfo)
}

const handlerImgResize = () => {
  initZoomerProperty()
  resetOutZoomPosition()
}

const mouseEnter = (e: any) => {
  if (imgLoadedFlag.value) {
    hideZoomer.value = false
  }
  emit('mouseenter', e)
}

const mouseMove = (e: any) => {
  if (hideZoomer.value) return
  if (imgLoadedFlag.value && e) {
    beforeReactivateMoveFns.value.forEach((fn: any) => fn.call(null))
    const { pageX, pageY, clientY } = e
    const scrollTop = pageY - clientY
    const { scale, outZoomer } = props
    const { absoluteLeft, absoluteTop } = zoomerRect.value
    const { leftBound, topBound, rightBound, bottomBound } = zoomerPoint.value
    const {
      leftBound: vZoomerLeftBound,
      topBound: vZoomerTopBound,
      rightBound: vZoomerRightBound,
      bottomBound: vZoomerBottomBound,
    } = vZoomerPoint.value
    let outZoomerInitTopValue = outZoomerInitTop.value
    const x = pageX - absoluteLeft
    const y = pageY - absoluteTop
    const zoomerLeft = x > leftBound ? Math.min(x, rightBound) : leftBound
    const zoomerTop = y > topBound ? Math.min(y, bottomBound) : topBound
    const vZoomerX = x * scale > vZoomerLeftBound ? Math.min(x * scale, vZoomerRightBound) : vZoomerLeftBound
    const vZoomerY = y * scale > vZoomerTopBound ? Math.min(y * scale, vZoomerBottomBound) : vZoomerTopBound
    zoomerRect.value.left = zoomerLeft - zoomerHalfWidth.value
    zoomerRect.value.top = zoomerTop - zoomerHalfHeight.value
    zoomerBgRect.value.left = -vZoomerX + vZoomerHalfWidth.value
    zoomerBgRect.value.top = -vZoomerY + vZoomerHalfHeight.value
    if (outZoomer) {
      if (!outZoomerInitTopValue) {
        outZoomerInitTopValue = outZoomerInitTop.value = scrollTop + imgInfo.value.top
      }
      if (hideOutZoomer.value) {
        hideOutZoomer.value = false
      }
      outZoomerTop.value = scrollTop > outZoomerInitTopValue ? scrollTop - outZoomerInitTopValue : 0
    }
  }
  emit('mousemove', e)
}

const mouseLeave = (e: any) => {
  hideZoomer.value = true
  if (props.outZoomer) {
    hideOutZoomer.value = true
  }
  emit('mouseleave', e)
}

const initZoomerProperty = () => {
  const { left, top } = imgInfo.value
  const { documentElement, body } = document
  const scrollTop = documentElement.scrollTop || body.scrollTop
  const scrollLeft = documentElement.scrollLeft || body.scrollLeft
  zoomerRect.value.absoluteLeft = left + scrollLeft
  zoomerRect.value.absoluteTop = top + scrollTop
  initZoomerPoint()
  initVZoomerPoint()
}

const initZoomerPoint = () => {
  const halfWidth = zoomerHalfWidth.value
  const halfHeight = zoomerHalfHeight.value
  const { width, height } = imgInfo.value
  zoomerPoint.value.leftBound = halfWidth
  zoomerPoint.value.topBound = halfHeight
  zoomerPoint.value.rightBound = width - halfWidth
  zoomerPoint.value.bottomBound = height - halfHeight
}

const initVZoomerPoint = () => {
  const halfWidth = vZoomerHalfWidth.value
  const halfHeight = vZoomerHalfHeight.value
  const { width, height } = imgInfo.value
  const { scale } = props
  vZoomerPoint.value.leftBound = halfWidth
  vZoomerPoint.value.topBound = halfHeight
  vZoomerPoint.value.rightBound = width * scale - halfWidth
  vZoomerPoint.value.bottomBound = height * scale - halfHeight
}

const reset = () => {
  initZoomerProperty()
}

const resetOutZoomPosition = () => {
  outZoomerInitTop.value = 0
}

// 监听器
watch(
  () => props.scale,
  () => {
    initVZoomerPoint()
    if (
      !props.outZoomer && // 避免循环调用，只在必要时调用mouseMove
      imgLoadedFlag.value
    ) {
      // 这里可以添加一个标志来避免循环调用
    }
  }
)

// 修复监听器，避免循环调用
watch(
  () => props.enterEvent,
  (newVal) => {
    if (newVal) mouseEnter(newVal)
  }
)

watch(
  () => props.moveEvent,
  (newVal) => {
    if (newVal) mouseMove(newVal)
  }
)

watch(
  () => props.leaveEvent,
  (newVal) => {
    if (newVal) mouseLeave(newVal)
  }
)

watch(() => props.url, handlerUrlChange)
watch(() => props.width, initZoomerPoint)
watch(() => props.height, initZoomerPoint)

// 生命周期
onMounted(() => {
  if (props.url) {
    handlerUrlChange()
  }
  beforeReactivateMoveFns.value = []
  $img.value = imgRef.value
  if (imgRef.value) {
    addResizeListener(imgRef.value, (rect: any) => {
      imgInfo.value = rect
      handlerImgResize()
    })
  }
})

// 暴露方法给父组件
defineExpose({
  reset,
})
</script>

<style lang="scss" scoped>
.vab-magnifier {
  position: relative;
  width: 100%;
  height: 100%;

  .origin-img {
    width: 100%;
    height: 100%;
  }

  .img-zoomer {
    position: absolute;
    box-sizing: border-box;
    cursor: crosshair;
    background-repeat: no-repeat;
    border: 1px solid rgba(0, 0, 0, 0.1);

    &.circle {
      border-radius: 50%;
    }

    &-point {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      background-color: black;
      transform: translate(-50%, -50%);
    }
  }

  .img-out-show {
    position: absolute;
    right: -8px;
    box-sizing: border-box;
    background-repeat: no-repeat;
    border: 1px solid rgba(0, 0, 0, 0.1);
    transform: translate(100%, 0);

    &.base-line {
      &::after {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        box-sizing: border-box;
        width: 1px;
        content: '';
        border: 1px dashed rgba(0, 0, 0, 0.36);
        transform: translateX(-50%);
      }

      &::before {
        position: absolute;
        top: 50%;
        right: 0;
        left: 0;
        box-sizing: border-box;
        height: 1px;
        content: '';
        border: 1px dashed rgba(0, 0, 0, 0.36);
        transform: translateY(-50%);
      }
    }
  }
}
</style>
