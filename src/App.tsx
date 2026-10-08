import { RouterProvider } from 'react-router'
import appRouter from './modules/shared/infraestructure/router/app.router'

function App() {
  return <RouterProvider router={appRouter}></RouterProvider>
}

export default App
