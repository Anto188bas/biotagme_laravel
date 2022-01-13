import PropTypes                  from 'prop-types';
import React                      from 'react';
import {Alert, Col, Row, Spinner} from 'reactstrap';
import {goToTop}                  from 'react-scrollable-anchor';


export const LoadingComponent = (props) => {
    const className = ((props.className + ' ') || '') + 'text-center';
    const message = (props.message) ? (
        <React.Fragment>
            <br/>
            <h3>{props.message}</h3>
        </React.Fragment>
    ) : null;
    return <div className={className}>
        <Spinner style={{width: '3rem', height: '3rem'}}/>
        {message}
    </div>;
};

LoadingComponent.propTypes = {
    message:   PropTypes.string,
    className: PropTypes.string,
};

export const ErrorComponent = (props) => (
    <Alert color="danger">
        <h4 className="alert-heading">Error!</h4>
        <p>{props.errorMessage}</p>
    </Alert>
);

ErrorComponent.propTypes = {
    errorMessage: PropTypes.string.isRequired,
};

export const BackToTop = (props) => {
    return (
        <Row>
            <Col xs={12} className="text-right mt-4">
                <a href="#" onClick={() => goToTop()}>Go to top</a>
            </Col>
        </Row>
    );
};
