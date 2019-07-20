import faunadb, { query as q } from "faunadb";

const client = new faunadb.Client({
  secret: "fnADTjTHCzACBxluxCcuz9vOZqD345VUcd9-BTF9"
});

const setup = async () => {
  await client.query(
    q.CreateCollection({
      name: "Users"
    })
  );

  await client.query(
    q.CreateIndex({
      name: "user_by_email",
      terms: [{ field: ["data", "email"] }],
      source: q.Collection("Users"),
      unique: true
    })
  );

  await client.query(
    q.CreateCollection({
      name: "Notes"
    })
  );

  await client.query(
    q.CreateIndex({
      name: "all_notes",
      source: q.Collection("Notes")
    })
  );

  await client.query(
    q.CreateIndex({
      name: "notes_by_owner",
      terms: [{ field: ["data", "owner"] }],
      source: q.Collection("Notes")
    })
  );

  await client.query(
    q.CreateRole({
      name: "can_manage_self_notes",
      privileges: [
        {
          resource: q.Collection("Notes"),
          actions: {
            read: q.Query(
              q.Lambda(
                "ref",
                q.Equals(
                  q.Identity(),
                  q.Select(["data", "owner"], q.Get(q.Var("ref")))
                )
              )
            ),
            write: q.Query(
              q.Lambda(
                ["oldData", "newData"],
                q.And(
                  q.Equals(
                    q.Identity(),
                    q.Select(["data", "owner"], q.Var("oldData"))
                  ),
                  q.Equals(
                    q.Select(["data", "owner"], q.Var("oldData")),
                    q.Select(["data", "owner"], q.Var("newData"))
                  )
                )
              )
            ),
            create: q.Query(
              q.Lambda(
                "newData",
                q.Equals(
                  q.Identity(),
                  q.Select(["data", "owner"], q.Var("newData"))
                )
              )
            ),
            delete: q.Query(
              q.Lambda(
                "ref",
                q.Equals(
                  q.Identity(),
                  q.Select(["data", "owner"], q.Get(q.Var("ref")))
                )
              )
            ),
            history_read: false,
            history_write: false
          }
        },
        {
          resource: q.Index("notes_by_owner"),
          actions: {
            unrestricted_read: false,
            read: true,
            history_read: false
          }
        }
      ],
      membership: [
        {
          resource: q.Collection("Users")
        }
      ]
    })
  );

  await client.query(
    q.CreateRole({
      name: "can_sign_in_and_up",
      privileges: [
        {
          resource: q.Collection("Users"),
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
          resource: q.Index("user_by_email"),
          actions: {
            unrestricted_read: false,
            read: true,
            history_read: false
          }
        }
      ],
      membership: []
    })
  );
};

setup();
