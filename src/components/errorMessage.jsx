import React from 'react';

const ErrorMessage = props => (
    <div className="error_message">
        <span>
            { props.message }
        </span>
    </div>
);

export default ErrorMessage;
