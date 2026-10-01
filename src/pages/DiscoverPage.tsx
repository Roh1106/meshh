import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  Filter,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  Send,
} from 'lucide-react';
import { CampusMeshBanner } from '../components/common/OfflineBanner';
import { PeerCard } from '../components/domain/PeerCard';
import { SkillSwapCard } from '../components/domain/SkillSwapCard';
import { ResourceCard } from '../components/domain/ResourceCard';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { peerService } from '../services/peerService';
import { resourceService } from '../services/resourceService';
import { sessionService } from '../services/sessionService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { Peer, SkillSwapListing, AcademicResource } from '../types';
import { DEFAULT_CAMPUS } from '../constants/app';
import { PdfViewerModal, PdfDocument } from '../components/common/PdfViewerModal';

export const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccess, showInfo } = useToast();
  const { currentUser } = useAuth();

  // Search & Filter State
  const queryFromUrl = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [activeTab, setActiveTab] = useState<'all' | 'peers' | 'skills' | 'resources' | 'groups'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All Years');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [availableToday, setAvailableToday] = useState<boolean>(false);
  const [nearbyOnly, setNearbyOnly] = useState<boolean>(false);
  const [selectedPdf, setSelectedPdf] = useState<PdfDocument | null>(null);

  useEffect(() => {
    if (queryFromUrl && queryFromUrl !== searchQuery) {
      setSearchQuery(queryFromUrl);
    }
  }, [queryFromUrl]);

  // Data State
  const [isLoading, setIsLoading] = useState(true);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [swaps, setSwaps] = useState<SkillSwapListing[]>([]);
  const [resources, setResources] = useState<AcademicResource[]>([]);

  // Modals
  const [bookingPeer, setBookingPeer] = useState<Peer | null>(null);
  const [bookingDate, setBookingDate] = useState('Today, 4:30 PM');
  const [bookingLocation, setBookingLocation] = useState('Tech Park Cafe (Table 4)');
  const [bookingTopic, setBookingTopic] = useState('Algorithms & Distributed Systems Walkthrough');

  const [swapModalPeer, setSwapModalPeer] = useState<Peer | null>(null);
  const [swapOffering, setSwapOffering] = useState('Python / Data Science Assistance');

  const [connectSwap, setConnectSwap] = useState<SkillSwapListing | null>(null);
  const [connectMessage, setConnectMessage] = useState('Hi Siddharth! I can assist with React & Mobile UI components in exchange for FastAPI architecture walkthrough.');

  // Load Feed Data
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [fetchedPeers, fetchedSwaps, fetchedResources] = await Promise.all([
          peerService.getPeers({
            query: searchQuery,
            department: selectedDept === 'All' ? undefined : selectedDept,
            verifiedOnly,
            availableToday,
          }),
          peerService.getSkillSwaps(),
          resourceService.getResources({
            query: searchQuery,
            department: selectedDept === 'All' ? undefined : selectedDept,
            verifiedOnly,
          }),
        ]);

        if (isMounted) {
          setPeers(fetchedPeers);
          setSwaps(fetchedSwaps);
          setResources(fetchedResources);
        }
      } catch (err) {
        console.error('Failed to load discovery items', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedDept, selectedYear, verifiedOnly, availableToday, nearbyOnly]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('All');
    setSelectedYear('All Years');
    setVerifiedOnly(false);
    setAvailableToday(false);
    setNearbyOnly(false);
    setActiveTab('all');
  };

  const handleBookSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingPeer) return;

    await sessionService.requestSession({
      mentorId: bookingPeer.id,
      mentorName: bookingPeer.name,
      mentorAvatar: bookingPeer.avatar,
      topic: bookingTopic,
      date: bookingDate.split(',')[0],
      time: bookingDate.split(',')[1] || '4:30 PM',
      location: bookingLocation,
      notes: `Requested by ${currentUser.name} via ${DEFAULT_CAMPUS.shortName} Mesh`,
    });

    showSuccess(
      `Session requested with ${bookingPeer.name}. Notification queued for offline mesh sync.`,
      'Session Booked'
    );
    setBookingPeer(null);
  };

  const handleProposeSwapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!swapModalPeer) return;
    showSuccess(
      `Skill swap proposal sent to ${swapModalPeer.name} for ${swapModalPeer.canTeach[0] || 'DSP'}.`,
      'Swap Proposed'
    );
    setSwapModalPeer(null);
  };

  const handleConnectCollaborate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectSwap) return;
    showSuccess(
      `Collaboration request sent to ${connectSwap.authorName}! Added to your pending local sync queue.`,
      'Collaboration Requested'
    );
    setConnectSwap(null);
  };

  const handleToggleOfflineResource = async (res: AcademicResource) => {
    const isNowOffline = await resourceService.toggleOfflineSave(res.id);
    setResources((prev) =>
      prev.map((r) => (r.id === res.id ? { ...r, isOfflineAvailable: isNowOffline } : r))
    );
    if (isNowOffline) {
      showSuccess(`"${res.title}" saved for offline study.`, 'Saved Offline');
    } else {
      showInfo(`Removed "${res.title}" from local storage.`, 'Removed');
    }
  };

  const handleToggleBookmarkPeer = async (peer: Peer) => {
    const isSaved = await peerService.toggleSavePeer(peer.id);
    setPeers((prev) =>
      prev.map((p) => (p.id === peer.id ? { ...p, isSaved } : p))
    );
    showInfo(isSaved ? `Bookmarked ${peer.name}` : `Removed ${peer.name} from saved items`);
  };

  // Compute active counts
  const totalResultsCount =
    (activeTab === 'all' || activeTab === 'peers' ? peers.length : 0) +
    (activeTab === 'all' || activeTab === 'skills' ? swaps.length : 0) +
    (activeTab === 'all' || activeTab === 'resources' ? resources.length : 0);

  return (
    <div className="flex flex-col w-full space-y-3 pb-8">
      {/* Mesh Campus Beacon Banner */}
      <CampusMeshBanner />

      {/* Search & Quick Query Bar */}
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          id="campus-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search skills, subjects, departments or peer names..."
          className="w-full h-10 pl-9 pr-9 bg-white text-gray-900 text-xs sm:text-sm rounded-lg border border-gray-200/90 shadow-2xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none placeholder:text-gray-400 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="Clear Search"
            className="absolute right-2.5 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Segmented Tabs (Horizontal Scrollable) */}
      <div className="w-full overflow-x-auto scrollbar-none py-0.5">
        <div className="flex items-center gap-1 min-w-max bg-gray-200/60 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-white text-blue-600 shadow-2xs font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>All</span>
            <span
              className={`px-1.5 py-0.2 rounded font-mono text-[11px] font-semibold ${
                activeTab === 'all' ? 'bg-blue-50 text-blue-600' : 'bg-gray-200/80 text-gray-600'
              }`}
            >
              {peers.length + swaps.length + resources.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('peers')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'peers'
                ? 'bg-white text-blue-600 shadow-2xs font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Peers</span>
            <span
              className={`px-1.5 py-0.2 rounded font-mono text-[11px] font-semibold ${
                activeTab === 'peers' ? 'bg-blue-50 text-blue-600' : 'bg-gray-200/80 text-gray-600'
              }`}
            >
              {peers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'bg-white text-blue-600 shadow-2xs font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Skills</span>
            <span
              className={`px-1.5 py-0.2 rounded font-mono text-[11px] font-semibold ${
                activeTab === 'skills' ? 'bg-blue-50 text-blue-600' : 'bg-gray-200/80 text-gray-600'
              }`}
            >
              {swaps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'resources'
                ? 'bg-white text-blue-600 shadow-2xs font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Resources</span>
            <span
              className={`px-1.5 py-0.2 rounded font-mono text-[11px] font-semibold ${
                activeTab === 'resources'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-gray-200/80 text-gray-600'
              }`}
            >
              {resources.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('groups')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'groups'
                ? 'bg-white text-blue-600 shadow-2xs font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Study Groups</span>
          </button>
        </div>
      </div>

      {/* Micro Filter Chips Row (as seen in the mockup) */}
      <div className="w-full overflow-x-auto scrollbar-none py-0.5">
        <div className="flex items-center gap-1.5 min-w-max text-xs">
          {/* Dept Dropdown */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-medium border border-blue-200 focus:outline-none cursor-pointer"
          >
            <option value="Computer Science & Eng.">Dept: Computer Science</option>
            <option value="Electronics & Comm. (ECE)">Dept: Electronics (ECE)</option>
            <option value="Information Technology">Dept: Information Tech</option>
            <option value="All">Dept: All Departments</option>
          </select>

          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-2.5 py-1 rounded-md bg-white text-gray-700 font-medium border border-gray-200 focus:outline-none cursor-pointer"
          >
            <option value="All Years">Year: All Years</option>
            <option value="3rd Year">Year: 3rd Year</option>
            <option value="4th Year">Year: 4th Year</option>
            <option value="2nd Year">Year: 2nd Year</option>
          </select>

          {/* Availability Button */}
          <button
            onClick={() => setAvailableToday(!availableToday)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium border transition-colors ${
              availableToday
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                availableToday ? 'bg-emerald-600' : 'bg-gray-400'
              }`}
            />
            <span>Availability: Today</span>
          </button>

          {/* Verified Mentors Toggle */}
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium border transition-colors ${
              verifiedOnly
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Verified Mentors Only</span>
          </button>

          {/* Nearby / In-Person Button */}
          <button
            onClick={() => setNearbyOnly(!nearbyOnly)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium border transition-colors ${
              nearbyOnly
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            <span>In-Person / Nearby</span>
          </button>
        </div>
      </div>

      {/* Active Filter Feedback Bar */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-0.5">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-gray-700">
            Filtering by {selectedDept === 'All' ? 'All Depts' : 'CSE'} & {verifiedOnly ? 'Verified' : 'All'}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="font-mono text-gray-500">
            {isLoading ? 'Searching...' : `${totalResultsCount} results`}
          </span>
        </div>

        {(searchQuery || selectedDept !== 'Computer Science & Eng.' || !verifiedOnly) && (
          <button
            onClick={handleResetFilters}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset all</span>
          </button>
        )}
      </div>

      {/* Main Discovery Feed */}
      <div className="flex flex-col gap-3 pt-1">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : totalResultsCount === 0 ? (
          <EmptyState
            title="No matching peers or study resources found"
            description="Try relaxing your filters, changing the department selection, or clearing your query."
            actionLabel="Reset All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <>
            {/* 1. Peer Card 1: Aarav Sharma */}
            {(activeTab === 'all' || activeTab === 'peers') &&
              peers.map((peer) => (
                <PeerCard
                  key={peer.id}
                  peer={peer}
                  isBookmarked={peer.isSaved}
                  onBookSession={(p) => setBookingPeer(p)}
                  onViewProfile={() => navigate('/profile')}
                  onProposeSwap={(p) => setSwapModalPeer(p)}
                  onToggleBookmark={(p) => handleToggleBookmarkPeer(p)}
                />
              ))}

            {/* 2. Skill Exchange Offering Card: Siddharth M. */}
            {(activeTab === 'all' || activeTab === 'skills') &&
              swaps.map((swap) => (
                <SkillSwapCard
                  key={swap.id}
                  listing={swap}
                  onConnect={(s) => setConnectSwap(s)}
                />
              ))}

            {/* 3. Verified Academic Resource Card: DBMS Cheat Sheet */}
            {(activeTab === 'all' || activeTab === 'resources') &&
              resources.map((res) => (
                <ResourceCard
                  key={res.id}
                  resource={res}
                  onSaveOffline={(r) => handleToggleOfflineResource(r)}
                  onView={(r) => navigate(`/resources/${r.id}`)}
                  onOpenPdf={(r) =>
                    setSelectedPdf({
                      id: r.id,
                      title: r.title,
                      subject: r.subject,
                      department: r.department,
                      fileSize: r.fileSize,
                      authorOrSource: `${r.author} (${r.authorRole || 'Faculty / Senior'})`,
                    })
                  }
                />
              ))}
          </>
        )}
      </div>

      {/* MODAL 1: Book Mentoring Session with Peer */}
      <Modal
        isOpen={!!bookingPeer}
        onClose={() => setBookingPeer(null)}
        title={`Book Peer Session with ${bookingPeer?.name}`}
        description={`${bookingPeer?.department} · Academic Mentoring`}
      >
        <form onSubmit={handleBookSessionSubmit} className="space-y-3.5 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Discussion Topic / Doubt
            </label>
            <input
              type="text"
              required
              value={bookingTopic}
              onChange={(e) => setBookingTopic(e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Date & Time</label>
              <input
                type="text"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Meeting Venue
              </label>
              <input
                type="text"
                required
                value={bookingLocation}
                onChange={(e) => setBookingLocation(e.target.value)}
                className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600">
            <span className="font-semibold text-gray-800">Peer Academic Honor Code:</span> Session
            requests are strictly for curriculum doubt-clearing and skill exchange. Both students
            must verify check-in at the agreed campus location.
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setBookingPeer(null)}
              className="w-full h-9 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full h-9 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-2xs"
            >
              Confirm Request
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Propose Skill Swap with Neha Gupta */}
      <Modal
        isOpen={!!swapModalPeer}
        onClose={() => setSwapModalPeer(null)}
        title={`Propose Skill Swap with ${swapModalPeer?.name}`}
        description="Reciprocal Peer Learning without financial barriers"
      >
        <form onSubmit={handleProposeSwapSubmit} className="space-y-3.5 text-xs sm:text-sm">
          <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-100 text-xs text-blue-900 space-y-1">
            <p className="font-semibold">Matching Skill Swap Detected</p>
            <p className="text-blue-800">
              {swapModalPeer?.name} teaches{' '}
              <strong>{swapModalPeer?.canTeach.join(', ')}</strong> and wants to learn{' '}
              <strong>{swapModalPeer?.wantsToLearn.join(', ')}</strong>.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              What you can teach in return:
            </label>
            <input
              type="text"
              required
              value={swapOffering}
              onChange={(e) => setSwapOffering(e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSwapModalPeer(null)}
              className="w-full h-9 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full h-9 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-2xs flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Swap Proposal</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: Connect & Collaborate on Siddharth's FastAPI Listing */}
      <Modal
        isOpen={!!connectSwap}
        onClose={() => setConnectSwap(null)}
        title={`Collaborate with ${connectSwap?.authorName}`}
        description={connectSwap?.title}
      >
        <form onSubmit={handleConnectCollaborate} className="space-y-3.5 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Introduction & Skills Match Note
            </label>
            <textarea
              rows={3}
              required
              value={connectMessage}
              onChange={(e) => setConnectMessage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setConnectSwap(null)}
              className="w-full h-9 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full h-9 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-2xs"
            >
              Connect Now
            </button>
          </div>
        </form>
      </Modal>

      {/* Academic PDF Reader Modal */}
      <PdfViewerModal
        document={selectedPdf}
        isOpen={!!selectedPdf}
        onClose={() => setSelectedPdf(null)}
      />
    </div>
  );
};
