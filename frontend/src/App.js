import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ProductListPage from './pages/ProductsListPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CheckoutPage from './pages/CheckoutPage'
import NavBar from './components/Navbar'
import PaymentStatus from './components/PaymentStatus'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import CardUpdatePage from './pages/CardUpdatePage'
import CardDetailsPage from './pages/CardDetailsPage'
import AccountPage from './pages/AccountPage'
import AccountUpdatePage from './pages/AccountUpdatePage'
import DeleteUserAccountPage from './pages/DeleteUserAccountPage'
import AllAddressesOfUserPage from './pages/AllAddressesOfUserPage'
import AddressUpdatePage from './pages/AddressUpdatePage'
import OrdersListPage from './pages/OrdersListPage'
import ProductCreatePage from './pages/ProductCreatePage'
import ProductUpdatePage from './pages/ProductUpdatePage'
import NotFound from './pages/NotFoundPage'

// Import the new components
import FullScreenAd from './components/FullScreenAd'
import AdvertisePage from './pages/AdvertisePage'
import AdSubmissionPage from './pages/AdSubmissionPage'
import AdApprovalPage from './pages/AdApprovalPage'
import HelpPage from './pages/HelpPage'
import AboutPage from './pages/AboutPage'
import OrderNowPage from './pages/OrderNowPage'
import SearchPage from './pages/SearchPage';


const App = () => {

  return (
    <div>
      <Router>
        <NavBar />
        <FullScreenAd />
        <div className="container mt-4">
          <Switch>
            <Route path="/" component={ProductListPage} exact />
            <Route path="/new-product/" component={ProductCreatePage} exact />
            <Route path="/product/:id/" component={ProductDetailsPage} exact />
            <Route path="/product-update/:id/" component={ProductUpdatePage} exact />
            <Route path="/product/:id/checkout/" component={CheckoutPage} exact />
            <Route path="/payment-status" component={PaymentStatus} exact />
            <Route path="/login" component={Login} exact />
            <Route path="/register" component={Register} exact />
            <Route path="/account" component={AccountPage} exact />
            <Route path="/account/update/" component={AccountUpdatePage} exact />
            <Route path="/account/delete/" component={DeleteUserAccountPage} exact />
            <Route path="/stripe-card-details" component={CardDetailsPage} exact />
            <Route path="/stripe-card-update" component={CardUpdatePage} exact />
            <Route path="/all-addresses/" component={AllAddressesOfUserPage} exact />
            <Route path="/all-addresses/:id/" component={AddressUpdatePage} exact />
            <Route path="/all-orders/" component={OrdersListPage} exact />

            <Route path="/advertise" component={AdvertisePage} exact />
            <Route path="/ad-submission" component={AdSubmissionPage} exact />
            <Route path="/ad-approval" component={AdApprovalPage} exact />
            <Route path="/help" component={HelpPage} exact />
            <Route path="/about" component={AboutPage} exact />
            <Route path="/order-now" component={OrderNowPage} exact />

            <Route path="/search" component={SearchPage} exact />

            <Route path="" component={NotFound} exact />
          </Switch>
        </div>
      </Router>
    </div >
  )
}

export default App
