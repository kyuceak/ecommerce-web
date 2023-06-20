import { getRefundRequestedOrders } from '@/utils/getter'
import { approveRefund } from '@/utils/poster'
import moment from 'moment';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Col, Card, ListGroup, ListGroupItem, Image } from 'react-bootstrap'
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function refunds() {

    const router = useRouter();
    const [refundRequested, setRefundRequested] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserOrders() {
            try {
                const data = await getRefundRequestedOrders();
                setLoading(false);
                console.log(data)
                setRefundRequested(data.data);
                
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserOrders();
    }, []);

    const handleApprove = async (msg, id) => {
        approveRefund(msg, id).then((res) => {
            router.reload();
        });
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="div" gutterBottom>
                Refunds
            </Typography>
            {refundRequested && refundRequested.map((ref) => (
                <Card style={{ width: '18rem', marginTop: '10px' }}>
                    <Card.Body>
                        <Card.Title>Order ID: {ref.id}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Total Price: {ref.total_price}</Card.Subtitle>
                        <Card.Text>
                            <strong>Order Date: </strong>{moment(ref.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                        </Card.Text>
                        <Card.Text>
                            <h4>Order Items</h4>
                            {ref.orderitems.map((item, index) => (
                                <div key={index}>
                                   
                                    <p>Item Name: {item.product_name}</p>
                                    {/* Add other properties of item you want to show here */}
                                </div>
                            ))}
                        </Card.Text>
                        <Button variant="contained" color="primary" onClick={() => handleApprove("approve", ref.id)}> Approve </Button>
                    </Card.Body>
                </Card>
            ))}
        </Box>
    );
}
