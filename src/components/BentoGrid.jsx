import PropTypes from 'prop-types';

const BentoGrid = ({ children, className = '' }) => {
  return (
    <div className={`
      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
      auto-rows-[300px]
      gap-6
      p-6
      ${className}
    `}>
      {children}
    </div>
  );
};

BentoGrid.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default BentoGrid;
