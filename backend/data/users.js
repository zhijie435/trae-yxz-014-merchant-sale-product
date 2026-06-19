export default [
  {
    id: 1,
    username: 'admin',
    password: 'Admin@2024',
    role: 'super_admin',
    permissions: ['read', 'write', 'delete', 'audit', 'approve']
  },
  {
    id: 2,
    username: 'auditor',
    password: 'Audit@2024',
    role: 'auditor',
    permissions: ['read', 'audit']
  },
  {
    id: 3,
    username: 'operator',
    password: 'Operate@2024',
    role: 'operator',
    permissions: ['read', 'write', 'restock']
  }
];
