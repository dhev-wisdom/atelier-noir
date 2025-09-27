import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Cart from './pages/Cart';
import Category from './pages/Category';
import Checkout from './pages/Checkout';
import CheckoutConfirm from './pages/CheckoutConfirm';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import Blog from './pages/Blog';

// CSS imports
import './assets/css/bootstrap.min.css';
import './assets/css/font-awesome.min.css';
import './assets/css/elegant-icons.css';
import './assets/css/jquery-ui.min.css';
import './assets/css/magnific-popup.css';
import './assets/css/owl.carousel.min.css';
import './assets/css/slicknav.min.css';
import './assets/css/style.css';

function App() {
  return (
    <>
      <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop/product-details' element={<ProductDetail />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/checkout-confirmation' element={<CheckoutConfirm />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/shop/cart' element={<Cart />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />
        <Route path='/shop/category' element={<Category />} />
      </Routes>
      <Footer />
      </BrowserRouter>
    </>
  )
}

export default App;