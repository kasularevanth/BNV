const StatCard = ({ label, value, sub, badge, badgeColor, icon: Icon }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider leading-tight">
          {label}
        </span>
        {badge ? (
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${badgeColor}`}>
            {badge}
          </span>
        ) : Icon ? (
          <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-indigo-600" />
          </div>
        ) : null}
      </div>
      <div>
        <span className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</span>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

export default StatCard;
