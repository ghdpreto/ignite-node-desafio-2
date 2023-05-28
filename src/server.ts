import { app } from './app'

app.listen({ port: 3333 }).then(() => {
  console.log('Server up! => http://localhost:3333/')
})
