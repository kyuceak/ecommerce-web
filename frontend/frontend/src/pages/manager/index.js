import {useEffect, useState} from "react";
import {getManager} from "@/utils/getter";
import {Col, Container, Row} from "react-bootstrap";
import WideCard from "@/pages/components/exampleCard";
import { useRouter } from "next/router";
export default function Manager() {
    const [product, setProduct] = useState([]);
    const router = useRouter();
    useEffect(() => {

        getManager().then(r => {
            console.log(r.status);
            if(!r) {
                router.push("/loginRegisterPage")
            }
            else {
                setProduct(r)
            }
        });

        console.log(product)
    }, []);
    return (
        product === [] ? <div>loading</div> :
        <Container>
            <Row>
                {product.map((item) => (
                    <Col md={4} sm={12} lg={3} key={item.id}>
                        <WideCard
                            item={item}
                            click={() => router.push(`/manager/edit/?id=${item.id}`)}
                            buttonText="Edit"
                            buttonDisabled={false}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}