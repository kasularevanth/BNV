import DashboardLayout from '../components/common/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Mail, User, CreditCard, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const fields = [
    { icon: User, label: 'Full Name', value: user?.name },
    { icon: Mail, label: 'Email Address', value: user?.email },
    { icon: Shield, label: 'Role', value: user?.role, capitalize: true },
    { icon: CreditCard, label: 'Plan', value: user?.plan || 'Free', capitalize: true },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your account details</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Cover + avatar */}
          <div className="h-24 sm:h-32 bg-gradient-to-r from-indigo-500 to-indigo-700" />
          <div className="px-5 sm:px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 mb-6">
              <div className="w-20 h-20 bg-white rounded-2xl border-4 border-white shadow-md flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-indigo-700">{initials}</span>
                )}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                {user?.plan === 'premium' ? 'Premium' : 'Free'} Plan
              </span>
            </div>

            <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-400 mb-6">{user?.email}</p>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(({ icon: Icon, label, value, capitalize }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {label}
                    </span>
                  </div>
                  <p className={`text-sm font-semibold text-gray-900 ${capitalize ? 'capitalize' : ''}`}>
                    {value || '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
