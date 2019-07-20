import faunadb, { query as q } from "faunadb";

const client = new faunadb.Client({
  secret: "fnADTjTHCzACBxluxCcuz9vOZqD345VUcd9-BTF9"
});

const setup = async () => {
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
};

setup();
