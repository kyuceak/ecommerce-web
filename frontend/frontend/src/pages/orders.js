

import { getOrdersByUser } from '@/utils/getter'
import { cancelOrder, commentPost } from '@/utils/poster'
import moment from 'moment';

import { refundOrder } from '@/utils/poster'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Col, Card, ListGroup, ListGroupItem, Image,  Modal, Form } from 'react-bootstrap'
import { API_PATH } from "../../constant";
import styles from './orders.module.css'
import { Button } from "@mui/material";




// daha sonra loading ikonu ekleyebilrsin.

export default function Orders() {

    

    const router = useRouter();
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(1);
    const [commentAdded, setCommentAdded] = useState(false);

    const [showModal, setShowModal] = useState(false);
const [currentProductId, setCurrentProductId] = useState(null);

    useEffect(() => {

        async function fetchUserOrders() {
            try {
                const data = await getOrdersByUser();
                setLoading(false);
                console.log(data.data)
                setUserOrders(data.data.orders);
            } catch (error) {
                console.error(error);
            }

        };

        fetchUserOrders();

    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCommentAdded(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [commentAdded]);

    const handleAddComment = (e) => {
        e.preventDefault();
        const commentInput = e.target.elements.comment.value;
        const ratingInput = e.target.elements.rating.value;
       



        commentPost(commentInput, ratingInput, currentProductId) // use currentProductId
  .then((res) => {
            console.log(res);
            console.log("commentAdded");
            // Clear the input fields after submission
            console.log("commentAdded");
            setComment("");
            setRating(1);

            // Show the "Review Sended!" popup
            //setShowPopup3(true);

            // Hide the popup after 3 seconds
            // setTimeout(() => {
            // setShowPopup3(false);
            // }, 3000);
            setCommentAdded(true);
            console.log("commentAdded");


        });


        document.getElementById('comment').value = '';
    };


    function handleCancel(id) {
        console.log(id)
        cancelOrder(id).then((res) => {

            router.reload();
        });
    }
    function handleRefund(id) {
        console.log(id)
        refundOrder(id).then((res) => {
            console.log(res);
            router.reload();
        });
    }
    return (
        loading ? <></> :
            <>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Add a Review</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={handleAddComment}>
      <Form.Group>
        <Form.Label>Comment:</Form.Label>
        <Form.Control 
          as="textarea" 
          id="comment"
          name="comment"
          onChange={(e) => setComment(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Rating:</Form.Label>
        <Form.Control
          as="select"
          id="rating"
          name="rating"
          required
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit">Submit Review</Button>
    </Form>
    {commentAdded && (
      <div className="alert alert-success mt-3" role="alert">
        Comment Added!
      </div>
    )}
  </Modal.Body>
</Modal>

                {userOrders.map((order, index) => (
                    <Card key={order.id} className={`styles.cardContainer ${index !== 0 ? styles.notFirstCard : ''}`} >
                        <Card.Header className={styles.cardHeader}>
                            <div>
                                <Card.Title className={styles.cardTitle}>Order #{order.id}</Card.Title>
                                <Card.Subtitle className={styles.cardSubtitle}>Date: {order.createdAt.slice(0, 10)}</Card.Subtitle>
                                <Card.Subtitle className={styles.cardSubtitle}>Delivery Address: {order.user.address}</Card.Subtitle>

                            </div>
                            <Card.Title className={styles.statusWrapper}><span className={styles.status}>  STATUS: {order.status}</span></Card.Title>

                        </Card.Header>
                        <Card.Body className={styles.cardBody}>
                            <ul className={styles.listGroup}>
                                {order.orderitems.map((item) => (
                                    <li key={item.product} className={styles.listGroupItem}>
                                        <Image src={API_PATH + item.image} alt="My Image" className={styles.image}></Image>
                                        <span className={styles.name}>{item.product_name}</span>
                                        <span className={styles.quantity}>  Quantity: {item.qty}</span>
                                        {order.status === 'delivered' && (
                                            <div>
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                
                                                <Button
  onClick={() => { setCurrentProductId(item.product); setShowModal(true); }}
  style={{ fontSize: '1.2rem', padding: '10px 20px' }}
>
  Create Comment
</Button>

                                            </div>
                                        )}
                                        
                                    </li>
                                ))}
                                <br />
                                {order.status === 'processing' && (

                                    <Button onClick={() => handleCancel(order.id)} style={{ backgroundColor: '#f44336', color: 'white', fontSize: '1.25rem' }}>
                                        Cancel
                                    </Button>
                                )}

                                {order.status === 'delivered' && moment().diff(moment(order.createdAt), 'days') <= 30 && (

                                    <Button onClick={() => handleRefund(order.id)} style={{ backgroundColor: '#f44336', color: 'white', fontSize: '1.25rem' }}>
                                        Refund
                                    </Button>
                                )}

                                <li> <Card.Text className={styles.totalPrice}>Total price: ${order.total_price}</Card.Text></li>
                            </ul>
                            {/* Calculate the total price here or retrieve it from the API */}
                        </Card.Body>
                    </Card>
                ))}
            </>

    );
};