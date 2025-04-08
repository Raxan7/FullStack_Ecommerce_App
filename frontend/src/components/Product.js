import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import React from 'react'

function Product({ product }) {
    // Construct the full image URL using the environment variable
    const imageUrl = product.image.startsWith('http') 
        ? product.image 
        : `${process.env.REACT_APP_API_BASE_URL}${product.image}`;

    return (
        <div>
            <Card className="mb-4 rounded">
                <Card.Body>
                    <Link to={`/product/${product.id}`} style={{ color: 'black' }}>
                        <Card.Img 
                            variant="top" 
                            src={imageUrl} 
                            height="162"
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.src = ''; // Remove placeholder logic
                            }}
                        />
                    </Link>
                    <Link to={`/product/${product.id}`} style={{ color: 'black' }}>
                        <Card.Title as="div">
                            <strong>{product.name}</strong>
                        </Card.Title>
                    </Link>
                    <Card.Text as="h3">
                        Tsh {product.price}
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Product