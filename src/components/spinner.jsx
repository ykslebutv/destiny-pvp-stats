import React from 'react';

const Spinner = (props) => {
    const size = props.size || 'fa-sm';
    const classes = `fas fa-spinner fa-pulse ${ size }`;
    return (
        <span>
            <i className={ classes } />
        </span>
    );
};

export default Spinner;