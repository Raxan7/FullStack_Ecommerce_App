import React from 'react'
import Message from '../components/Message'
import BottomNavBar from '../components/BottomNavBar'

function NotFoundPage() {
    return (
        <div>
            <Message variant='danger'>
                404 Not Found
            </Message>
            <BottomNavBar />
        </div>
    )
}

export default NotFoundPage
