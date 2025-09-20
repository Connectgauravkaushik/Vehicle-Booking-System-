import './App.css'
import { createBrowserRouter, Outlet, RouterProvider} from "react-router";
import BodyComponent from './pages/body';
import SearchAndBookComponent from './pages/component/searchPage';
import BookingList from './pages/component/BookingsPage';

function App() {

 const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <BodyComponent />
    },
    {
      path: "/book",
      element: <SearchAndBookComponent />
    },
      {
      path: "/all/bookings",
      element: <BookingList />
    }
  ]);


  return (
    <>
     <RouterProvider router={appRouter} />
        <Outlet />
    
    </>
  )
}

export default App
