import React, { useState, useEffect } from "react";
import { getProducts } from "@/utils/getter";
import { Container, Row, Col, Button } from "react-bootstrap";
import WideCard from "@/pages/components/exampleCard";
import { useRouter } from "next/router";

const SalesManagerPanel = () => {
  const [view, setView] = useState(null);
  const [products, setProducts] = useState([]);
  const router = useRouter();
  useEffect(() => {
    getProducts().then(res => {
      if (res) {
        setProducts(res);
      }
    });
  }, []);

  const setCurrentView = (view) => {
    setView(view);
  }
  
  
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '20%', background: '#f8f8f8', minHeight: '100vh', padding: '20px' }}>
        <h1>Sales Manager Panel</h1>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li>
            <Button variant="primary" onClick={() => setCurrentView('products')}>Products</Button>
          </li>
          <br /> {/* Add a line break for space */}
          <li>
            <Button variant="primary" onClick={() => router.push('/manager/graphs')}> Invoice </Button>
          </li>
          <br /> {/* Add a line break for space */}
          <li>
            <Button variant="primary" onClick={() => router.push('/manager/refunds')}> Refunds </Button>
          </li>
          {/* Add more navigation buttons here */}
        </ul>

      </div>
      <div style={{ width: '80%', padding: '20px' }}>
        {view === 'products' &&
          <Container>
            <Row>
              {products.map((product) => (
                <Col md={4} sm={12} lg={3} key={product.id}>
                  <WideCard
                    item={product}
                    click={() => router.push(`/manager/edit/?id=${product.id}`)}
                    buttonText="Edit"
                    buttonDisabled={false}
                  />
                </Col>
              ))}
            </Row>
          </Container>
        }
        {/* Add a similar structure for invoices if needed */}
      </div>
    </div>
  );
};

export default SalesManagerPanel;
