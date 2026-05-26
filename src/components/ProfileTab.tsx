import { User, LogOut, ChevronRight, Sparkles, Target, Bell, Shield, HelpCircle } from 'lucide-react';
import { useProfile } from '../hooks/useAppData';
import { useState } from 'react';

export function ProfileTab() {
  const { profile, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.full_name || '');
  const [showSkinTypeModal, setShowSkinTypeModal] = useState(false);

  const skinTypes = ['normal', 'dry', 'oily', 'combination', 'sensitive'];

  const handleSaveName = () => {
    if (editName.trim()) {
      updateProfile({ full_name: editName.trim() });
      setIsEditing(false);
    }
  };

  const handleSkinTypeChange = (type: string) => {
    updateProfile({ skin_type: type });
    setShowSkinTypeModal(false);
  };

  const menuItems = [
    { icon: Bell, label: 'Notifications', desc: 'Reminders and alerts' },
    { icon: Shield, label: 'Privacy', desc: 'Data and security' },
    { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs and contact' },
  ];

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 pt-12 pb-20 px-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-white text-2xl font-semibold">Profile</h1>
          <p className="text-teal-100 text-sm mt-1">Manage your account settings</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 -mt-12">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profile?.avatar_url || 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={profile?.full_name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center border-2 border-white">
                  <User className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="px-4 py-2 bg-teal-500 text-white rounded-lg font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div>
                    <h2
                      className="text-xl font-semibold text-slate-800 cursor-pointer hover:text-teal-600"
                      onClick={() => {
                        setEditName(profile?.full_name || '');
                        setIsEditing(true);
                      }}
                    >
                      {profile?.full_name || 'Sarah Johnson'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Tap to edit name</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skin Info */}
          <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-lg">
                <Sparkles className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Skin Type</p>
                <p className="font-medium text-slate-700 capitalize">{profile?.skin_type || 'Combination'}</p>
              </div>
            </div>
            <button
              onClick={() => setShowSkinTypeModal(true)}
              className="text-teal-600 text-sm font-medium hover:text-teal-700"
            >
              Change
            </button>
          </div>

          {/* Skin Goals */}
          <div className="border-t border-slate-100 px-6 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <p className="font-medium text-slate-700">Skin Goals</p>
            </div>
            <div className="flex flex-wrap gap-2 ml-11">
              {(profile?.skin_goals || ['improve hydration', 'reduce acne', 'anti-aging']).map((goal, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm capitalize"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${
                i < menuItems.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <item.icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-700">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          ))}
        </div>

        {/* Sign Out */}
        <button className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-600 rounded-2xl font-medium hover:bg-slate-200 transition-colors">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>

        {/* App Version */}
        <p className="text-center text-sm text-slate-400 mt-6">
          iDermal AI v1.0.0
        </p>
      </div>

      {/* Skin Type Modal */}
      {showSkinTypeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowSkinTypeModal(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 pb-8" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 text-center">Select Skin Type</h3>
            <div className="mt-6 space-y-2">
              {skinTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleSkinTypeChange(type)}
                  className={`w-full py-4 px-6 rounded-xl text-left font-medium transition-all ${
                    profile?.skin_type === type
                      ? 'bg-teal-50 text-teal-700 border-2 border-teal-500'
                      : 'bg-slate-50 text-slate-700 border-2 border-transparent hover:bg-slate-100'
                  }`}
                >
                  <span className="capitalize">{type}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSkinTypeModal(false)}
              className="w-full mt-6 py-4 bg-slate-100 text-slate-700 rounded-xl font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
