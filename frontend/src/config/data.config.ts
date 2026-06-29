export const userConfig = {
  roleOptions: [
    { label: '管理员', value: 'Admin' },
    { label: '电商运营', value: 'EcOperator' },
    { label: '不动产管理', value: 'ReOperator' },
    { label: '金融管理', value: 'FiOperator' },
    { label: '税理士', value: 'TaxOperator' },
    { label: '分析师', value: 'analysize' },
    { label: '财务', value: 'FinancialManagement' },
  ],
}

export const documentConfig = {
  statusOptions: [
    { label: '草稿', tagType: 'info', value: 'draft' },
    { label: '已发布', tagType: 'success', value: 'published' },
    { label: '已归档', tagType: 'warning', value: 'archived' },
  ],
  categoryOptions: [
    { label: '指南', value: 'guide' },
    { label: '归档', value: 'archive' },
    { label: '公告', value: 'notice' },
    { label: '规范', value: 'standard' },
  ],
}
