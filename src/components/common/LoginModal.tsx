import React, { useState } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../ui/Avatar';
import {
  ShieldCheck,
  UserCheck,
  Check,
  LogIn,
  UserPlus,
  KeyRound,
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { DEFAULT_CAMPUS } from '../../constants/app';

export const LoginModal: React.FC = () => {
  const {
    currentUser,
    availableUsers,
    switchUser,
    loginWithCredentials,
    registerNewStudent,
    isLoginModalOpen,
    closeLoginModal,
  } = useAuth();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState<'profiles' | 'credentials' | 'register'>('profiles');

  // Credentials Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Student Registration State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRollNo, setRegRollNo] = useState('');
  const [regDepartment, setRegDepartment] = useState(DEFAULT_CAMPUS.departmentList[0]);
  const [regYear, setRegYear] = useState('1st Year');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSelectUser = (userId: string) => {
    switchUser(userId);
    const target = availableUsers.find((u) => u.id === userId);
    showSuccess(
      `Switched session to ${target?.name} (${target?.role === 'admin' ? 'Faculty Admin' : 'Student'}).`,
      'Account Switched'
    );
  };

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      showError('Please enter your Roll Number, BVCOE Email, or Name.');
      return;
    }
    setIsSubmitting(true);
    const res = await loginWithCredentials(identifier);
    setIsSubmitting(false);

    if (res.success) {
      showSuccess(res.message, 'Authenticated');
      setIdentifier('');
      setPassword('');
    } else {
      showError(res.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regRollNo.trim()) {
      showError('Please fill in Name, BVCOE Email, and Roll Number.');
      return;
    }

    setIsRegistering(true);
    try {
      const newStudent = await registerNewStudent({
        name: regName.trim(),
        email: regEmail.trim(),
        rollNo: regRollNo.trim().toUpperCase(),
        department: regDepartment,
        year: regYear,
      });
      setIsRegistering(false);
      showSuccess(
        `Welcome to BVCOE SkillMesh, ${newStudent.name}! You are now registered and logged in.`,
        'Student Registered'
      );
      setRegName('');
      setRegEmail('');
      setRegRollNo('');
    } catch {
      setIsRegistering(false);
      showError('Registration failed. Please check input data.');
    }
  };

  return (
    <Modal
      isOpen={isLoginModalOpen}
      onClose={closeLoginModal}
      title="Campus Authentication & User Profiles"
      description={`Bharati Vidyapeeth College of Engineering (${DEFAULT_CAMPUS.shortName}) Student & Admin Access`}
      maxWidth="md"
    >
      <div className="space-y-4 text-xs sm:text-sm">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('profiles')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'profiles'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Switch Profiles</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'credentials'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Login Credentials</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'register'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Student</span>
          </button>
        </div>

        {/* TAB 1: 1-Click User Profiles */}
        {activeTab === 'profiles' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* Admin Account Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Faculty & Administrator Logins
                  </h4>
                </div>
                <span className="text-[10px] text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                  Full Course & Admin Privileges
                </span>
              </div>

              <div className="space-y-2">
                {availableUsers
                  .filter((u) => u.role === 'admin')
                  .map((user) => {
                    const isActive = currentUser.id === user.id;
                    return (
                      <div
                        key={user.id}
                        onClick={() => handleSelectUser(user.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isActive
                            ? 'border-purple-500 bg-purple-50/60 shadow-xs ring-1 ring-purple-400'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar src={user.avatar} name={user.name} size="md" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-gray-900 text-sm">{user.name}</span>
                              <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider">
                                Faculty Admin
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs truncate">{user.designation}</p>
                            <p className="text-gray-400 text-[11px] truncate">{user.email}</p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-600 text-white text-xs font-semibold">
                              <Check className="w-3.5 h-3.5" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="px-3 py-1 rounded-lg border border-purple-300 text-purple-700 bg-white hover:bg-purple-50 text-xs font-semibold"
                            >
                              Login Admin
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Student Accounts Section */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    BVCOE Student Logins
                  </h4>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">
                  {availableUsers.filter((u) => u.role !== 'admin').length} enrolled students
                </span>
              </div>

              <div className="space-y-2">
                {availableUsers
                  .filter((u) => u.role !== 'admin')
                  .map((user) => {
                    const isActive = currentUser.id === user.id;
                    return (
                      <div
                        key={user.id}
                        onClick={() => handleSelectUser(user.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isActive
                            ? 'border-blue-500 bg-blue-50/60 shadow-xs ring-1 ring-blue-400'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar src={user.avatar} name={user.name} size="md" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                                {user.name}
                              </span>
                              <span className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-700 text-[10px] font-semibold">
                                {user.year}
                              </span>
                            </div>
                            <p className="text-gray-600 text-[11px] truncate">
                              <span className="font-mono font-medium text-gray-700">{user.rollNo}</span> · {user.department}
                            </p>
                            <p className="text-gray-400 text-[10px] truncate">{user.email}</p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                              <Check className="w-3.5 h-3.5" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="px-2.5 py-1 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-xs font-medium"
                            >
                              Switch
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Credential Login */}
        {activeTab === 'credentials' && (
          <form onSubmit={handleCredentialLogin} className="space-y-3.5 py-1">
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-xs text-blue-900 space-y-1">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Demo Credentials:
              </span>
              <p className="text-[11px] text-blue-800">
                • <strong>Admin:</strong> Type <code className="bg-white px-1 rounded text-blue-700">dr.pbrao.admin@bvu.edu.in</code> or <code className="bg-white px-1 rounded text-blue-700">admin</code>
              </p>
              <p className="text-[11px] text-blue-800">
                • <strong>Student:</strong> Type roll number <code className="bg-white px-1 rounded text-blue-700">BV-22CS084</code> (Rohan) or <code className="bg-white px-1 rounded text-blue-700">BV-22EC012</code> (Neha)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                BVCOE Roll Number or Institutional Email
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. BV-22CS084 or dr.pbrao.admin@bvu.edu.in"
                className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Campus Password / Pin
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (Default: demo)"
                className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-9 rounded-lg bg-blue-600 text-white font-semibold text-xs sm:text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to SkillMesh'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Register New Student */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 py-1">
            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg text-xs text-emerald-900 space-y-1">
              <span className="font-semibold flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                Bharti Vidyapeeth Student Self-Registration:
              </span>
              <p className="text-[11px] text-emerald-800">
                Register as an enrolled BVCOE undergrad to participate in peer learning, take higher exams, and register for courses.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Student Name *</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Tanvi Kulkarni"
                className="w-full h-8.5 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">BVCOE Email *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="tanvi.k@bvu.edu.in"
                  className="w-full h-8.5 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Roll / PRN No. *</label>
                <input
                  type="text"
                  required
                  value={regRollNo}
                  onChange={(e) => setRegRollNo(e.target.value)}
                  placeholder="BV-23CS102"
                  className="w-full h-8.5 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 uppercase font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Department</label>
                <select
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                  className="w-full h-8.5 rounded-lg border border-gray-300 px-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  {DEFAULT_CAMPUS.departmentList.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Year</label>
                <select
                  value={regYear}
                  onChange={(e) => setRegYear(e.target.value)}
                  className="w-full h-8.5 rounded-lg border border-gray-300 px-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="1st Year">1st Year (FE)</option>
                  <option value="2nd Year">2nd Year (SE)</option>
                  <option value="3rd Year">3rd Year (TE)</option>
                  <option value="4th Year">4th Year (BE)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full h-9 rounded-lg bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isRegistering ? 'Registering Student...' : 'Create Account & Sign In'}</span>
              </button>
            </div>
          </form>
        )}

        <div className="pt-2 text-center text-[11px] text-gray-500 border-t border-gray-100 flex items-center justify-between">
          <span>Active Institution: <strong>{DEFAULT_CAMPUS.name}</strong></span>
          <span className="font-mono text-gray-400">Node: {DEFAULT_CAMPUS.id}</span>
        </div>
      </div>
    </Modal>
  );
};
