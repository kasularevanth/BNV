const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  active: 'bg-blue-50 text-blue-700 border border-blue-200',
  completed: 'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-gray-100 text-gray-500 border border-gray-200',
};

const STATUS_DOT = {
  pending: 'bg-amber-500',
  active: 'bg-blue-500',
  completed: 'bg-green-500',
  cancelled: 'bg-gray-400',
};

const OrderStatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] || STATUS_DOT.pending}`} />
    {status}
  </span>
);

export default OrderStatusBadge;
