import React from 'react';
import Spinner from 'spin';

export default class SpinnerComp extends React.Component {
    componentDidMount() {
        this.initSpinner();
    }

    initSpinner() {
        const scale = parseFloat(this.props.scale, 10) || 1;
        const radius = 10 * scale;
        const width = 4 * scale;
        const length = 7 * scale;

        const opts = {
            radius: radius,
            width: width,
            length: length,
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
