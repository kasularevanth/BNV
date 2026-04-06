const StatCard = ({ label, value, sub, badge, badgeColor, icon: Icon }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
        {badge ? (
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        ) : Icon ? (
          <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-indigo-600" />
          </div>
        ) : null}
      </div>
      <div>
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

export default StatCard;
