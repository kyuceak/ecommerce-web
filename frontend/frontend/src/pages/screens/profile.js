import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
// import Layout from '../components/Layout' 
import { getUser, getOrders } from '@/utils/getter' // import your API function to fetch user profile data
import { Button, Row, Col } from 'react-bootstrap'
export default function Profile() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [userProfile, setUserProfile] = useState(null)
    const [orderList, setOrderList] = useState(null)
    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const data = await getUser()
                console.log('User profile data:', data);
                setUserProfile(data)
                const orders = await getOrders();
                setOrderList(orders)
                } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchUserProfile()
    }, [])

    if (loading) {
        return <p>Loading...</p>
    }

    if (!userProfile) {
        router.push('/login') // redirect to login page if user is not logged in
        return null
    }

    return (

        <Row>
            <Head>
                <title>{userProfile.user.username}'s Profile</title>
            </Head>
            <h1>{userProfile.user.username}'s Profile</h1>
            {console.log(orderList)}
        </Row>

    )
}


