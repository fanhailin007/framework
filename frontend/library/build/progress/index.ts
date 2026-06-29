import progress from 'vite-plugin-vitebar'

import { title } from '/@/config'

export const createProgress = (env: Record<string, string>) => {
  let projectName = 'Vue Shop Vite'
  if (title !== 'Vue Shop Vite') {
    projectName = `${projectName} - ${title}`
  }

  return progress({ env, projectName })
}
