import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getWishlist } from '@/utils/getter'
import WideCard from './components/exampleCard'
import { API_PATH } from "../../constant";
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import { addItem } from "@/cartSlice";

export default function Wishlist() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [wishlist, setWishlist] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        async function fetchUserOrders() {
            try {
                const data = await getWishlist();
                console.log(data)
                setWishlist(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserOrders();
    }, []);

    const handleAddToCart = (item, quantityToAdd) => {
        handleAddItem(item, quantityToAdd);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1000);
      };
    
      const handleAddItem = (item, quantityToAdd) => {
        dispatch(addItem({ item, quantity: quantityToAdd }));
      };
    
    return (
      <div>
        <h1>Wishlist</h1>
        <Container>
          <Row>
            {wishlist && wishlist.data.map((product) => (
              <Col md={4} sm={12} lg={3} key={product.id}>
                <WideCard 
                  item={product}
                  click={() => router.push(`/products/detail/?id=${product.id}`)}
                  addToCart={() => handleAddToCart(product, 1)}
                  buttonText="Buy"
                  buttonDisabled={product.count_in_stock == 0}
                />
              </Col>
            ))}
          </Row>
        </Container>
        {showPopup && (
          <div className="popup">
            Product added to cart!
          </div>
        )}
      </div>
    );
}
