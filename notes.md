## Insert by default doesn't return a value
- Note that insert returns an array of objects
```ts
// drizzle example of insert with returning values
const user = await db.insert(users).values({name: 'joe'}).returning({
  id: users.id,
  })

```
### you can insert multiple rows at once
```ts

const user = await db.insert(users).values([
  {name: 'joe'},
  {name: 'bob'},
])
```
---

