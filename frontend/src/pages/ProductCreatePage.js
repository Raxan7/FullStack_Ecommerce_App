import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import { createProduct } from '../actions/productActions'
import { useHistory } from 'react-router'
import { checkTokenValidation, logout } from '../actions/userActions'
import { CREATE_PRODUCT_RESET } from '../constants'
import Message from '../components/Message';
import Loader from '../components/Loader'; // Import a loader component
import BottomNavBar from '../components/BottomNavBar'; // Import the component

const ProductCreatePage = () => {

    let history = useHistory()
    const dispatch = useDispatch()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState(false)
    const [image, setImage] = useState(null)
    const [category, setCategory] = useState("")
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false); // State to manage loader visibility
    const [images, setImages] = useState([]);

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // create product reducer
    const createProductReducer = useSelector(state => state.createProductReducer)
    const { product, success: productCreationSuccess, error: productCreationError } = createProductReducer

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        }
        dispatch(checkTokenValidation())

        // Fetch categories from the backend
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/categories/`)
                const data = await response.json()
                setCategories(data)
            } catch (error) {
                console.error("Failed to fetch categories:", error)
            }
        }
        fetchCategories()
    }, [dispatch, userInfo, history])

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        let form_data = new FormData();
        form_data.append('name', name);
        form_data.append('description', description);
        form_data.append('price', price);
        form_data.append('stock', stock);
        form_data.append('image', image);
        form_data.append('category', category);

        // Handle single image (backward compatibility)
        if (image) {
            form_data.append('image', image);
        }

        // Handle multiple images
        images.forEach((img) => {
            form_data.append('images', img);
        });

        console.log("Submitting form data:", Object.fromEntries(form_data.entries())); // Log form data for debugging

        dispatch(createProduct(form_data)).finally(() => setLoading(false));
    };

    if (productCreationSuccess) {
        alert("Product successfully created.");
        history.push(`/product/${product.id}/`);
        dispatch({
            type: CREATE_PRODUCT_RESET
        });
    }

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.");
        dispatch(logout());
        history.push("/login");
        window.location.reload();
    }

    return (
        <div>
            {loading && <Loader />} {/* Display loader when loading is true */}
            {productCreationError && (
                <Message variant='danger'>
                    {typeof productCreationError === 'string'
                        ? productCreationError
                        : productCreationError.image
                        ? productCreationError.image[0]
                        : "An error occurred"}
                </Message>
            )}
            <span
                className="d-flex justify-content-center text-info"
                >
                <em>New Product</em>
            </span>
            <Form onSubmit={onSubmit}>

                <Form.Group controlId='name'>
                    <Form.Label>
                        <b>
                            Product Name
                        </b>
                    </Form.Label>
                    <Form.Control
                        required
                        autoFocus={true}
                        type="text"
                        value={name}
                        placeholder="product name"
                        onChange={(e) => setName(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='description'>
                    <Form.Label>
                        <b>
                            Product Description
                        </b>
                    </Form.Label>
                    <Form.Control
                        required
                        type="text"
                        value={description}
                        placeholder="product description"
                        onChange={(e) => setDescription(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='price'>
                    <Form.Label>
                        <b>
                            Price
                        </b>
                    </Form.Label>
                    <Form.Control
                        required
                        type="text"
                        pattern="[0-9]+(\.[0-9]{1,2})?%?"
                        value={price}
                        placeholder="199.99"
                        step="0.01"
                        maxLength="8"
                        onChange={(e) => setPrice(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <span style={{ display: "flex" }}>
                    <label>In Stock</label>
                    <input
                        type="checkbox"
                        value={stock}
                        className="ml-2 mt-2"
                        onChange={() => setStock(!stock)}
                    />
                </span>

                <Form.Group controlId='image'>
                    <Form.Label>
                        <b>
                            Product Image
                        </b>
                    </Form.Label>
                    <Form.Control
                        required
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='images'>
                    <Form.Label>
                        <b>Additional Images</b>
                    </Form.Label>
                    <Form.Control
                        type="file"
                        multiple
                        onChange={(e) => setImages([...e.target.files])}
                    />
                    <Form.Text className="text-muted">
                        Select multiple images (optional)
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId='category'>
                    <Form.Label>
                        <b>Category</b>
                    </Form.Label>
                    <Form.Control
                        as="select"
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Button
                    type="submit"
                    variant='success'
                    className="btn-sm button-focus-css"
                >
                    {loading ? <Loader /> : "Save Product"} {/* Replace text with loader */}
                </Button>
                <Button
                    type="button"
                    variant='primary'
                    className="btn-sm ml-2 button-focus-css"
                    onClick={() => history.push("/")}
                >
                    Cancel
                </Button>
            </Form>
            <BottomNavBar /> {/* Add the BottomNavBar */}
        </div>
    )
}

export default ProductCreatePage
