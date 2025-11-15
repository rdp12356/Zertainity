export const supabase = {
  auth: {
    getSession: () => Promise.resolve({
      data: {
        session: { user: { id: 'test-user-id' } },
      },
      error: null,
    }),
  },
  from: (tableName) => ({
    select: () => ({
      eq: (columnName) => {
        if (tableName === 'user_roles' && columnName === 'user_id') {
          return Promise.resolve({ data: [{ role: 'admin' }], error: null });
        }
        if (tableName === 'role_permissions' && columnName === 'role') {
          return {
            eq: () => Promise.resolve({
              data: [{ permission: 'edit_quiz' }],
              error: null,
            }),
          };
        }
        return Promise.resolve({ data: [], error: null });
      },
    }),
  }),
};
