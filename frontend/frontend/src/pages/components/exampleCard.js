import { Card, CardGroup, Button, Container } from "react-bootstrap";
import { API_PATH } from "../../../constant";
import Rating from "./Rating";

export default function WideCard({ click, item, addToCart, buttonText, buttonDisabled = "Go to collection",  }) {

    const descriptionFilter = (description) => {
        const words = description.split(" ");
        if (words.length > 15) {
            return words.slice(0, 15).join(" ") + "...";
        }
        return description;
    }

    const nameFilter = (name) => {
        if (name.length > 30) {
            return name.slice(0,30) + "...";
        }
        return name;
    }
    

    return (
        <>
            <Card className="my-3 p-3 rounded"  style={{ height: '450px' }}>
                
            {item.discount > 0 && // If discount is greater than 0, show the discount tag.
                    <div className="discount-tag">
                    {item.discount}% Discount
                    </div>
                }
                
                <Card.Img className="w-100" style={{ height: "200px"}} variant="top" src={API_PATH+item.image} onClick={click} />
                <Card.Body>
                    <Card.Title as='div' onClick={click} className="break-words">
                    <strong>{nameFilter(item.product_name)}</strong>
                    </Card.Title>

                <Card.Text as='div'>
                    <div className="my-3">
                        <Rating value={item.rating} text={`${item.numReviews} ratings`} color={'#f8e825'} />
                       </div>
                </Card.Text>
                <Card.Text as="h3">
                ${item.price}
                </Card.Text>

                </Card.Body>
                    
                <Button
      className="btn btn-dark mb-0"
      variant="primary"
        onClick={buttonText === 'Buy' ? addToCart : click} 
        disabled={buttonText === 'Buuy' ? false : buttonDisabled}
    >
      {buttonText}
    </Button>

                
                  
            </Card>
        
        </>

    );
}
