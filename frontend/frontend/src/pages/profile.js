import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getUser } from '@/utils/getter';
import { setUser, logout } from '@/authSlice';
import { List, ListItem, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useRouter } from 'next/router';

const ListItemStyled = styled(ListItem)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '500px',
    padding: '0.5rem 1rem',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    marginBottom: theme.spacing(2),
}));

const LogoutButton = styled(Button)({
    backgroundColor: '#f44336',
    color: 'white',
    '&:hover': {
        backgroundColor: '#aa2e25',
    },
});

function Profile() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }

        const fetchUserData = async () => {
            const userData = await getUser();
            console.log(userData);
            dispatch(setUser(userData));
        };
        fetchUserData();
        const interval = setInterval(fetchUserData, 5000); // Fetch every 5 seconds (adjust as needed)

        return () => {
            clearInterval(interval); // Clean up the interval on component unmount
        };
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', fontSize: '1.25rem' }}>
            <h1>Profile</h1>
            {user && (
                <>
                    <ListItemStyled>
                        <Typography variant="h6">Username</Typography>
                        <Typography variant="body1">{user.user.username}</Typography>
                    </ListItemStyled>
                    <ListItemStyled>
                        <Typography variant="h6">ID</Typography>
                        <Typography variant="body1">{user.user.id}</Typography>
                    </ListItemStyled>
                    <ListItemStyled>
                        <Typography variant="h6">Email</Typography>
                        <Typography variant="body1">{user.user.email}</Typography>
                    </ListItemStyled>
                    <ListItemStyled>
                        <Typography variant="h6">Name</Typography>
                        <Typography variant="body1">{user.user.nameSurname}</Typography>
                    </ListItemStyled>
                    <ListItemStyled>
                        <Typography variant="h6">Role</Typography>
                        <Typography variant="body1">{user.user.role === 1? "Product Manager": user.user.role === 2?"Sales Manager":"User"}</Typography>
                    </ListItemStyled>
                    <ListItemStyled>
                        <Typography variant="h6">Address</Typography>
                        <Typography variant="body1">{user.user.address}</Typography>
                    </ListItemStyled>
                    <ListItemStyled>
                        <Typography variant="h6">Tax ıd</Typography>
                        <Typography variant="body1">{user.user.taxID}</Typography>
                    </ListItemStyled>
                    <LogoutButton variant="contained" onClick={handleLogout}>
                        Logout
                    </LogoutButton>
                </>
            )}
        </div>
    );
}

export default Profile;
