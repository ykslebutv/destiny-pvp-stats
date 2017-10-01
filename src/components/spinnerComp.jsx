import React, { PropTypes } from 'react';
// global Spinner
//import Spinner from 'spinner';

export default class SpinnerComp extends React.Component {
    componentDidMount() {
        this.initSpinner();
    }

    initSpinner() {
        const opts = {
            scale: this.props.scale || 0.5,
            opacity: 0.5,
            color: this.props.color || '#337ab7',
            lines: 10,
            position: 'relative'
        };
        const spinner = new Spinner(opts).spin();
        this.container.appendChild(spinner.el);
    }

    render() {
        return (
            <div
                className="spinner"
                ref={ node => (this.container = node) }
            />
        );
    }
}
