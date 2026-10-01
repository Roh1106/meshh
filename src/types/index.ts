export type PeerStatus = 'available' | 'busy' | 'offline';

export interface Peer {
  id: string;
  name: string;
  avatar: string;
  department: string;
  year: string;
  roleTag?: 'Tutor' | 'Dept Rank 1' | 'Dept Rank 2' | 'Dept Rank 3' | 'Researcher' | 'Mentor';
  rating: number;
  sessionCount: number;
  verified: boolean;
  skills: string[];
  canTeach: string[];
  wantsToLearn: string[];
  availability: string;
  location: string;
  bio?: string;
  isSaved?: boolean;
}

export interface SkillSwapListing {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorMeta: string;
  timeAgo: string;
  location: string;
  title: string;
  description: string;
  seekingSkill: string;
  interestedCount: number;
  interestedAvatars: string[];
  tag?: string;
}

export interface AcademicResource {
  id: string;
  title: string;
  subject: string;
  topic: string;
  format: 'PDF' | 'ZIP' | 'CODE' | 'NOTES';
  fileSize: string;
  semester: string;
  department: string;
  language: string;
  verified: boolean;
  verifiedBy?: string;
  rating: number;
  ratingsCount: number;
  downloadCount: number;
  author: string;
  authorRole?: string;
  updatedAt: string;
  description: string;
  isSaved?: boolean;
  isOfflineAvailable?: boolean;
}

export interface QuestionAnswer {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorDepartment: string;
  createdAt: string;
  content: string;
  votes: number;
  isAccepted: boolean;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  authorName: string;
  authorAvatar: string;
  authorYear: string;
  department: string;
  answersCount: number;
  isSolved: boolean;
  usefulVotes: number;
  createdAt: string;
  answers?: QuestionAnswer[];
  isSaved?: boolean;
}

export type SessionStatus = 'Requested' | 'Scheduled' | 'In progress' | 'Completed' | 'Cancelled';

export interface MentoringSession {
  id: string;
  topic: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  menteeName: string;
  menteeAvatar: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  status: SessionStatus;
  rating?: number;
  notes?: string;
  meetingLinkOrVenue?: string;
}

export interface TestFreeResource {
  id: string;
  title: string;
  type: 'PDF Guide' | 'Cheat Sheet' | 'Lecture Notes' | 'Formula Sheet' | 'Open Textbook';
  size?: string;
  description: string;
  authorOrSource: string;
  downloadUrl?: string;
}

export interface PracticeTest {
  id: string;
  title: string;
  subject: string;
  courseId?: string;
  department: string;
  questionsCount: number;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Higher / Mastery';
  isHigherTest?: boolean;
  semester: string;
  attemptsCount: number;
  highScorePercentage?: number;
  lastAttemptScore?: number;
  isAvailableOffline: boolean;
  freelyAvailableResources?: TestFreeResource[];
  questions?: {
    id: string;
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface HistoryItem {
  id: string;
  type: 'viewed_resource' | 'attempted_test' | 'asked_question' | 'answered_question' | 'mentoring_session' | 'uploaded_resource' | 'sync_event' | 'profile_update';
  title: string;
  timestamp: string;
  dateGroup: 'Today' | 'Yesterday' | 'This week' | 'Older';
  status?: string;
  link?: string;
  details?: string;
}

export interface SavedItem {
  id: string;
  originalId: string;
  type: 'resource' | 'question' | 'peer' | 'session';
  title: string;
  subtitle: string;
  savedAt: string;
  metadata?: string;
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

// Karma Ledger Transaction
export interface KarmaTransaction {
  id: string;
  userId: string;
  amount: number;
  action:
    | 'answered_question'
    | 'accepted_answer'
    | 'resource_contribution'
    | 'completed_session'
    | 'useful_validation'
    | 'moderation_adjustment';
  description: string;
  timestamp: string;
  referenceId?: string;
}

// Student Badge
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  category: 'mentorship' | 'academic' | 'contributions' | 'integrity';
}

// Deterministic Skill Match
export interface SkillMatch {
  peerId: string;
  peerName: string;
  peerAvatar: string;
  peerDepartment: string;
  peerYear: string;
  rating: number;
  matchingSkill: string;
  reciprocalSkill?: string;
  compatibilityScore: number; // 0 - 100
  matchLabel: 'Strong match' | 'Good match' | 'Moderate match';
  factors: {
    skillMatch: boolean;
    reciprocalNeed: boolean;
    sameCampus: boolean;
    compatibleLevel: boolean;
    availabilityMatch: boolean;
    verified: boolean;
  };
}

// Assessment Integrity Violations
export type ViolationType =
  | 'FULLSCREEN_EXIT'
  | 'PAGE_HIDDEN'
  | 'WINDOW_BLUR'
  | 'NAVIGATION_ATTEMPT'
  | 'TIMEOUT';

export interface TestViolation {
  id: string;
  attemptId: string;
  type: ViolationType;
  timestamp: string;
  sequenceNumber: number;
  details: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  startedAt: string;
  submittedAt?: string;
  answers: Record<string, number>; // questionId -> selectedIndex
  score?: number;
  maxScore?: number;
  percentage?: number;
  violations: TestViolation[];
  isSubmitted: boolean;
  integrityStatus: 'Clean' | 'Warning issued' | 'Review required';
}

// Resource Reporting
export type ResourceReportReason =
  | 'incorrect_content'
  | 'duplicate'
  | 'misleading_title'
  | 'inappropriate_content'
  | 'academic_integrity'
  | 'unreadable_file';

export interface ResourceReport {
  id: string;
  resourceId: string;
  reporterId: string;
  reason: ResourceReportReason;
  description: string;
  status: 'New' | 'Under Review' | 'Resolved' | 'Dismissed';
  createdAt: string;
}

export interface ResourceVersion {
  versionNumber: number;
  updatedDate: string;
  changeNote: string;
  fileSize: string;
  contentHash: string;
}

// Peer & Device Trust
export type DeviceTrustLevel = 'unknown' | 'discovered' | 'paired' | 'trusted' | 'blocked';

export interface PeerDevice {
  id: string;
  deviceId: string;
  studentName: string;
  department: string;
  trustLevel: DeviceTrustLevel;
  lastSeen: string;
  protocolVersion: number;
  ipAddress?: string;
  isOnline: boolean;
}

// Sync Records & Handshake
export interface SyncChangeRecord {
  eventId: string;
  entityType: 'resource' | 'profile' | 'question' | 'session' | 'karma' | 'test_attempt';
  recordId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  version: number;
  originDeviceId: string;
  timestamp: string;
  payload: unknown;
}

export interface SyncConflict {
  id: string;
  entityType: string;
  recordId: string;
  localVersion: number;
  remoteVersion: number;
  localData: unknown;
  remoteData: unknown;
  resolved: boolean;
  resolutionStrategy?: 'newest_version' | 'append_only' | 'manual_review';
}

