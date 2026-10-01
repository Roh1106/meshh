import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppUser, PRESET_USERS } from '../constants/app';

interface AuthContextValue {
  currentUser: AppUser;
  isAdmin: boolean;
  availableUsers: AppUser[];
  switchUser: (userId: string) => void;
  loginWithCredentials: (identifier: string, role?: 'student' | 'admin') => Promise<{ success: boolean; message: string }>;
  registerNewStudent: (data: {
    name: string;
    email: string;
    department: string;
    year: string;
    rollNo: string;
  }) => Promise<AppUser>;
  enrollInCourse: (courseId: string) => Promise<boolean>;
  unenrollFromCourse: (courseId: string) => Promise<boolean>;
  adminEnrollStudentInCourse: (studentId: string, courseId: string) => Promise<boolean>;
  isEnrolledInCourse: (courseId: string) => boolean;
  updateCurrentUserProfile: (updated: Partial<AppUser>) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_ACTIVE_USER = 'skillmesh_active_user_id';
const STORAGE_USERS_LIST = 'skillmesh_users_list_v2';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<AppUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERS_LIST);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge preset users in case new presets were added
          const merged = [...parsed];
          for (const preset of PRESET_USERS) {
            if (!merged.some((u) => u.id === preset.id)) {
              merged.push(preset);
            }
          }
          return merged;
        }
      }
    } catch {
      // ignore
    }
    return PRESET_USERS;
  });

  const [activeUserId, setActiveUserId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_ACTIVE_USER) || PRESET_USERS[0].id;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync users to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USERS_LIST, JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  const currentUser = users.find((u) => u.id === activeUserId) || users[0];
  const isAdmin = currentUser.role === 'admin';

  const switchUser = useCallback((userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setActiveUserId(userId);
      localStorage.setItem(STORAGE_ACTIVE_USER, userId);
      setIsLoginModalOpen(false);
    }
  }, [users]);

  const loginWithCredentials = useCallback(
    async (identifier: string, targetRole: 'student' | 'admin' = 'student'): Promise<{ success: boolean; message: string }> => {
      await new Promise((r) => setTimeout(r, 120));
      const clean = identifier.trim().toLowerCase();
      if (!clean) {
        return { success: false, message: 'Please enter a valid Roll Number, Email, or Name.' };
      }

      const match = users.find(
        (u) =>
          u.email.toLowerCase() === clean ||
          u.rollNo?.toLowerCase() === clean ||
          u.name.toLowerCase().includes(clean)
      );

      if (match) {
        setActiveUserId(match.id);
        localStorage.setItem(STORAGE_ACTIVE_USER, match.id);
        setIsLoginModalOpen(false);
        return {
          success: true,
          message: `Logged in as ${match.name} (${match.role === 'admin' ? 'Faculty Admin' : 'Student'}).`,
        };
      }

      // If user typed 'admin' or 'dean'
      if (clean.includes('admin') || clean.includes('dean') || clean.includes('rao')) {
        const adminUser = users.find((u) => u.role === 'admin');
        if (adminUser) {
          setActiveUserId(adminUser.id);
          localStorage.setItem(STORAGE_ACTIVE_USER, adminUser.id);
          setIsLoginModalOpen(false);
          return { success: true, message: `Logged in as Administrator (${adminUser.name}).` };
        }
      }

      return {
        success: false,
        message: 'No registered BVCOE account found matching this identifier. You can register below or select from presets.',
      };
    },
    [users]
  );

  const registerNewStudent = useCallback(
    async (data: {
      name: string;
      email: string;
      department: string;
      year: string;
      rollNo: string;
    }): Promise<AppUser> => {
      await new Promise((r) => setTimeout(r, 150));
      const newId = `usr_${Date.now()}`;
      const newUser: AppUser = {
        id: newId,
        name: data.name,
        email: data.email,
        role: 'student',
        avatar: '',
        department: data.department,
        year: data.year,
        rollNo: data.rollNo,
        bio: `Undergraduate student at Bharti Vidyapeeth College of Engineering (${data.department}).`,
        karma: 100,
        verifiedSkillsCount: 1,
        mentoringSessionsCount: 0,
        resourcesContributedCount: 0,
        languages: ['English', 'Hindi'],
        badges: [{ id: 'b_new', name: 'New BVCOE Member', icon: 'award', date: '2026' }],
        enrolledCourseIds: ['course_dsa'],
      };

      setUsers((prev) => [newUser, ...prev]);
      setActiveUserId(newId);
      localStorage.setItem(STORAGE_ACTIVE_USER, newId);
      setIsLoginModalOpen(false);
      return newUser;
    },
    []
  );

  const isEnrolledInCourse = useCallback(
    (courseId: string) => {
      return (currentUser.enrolledCourseIds || []).includes(courseId);
    },
    [currentUser]
  );

  const enrollInCourse = useCallback(
    async (courseId: string) => {
      await new Promise((r) => setTimeout(r, 120));
      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (u.id === currentUser.id) {
            const currentList = u.enrolledCourseIds || [];
            if (!currentList.includes(courseId)) {
              return { ...u, enrolledCourseIds: [...currentList, courseId] };
            }
          }
          return u;
        })
      );
      return true;
    },
    [currentUser]
  );

  const unenrollFromCourse = useCallback(
    async (courseId: string) => {
      await new Promise((r) => setTimeout(r, 100));
      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (u.id === currentUser.id) {
            return {
              ...u,
              enrolledCourseIds: (u.enrolledCourseIds || []).filter((id) => id !== courseId),
            };
          }
          return u;
        })
      );
      return true;
    },
    [currentUser]
  );

  const adminEnrollStudentInCourse = useCallback(
    async (studentId: string, courseId: string) => {
      await new Promise((r) => setTimeout(r, 100));
      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (u.id === studentId) {
            const currentList = u.enrolledCourseIds || [];
            if (!currentList.includes(courseId)) {
              return { ...u, enrolledCourseIds: [...currentList, courseId] };
            }
          }
          return u;
        })
      );
      return true;
    },
    []
  );

  const updateCurrentUserProfile = useCallback(
    (updated: Partial<AppUser>) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, ...updated } : u))
      );
    },
    [currentUser]
  );

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        availableUsers: users,
        switchUser,
        loginWithCredentials,
        registerNewStudent,
        enrollInCourse,
        unenrollFromCourse,
        adminEnrollStudentInCourse,
        isEnrolledInCourse,
        updateCurrentUserProfile,
        openLoginModal,
        closeLoginModal,
        isLoginModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
