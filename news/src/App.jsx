import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavbarList from './NavbarList';
import Home from './Home';
import News from './News';
import NewsDetail from './NewsDetail';
import NewsByCategory from "./NewsByCategory";
import NewsAdd from './NewsAdd';
import SignUp from './SignUp';
import SignIn from './SignIn';
import EditNews from './EditNews';
import AboutUs from "./AboutUs"
import { AuthProvider } from './AuthContext'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavbarList /> 
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/news' element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/category/:categoryId" element={<NewsByCategory />} />
          <Route path="/news/create" element={<NewsAdd />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/news/:id/edit" element={<EditNews />} />
          <Route path="/about" element={<AboutUs />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
