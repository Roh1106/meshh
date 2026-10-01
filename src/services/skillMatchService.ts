import { Peer, SkillMatch } from '../types';
import { usersRepository } from '../repositories';
import { logger } from '../utils/logger';

export interface MatchFilterOptions {
  department?: string;
  minRating?: number;
  verifiedOnly?: boolean;
}

export const skillMatchService = {
  /**
   * Deterministically calculate compatibility between a student's desired learning skill
   * and peer offerings, taking into account reciprocal needs, availability, verification,
   * and campus affiliation.
   */
  async findMatchesForSkill(
    learningSkill: string,
    offeringSkill?: string,
    options?: MatchFilterOptions
  ): Promise<SkillMatch[]> {
    logger.info('NETWORK', `Computing deterministic skill matches for: ${learningSkill}`);

    const currentUser = await usersRepository.getCurrentUser();
    const peers = await usersRepository.getAllPeers();

    const normalizedLearning = learningSkill.trim().toLowerCase();
    const normalizedOffering = offeringSkill?.trim().toLowerCase();

    const matches: SkillMatch[] = [];

    peers.forEach((peer) => {
      if (options?.department && options.department !== 'All' && peer.department !== options.department) {
        return;
      }
      if (options?.verifiedOnly && !peer.verified) {
        return;
      }

      // Check if peer can teach what current student wants to learn
      const matchCanTeach = peer.canTeach.find((s) => s.toLowerCase().includes(normalizedLearning) || normalizedLearning.includes(s.toLowerCase()));

      if (!matchCanTeach) return;

      // Check reciprocal match: does peer want to learn what current student can teach?
      let reciprocalMatch = false;
      let reciprocalSkillName: string | undefined = undefined;
      if (normalizedOffering && peer.wantsToLearn) {
        const found = peer.wantsToLearn.find((w) => w.toLowerCase().includes(normalizedOffering) || normalizedOffering.includes(w.toLowerCase()));
        if (found) {
          reciprocalMatch = true;
          reciprocalSkillName = found;
        }
      }

      // Scoring breakdown
      let score = 40; // Base match for having the requested skill

      // 1. Reciprocal need (+25)
      if (reciprocalMatch) {
        score += 25;
      }

      // 2. Peer verified badge (+15)
      if (peer.verified) {
        score += 15;
      }

      // 3. Same department synergy (+10)
      const sameDept = peer.department === currentUser.department;
      if (sameDept) {
        score += 10;
      }

      // 4. Rating above 4.5 (+10)
      if (peer.rating >= 4.5) {
        score += 10;
      }

      // Cap at 100
      const finalScore = Math.min(100, score);

      let matchLabel: 'Strong match' | 'Good match' | 'Moderate match' = 'Moderate match';
      if (finalScore >= 80) {
        matchLabel = 'Strong match';
      } else if (finalScore >= 60) {
        matchLabel = 'Good match';
      }

      matches.push({
        peerId: peer.id,
        peerName: peer.name,
        peerAvatar: peer.avatar,
        peerDepartment: peer.department,
        peerYear: peer.year,
        rating: peer.rating,
        matchingSkill: matchCanTeach,
        reciprocalSkill: reciprocalSkillName,
        compatibilityScore: finalScore,
        matchLabel,
        factors: {
          skillMatch: true,
          reciprocalNeed: reciprocalMatch,
          sameCampus: true,
          compatibleLevel: true,
          availabilityMatch: Boolean(peer.availability),
          verified: peer.verified,
        },
      });
    });

    // Sort by compatibility score descending
    return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  },
};
