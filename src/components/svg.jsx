class SvgArc extends React.Component {

	polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
          x: centerX + (radius * Math.cos(angleInRadians)),
          y: centerY + (radius * Math.sin(angleInRadians))
      };
  }

  describeArc(x, y, radius, startAngle, endAngle) {
      var start = this.polarToCartesian(x, y, radius, endAngle);
      var end = this.polarToCartesian(x, y, radius, startAngle);
      var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      var d = [
          "M", start.x, start.y, 
          "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(" ");
      return d;
  }

  render() {
  	const { x, y, r, start, end } = this.props;
    const arcpath = this.describeArc(+x, +y, +r, +start, +end);
    return (
        <svg height="500" width="500">
            <path id="arc1" fill="none" stroke="#446688" stroke-width="2" d={ arcpath } />
        </svg>
    );
  }
}

export { SvgArc };
