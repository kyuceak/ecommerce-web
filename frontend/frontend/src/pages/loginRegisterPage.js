import { login, logout } from "@/authSlice";
import { loginPost, registerPost } from "@/utils/poster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import loginPage from "@/pages/components/loginPage";
import registerPage from "@/pages/components/registerPage";
import { useDispatch, useSelector } from "react-redux";
import { router } from "next/client";
import { useRouter } from 'next/router';
import { getUser } from "@/utils/getter";
import { setUser } from "@/authSlice";

export default function loginRegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [nameSurname, setNameSurname] = useState('');
    const [address, setAddress] = useState('');
    const [taxID, setTaxID] = useState('');
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const router = useRouter();
    const redirect = router.query.redirect;

    useEffect(() => {
        if (isAuthenticated) {
            if (redirect) {
                router.push(`/cart/${redirect}`);
            } else {
                router.push('/');
            }
        }
    }, [isAuthenticated, redirect, router]);

    const handleUsernameInput = (e) => {
        setUsername(e.target.value);
    };
    const handleEmailInput = (e) => {
        setEmail(e.target.value);
    };
    const handlePasswordInput = (e) => {
        setPassword(e.target.value);
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);

    };
    const toggleRegister = () => {
        setIsLogin(!isLogin);
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isLogin) {
            const loginResult = await loginPost(username, password);
            dispatch(login(loginResult));
            if (loginResult[1] === 200) {
                // Login was successful, fetch user data
                // const userData = await getUser();
                // dispatch(setUser(userData));
            }
        } else {
            await registerPost(username, email, password, password,nameSurname,address,taxID).then(() => setIsLogin(true));
        }
    }

    function handleNameSurname(e) {
        setNameSurname(e.target.value)
    }

    function handleAddress(e) {
        setAddress(e.target.value)
    }

    function handleTaxID(e) {
        setTaxID(e.target.value)
    }

    return <>{isLogin ? loginPage(handleSubmit, toggleRegister, handleUsernameInput, togglePasswordVisibility, handlePasswordInput, showPassword) : registerPage(handleSubmit, toggleRegister, handleUsernameInput, handleEmailInput, togglePasswordVisibility, handlePasswordInput, showPassword, handleNameSurname,handleAddress,handleTaxID)}</>

}