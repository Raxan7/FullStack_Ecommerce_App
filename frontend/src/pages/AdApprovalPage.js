import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, Row, Col, Container, Spinner, Alert } from 'react-bootstrap'
import { listPendingAds, approveAd } from '../actions/adActions'
import { AD_APPROVAL_RESET } from '../constants'
import BottomNavBar from '../components/BottomNavBar'

function AdApprovalPage({ history }) {
  const dispatch = useDispatch()

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const pendingAdsList = useSelector(state => state.pendingAdsList)
  const { loading, error, pendingAds } = pendingAdsList

  const adApproval = useSelector(state => state.adApproval)
  const { success: successApprove } = adApproval

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      if (!userInfo || !userInfo.isAdmin) {
        history.push('/login');
      }

      dispatch(listPendingAds());

      if (successApprove) {
        dispatch({ type: AD_APPROVAL_RESET });
        dispatch(listPendingAds());
      }
    }

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [dispatch, history, userInfo, successApprove]);

  const approveHandler = (id) => {
    if (window.confirm('Are you sure you want to approve this ad?')) {
      dispatch(approveAd(id))
    }
  }

  return (
    <Container>
      <Row className="align-items-center">
        <Col>
          <h2 className="my-4">Pending Ads for Approval</h2>
        </Col>
      </Row>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>AD TITLE</th>
              <th>ADVERTISER</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>SUBMITTED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pendingAds.map(ad => (
              <tr key={ad.id}>
                <td>{ad.id}</td>
                <td>{ad.ad_title}</td>
                <td>{ad.name}</td>
                <td><a href={`mailto:${ad.email}`}>{ad.email}</a></td>
                <td><a href={`tel:${ad.phone_number}`}>{ad.phone_number}</a></td>
                <td>{new Date(ad.created_at).toLocaleDateString()}</td>
                <td>
                  <Button 
                    variant="success" 
                    className="btn-sm" 
                    onClick={() => approveHandler(ad.id)}
                  >
                    Approve
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <BottomNavBar />
    </Container>
  )
}

export default AdApprovalPage