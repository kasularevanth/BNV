import DashboardLayout from '../components/common/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-700">
                {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="inline-block mt-1 text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Plan</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5 capitalize">{user?.plan || 'Free'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Role</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
