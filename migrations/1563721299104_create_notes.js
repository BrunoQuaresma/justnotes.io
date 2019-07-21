module.exports.up = q => {
  return q.Let(
    {
      notesCollection: q.CreateCollection({
        name: 'Notes'
      }),
      notesByOwnerIndex: q.CreateIndex({
        name: 'notes_by_owner',
        terms: [{ field: ['data', 'owner'] }],
        source: q.Select(['ref'], q.Var('notesCollection'))
      }),
      canManageSelfNotesRole: q.CreateRole({
        name: 'can_manage_self_notes',
        privileges: [
          {
            resource: q.Select(['ref'], q.Var('notesCollection')),
            actions: {
              read: q.Query(
                q.Lambda(
                  'ref',
                  q.Equals(
                    q.Identity(),
                    q.Select(['data', 'owner'], q.Get(q.Var('ref')))
                  )
                )
              ),
              write: q.Query(
                q.Lambda(
                  ['oldData', 'newData'],
                  q.And(
                    q.Equals(
                      q.Identity(),
                      q.Select(['data', 'owner'], q.Var('oldData'))
                    ),
                    q.Equals(
                      q.Select(['data', 'owner'], q.Var('oldData')),
                      q.Select(['data', 'owner'], q.Var('newData'))
                    )
                  )
                )
              ),
              create: q.Query(
                q.Lambda(
                  'newData',
                  q.Equals(
                    q.Identity(),
                    q.Select(['data', 'owner'], q.Var('newData'))
                  )
                )
              ),
              delete: q.Query(
                q.Lambda(
                  'ref',
                  q.Equals(
                    q.Identity(),
                    q.Select(['data', 'owner'], q.Get(q.Var('ref')))
                  )
                )
              ),
              history_read: false,
              history_write: false
            }
          },
          {
            resource: q.Select(['ref'], q.Var('notesByOwnerIndex')),
            actions: {
              unrestricted_read: false,
              read: true,
              history_read: false
            }
          }
        ],
        membership: [
          {
            resource: q.Collection('Users')
          }
        ]
      })
    },
    true
  )
}

module.exports.down = q => {
  return q.Do(
    q.Delete(q.Collection('Notes')),
    q.Delete(q.Index('notes_by_owner')),
    q.Delete(q.Role('can_manage_self_notes'))
  )
}
