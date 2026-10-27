import { AcApI18n } from '@mlightcad/cad-simple-viewer'

import zh from './zh'

export const initializeLocale = () => {
  // 无论前端调用 en 还是 zh，全部注入中文文本
  AcApI18n.mergeLocaleMessage('en', zh)
  AcApI18n.mergeLocaleMessage('zh', zh)
}
