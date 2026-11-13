/**
 * AetherGL Collaboration & Gamified Multi-Layer Protocol Utilities
 */

import { WebGLObject } from '../components/WebGLCanvas';

export interface CollabLayer {
  id: string;
  name: string;
  creator: string;
  meshType: WebGLObject['type'];
  fragmentShader: string;
  synthTrackId: 'synthwave' | 'ambient' | 'chiptune';
  rotationSpeed: number; // custom motion
  pulseRange: number;    // custom pulse warp scale
  baseColor: [number, number, number];
  signatureHash: string; // crypto visual seed
}

export interface CollabCertificate {
  id: string;
  title: string;
  timestamp: string;
  creators: string[];
  layers: CollabLayer[];
  type: '2P' | '3P' | '4P';
  isSigned: boolean;
  visualStampHash: string; // Deterministic seed for drawing visual certification
}

export interface PlayerAchievement {
  creatorName: string;
  individualMeetsCount: number; // Needs 3
  twopPlayerCompositionsCount: number; // Needs 2
  threePlayerCompositionsCount: number; // Needs 2
  unlockedLayer4: boolean;
}

// Generate a deterministic pseudo-random hash from string signatures
export function generateVisualHash(inputs: string[]): string {
  const combined = inputs.sort().join('|');
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return 'ae_' + Math.abs(hash).toString(16).padStart(8, '0');
}

// Verify that a 3-Player composition has valid bilateral contracts between all three
export function verifyThreePlayerCollab(
  playerA: string,
  playerB: string,
  playerC: string,
  existingMeets: { players: string[] }[]
): {
  success: boolean;
  missingPairs: [string, string][];
} {
  const pairs: [string, string][] = [
    [playerA, playerB],
    [playerB, playerC],
    [playerA, playerC]
  ];

  const missingPairs: [string, string][] = [];

  pairs.forEach(([p1, p2]) => {
    // Check if there is an existing bilateral meet record containing p1 and p2
    const hasMeet = existingMeets.some(meet => 
      meet.players.includes(p1) && meet.players.includes(p2)
    );
    if (!hasMeet) {
      missingPairs.push([p1, p2]);
    }
  });

  return {
    success: missingPairs.length === 0,
    missingPairs
  };
}

// Evaluate Layer 4 unlock eligibility for a new player
export function evaluateLayer4Unlock(achievement: PlayerAchievement): {
  eligible: boolean;
  requirements: {
    individualMeets: { current: number; required: number; met: boolean };
    twoPlayerCompositions: { current: number; required: number; met: boolean };
    threePlayerCompositions: { current: number; required: number; met: boolean };
  };
} {
  const individualMeetsMet = achievement.individualMeetsCount >= 3;
  const twoPlayerMet = achievement.twopPlayerCompositionsCount >= 2;
  const threePlayerMet = achievement.threePlayerCompositionsCount >= 2;

  return {
    eligible: individualMeetsMet && twoPlayerMet && threePlayerMet,
    requirements: {
      individualMeets: {
        current: achievement.individualMeetsCount,
        required: 3,
        met: individualMeetsMet,
      },
      twoPlayerCompositions: {
        current: achievement.twopPlayerCompositionsCount,
        required: 2,
        met: twoPlayerMet,
      },
      threePlayerCompositions: {
        current: achievement.threePlayerCompositionsCount,
        required: 2,
        met: threePlayerMet,
      }
    }
  };
}
