module.exports.up = q => {
  return q.Let(
    {
      userCollection: q.CreateCollection({
        name: 'Users'
      }),
      userByEmailIndex: q.CreateIndex({
        name: 'user_by_email',
        terms: [{ field: ['data', 'email'] }],
        source: q.Select(['ref'], q.Var('userCollection')),
        unique: true
      }),
      signInSignUpRole: q.CreateRole({
        name: 'can_sign_in_and_up',
        privileges: [
          {
            resource: q.Select(['ref'], q.Var('userCollection')),
            actions: {
              read: false,
              write: false,
              create: true,
              delete: false,
              history_read: false,
              history_write: false
            }
          },
          {
            resource: q.Select(['ref'], q.Var('userByEmailIndex')),
            actions: {
              unrestricted_read: false,
              read: true,
              history_read: false
            }
          }
        ],
        membership: []
      })
    },
    true
  )
}

module.exports.down = q => {
  return q.Do(
    q.Delete(q.Collection('Users')),
    q.Delete(q.Index('users_by_email')),
    q.Delete(q.Role('can_sign_in_and_up'))
  )
}
