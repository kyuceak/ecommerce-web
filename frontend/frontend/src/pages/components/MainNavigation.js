import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/authSlice';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Categories from './Catagories';
import SearchBox from './SearchBox';
import grey from '@mui/material/colors';
import Document from '../_document';
import { setUser } from '@/authSlice';
import { getUser } from '@/utils/getter';
import { useRouter } from 'next/router';

function MainNavigation() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);


  const userRole = useSelector((state) => state.auth.user);


  const dispatch = useDispatch();

  const router = useRouter();
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUser();

      dispatch(setUser(userData));

    };

    fetchUserData(); // Initial fetch

    const interval = setInterval(fetchUserData, 2000); // Fetch every 5 seconds (adjust as needed)

    return () => {
      clearInterval(interval); // Clean up the interval on component unmount
    };
  }, [], userRole);

  const handleProfileClick = () => {
    router.push('/profile');
  };
  const handleLogout = () => {
    router.push('/');
    dispatch(logout())
  }

  return (
    <AppBar position="static" color="grey">
      <Toolbar>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" className="navbar-brand">
            E-commerce
          </Link>
        </Typography>
        <Box sx={{ flexGrow: 1 }} color="secondary">
          <Categories color="secondary" />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SearchBox />
        </Box >
        <Box>
          <Link href="/cart/">
            <Button color="inherit"><i className="fas fa-shopping-cart"></i>Cart</Button>
          </Link>
        </Box>
        <Box >
          <Link href="/wishlist/">
            <Button color="inherit"><i className="fa-regular fa-heart"></i>Wish</Button>
          </Link>
        </Box>
        {!isAuthenticated ? (
          <Link href="/loginRegisterPage">
            <Button color="inherit"><i className="fas fa-user"></i>Login</Button>
          </Link>
        ) : (
          <>
            {userRole.user?.role === 1 && (
              <Link href="/product-manager-panel">
                <Button color="inherit"><i className="fas fa-user"></i>Product Manager Panel</Button>
              </Link>
            )}

            {userRole.user?.role === 2 && (
              <Link href="/sales-manager-page">
                <Button color="inherit"><i className="fas fa-user"></i>Sales Manager Panel</Button>
              </Link>
            )}
            <Link href="/orders">
              <Button color="inherit"><i className="fas fa-list"></i>My Orders</Button>
            </Link>

            <Button onClick={handleProfileClick} color="inherit">
              Profile
            </Button>
            <Button onClick={() => dispatch(logout())} color="inherit"><i className="fas fa-sign-out"></i>Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default MainNavigation;