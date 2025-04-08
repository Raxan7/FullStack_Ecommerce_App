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
                            style={{ 
                                width: '100%', 
                                height: 'auto', 
                                aspectRatio: '1 / 1', // Maintain a square aspect ratio
                                objectFit: 'cover', // Ensure the image covers the card without distortion
                                borderRadius: '10px' 
                            }}
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.src = ''; // Remove placeholder logic
                            }}
                        />
                    </Link>
                    <Link to={`/product/${product.id}`} style={{ color: 'black' }}>
                        <Card.Title as="div" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <strong>{product.name}</strong>
                        </Card.Title>
                    </Link>
                    <Card.Text as="h3" style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Tsh {product.price}
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Product